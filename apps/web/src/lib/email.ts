import type { FormRecipient } from "./strapi";

/** Escape user/CMS text for safe inclusion in HTML. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- notification-email wording (in code, not the CMS) ----------
interface Wording {
  /** Subject line of the staff notification. */
  subject: string;
  /** Line above the submitted-details table. */
  intro: string;
  /** Small print below the table. */
  footer: string;
  /** Subject of the "reply to customer" mailto the staff button pre-fills. */
  customerSubject: string;
  /** Greeting above the recap in the customer reply (`{name}` substituted). */
  customerGreeting: string;
  /** Closing below the recap in the customer reply (`{name}` substituted). */
  customerClosing: string;
}

const FOOTER_EN = "Sent automatically from the Kalvárium 1910 website.";
const FOOTER_SK = "Odoslané automaticky z webovej stránky Kalvárium 1910.";

const TEMPLATES: Record<"en" | "sk", Record<FormRecipient, Wording>> = {
  en: {
    reservation: {
      subject: "Reservation request",
      intro: "A new reservation request has been submitted through the website:",
      footer: FOOTER_EN,
      customerSubject: "Your reservation – Kalvárium 1910",
      customerGreeting: "Dear {name},\n\nthank you for your reservation request. We received the following details:",
      customerClosing: "We will get back to you shortly to confirm your table.\n\nKind regards,\nKalvárium 1910",
    },
    upstairs: {
      subject: "Upstairs enquiry",
      intro: "A new enquiry about the Upstairs space has been submitted through the website:",
      footer: FOOTER_EN,
      customerSubject: "Your enquiry – Kalvárium 1910 (Upstairs)",
      customerGreeting: "Dear {name},\n\nthank you for your enquiry about our Upstairs space. We received:",
      customerClosing: "We will get back to you shortly.\n\nKind regards,\nKalvárium 1910",
    },
    cakes: {
      subject: "Cake order",
      intro: "A new cake order has been submitted through the website:",
      footer: FOOTER_EN,
      customerSubject: "Your cake order – Kalvárium 1910",
      customerGreeting: "Dear {name},\n\nthank you for your cake order. We received:",
      customerClosing: "We will confirm availability and pickup shortly.\n\nKind regards,\nKalvárium 1910",
    },
  },
  sk: {
    reservation: {
      subject: "Žiadosť o rezerváciu",
      intro: "Cez webovú stránku bola odoslaná nová žiadosť o rezerváciu:",
      footer: FOOTER_SK,
      customerSubject: "Vaša rezervácia – Kalvárium 1910",
      customerGreeting: "Dobrý deň {name},\n\nďakujeme za vašu žiadosť o rezerváciu. Prijali sme tieto údaje:",
      customerClosing: "Čoskoro sa vám ozveme s potvrdením.\n\nS pozdravom,\nKalvárium 1910",
    },
    upstairs: {
      subject: "Dopyt – priestor Hore",
      intro: "Cez webovú stránku bol odoslaný nový dopyt na priestor Hore:",
      footer: FOOTER_SK,
      customerSubject: "Váš dopyt – Kalvárium 1910 (priestor Hore)",
      customerGreeting: "Dobrý deň {name},\n\nďakujeme za váš dopyt na priestor Hore. Prijali sme:",
      customerClosing: "Čoskoro sa vám ozveme.\n\nS pozdravom,\nKalvárium 1910",
    },
    cakes: {
      subject: "Objednávka torty",
      intro: "Cez webovú stránku bola odoslaná nová objednávka torty:",
      footer: FOOTER_SK,
      customerSubject: "Vaša objednávka torty – Kalvárium 1910",
      customerGreeting: "Dobrý deň {name},\n\nďakujeme za vašu objednávku torty. Prijali sme:",
      customerClosing: "Čoskoro potvrdíme dostupnosť a vyzdvihnutie.\n\nS pozdravom,\nKalvárium 1910",
    },
  },
};

export interface EmailField {
  label: string;
  value: string;
}

export interface RenderOpts {
  /** Customer's email (from a form field) — enables the "reply to customer" button. */
  customerEmail?: string;
  /** Customer's name (from a name-ish field) — fills `{name}` and the subject. */
  customerName?: string;
  /** Locale for the wording (default en). */
  locale?: "sk" | "en";
}

/**
 * Render the branded HTML + plain-text bodies and subject for a form-notification
 * email. All wording is defined in code (TEMPLATES above); the submitted `fields`
 * are rendered as a label/value table. Table-based inline styles for broad
 * email-client support (Playfair/Cormorant fall back to Georgia).
 */
export function renderFormEmail(
  recipient: FormRecipient,
  fields: EmailField[],
  opts?: RenderOpts,
): { html: string; text: string; subject: string } {
  const locale = opts?.locale === "sk" ? "sk" : "en";
  const t = TEMPLATES[locale][recipient];
  const name = opts?.customerName ?? "";
  const fill = (s: string) => s.replace(/\{name\}/g, name).trim();

  const rows = fields
    .map(
      (f) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(43,36,33,0.1);font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:rgba(43,36,33,0.55);width:38%;vertical-align:top;">${esc(f.label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(43,36,33,0.1);font-family:Georgia,serif;font-size:16px;color:#2b2421;">${esc(f.value).replace(/\n/g, "<br>")}</td>
        </tr>`,
    )
    .join("");

  const introHtml = `<p style="margin:0 0 12px;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:rgba(43,36,33,0.8);">${esc(t.intro)}</p>`;
  const footerHtml = `<p style="margin:16px 0 0;font-family:Georgia,serif;font-size:13px;color:rgba(43,36,33,0.5);">${esc(t.footer)}</p>`;

  // "Reply to customer" button: a mailto pre-filled with the recap + greeting/closing.
  const recap = fields.map((f) => `${f.label}: ${f.value}`).join("\n");
  const customerBody = [fill(t.customerGreeting), recap, fill(t.customerClosing)].filter(Boolean).join("\n\n");
  const buttonLabel = locale === "sk" ? "Odpovedať zákazníkovi" : "Reply to customer";
  const mailto = opts?.customerEmail
    ? `mailto:${opts.customerEmail}?subject=${encodeURIComponent(t.customerSubject)}&body=${encodeURIComponent(customerBody)}`
    : null;
  const button = mailto
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
                  <tr><td style="background:#a85a32;border-radius:2px;">
                    <a href="${esc(mailto)}" style="display:inline-block;padding:13px 26px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;text-decoration:none;">${buttonLabel} &rarr;</a>
                  </td></tr>
                </table>`
    : "";

  const subject = name ? `${t.subject} — ${name}` : t.subject;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8f2e6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f2e6;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fffdf9;border:1px solid rgba(0,0,0,0.08);">
            <tr>
              <td style="background:#33473a;padding:28px 32px;text-align:center;">
                <div style="font-family:Georgia,'Playfair Display',serif;color:#f8f2e6;font-size:22px;letter-spacing:2px;">KALVÁRIUM 1910</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${introHtml}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse;">${rows}</table>
                ${button}
                ${footerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text =
    [t.intro, recap, t.footer, opts?.customerEmail ? `Reply to customer: ${opts.customerEmail}` : ""]
      .filter(Boolean)
      .join("\n\n") + "\n";

  return { html, text, subject };
}
