import Link from "next/link";
import type { ReactNode } from "react";
import { List, ListItem } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Block } from "@/lib/strapi";

/** One inline text leaf, wrapped in its formatting marks. */
function Leaf({ node }: { node: Block }) {
  let content: ReactNode = node.text ?? "";
  if (node.code)
    content = <code className="rounded-sm bg-current/10 px-1.5 py-0.5 font-mono text-[0.85em]">{content}</code>;
  if (node.bold) content = <strong className="font-semibold">{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return <>{content}</>;
}

/** Inline children: text leaves and links. */
function Inline({ nodes }: { nodes?: Block[] }) {
  return (
    <>
      {nodes?.map((n, i) =>
        n.type === "link" ? (
          <Link
            key={i}
            href={n.url ?? "#"}
            className="font-medium text-rust-500 underline underline-offset-2 transition-colors hover:text-rust-600"
          >
            <Inline nodes={n.children} />
          </Link>
        ) : (
          <Leaf key={i} node={n} />
        ),
      )}
    </>
  );
}

const HEADING_CLASS: Record<number, string> = {
  2: "font-display-alt text-3xl font-bold leading-tight tracking-tight",
  3: "font-display-alt text-2xl font-semibold leading-snug tracking-tight",
  4: "font-display-alt text-xl font-semibold leading-snug",
};

/** Body-prose font size, scaled per section (paragraphs + quotes). */
export type ProseSize = "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge";
const PROSE_SIZE: Record<ProseSize, string> = {
  xsmall: "text-regular", // 16
  small: "text-large", // 18
  medium: "text-subhead", // 20 (default)
  large: "text-title", // 24
  xlarge: "text-hero", // 28
  xxlarge: "text-2xl", // 32
  xxxlarge: "text-3xl", // 40
};

/**
 * Renders a Strapi "blocks" rich-text value with the site's typography.
 * Body text is Cormorant at the same size/leading as Media-Text prose; colours
 * use `text-current` so it adapts to the section background. `size` scales the
 * body prose (paragraphs + quotes).
 */
export function RichBlocks({
  blocks,
  className,
  size = "medium",
}: {
  blocks?: Block[];
  className?: string;
  size?: ProseSize;
}) {
  if (!blocks?.length) return null;
  const prose = PROSE_SIZE[size];
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const level = Math.min(Math.max(b.level ?? 2, 2), 4);
            const Tag = `h${level}` as "h2" | "h3" | "h4";
            return (
              <Tag key={i} className={cn(HEADING_CLASS[level], i > 0 && "mt-2")}>
                <Inline nodes={b.children} />
              </Tag>
            );
          }
          case "list": {
            const ordered = b.format === "ordered";
            return (
              <List key={i} ordered={ordered}>
                {b.children?.map((li, j) => (
                  <ListItem key={j} marker={ordered ? `${j + 1}.` : undefined}>
                    <Inline nodes={li.children} />
                  </ListItem>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <blockquote
                key={i}
                className={cn(
                  "border-l-2 border-gold-500 pl-5 font-accent italic leading-[1.6] text-current/85",
                  prose,
                )}
              >
                <Inline nodes={b.children} />
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} className="overflow-x-auto rounded-sm bg-brown-900/90 p-4 font-mono text-medium text-cream">
                <code>{b.children?.map((c) => c.text).join("")}</code>
              </pre>
            );
          case "paragraph":
          default:
            return (
              <p key={i} className={cn("font-accent leading-[1.75] text-current", prose)}>
                <Inline nodes={b.children} />
              </p>
            );
        }
      })}
    </div>
  );
}
