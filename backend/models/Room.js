const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String, // 'editor', 'viewer', etc.
            default: 'editor'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    inviteToken: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const roomModel = mongoose.models.Room || mongoose.model("Room", roomSchema);
module.exports = roomModel;
