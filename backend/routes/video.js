const router = require("express").Router();
const path = require("path");
const { google } = require("googleapis");
const { getOAuth2Client } = require("../tools/googleClient");

const multer = require("multer");
const roomModel = require("../models/Room");
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

router.post("/upload", userAuth, upload.single("video"), async (req, res) => {
  console.log("BODY ===>", req.body);
  console.log("FILE ===>", req.file);
  try {
    let creatorId = req.body.creatorId || req.userId;

    // If uploading to a room, set creatorId to room owner
    if (req.body.roomId) {
      try {
        const room = await roomModel.findById(req.body.roomId);
        if (room) {
          creatorId = room.ownerId;
        }
      } catch (e) { console.error("Room lookup error in /upload", e); }
    }

    const isEditor = req.role === "editor";

    const video = await videoModel.create({
      fileUrl: req.file.path,
      title: req.body.title,
      description: req.body.description,
      editorId: isEditor ? req.userId : req.body.editorId,
      creatorId: creatorId,
      roomId: req.body.roomId,
      status: isEditor ? "pending" : "raw_uploaded",
    });
    res.json({ message: "uploaded", video });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "upload failed", error: err.message });
  }
});

router.get("/", userAuth, async (req, res) => {
  let filter = {};

  // If roomId is provided, filter by it
  if (req.query.roomId) {
    filter.roomId = req.query.roomId;
  } else {
    // If no room specified, maybe return videos without room (legacy)
    // or just default to user's creator context
  }

  if (req.role === "creator") {
    let isRoomOwner = false;
    if (req.query.roomId) {
      try {
        const room = await roomModel.findById(req.query.roomId);
        // check ownership
        if (room && room.ownerId.toString() === req.userId) {
          isRoomOwner = true;
        }
      } catch (e) {
        console.error("Room check error", e);
      }
    }

    if (!isRoomOwner) {
      filter.creatorId = req.userId;
    }
  } else if (req.role === "editor") {
    if (req.query.roomId) {
      // ideally check if editor is part of this room
      // const room = await roomModel.findById(req.query.roomId);
      // if (!room.members.some(m => m.userId.equals(req.userId))) return res.status(403)...

      // For now, trusting the ID or assuming access if they have it
      filter.roomId = req.query.roomId;

      // Visibility: Assigned to me OR Unassigned
      filter.$or = [
        { editorId: req.userId },
        { editorId: { $exists: false } },
        { editorId: null }
      ];
    } else {
      // Legacy: Filter by linked creatorId
      const user = await userModel.findById(req.userId);
      if (user && user.creatorId) {
        filter.creatorId = user.creatorId;
        // Legacy visibility
        filter.$or = [
          { editorId: req.userId },
          { editorId: { $exists: false } },
          { editorId: null }
        ];
      } else {
        // No room, no creator linked -> empty
        return res.json([]);
      }
    }
  }

  console.log("Fetching videos with filter:", filter);
  const videos = await videoModel.find(filter).sort({ createdAt: -1 }).populate("editorId", "name email");
  res.json(videos);
});

// ... (other routes)

router.post("/upload-raw", userAuth, upload.single("video"), async (req, res) => {
  try {
    console.log("Raw Upload Body:", req.body);
    let creatorId = req.body.creatorId || req.userId;

    // If uploaded to a room, the creatorId must be the Room Owner
    if (req.body.roomId) {
      const room = await roomModel.findById(req.body.roomId);
      if (room) {
        creatorId = room.ownerId;
      }
    }

    const isEditor = req.role === "editor";

    const video = await videoModel.create({
      rawFileUrl: req.file.path,
      fileUrl: req.file.path, // Set fileUrl to avoid empty string issues
      title: req.body.title,
      description: req.body.description,
      editorId: isEditor ? req.userId : req.body.editorId, // If editor uploads, assign to self
      creatorId: creatorId,
      roomId: req.body.roomId, // Add room association
      thumbnailUrl: req.body.thumbnailUrl || "",
      hasRawVideo: true,
      status: isEditor ? "editing_in_progress" : "raw_uploaded",
      editorReviewStatus: isEditor ? "accepted" : "pending"
    });

    // If room is provided, maybe notify room members?
    if (req.body.roomId && req.io) {
      req.io.to(`room_${req.body.roomId}`).emit("new_video", video);
    }

    res.json({ message: "raw video uploaded", video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "upload failed", error: err.message });
  }
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
    filter.editorId = req.userId; // Only show pending videos for this editor
  }
  const videos = await videoModel.find(filter).populate("editorId", "name email");
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
  if (req.body.reason) {
    video.rejectionReason = req.body.reason;
  }
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

router.post("/:id/comments", userAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const video = await videoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.comments.push({
      senderId: req.userId,
      text,
      createdAt: new Date()
    });
    await video.save();

    // Populate sender info for immediate return
    const updatedVideo = await videoModel.findById(req.params.id).populate("comments.senderId", "name email");
    const newComment = updatedVideo.comments[updatedVideo.comments.length - 1];

    // Emit socket event
    if (req.io) {
      req.io.to(`video_${req.params.id}`).emit("new_comment", newComment);
    }

    res.json(updatedVideo.comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

router.put("/:id/edit-settings", userAuth, async (req, res) => {
  try {
    const { editSettings } = req.body;
    const video = await videoModel.findByIdAndUpdate(
      req.params.id,
      { editSettings },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Failed to save edit settings" });
  }
});

// Get single video with populated data
router.get("/:id", userAuth, async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id)
      .populate("comments.senderId", "name email")
      .populate("editorId", "name")
      .populate("creatorId", "name");

    if (!video) return res.status(404).json({ message: "Not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});




router.post("/:id/raw-review", userAuth, async (req, res) => {
  try {
    const { action, reason } = req.body;
    const video = await videoModel.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (action === "accept") {
      video.editorReviewStatus = "accepted";
      video.status = "editing_in_progress";
      // Claim the video for this editor if not already assigned
      if (!video.editorId) {
        video.editorId = req.userId;
      }
    } else if (action === "reject") {
      video.editorReviewStatus = "rejected";
      video.status = "raw_rejected";
      video.editorRejectionReason = reason;
    }

    await video.save();
    res.json({ message: "Review submitted", video });
  } catch (err) {
    res.status(500).json({ message: "Review failed", error: err.message });
  }
});

router.post("/:id/upload-edit", userAuth, upload.single("video"), async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.fileUrl = req.file.path;
    if (req.body.title) video.title = req.body.title;
    if (req.body.description) video.description = req.body.description;
    if (req.body.thumbnailUrl) video.thumbnailUrl = req.body.thumbnailUrl;

    video.status = "pending"; // Ready for Creator review
    video.rejectionReason = ""; // Clear any previous rejection
    video.editorRejectionReason = ""; // Clear any previous editor rejection
    video.editorReviewStatus = "accepted"; // Implicitly accepted if editing happens

    await video.save();
    res.json({ message: "Edited video uploaded", video });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;


