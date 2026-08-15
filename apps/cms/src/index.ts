import fs from 'fs';
import path from 'path';

/**
 * One-time price backfill. After moving price/available into the `shared.price`
 * component, the old flat data is gone — this restores it from data/price-backup.json
 * (captured from the previous schema). Guarded by SEED_PRICES=true; safe to re-run
 * (it overwrites the price component with the backup values). Run once per env, then
 * unset SEED_PRICES.
 */
async function seedPrices(strapi: any) {
  if (process.env.SEED_PRICES !== 'true') return;

  const candidates = [
    path.join(process.cwd(), 'data', 'price-backup.json'),
    path.join(__dirname, '..', 'data', 'price-backup.json'),
    path.join(__dirname, '..', '..', 'data', 'price-backup.json'),
  ];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) {
    strapi.log.warn('SEED_PRICES: data/price-backup.json not found — skipping.');
    return;
  }
  const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
  const norm = (s?: string) => (s ?? '').trim().toLowerCase();
  const locales = ['sk', 'en'];

  for (const [kind, uid] of [
    ['cakes', 'api::cake.cake'],
    ['cafes', 'api::cafe.cafe'],
  ] as const) {
    const recsById: Record<string, any> = backup[kind] ?? {};
    const byName = new Map<string, any>();
    for (const r of Object.values<any>(recsById)) {
      for (const l of locales) if (r.name?.[l]) byName.set(norm(r.name[l]), r);
    }

    let updated = 0;
    let unmatched = 0;
    for (const loc of locales) {
      const docs = await strapi.documents(uid).findMany({ locale: loc, fields: ['name'], pagination: { limit: 200 } });
      for (const doc of docs) {
        const rec = recsById[doc.documentId] ?? byName.get(norm(doc.name));
        if (!rec) {
          unmatched++;
          continue;
        }
        const data = {
          price: {
            amount: rec.price ?? 0,
            currency: rec.currency ?? 'EUR',
            pricePrefix: rec.pricePrefix?.[loc] ?? null,
            priceUnit: rec.priceUnit?.[loc] ?? null,
            available: rec.available ?? true,
          },
        };
        await strapi.documents(uid).update({ documentId: doc.documentId, locale: loc, data });
        await strapi.documents(uid).publish({ documentId: doc.documentId, locale: loc });
        updated++;
      }
    }
    strapi.log.info(`SEED_PRICES: ${kind} — updated ${updated}, unmatched ${unmatched}`);
  }
}

export default {
  /**
   * On Railway the container filesystem is ephemeral, so Media Library files in
   * public/uploads would be lost on every redeploy. When a persistent volume is
   * mounted (default /data), symlink public/uploads -> <volume>/uploads so uploads
   * live on the volume. Recreated on each boot; a no-op locally (no volume dir).
   */
  register({ strapi }: { strapi: any }) {
    try {
      const target = process.env.UPLOADS_DIR || '/data/uploads';
      const volumeDir = path.dirname(target); // e.g. /data
      if (!fs.existsSync(volumeDir)) return; // no volume mounted (local dev) → nothing to do
      fs.mkdirSync(target, { recursive: true });

      const publicDir = strapi?.dirs?.static?.public || path.join(process.cwd(), 'public');
      const publicUploads = path.join(publicDir, 'uploads');
      const current = fs.existsSync(publicUploads) ? fs.lstatSync(publicUploads) : null;
      if (!current || !current.isSymbolicLink()) {
        fs.rmSync(publicUploads, { recursive: true, force: true });
        fs.symlinkSync(target, publicUploads);
        strapi.log.info(`Media Library uploads linked to volume: ${target}`);
      }
    } catch (err) {
      strapi.log.error(`Failed to link uploads to volume: ${err}`);
    }
  },
  async bootstrap({ strapi }: { strapi: any }) {
    await seedPrices(strapi).catch((e: unknown) => strapi.log.error(`SEED_PRICES failed: ${e}`));
  },
};
