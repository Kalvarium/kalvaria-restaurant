/**
 * Seed an empty local CMS with the published content of the production CMS.
 *
 * Reads production's public REST API (read-only), downloads every referenced
 * image into the local Media Library, and recreates locales, cakes, cafés,
 * pages, Global, General Info, Email and the Public role's read permissions.
 *
 * Usage (from apps/cms, with the dev server stopped):
 *   node scripts/seed-from-production.js
 *   SEED_SOURCE=https://admin.kalvarium.sk node scripts/seed-from-production.js
 *
 * Refuses to run if the local DB already has pages, so it never overwrites content.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const SOURCE = (process.env.SEED_SOURCE || 'https://admin.kalvarium.sk').replace(/\/+$/, '');
const LOCALES = [
  { code: 'sk', name: 'Slovak (sk)', isDefault: true },
  { code: 'en', name: 'English (en)' },
];

const PAGE_POPULATE = [
  'populate[sections][on][sections.hero][populate][background]=true',
  'populate[sections][on][sections.hero][populate][ctas]=true',
  'populate[sections][on][sections.media-text][populate][image]=true',
  'populate[sections][on][sections.cake-grid][populate][cakes][fields][0]=documentId',
  'populate[sections][on][sections.cake-grid][populate][ctaButton]=true',
  'populate[sections][on][sections.cafe-grid][populate][cafes][fields][0]=documentId',
  'populate[sections][on][sections.quote][populate]=*',
  'populate[sections][on][sections.gallery][populate][images]=true',
  'populate[sections][on][sections.text][populate]=*',
  'populate[sections][on][sections.venue-info][populate]=*',
  'populate[sections][on][sections.card-grid][populate]=*',
  'populate[sections][on][sections.map][populate]=*',
  'populate[sections][on][sections.cta-card][populate]=*',
  'populate[sections][on][sections.form][populate][image]=true',
  'populate[sections][on][sections.form][populate][fields]=true',
  'populate[sections][on][sections.form][populate][content][populate]=*',
  'populate[seo][populate]=*',
].join('&');
const ITEM_POPULATE = 'populate[image]=true&populate[price]=true&populate[badge]=true&populate[seo][populate]=*';
const GLOBAL_POPULATE =
  'populate[navigation]=true&populate[headerCta]=true&populate[logo]=true&populate[defaultSeo][populate]=*';

const SYSTEM_KEYS = new Set(['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations']);

async function get(pathAndQuery) {
  const res = await fetch(`${SOURCE}/api/${pathAndQuery}`);
  if (!res.ok) throw new Error(`GET ${pathAndQuery} → ${res.status}`);
  return (await res.json()).data;
}
async function getAll(collection, query, locale) {
  return get(`${collection}?${query}&locale=${locale}&pagination[limit]=200`);
}

const isMedia = (v) => v && typeof v === 'object' && typeof v.url === 'string' && 'mime' in v && 'hash' in v;

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'warn';
  const strapi = app;

  const existingPages = await strapi.db.query('api::page.page').count();
  if (existingPages > 0) {
    console.error(`Local DB already has ${existingPages} page rows — refusing to seed over existing content.`);
    await strapi.destroy();
    process.exit(1);
  }

  // ---------- locales ----------
  const localeService = strapi.plugin('i18n').service('locales');
  const have = (await localeService.find()).map((l) => l.code);
  for (const l of LOCALES) {
    if (!have.includes(l.code)) await localeService.create({ code: l.code, name: l.name });
    if (l.isDefault) await localeService.setDefaultLocale({ code: l.code });
  }
  console.log('✔ locales: sk (default), en');

  // ---------- media ----------
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kalvaria-seed-'));
  const uploadService = strapi.plugin('upload').service('upload');
  const mediaMap = new Map(); // production file id → local file id
  async function importMedia(file) {
    if (mediaMap.has(file.id)) return mediaMap.get(file.id);
    const url = file.url.startsWith('http') ? file.url : `${SOURCE}${file.url}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! could not download ${url} (${res.status})`);
      mediaMap.set(file.id, null);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filepath = path.join(tmpDir, `${file.hash}${file.ext}`);
    fs.writeFileSync(filepath, buf);
    const [uploaded] = await uploadService.upload({
      data: {
        fileInfo: { name: file.name, alternativeText: file.alternativeText, caption: file.caption },
      },
      files: { filepath, originalFilename: file.name, mimetype: file.mime, size: buf.length },
    });
    mediaMap.set(file.id, uploaded.id);
    return uploaded.id;
  }

  // Strip system fields, swap media for local ids, swap relations for local documentIds.
  const docIdMap = new Map(); // production documentId → local documentId
  async function clean(value, key) {
    if (Array.isArray(value)) {
      const out = [];
      for (const v of value) {
        const c = await clean(v, key);
        if (c !== undefined && c !== null) out.push(c);
      }
      return out;
    }
    if (isMedia(value)) return importMedia(value);
    if (value && typeof value === 'object') {
      if ((key === 'cakes' || key === 'cafes') && value.documentId) {
        return docIdMap.get(value.documentId) ?? null;
      }
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        if (SYSTEM_KEYS.has(k)) continue;
        out[k] = await clean(v, k);
      }
      return out;
    }
    return value;
  }

  // ---------- collection types (sk first, then en as a localization of the same document) ----------
  async function seedCollection(uid, collection, query, label) {
    let count = 0;
    for (const { code: locale } of LOCALES) {
      const entries = await getAll(collection, query, locale);
      for (const entry of entries) {
        const data = await clean(entry);
        const localId = docIdMap.get(entry.documentId);
        if (localId) {
          await strapi.documents(uid).update({ documentId: localId, locale, data, status: 'published' });
        } else {
          const created = await strapi.documents(uid).create({ locale, data, status: 'published' });
          docIdMap.set(entry.documentId, created.documentId);
        }
        count++;
      }
    }
    console.log(`✔ ${label}: ${count} localized entries`);
  }

  await seedCollection('api::cake.cake', 'cakes', ITEM_POPULATE, 'cakes');
  await seedCollection('api::cafe.cafe', 'cafes', ITEM_POPULATE, 'cafes');
  await seedCollection('api::page.page', 'pages', PAGE_POPULATE, 'pages');

  // ---------- single types ----------
  let globalId;
  for (const { code: locale } of LOCALES) {
    const data = await clean(await get(`global?${GLOBAL_POPULATE}&locale=${locale}`));
    if (globalId) {
      await strapi.documents('api::global.global').update({ documentId: globalId, locale, data });
    } else {
      globalId = (await strapi.documents('api::global.global').create({ locale, data })).documentId;
    }
  }
  console.log('✔ global (sk, en)');

  const generalInfo = await clean(await get('general-info?populate[contact]=true&populate[socialLinks]=true'));
  await strapi.documents('api::general-info.general-info').create({ data: generalInfo });
  console.log('✔ general-info');

  const email = await clean(await get('email'));
  await strapi.documents('api::email.email').create({ data: email });
  console.log('✔ email');

  // ---------- public read permissions ----------
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  const actions = [
    'api::page.page.find',
    'api::page.page.findOne',
    'api::cake.cake.find',
    'api::cake.cake.findOne',
    'api::cafe.cafe.find',
    'api::cafe.cafe.findOne',
    'api::global.global.find',
    'api::general-info.general-info.find',
    'api::email.email.find',
    'api::event.event.find',
  ];
  const permQuery = strapi.db.query('plugin::users-permissions.permission');
  for (const action of actions) {
    const exists = await permQuery.findOne({ where: { action, role: publicRole.id } });
    if (!exists) await permQuery.create({ data: { action, role: publicRole.id } });
  }
  console.log(`✔ public permissions: ${actions.length} read actions`);

  console.log(`✔ media: ${[...mediaMap.values()].filter(Boolean).length} files imported`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  await strapi.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
