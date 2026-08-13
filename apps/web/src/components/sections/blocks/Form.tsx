"use client";

import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import { Button, ButtonVariant, Dialog, DialogOverlay, Eyebrow, Icon, Image, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";
import { media, type Cake, type FormSection } from "@/lib/strapi";
import type { TextFieldType } from "@/components/ui";
import { useLocale } from "@/lib/locale-context";
import { TextContent } from "./Text";

// The only system string left in code — every field label now comes from the CMS.
const SENDING = { en: "Sending…", sk: "Odosielam…" } as const;

const FormStatus = {
  Idle: "idle",
  Sending: "sending",
  Success: "success",
  Error: "error",
} as const;
type FormStatus = (typeof FormStatus)[keyof typeof FormStatus];

/** The form panel (heading + intro + fields) — shared by the page and dialog modes. */
function FormFields({ s, cakes }: { s: FormSection; cakes: Cake[] }) {
  const { locale } = useLocale();
  const sending = SENDING[locale] ?? SENDING.en;
  const [status, setStatus] = useState<FormStatus>(FormStatus.Idle);
  const fields = s.fields ?? [];
  // Options for any `cakes` field — sourced from the Cake collection.
  const cakeOptions = cakes.map((c) => ({ label: c.name, value: c.name }));

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      recipient: s.recipient ?? "reservation",
      locale,
      // Label + value for each configured field (checkboxes post "yes"), so the email reads well.
      fields: fields.map((f) => ({ label: f.label, value: String(fd.get(f.name) ?? "").trim() })),
    };
    setStatus(FormStatus.Sending);
    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus(FormStatus.Success);
      form.reset();
    } catch {
      setStatus(FormStatus.Error);
    }
  }

  return (
    <>
      {s.eyebrow && <Eyebrow className="mb-3 block">{s.eyebrow}</Eyebrow>}
      {s.heading && (
        <h2 className="mb-4 font-display-alt text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {s.heading}
        </h2>
      )}
      {s.intro && <p className="mb-10 font-accent text-large leading-[1.6] text-color-brown-900/75">{s.intro}</p>}

      {status === FormStatus.Success ? (
        <div className="rounded-sm border border-green-800/30 bg-green-800/5 p-6 font-accent text-large text-color-brown-900">
          {s.successMessage ?? "Thank you! We'll be in touch soon to confirm your reservation."}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {fields.map((f) => {
              const isCakes = f.type === "cakes";
              return (
                <TextField
                  key={f.id ?? f.name}
                  name={f.name}
                  label={f.label}
                  type={isCakes ? "select" : (f.type as TextFieldType | undefined)}
                  placeholder={f.placeholder}
                  required={f.required}
                  min={f.min}
                  max={f.max}
                  options={isCakes ? cakeOptions : undefined}
                  className={f.fullWidth ? "sm:col-span-2" : undefined}
                />
              );
            })}
          </div>
          {status === FormStatus.Error && (
            <p className="text-[13px] font-semibold text-error">
              {s.errorMessage ?? "Sorry, something went wrong. Please call us instead."}
            </p>
          )}
          <Button type="submit" variant={ButtonVariant.Primary} disabled={status === FormStatus.Sending} className="w-full">
            {status === FormStatus.Sending ? sending : (s.submitLabel ?? "Send reservation request")}
          </Button>
        </form>
      )}

      {/* Optional embedded Text blocks (formatted prose + links) below the form — full width. */}
      {s.content?.map((c, i) => <TextContent key={c.id ?? i} s={c} className="mt-10" bodyClassName="max-w-none" />)}
    </>
  );
}

/**
 * `dialog` display: opens the form in a modal. It renders no button of its own —
 * it's opened by an on-page button wired by id. A CMS button with href="#order-cake"
 * renders as `<button id="order-cake">`; set this form's `anchor` to "order-cake"
 * and clicking that button opens the dialog (no href, no URL change).
 */
function FormDialog({ s, cakes }: { s: FormSection; cakes: Cake[] }) {
  const [open, setOpen] = useState(false);
  // The button renders as <button id="order-cake">, so match by the bare id even
  // if the anchor was entered with a leading "#".
  const anchor = s.anchor?.replace(/^#/, "");

  const close = useCallback(() => setOpen(false), []);

  // Find the on-page trigger button by id and open the dialog when it's clicked.
  useEffect(() => {
    if (!anchor) return;
    const btn = document.getElementById(anchor);
    if (!btn) return;
    const onClick = (e: Event) => {
      e.preventDefault();
      setOpen(true);
    };
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  }, [anchor]);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;
  return (
    <DialogOverlay onClick={close} className="animate-dialog-overlay">
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={s.heading ?? "Form"}
        className="animate-dialog-panel relative max-w-xl bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-brown-900 transition duration-300 hover:rotate-90 hover:bg-brown-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
        >
          <Icon name="close" size={22} />
        </button>
        <div className="max-h-[85vh] overflow-y-auto p-8 md:p-10">
          <FormFields s={s} cakes={cakes} />
        </div>
      </Dialog>
    </DialogOverlay>
  );
}

/**
 * A form (reservation, cake order, enquiry, …). `display: page` renders a
 * full-screen photo + form split; `display: dialog` renders a button that opens
 * the form in a modal (e.g. "Order a cake" on the cakes page). Both post to /api/form.
 */
export function Form({ s, cakes = [] }: { s: FormSection; cakes?: Cake[] }) {
  if (s.display === "dialog") return <FormDialog s={s} cakes={cakes} />;

  const img = media(s.image?.url);
  return (
    <section className={cn("grid min-h-screen items-stretch", img && "md:grid-cols-2")}>
      {/* left — optional photo + quote (fills the screen height) */}
      {img && (
        <div className="relative min-h-[240px] md:min-h-full">
          <Image src={img} alt={s.heading ?? ""} className="absolute inset-0 h-full w-full object-cover" />
          {s.quote && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-800/95 to-transparent px-6 pb-6 pt-16 md:px-10 md:pb-10 md:pt-20">
              <p className="font-display-alt text-large italic leading-[1.6] text-cream">{s.quote}</p>
            </div>
          )}
        </div>
      )}

      {/* form — full width when there's no image */}
      <div className="flex items-center bg-cream px-6 py-24 sm:px-10 md:px-14 lg:px-16">
        {/* With an image, the form fills the column (left edge sits near the photo,
            matching the prototype). Without one, cap + centre it on the full width. */}
        <div className={cn("w-full", !img && "mx-auto max-w-xl")}>
          <FormFields s={s} cakes={cakes} />
        </div>
      </div>
    </section>
  );
}
