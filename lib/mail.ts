import { Resend } from 'resend';

import { Routes } from '@/routes';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_VERCEL_URL;

export async function sendVerificationEmail(
  name: string,
  email: string,
  token: string,
) {
  const confirmLink = `${domain}${Routes.auth.emailVerification}?token=${token}`;

  await resend.emails.send({
    from: 'hello@sidedeck.app',
    to: email,
    subject: 'Confirm your email address',
    html: `
      <body style="background-color: #0a0a0a;">
    <table width="100%" border="0" cellspacing="0" cellpadding="20"
      style="font-family: Helvetica, sans-serif; background-color: #0a0a0a;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="20"
            style="background-color: #fafafa; border-collapse: collapse; border-radius: 12px;">
            <tr>
              <td align="center" style="text-align: center;">
                <table style="margin: 0 auto;">
                  <tr>
                    <td>
                      <img src="https://ayvom5vlizclv37r.public.blob.vercel-storage.com/sidedeck-logo-BZ0tzxVoqcKQWYXSEA5U4rVsXA6Gvv.png" alt="Logo" width="32" style="margin-right: 4px;">
                    </td>
                    <td>
                      <p style="font-size: 18px;">Side<span style="font-weight: 600;">Deck</span></p>
                    </td>
                  </tr>
                </table>
                <h1 style="font-size: 18px; margin-bottom: 16px;">Verify Your Email Address</h1>
                <p style="font-size: 16px; color: #555555; margin-bottom: 16px;">
                  Hello ${name}!
                </p>
                <p style="font-size: 16px; color: #555555; margin-bottom: 16px;">
                  Thank you for signing up with SideDeck!
                </p>
                <p style="font-size: 16px; color: #555555;">
                  To complete your registration, please verify your
                  email address by clicking the button below.
                </p>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px; margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${confirmLink}" target="_blank"
                        style="background-color: #0a0a0a; color: #fafafa; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 4px; display: inline-block;">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #555555; margin-top: 20px;">
                  If the button above does not work, please copy and paste the following URL into your web browser:<br>
                  <a href="${confirmLink}" target="_blank"
                    style="color: #0a0a0a;">${confirmLink}</a>
                </p>
                <p style="font-size: 14px; color: #555555;">
                  Please note: The verification link will expire in 24 hours.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f6f6f6; padding: 20px; font-size: 14px; color: #171717;">
                If you did not request this email, no further action is required.
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size: 12px; color: #aaaaaa; padding: 20px;">
                SideDeck | <a style="color: #0a0a0a;" href='https://sidedeck.app'>https://sidedeck.app</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}${Routes.auth.resetPassword}?token=${token}`;

  await resend.emails.send({
    from: 'hello@sidedeck.app',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
