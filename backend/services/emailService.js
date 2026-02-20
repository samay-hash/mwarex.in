const { Resend } = require("resend");

// Use Resend HTTP API for emails
// Works on Render (no SMTP needed), no Google verification needed
let resendClient = null;

const getResendClient = () => {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      console.error("[Email] RESEND_API_KEY not set!");
      return null;
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

const sendInviteEmail = async (toEmail, inviteLink, creatorName) => {
  const client = getResendClient();
  if (!client) {
    console.error("[Email] Cannot send — Resend client not available");
    throw new Error("Email service not configured");
  }

  console.log(`[Email] Sending invite to ${toEmail} via Resend...`);

  try {
    const { data, error } = await client.emails.send({
      from: "MwareX <team-Samay@mwarex.in>",
      to: [toEmail],
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
    });

    if (error) {
      console.error("[Email] Resend Error:", error);
      throw new Error(error.message || "Failed to send email");
    }

    console.log("[Email] Sent successfully! ID:", data.id);
    return data;
  } catch (error) {
    console.error("[Email] Send Error:", error.message);
    throw error;
  }
};

const verifyConnection = async () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  Email: RESEND_API_KEY not set — invite emails will not be sent");
    console.warn("   Get a free key at https://resend.com");
    return;
  }
  console.log("✅ Resend Email Service Ready");
};

module.exports = { sendInviteEmail, verifyConnection };
