import { getGlobal, media } from "@/lib/strapi";

// Always resolved per-request (the CMS image can change); the response itself is
// cacheable so crawlers/CDN don't re-hit the CMS each time.
export const dynamic = "force-dynamic";

/**
 * Same-origin OG image: `/og-image?u=/uploads/<file>` streams that CMS upload from
 * the site's own domain (WhatsApp/Facebook are far more reliable with a same-domain
 * image than a cross-origin CMS subdomain). `u` is restricted to `/uploads/…` so this
 * can't be used to proxy arbitrary URLs. Falls back to the Global default OG image.
 */
export async function GET(req: Request) {
  const u = new URL(req.url).searchParams.get("u") ?? "";
  const isSafe = /^\/uploads\/[\w.\-/]+$/.test(u) && !u.includes("..");

  let target = isSafe ? media(u) : undefined;
  if (!target) {
    const global = await getGlobal();
    target = media(global?.defaultSeo?.ogImage?.url);
  }
  if (!target) return new Response("Not found", { status: 404 });

  const upstream = await fetch(target, { cache: "no-store" });
  if (!upstream.ok) return new Response("Bad gateway", { status: 502 });

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
