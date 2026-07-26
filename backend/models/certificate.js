const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "Mwarex",
    },
    issueDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["VALID", "REVOKED"],
      default: "VALID",
    },
    issuedBy: {
      name: { type: String, default: "Samay" },
      title: { type: String, default: "Founder & CEO, Mwarex" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
