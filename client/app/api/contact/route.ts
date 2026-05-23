import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Lhasa Contact <onboarding@resend.dev>",
    to: "rubrangsokri07@gmail.com",
    subject: `New message from ${name || "someone"} via Lhasa`,
    text: [
      `From: ${name || "Anonymous"}`,
      email ? `Reply to: ${email}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
    replyTo: email || undefined,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
