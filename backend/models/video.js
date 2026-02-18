const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  fileUrl: String,
  title: String,
  description: String,
  thumbnailUrl: String,

  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  editorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "uploaded", "processing", "upload_failed", "raw_uploaded", "raw_rejected", "editing_in_progress"],
    default: "pending",
  },
  rejectionReason: String,

  // Raw Video Workflow Fields
  rawFileUrl: String, // If creator uploads a raw video
  hasRawVideo: { type: Boolean, default: false },
  editorReviewStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending" // Only relevant if hasRawVideo is true
  },
  editorRejectionReason: String,

  // Messaging / Feedback
  comments: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Video Editing / Color Grading Metadata
  editSettings: {
    brightness: { type: Number, default: 100 },
    contrast: { type: Number, default: 100 },
    saturation: { type: Number, default: 100 },
    grayscale: { type: Number, default: 0 },
    sepia: { type: Number, default: 0 },
    trimStart: { type: Number, default: 0 }, // In seconds
    trimEnd: { type: Number, default: 0 }     // In seconds
  }
});

const videoModel = mongoose.models.Video || mongoose.model("Video", videoSchema);

module.exports = videoModel;
