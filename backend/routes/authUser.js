const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, creatorId, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 7);
    const newUser = await userModel.create({
      email,
      password: hashed,
      name,
      creatorId: creatorId || null,
      role: role || "creator",
    });
    res.json({
      message: "User Created",
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email,
  });
  if (!user) {
    return res.status(404).json({ message: "not found" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "invalid" });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_USER
  );

  res.cookie("auth", token, {
    httpOnly: true,
    secure: true, // Required for sameSite: "none"
    sameSite: "none", // Required for cross-domain cookies
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  res.json({ token });
  console.log("SIGN IN EMAIL:", email);
});

router.get("/me", require("../middlewares/userMiddleware"), async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.put("/settings", require("../middlewares/userMiddleware"), async (req, res) => {
  try {
    const { settings } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { $set: { settings } },
      { new: true }
    ).select("-password");
    res.json({ message: "Settings updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// Fetch editors associated with the current creator
router.get("/editors", require("../middlewares/userMiddleware"), async (req, res) => {
  try {
    const editors = await userModel.find({
      creatorId: req.userId,
      role: "editor"
    }).select("name email _id");

    res.json(editors);
  } catch (err) {
    console.error("Error fetching editors:", err);
    res.status(500).json({ message: "Failed to fetch editors" });
  }
});

// Revoke editor access
router.delete("/editors/:id", require("../middlewares/userMiddleware"), async (req, res) => {
  try {
    const editorId = req.params.id;
    const editor = await userModel.findOne({ _id: editorId, creatorId: req.userId });

    if (!editor) {
      return res.status(404).json({ message: "Editor not found or not associated with you." });
    }

    // Unlink the editor
    editor.creatorId = null;
    await editor.save();

    res.json({ message: "Editor removed successfully" });
  } catch (err) {
    console.error("Error removing editor:", err);
    res.status(500).json({ message: "Failed to remove editor" });
  }
});

module.exports = router;
