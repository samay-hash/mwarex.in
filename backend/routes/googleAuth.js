const router = require("express").Router();
const { google } = require("googleapis");

router.get("/google", (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT
    );

    const { origin } = req.query;

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      state: origin, // Pass the origin in the state
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/youtube.upload",
      ],
    });

    return res.redirect(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate auth url" });
  }
});

module.exports = router;
