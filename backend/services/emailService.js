const nodemailer = require("nodemailer");

// Create transporter lazily (only when needed) to ensure env vars are loaded
let _transporter = null;

const getTransporter = () => {
  if (!_transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("[Email] EMAIL_USER or EMAIL_PASS not set in environment!");
      return null;
    }

    _transporter = nodemailer.createTransport({
      service: "gmail", // Using 'service' instead of host/port — more reliable across environments
      connectionTimeout: 10000, // 10 second connection timeout
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("[Email] Transporter created for:", process.env.EMAIL_USER);
  }
  return _transporter;
};

const sendInviteEmail = async (toEmail, inviteLink, creatorName) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("[Email] Cannot send — transporter not available");
    return null;
  }

  const mailOptions = {
    from: `"MwareX" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "You've been invited to join a MwareX Workspace",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to MwareX</h2>
        <p style="font-size: 16px; color: #555;">
          Hello,
        </p>
        <p style="font-size: 16px; color: #555;">
          <strong>${creatorName || "A creator"}</strong> has invited you to collaborate on their video content as an editor.
        </p>
        <p style="font-size: 16px; color: #555;">
          Click the button below to accept the invitation and set up your secure workspace.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Join Workspace
          </a>
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${inviteLink}" style="color: #0066cc;">${inviteLink}</a>
        </p>
      </div>
    `,
  };

  console.log(`[Email] Attempting to send to ${toEmail} from ${process.env.EMAIL_USER}...`);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[Email] Sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("[Email] Send Error:", error.code, error.message);
    // Reset transporter so it's recreated on next attempt
    _transporter = null;
    throw error;
  }
};

const verifyConnection = async () => {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("❌ SMTP: No transporter — EMAIL_USER or EMAIL_PASS missing");
    return;
  }

  try {
    await transporter.verify();
    console.log("✅ SMTP Connection Verified (Ready to send emails)");
  } catch (error) {
    console.error("❌ SMTP Connection Failed:", error.code, error.message);
    console.error("   Hint: Check EMAIL_USER, EMAIL_PASS, and ensure App Password is used.");
    // Reset transporter so it's recreated on next attempt
    _transporter = null;
  }
};

module.exports = { sendInviteEmail, verifyConnection };
