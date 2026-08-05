import type { Metadata } from "next";
import { pageMetadata, renderPage } from "@/components/render-page";
import { PageSlug } from "@/lib/strapi";

// CMS-driven, locale-aware content: render per request.
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata(PageSlug.Home);
}

export default async function Home() {
  return renderPage(PageSlug.Home);
}
