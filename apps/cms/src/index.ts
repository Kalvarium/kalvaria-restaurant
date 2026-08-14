import fs from 'fs';
import path from 'path';

// Seeding is intentionally disabled — all content is managed manually in the
// Strapi admin. The bootstrap no longer creates, repairs, or overwrites any data.
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
  bootstrap() {},
};
