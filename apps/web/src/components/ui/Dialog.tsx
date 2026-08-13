import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Presentational dialog building blocks — styled structure only, no behaviour.
 * No open state, portal, animation or handlers live here; the consuming page
 * composes these and wires up opening/closing itself. All parts forward extra
 * props (className, onClick, role, aria-*, ref via props, …).
 *
 *   <DialogOverlay onClick={onClose}>
 *     <Dialog role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
 *       <DialogHeader>
 *         <DialogTitle>Medová torta</DialogTitle>
 *       </DialogHeader>
 *       <DialogBody>…</DialogBody>
 *       <DialogFooter>…</DialogFooter>
 *     </Dialog>
 *   </DialogOverlay>
 */

export type DialogProps = HTMLAttributes<HTMLDivElement>;

/** Full-screen centering layer behind the dialog (backdrop + centering). */
export function DialogOverlay({ className, ...props }: DialogProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-brown-900/60 p-4 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

/** The dialog panel — the surface that holds header / body / footer. */
export function Dialog({ className, ...props }: DialogProps) {
  return (
    <div
      className={cn(
        "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-sm bg-surface text-brown-900 shadow-card",
        className,
      )}
      {...props}
    />
  );
}

/** Top row — typically a title on the left and a close control on the right. */
export function DialogHeader({ className, ...props }: DialogProps) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 border-b border-line px-6 py-5", className)}
      {...props}
    />
  );
}

/** Dialog title (renders an <h2>). */
export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-display-alt text-title font-normal", className)} {...props} />;
}

/** Scrollable content region. */
export function DialogBody({ className, ...props }: DialogProps) {
  return <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)} {...props} />;
}

/** Bottom row for actions. */
export function DialogFooter({ className, ...props }: DialogProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-end gap-3 border-t border-line px-6 py-4", className)}
      {...props}
    />
  );
}
