import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, renderPage } from "@/components/render-page";
import { PageSlug } from "@/lib/strapi";

// Renders any CMS `page` at /<slug> (e.g. /o-nas, /torty). Per-request SSR.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === PageSlug.Home) return {};
  return pageMetadata(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  // Home is served at "/", not "/home" — avoid a duplicate URL.
  if (slug === PageSlug.Home) notFound();
  return renderPage(slug);
}
