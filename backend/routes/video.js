const router = require("express").Router();
const path = require("path");
const { google } = require("googleapis");
const { getOAuth2Client } = require("../tools/googleClient");

const multer = require("multer");
const videoModel = require("../models/video");
const userModel = require("../models/user");
const adminAuth = require("../middlewares/adminMiddleware");
const userAuth = require("../middlewares/userMiddleware");
const uploadToYoutube = require("../services/youtubeUploader");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mwarex_videos",
    resource_type: "video",
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("video"), async (req, res) => {
  console.log("BODY ===>", req.body);
  console.log("FILE ===>", req.file);
  try {
    const video = await videoModel.create({
      fileUrl: req.file.path,
      title: req.body.title,
      description: req.body.description,
      editorId: req.body.editorId,
      creatorId: req.body.creatorId,
    });
    res.json({ message: "uploaded", video });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "upload failed", error: err.message });
  }
});

router.get("/", userAuth, async (req, res) => {
  let filter = {};
  if (req.role === "creator") {
    filter.creatorId = req.userId;
  } else if (req.role === "editor") {
    const user = await userModel.findById(req.userId);
    if (!user || !user.creatorId) {
      return res.json([]);
    }
    filter.creatorId = user.creatorId;
  }
  const videos = await videoModel.find(filter).sort({ createdAt: -1 });
  res.json(videos);
});

router.get("/pending", userAuth, async (req, res) => {
  let filter = { status: "pending" };
  if (req.role === "creator") {
    filter.creatorId = req.userId;
  } else if (req.role === "editor") {

    const user = await userModel.findById(req.userId);
    if (!user || !user.creatorId) {
      return res.json([]);
    }
    filter.creatorId = user.creatorId;
  }
  const videos = await videoModel.find(filter);
  res.json(videos);
});

router.post("/:id/approve", userAuth, async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video Not Found" });
    }

    const user = await userModel.findById(req.userId);
    if (!user || !user.youtubeTokens || !user.youtubeTokens.refreshToken) {
      return res.status(400).json({
        message: "YouTube account not connected. Please go to Settings and connect your channel."
      });
    }

    video.status = "processing";
    await video.save();


    res.json({ message: "Video approved. Uploading to YouTube in background..." });

    uploadToYoutube(video, req.userId)
      .then(async (yt) => {
        console.log("YouTube Upload Success:", yt.id);
        video.status = "uploaded";
        video.youtubeId = yt.id;
        await video.save();
      })
      .catch(async (uploadErr) => {
        console.error("YouTube Upload Error (Background):", uploadErr);
        video.status = "upload_failed";
        await video.save();
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Approval process failed", error: err.message });
  }
});

router.post("/:id/reject", userAuth, async (req, res) => {
  const video = await videoModel.findById(req.params.id);
  if (!video) {
    return res.status(404).json({ message: "not found" });
  }
  video.status = "rejected";
  await video.save();

  res.json({ message: "Video Rejected" });
});

// Store YouTube tokens for user
router.post("/store-youtube-tokens", userAuth, async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.youtubeTokens = {
      accessToken,
      refreshToken,
      updatedAt: new Date(),
    };
    await user.save();

    res.json({ message: "YouTube tokens stored successfully" });
  } catch (error) {
    console.error("Error storing YouTube tokens:", error);
    res.status(500).json({ message: "Failed to store tokens" });
  }
});

router.put("/:id/thumbnail", userAuth, async (req, res) => {
  try {
    const { thumbnailUrl } = req.body;
    const video = await videoModel.findByIdAndUpdate(
      req.params.id,
      { thumbnailUrl },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Failed to update thumbnail" });
  }
});

module.exports = router;


