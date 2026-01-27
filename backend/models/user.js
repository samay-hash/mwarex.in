const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  role: {
    type: String,
    enum: ["creator", "editor", "admin"],
    default: "creator",
  },
  youtubeTokens: {
    accessToken: String,
    refreshToken: String,
    updatedAt: Date,
  },
  settings: {
    aiAutoSuggest: { type: Boolean, default: true },
    aiThumbnailGen: { type: Boolean, default: true },
    contentModeration: { type: String, default: 'medium' },
    defaultStyle: { type: String, default: 'modern' },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false }
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
