import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
console.log("[resend] API key loaded:", key ? `yes (${key.slice(0, 7)}...)` : "NO — check .env.local");

const resend = new Resend(key);

const FROM    = "GoHorn Detailing <onboarding@resend.dev>";
const TO      = "kiran@unicorn.love"; // sandbox: must match Resend account email until domain is verified
const BRAND   = { navy: "#1F2433", green: "#3FAE89", cream: "#FAF7F0", warm: "#F0EBE3" };

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.navy};border-radius:16px 16px 0 0;padding:28px 36px;">
            <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">🐎 GoHorn Detailing</span>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.55);letter-spacing:1.5px;text-transform:uppercase;">${title}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:32px 36px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${BRAND.warm};border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#888;">
              Manage submissions →
              <a href="https://supabase.com/dashboard" style="color:${BRAND.green};font-weight:600;text-decoration:none;">Supabase Dashboard</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string | null | undefined, highlight = false): string {
  if (!value) return "";
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #F0EBE3;width:38%;">
      <span style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;">${label}</span>
    </td>
    <td style="padding:10px 0 10px 16px;border-bottom:1px solid #F0EBE3;">
      <span style="font-size:14px;font-weight:${highlight ? "700" : "500"};color:${highlight ? BRAND.navy : "#333"};">${value}</span>
    </td>
  </tr>`;
}

function section(heading: string, rows: string): string {
  return `
  <p style="margin:24px 0 8px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;">${heading}</p>
  <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

function tag(text: string): string {
  return `<span style="display:inline-block;background:${BRAND.warm};color:${BRAND.navy};font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;margin:2px 3px 2px 0;">${text}</span>`;
}

// ─── Booking notification ─────────────────────────────────────────────────────

type BookingPayload = {
  service: string;
  addons: string[];
  date: string;
  time: string;
  vehicle_year?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_size?: string | null;
  location: string;
  address?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_notes?: string | null;
  first_time_discount: boolean;
};

export async function sendBookingNotification(b: BookingPayload) {
  const vehicle = [b.vehicle_year, b.vehicle_make, b.vehicle_model].filter(Boolean).join(" ") || "—";
  const addonText = b.addons.length ? b.addons.map(a => tag(a)).join("") : "None";
  const locationText = b.location === "shop" ? "At our shop (304 Lake George Ave)" : `Mobile — ${b.address || "address not provided"}`;

  const body = `
    ${section("Service", `
      ${row("Service", b.service, true)}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F0EBE3;width:38%;">
          <span style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Add-ons</span>
        </td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #F0EBE3;">${addonText}</td>
      </tr>
      ${row("Date", b.date)}
      ${row("Time", b.time)}
    `)}
    ${section("Location", `
      ${row("Where", locationText)}
    `)}
    ${section("Vehicle", `
      ${row("Vehicle", vehicle)}
      ${row("Size", b.vehicle_size ?? null)}
    `)}
    ${section("Customer", `
      ${row("Name", b.customer_name, true)}
      ${row("Phone", b.customer_phone)}
      ${row("Email", b.customer_email)}
      ${row("Notes", b.customer_notes ?? null)}
      ${b.first_time_discount ? row("Discount", "✓ First-time 20% discount applied") : ""}
    `)}
  `;

  const { error } = await resend.emails.send({
    from:    FROM,
    to:      TO,
    subject: `New booking — ${b.service} · ${b.date}`,
    html:    base("New Booking Received", body),
  });

  if (error) throw error;
}

// ─── Quote notification ───────────────────────────────────────────────────────

type QuotePayload = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle_year?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_size?: string | null;
  service_interest?: string | null;
  issues: string[];
  location?: string | null;
  notes?: string | null;
  photo_urls?: string[];
};

export async function sendQuoteNotification(q: QuotePayload) {
  const vehicle   = [q.vehicle_year, q.vehicle_make, q.vehicle_model].filter(Boolean).join(" ") || "—";
  const issueText = q.issues.length ? q.issues.map(i => tag(i)).join("") : "None specified";
  const locationText = q.location === "shop"
    ? "At our shop"
    : q.location === "mobile"
    ? "Mobile (come to them)"
    : "—";

  const body = `
    ${section("Customer", `
      ${row("Name", q.customer_name, true)}
      ${row("Phone", q.customer_phone)}
      ${row("Email", q.customer_email)}
    `)}
    ${section("Vehicle", `
      ${row("Vehicle", vehicle)}
      ${row("Size", q.vehicle_size ?? null)}
    `)}
    ${section("Request", `
      ${row("Service interest", q.service_interest ?? null)}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F0EBE3;width:38%;">
          <span style="font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Issues</span>
        </td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #F0EBE3;">${issueText}</td>
      </tr>
      ${row("Location", locationText)}
      ${row("Notes", q.notes ?? null)}
    `)}
    ${q.photo_urls && q.photo_urls.length > 0 ? `
    <p style="margin:24px 0 8px;font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;">
      Photos (${q.photo_urls.length})
    </p>
    <table cellpadding="0" cellspacing="0"><tr>
      ${q.photo_urls.map((url, i) => `
        <td style="padding:0 8px 0 0;vertical-align:top;">
          <a href="${url}" target="_blank" style="text-decoration:none;">
            <img src="${url}" width="180" alt="Photo ${i + 1}"
              style="display:block;border-radius:8px;border:1px solid #E8E0D8;object-fit:cover;" />
            <span style="display:block;text-align:center;font-size:11px;color:#888;margin-top:4px;">
              Photo ${i + 1}
            </span>
          </a>
        </td>
      `).join("")}
    </tr></table>
    ` : ""}
  `;

  const { error } = await resend.emails.send({
    from:    FROM,
    to:      TO,
    subject: `New quote request — ${q.customer_name} · ${q.service_interest ?? "General"}`,
    html:    base("New Quote Request", body),
  });

  if (error) throw error;
}
