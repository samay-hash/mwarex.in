const mongoose = require("mongoose");

const creatorDNASchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  channelName: {
    type: String,
    default: "Your Channel"
  },
  audienceDNA: {
    loves: [String],
    ignores: [String]
  },
  nextMoveEngine: {
    topic: String,
    confidence: Number,
    angle: String
  },
  videoAutopsy: {
    videoTitle: String,
    signals: [String]
  },
  performanceComparison: {
    highPerformer: {
      videoTitle: String,
      views: String,
      engagement: String,
      reasonsWorked: [String],
      dnaScore: Number
    },
    lowPerformer: {
      videoTitle: String,
      views: String,
      engagement: String,
      reasonsUnderperformed: [String],
      dnaScore: Number
    }
  },
  styleDNA: {
    traits: [String],
    hookPatterns: [String],
    storyStructure: [String]
  },
  uploadPredictor: {
    viralProbability: String, // "High", "Medium", "Low"
    bestUploadTime: String
  },
  opportunities: [
    {
      topic: String,
      competition: String // e.g., "Low", "Medium", "High"
    }
  ],
  videosAnalyzed: {
    type: Number,
    default: 0
  },
  criticalMistakes: {
    type: [String],
    default: []
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("CreatorDNA", creatorDNASchema);
