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
    const frontendUrl = (process.env.FRONTEND_URL || "https://www.mwarex.in").replace(/\/$/, "");
    const inviteLink = `${frontendUrl}/join?token=${token}`;

    const creator = await userModel.findById(req.userId);
    const creatorName = creator ? creator.name : "A Creator";

    console.log("Invite link generated:", inviteLink);

    res.json({
      message: "Invite link generated!",
      inviteLink,
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && email) {
      console.log("Environment variables present. Sending email...");
      // We'll await this just for debugging to ensure we catch the error 
      // (In production high-scale you might queue this, but for now we need to see the error)
      try {
        await sendInviteEmail(email, inviteLink, creatorName);
        console.log("Email sent successfully to:", email);
      } catch (emailErr) {
        console.error("FULL EMAIL ERROR:", emailErr);
      }
    } else {
      console.log(`Email skip. User: ${!!process.env.EMAIL_USER}, Pass: ${!!process.env.EMAIL_PASS}, To: ${email}`);
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
