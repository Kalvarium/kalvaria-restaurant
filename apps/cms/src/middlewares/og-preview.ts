/**
 * Social preview for the CMS root URL. Strapi's admin is a SPA with no OG tags and
 * `/` normally 302s to `/admin`, so pasting the CMS link shows no preview. This
 * serves an OG-tagged HTML page at `/` (crawlers read the tags) with a meta-refresh
 * so humans still land on `/admin`. Image/title are overridable via env.
 */
export default (_config: unknown, _ctx: { strapi: unknown }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.method === 'GET' && (ctx.path === '/' || ctx.path === '')) {
      const origin = process.env.CMS_URL || `${ctx.request.protocol}://${ctx.request.host}`;
      const image = process.env.CMS_OG_IMAGE || `${origin}/uploads/OG_banner_8964fb079d.jpeg`;
      const title = process.env.CMS_OG_TITLE || 'Kalvárium 1910 — CMS';
      const description = process.env.CMS_OG_DESCRIPTION || 'Content management for kalvarium.sk';

      ctx.type = 'html';
      ctx.status = 200;
      ctx.body = `<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${origin}/" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta http-equiv="refresh" content="0; url=/admin" />
  </head>
  <body>Redirecting to <a href="/admin">/admin</a>…</body>
</html>`;
      return; // short-circuit — don't fall through to the /admin redirect
    }
    await next();
  };
};
