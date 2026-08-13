import type { Block, EmailTemplate } from "./strapi";

/** Escape user/CMS text for safe inclusion in HTML. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Inline leaves + links → HTML (bold / italic / underline / code). */
function inlineHtml(nodes?: Block[]): string {
  if (!nodes) return "";
  return nodes
    .map((n) => {
      if (n.type === "link") return `<a href="${esc(n.url ?? "#")}" style="color:#a85a32;">${inlineHtml(n.children)}</a>`;
      let t = esc(n.text ?? "");
      if (n.code) t = `<code>${t}</code>`;
      if (n.bold) t = `<strong>${t}</strong>`;
      if (n.italic) t = `<em>${t}</em>`;
      if (n.underline) t = `<u>${t}</u>`;
      return t;
    })
    .join("");
}

/** Strapi "blocks" rich text → email-safe HTML (paragraphs, headings, lists, quotes). */
function blocksHtml(blocks?: Block[]): string {
  if (!blocks?.length) return "";
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading": {
          const lvl = Math.min(Math.max(b.level ?? 2, 2), 4);
          return `<h${lvl} style="margin:0 0 12px;font-family:Georgia,serif;color:#2b2421;">${inlineHtml(b.children)}</h${lvl}>`;
        }
        case "list": {
          const tag = b.format === "ordered" ? "ol" : "ul";
          const items = (b.children ?? []).map((li) => `<li>${inlineHtml(li.children)}</li>`).join("");
          return `<${tag} style="margin:0 0 12px 20px;padding:0;font-family:Georgia,serif;font-size:16px;color:rgba(43,36,33,0.8);">${items}</${tag}>`;
        }
        case "quote":
          return `<blockquote style="margin:0 0 12px;padding-left:16px;border-left:2px solid #bb9257;font-family:Georgia,serif;font-style:italic;color:rgba(43,36,33,0.8);">${inlineHtml(b.children)}</blockquote>`;
        default:
          return `<p style="margin:0 0 12px;font-family:Georgia,serif;font-size:16px;line-height:1.6;color:rgba(43,36,33,0.8);">${inlineHtml(b.children)}</p>`;
      }
    })
    .join("");
}

/** Plain-text version of blocks (for the multipart text/plain body). */
function blocksText(blocks?: Block[]): string {
  if (!blocks?.length) return "";
  const line = (nodes?: Block[]): string =>
    (nodes ?? []).map((n) => (n.type === "link" ? line(n.children) : (n.text ?? ""))).join("");
  return blocks
    .map((b) => (b.type === "list" ? (b.children ?? []).map((li) => `- ${line(li.children)}`).join("\n") : line(b.children)))
    .join("\n\n");
}

export interface EmailField {
  label: string;
  value: string;
}

/**
 * Render the branded HTML + plain-text bodies for a form-notification email.
 * The CMS `template` supplies the intro/footer wording; the submitted `fields`
 * are rendered as a label/value table. Table-based, inline-styled layout for
 * broad email-client support (Playfair/Cormorant fall back to Georgia).
 */
export function renderFormEmail(
  template: EmailTemplate | undefined,
  fields: EmailField[],
): { html: string; text: string } {
  const intro = blocksHtml(template?.intro);
  const footer = blocksHtml(template?.footer);

  const rows = fields
    .map(
      (f) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(43,36,33,0.1);font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:rgba(43,36,33,0.55);width:38%;vertical-align:top;">${esc(f.label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(43,36,33,0.1);font-family:Georgia,serif;font-size:16px;color:#2b2421;">${esc(f.value).replace(/\n/g, "<br>")}</td>
        </tr>`,
    )
    .join("");

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
                ${intro}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse;">${rows}</table>
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text =
    [blocksText(template?.intro), fields.map((f) => `${f.label}: ${f.value}`).join("\n"), blocksText(template?.footer)]
      .filter(Boolean)
      .join("\n\n") + "\n";

  return { html, text };
}
