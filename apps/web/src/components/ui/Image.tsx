import type { ImgHTMLAttributes } from "react";

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Thin wrapper over the native <img> — the single place a raw <img> lives, so
 * layout/components import <Image> instead. Defaults to lazy loading + async decoding
 * (pass `loading="eager"` for above-the-fold images like the header logo).
 */
export function Image({ alt = "", loading = "lazy", decoding = "async", ...props }: ImageProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading={loading} decoding={decoding} {...props} />;
}
