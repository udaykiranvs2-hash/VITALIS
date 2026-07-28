import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return null;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || '"Vitalis Health" <no-reply@vitalis.app>';

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from, to, subject, html, text });
      console.log(`[EMAIL SERVICE] Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[EMAIL SERVICE ERROR] Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Fallback mode for local development when SMTP is not configured
  console.log('\n======================================================');
  console.log(' [EMAIL SERVICE DEV FALLBACK] (No SMTP credentials set)');
  console.log(` To: ${to}`);
  console.log(` Subject: ${subject}`);
  console.log('------------------------------------------------------');
  console.log(text || html);
  console.log('======================================================\n');
  return { success: true, fallback: true };
};

export const sendPasswordResetEmail = async ({ to, name, resetLink }) => {
  const subject = 'Reset Your Vitalis Password';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 30px; line-height: 1.6; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { background-color: #0d9488; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(13,148,136,0.25); }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .link-text { word-break: break-all; color: #0d9488; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vitalis Health</h1>
        </div>
        <div class="content">
          <p>Hello ${name || 'User'},</p>
          <p>We received a request to reset your password for your <strong>Vitalis Health</strong> account.</p>
          <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
          <div class="btn-container">
            <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p class="link-text"><a href="${resetLink}">${resetLink}</a></p>
          <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Vitalis Health. Educational & diagnostic assistance.
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Hello ${name || 'User'},\n\nWe received a request to reset your password for your Vitalis Health account.\n\nPlease use the following link to reset your password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.`;

  return sendEmail({ to, subject, html, text });
};

export const sendLoginNotificationEmail = async ({ to, name, loginTime = new Date().toLocaleString(), ipAddress }) => {
  const subject = 'Security Alert: New Sign-in to Your Vitalis Account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .content { padding: 30px; line-height: 1.6; }
        .alert-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vitalis Security Alert</h1>
        </div>
        <div class="content">
          <p>Hello ${name || 'User'},</p>
          <div class="alert-box">
            <strong>Successful Sign-in Detected</strong><br>
            <span style="font-size: 14px; color: #4b5563;">Time: ${loginTime}</span>
            ${ipAddress ? `<br><span style="font-size: 14px; color: #4b5563;">IP Address: ${ipAddress}</span>` : ''}
          </div>
          <p>Your Vitalis Health account was just accessed. If this was you, no action is needed.</p>
          <p style="color: #dc2626; font-size: 13px;">If you did not sign in recently, please change your password immediately in your account settings.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Vitalis Health. Security & Privacy Protection.
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Hello ${name || 'User'},\n\nA new successful sign-in to your Vitalis Health account was detected at ${loginTime}.\n\nIf this was you, no further action is required. If you did not recognize this login, please change your password immediately.`;

  return sendEmail({ to, subject, html, text });
};
