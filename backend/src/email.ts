import nodemailer from "nodemailer";
import { EmailStatus, PrismaClient } from "@prisma/client";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function createTransport() {
  const host = process.env.SMTP_HOST;

  if (!host) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  const options: Record<string, unknown> = {
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true"
  };

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    options.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    };
  }

  return nodemailer.createTransport(options);
}

export async function sendEmail(prisma: PrismaClient, input: SendEmailInput) {
  const from = process.env.MAIL_FROM ?? "Beyond ERP <no-reply@beyonderp.local>";
  const transporter = createTransport();

  try {
    const result = await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html
    });

    await prisma.emailLog.create({
      data: {
        to: input.to,
        subject: input.subject,
        status: process.env.SMTP_HOST ? EmailStatus.SENT : EmailStatus.SKIPPED,
        messageId: result.messageId
      }
    });

    return {
      sent: Boolean(process.env.SMTP_HOST),
      skipped: !process.env.SMTP_HOST,
      messageId: result.messageId
    };
  } catch (error) {
    await prisma.emailLog.create({
      data: {
        to: input.to,
        subject: input.subject,
        status: EmailStatus.FAILED,
        error: error instanceof Error ? error.message : "Unknown email error"
      }
    });
    throw error;
  }
}

export function welcomeEmail(fullName: string) {
  return {
    subject: "Welcome to Beyond ERP",
    text: `Hello ${fullName}, your Beyond ERP account is ready.`,
    html: `<p>Hello <strong>${fullName}</strong>, your Beyond ERP account is ready.</p>`
  };
}
