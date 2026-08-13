import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The site's list — a marker beside each row with hairline dividers, set in the
 * accent face. Colours use `text-current` / `border-current` so it adapts to
 * whatever section background it sits on. Compose with `ListItem`:
 *
 *   <List>
 *     <ListItem>Family celebrations</ListItem>       // default em-dash marker
 *   </List>
 *
 *   <List ordered>
 *     <ListItem marker="1.">First</ListItem>          // ordered → number markers
 *   </List>
 */
export type ListProps = HTMLAttributes<HTMLElement> & {
  /** Render as an ordered `<ol>` instead of a `<ul>`. */
  ordered?: boolean;
};
export type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  /** Marker beside the content; defaults to a rust em-dash. Pass e.g. `"1."` for ordered lists. */
  marker?: ReactNode;
};

export function List({ ordered = false, className, children, ...props }: ListProps) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("flex flex-col", className)} {...props}>
      {children}
    </Tag>
  );
}

/** One row of a `List`: a rust marker (em-dash by default) beside the content. */
export function ListItem({ marker, className, children, ...props }: ListItemProps) {
  const isDefault = marker === undefined;
  return (
    <li
      className={cn(
        "flex items-center gap-3 border-b border-current/10 py-3 font-accent text-subhead text-current",
        className,
      )}
      {...props}
    >
      {/* Default em-dash is decorative (hidden from SR); an explicit marker (e.g. a number) is read. */}
      <span aria-hidden={isDefault || undefined} className="shrink-0 text-rust-500">
        {isDefault ? <>&mdash;</> : marker}
      </span>
      {children}
    </li>
  );
}
