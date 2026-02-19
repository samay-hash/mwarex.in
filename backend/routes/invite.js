const router = require("express").Router();
const crypto = require("crypto");
const EditorAssignment = require("../models/EditorAssignment");
const userModel = require("../models/user");
const { creatorAuth } = require("../middlewares/creatorMiddleware");
const { sendInviteEmail } = require("../services/emailService");

router.post("/invite", creatorAuth, async (req, res) => {
  try {
    const { email, inviteLink: providedLink } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate a token for the EditorAssignment record
    const token = crypto.randomBytes(32).toString("hex");

    await EditorAssignment.create({
      creatorId: req.userId,
      editorEmail: email,
      inviteToken: token,
    });

    // Use the provided invite link (from Room-based system) or generate one
    const frontendUrl = (process.env.FRONTEND_URL || "https://www.mwarex.in").replace(/\/$/, "");
    const inviteLink = providedLink || `${frontendUrl}/join?token=${token}`;

    const creator = await userModel.findById(req.userId);
    const creatorName = creator ? creator.name : "A Creator";

    console.log("Invite link for email:", inviteLink);

    // Send email BEFORE responding (critical for Render — 
    // if we respond first, the process might get killed before email completes)
    let emailSent = false;
    if (email) {
      console.log("[Invite] Sending email to:", email);
      try {
        await sendInviteEmail(email, inviteLink, creatorName, req.userId);
        console.log("[Invite] Email sent successfully to:", email);
        emailSent = true;
      } catch (emailErr) {
        console.error("[Invite] EMAIL ERROR:", emailErr.message);
        // Don't fail the whole invite — link still works
      }
    }

    res.json({
      message: emailSent ? "Invite sent via email!" : "Invite link generated!",
      inviteLink,
      emailSent,
    });

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
