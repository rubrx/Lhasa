import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEmailHtml(name: string, email: string, phone: string | undefined, message: string): string {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const escaped = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1c1c1a;padding:28px 36px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Lhasa</p>
            <p style="margin:6px 0 0;font-size:13px;color:#a0a09a;">New message via contact form</p>
          </td>
        </tr>

        <!-- Sender info -->
        <tr>
          <td style="padding:28px 36px 0;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9b9b95;">From</p>
            <table cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;width:100%;padding:16px 20px;">
              <tr>
                <td>
                  <p style="margin:0;font-size:17px;font-weight:600;color:#1c1c1a;">${escaped(name)}</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#555552;">
                    <a href="mailto:${escaped(email)}" style="color:#7c5f3d;text-decoration:none;">${escaped(email)}</a>
                  </p>
                  ${phone ? `<p style="margin:6px 0 0;font-size:14px;color:#555552;">${escaped(phone)}</p>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:24px 36px 0;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#9b9b95;">Message</p>
            <div style="font-size:15px;line-height:1.7;color:#2a2a28;white-space:pre-wrap;">${escaped(message)}</div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 36px;border-top:1px solid #eeede9;margin-top:28px;">
            <p style="margin:0;font-size:12px;color:#b0afa9;">
              Sent ${timestamp} IST · <a href="mailto:${escaped(email)}" style="color:#7c5f3d;text-decoration:none;">Reply to ${escaped(name)}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  const { name, email, phone, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Lhasa Contact <onboarding@resend.dev>",
    to: "rubrangsokri07@gmail.com",
    replyTo: email,
    subject: `${name} sent you a message via Lhasa`,
    html: buildEmailHtml(name, email, phone || undefined, message),
    text: [`From: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : "", "", message]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
