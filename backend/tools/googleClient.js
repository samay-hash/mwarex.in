const { google } = require("googleapis");
const userModel = require("../models/user");
require("dotenv").config();

const getOAuth2Client = async (userId) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT
  );

  const user = await userModel.findById(userId);
  if (user && user.youtubeTokens) {
    oauth2Client.setCredentials({
      access_token: user.youtubeTokens.accessToken,
      refresh_token: user.youtubeTokens.refreshToken,
    });
  } else if (process.env.YOUTUBE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });
  }

  // IMPORTANT: Listen for token refresh events
  // When the access_token expires, googleapis auto-refreshes it using the refresh_token.
  // We MUST save the new tokens back to the database so they persist.
  oauth2Client.on("tokens", async (tokens) => {
    try {
      console.log("[OAuth] Token refreshed for user:", userId);
      const updateData = {
        "youtubeTokens.updatedAt": new Date(),
      };
      if (tokens.access_token) {
        updateData["youtubeTokens.accessToken"] = tokens.access_token;
      }
      // Google only sends a new refresh_token if the old one was revoked
      if (tokens.refresh_token) {
        updateData["youtubeTokens.refreshToken"] = tokens.refresh_token;
      }
      await userModel.findByIdAndUpdate(userId, { $set: updateData });
      console.log("[OAuth] Tokens saved to DB successfully");
    } catch (err) {
      console.error("[OAuth] Failed to save refreshed tokens:", err.message);
    }
  });

  return oauth2Client;
};

module.exports = { getOAuth2Client };
