const { google } = require("googleapis");
const userModel = require("../models/user");

// Use Gmail API (HTTP-based) instead of SMTP
// Render's free tier blocks SMTP ports (465, 587), so we use REST API instead

// Get Gmail client using the CREATOR's stored OAuth tokens
const getGmailClientForUser = async (userId) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT
  );

  const user = await userModel.findById(userId);
  if (!user || !user.youtubeTokens || !user.youtubeTokens.refreshToken) {
    throw new Error("User has no stored Google refresh token");
  }

  oauth2Client.setCredentials({
    access_token: user.youtubeTokens.accessToken,
    refresh_token: user.youtubeTokens.refreshToken,
  });

  // Save refreshed tokens back to DB
  oauth2Client.on("tokens", async (tokens) => {
    try {
      const updateData = { "youtubeTokens.updatedAt": new Date() };
      if (tokens.access_token) updateData["youtubeTokens.accessToken"] = tokens.access_token;
      if (tokens.refresh_token) updateData["youtubeTokens.refreshToken"] = tokens.refresh_token;
      await userModel.findByIdAndUpdate(userId, { $set: updateData });
    } catch (err) {
      console.error("[Email] Failed to save refreshed tokens:", err.message);
    }
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};

// Build a raw RFC 2822 email message
const buildRawEmail = (from, to, subject, htmlBody) => {
  const boundary = "boundary_" + Date.now();
  const messageParts = [
    `From: "MwareX" <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ];

  const rawMessage = messageParts.join("\r\n");
  // Gmail API requires base64url encoding
  return Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sendInviteEmail = async (toEmail, inviteLink, creatorName, creatorId) => {
  console.log(`[Email] Sending invite to ${toEmail} via Gmail API...`);

  try {
    const gmail = await getGmailClientForUser(creatorId);

    // Get the sender's email from their Gmail profile
    let senderEmail = process.env.EMAIL_USER;
    try {
      const profile = await gmail.users.getProfile({ userId: "me" });
      senderEmail = profile.data.emailAddress;
    } catch (e) {
      console.log("[Email] Could not get profile, using default sender");
    }

    const htmlBody = `
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
    `;

    const raw = buildRawEmail(
      senderEmail,
      toEmail,
      "You've been invited to join a MwareX Workspace",
      htmlBody
    );

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });

    console.log("[Email] Sent successfully via Gmail API. Message ID:", result.data.id);
    return result.data;
  } catch (error) {
    console.error("[Email] Gmail API Error:", error.message);
    if (error.response) {
      console.error("[Email] Error details:", JSON.stringify(error.response.data));
    }
    throw error;
  }
};

const verifyConnection = async () => {
  // Gmail API uses HTTP — no SMTP connection to verify
  // We just check that the required env vars exist
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("❌ Email: Google OAuth credentials not set");
    return;
  }
  console.log("✅ Gmail API Email Service Ready (uses creator's OAuth tokens)");
};

module.exports = { sendInviteEmail, verifyConnection };
