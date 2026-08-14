import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getEmails, getGeneralInfo, type FormRecipient } from "@/lib/strapi";
import { renderFormEmail } from "@/lib/email";

/**
 * Form endpoint — validates a submission (reservation, cake order, enquiry, …)
 * and emails it to the restaurant. SMTP is configured via env:
 *   SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS,
 *   SMTP_FROM (default = SMTP_USER), RESERVATION_TO (default = General Info email).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const recipientRaw = str(body.recipient);
  const recipient: FormRecipient =
    recipientRaw === "upstairs" || recipientRaw === "cakes" ? recipientRaw : "reservation";
  // Customer's site language — picks the localized email template (default sk).
  const locale = str(body.locale) === "en" ? "en" : "sk";

  // The form's fields (incl. consent checkboxes) are configured in the CMS, so
  // accept whatever it posts as a list of { label, value } pairs. Required fields
  // are enforced in the browser.
  const rawFields = Array.isArray(body.fields) ? body.fields : [];
  const fields = rawFields
    .map((f) => {
      const o = (f ?? {}) as Record<string, unknown>;
      return { label: str(o.label), value: str(o.value) };
    })
    .filter((f) => f.label && f.value);

  if (fields.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  // Recipient chosen on the form → the matching address in the Email single type.
  const emails = await getEmails();
  const chosen =
    recipient === "cakes" ? emails?.cakesEmail : recipient === "upstairs" ? emails?.upstairsEmail : emails?.reservationEmail;
  const to = chosen || process.env.RESERVATION_TO || (await getGeneralInfo())?.contact?.email;
  if (!to) {
    return NextResponse.json({ ok: false, error: "No recipient configured." }, { status: 500 });
  }

  // Reply to whatever field holds an email address; name the subject after a name-ish field.
  const replyTo = fields.find((f) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value))?.value;
  const nameField = fields.find((f) => /name|meno/i.test(f.label))?.value;
  const { html, text, subject } = renderFormEmail(recipient, fields, {
    customerEmail: replyTo,
    customerName: nameField,
    locale,
  });

  // Sender stays on our domain (SPF/DKIM); show the customer's name; Reply-To → customer.
  const fromAddress = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "onboarding@resend.dev";
  const fromHeader = nameField ? `${nameField} <${fromAddress}>` : fromAddress;

  try {
    // Prefer the HTTP API (Resend) — works on hosts that block outbound SMTP (Railway).
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromHeader, to: [to], reply_to: replyTo || undefined, subject, html, text }),
      });
      if (!res.ok) {
        console.error("Resend send failed:", res.status, await res.text().catch(() => ""));
        return NextResponse.json({ ok: false, error: "Failed to send." }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    // Fallback: SMTP (local dev; blocked on Railway). Short timeouts so it fails fast.
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
      console.error("Email not configured — set RESEND_API_KEY (prod) or SMTP_HOST/USER/PASS (local).");
      return NextResponse.json({ ok: false, error: "Email is not configured." }, { status: 500 });
    }
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    await transporter.sendMail({
      from: nameField ? { name: nameField, address: fromAddress } : fromAddress,
      to,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reservation email failed:", err);
    return NextResponse.json({ ok: false, error: "Failed to send." }, { status: 502 });
  }
}
