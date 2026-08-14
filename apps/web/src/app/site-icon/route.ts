import { getGlobal, media } from "@/lib/strapi";

// Resolved per-request (the CMS logo can change); the response is cacheable.
export const dynamic = "force-dynamic";

/**
 * Same-origin favicon: streams the Global logo from the site's own domain so Google
 * and browsers fetch the icon from the main host, not the cross-origin CMS subdomain.
 * Falls back to the bundled square SVG in /public if the CMS logo is unset/unreachable.
 */
export async function GET(req: Request) {
  const fallback = new URL("/kalvarium_logo_black.svg", req.url);
  const url = media((await getGlobal())?.logo?.url);
  if (!url) return Response.redirect(fallback, 307);

  const upstream = await fetch(url, { cache: "no-store" });
  if (!upstream.ok) return Response.redirect(fallback, 307);

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/svg+xml",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
