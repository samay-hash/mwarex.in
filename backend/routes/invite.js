const router = require("express").Router();
const crypto = require("crypto");
const EditorAssignment = require("../models/EditorAssignment");
const userModel = require("../models/user");
const { creatorAuth } = require("../middlewares/creatorMiddleware");
const { sendInviteEmail } = require("../services/emailService");

router.post("/invite", creatorAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(32).toString("hex");

    const invite = await EditorAssignment.create({
      creatorId: req.userId,
      editorEmail: email,
      inviteToken: token,
    });
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const inviteLink = `${frontendUrl}/join?token=${token}`;

    // Fetch creator name for the email
    const creator = await userModel.findById(req.userId);
    const creatorName = creator ? creator.name : "A Creator";

    console.log("Invite link generated:", inviteLink);

    // Send response IMMEDIATELY (don't wait for email)
    res.json({
      message: "Invite link generated!",
      inviteLink,
    });

    // Fire-and-forget email (runs in background after response is sent)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && email) {
      sendInviteEmail(email, inviteLink, creatorName)
        .then(() => console.log("Email sent successfully to:", email))
        .catch((emailErr) => console.error("Email sending failed (non-blocking):", emailErr.message));
    } else {
      console.log("Email not configured or recipient missing. Link-only mode.");
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/verify", async (req, res) => {
  const token = req.query.token;
  const invite = await EditorAssignment.findOne({
    inviteToken: token,
  });
  if (!invite) {
    return res.status(404).json({ message: "Invalid invite link" });
  }
  res.json({
    message: "invite valid, proceed to signup",
    email: invite.editorEmail,
    creatorId: invite.creatorId,
  });
});

module.exports = router;
