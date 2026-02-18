const express = require("express");
const router = express.Router();
const roomModel = require("../models/Room");
const userModel = require("../models/user");
const userAuth = require("../middlewares/userMiddleware");
const crypto = require("crypto");

// Create a new room
router.post("/create", userAuth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Room name is required" });

        const inviteToken = crypto.randomBytes(16).toString("hex");

        const room = await roomModel.create({
            name,
            ownerId: req.userId,
            inviteToken,
            members: [] // Initial members list is empty, owner is separate
        });

        // Add room to user's joinedRooms (owner is implicitly joined)
        await userModel.findByIdAndUpdate(req.userId, {
            $addToSet: { joinedRooms: room._id }
        });

        res.json(room);
    } catch (err) {
        console.error("Create Room Error:", err);
        res.status(500).json({ message: "Failed to create room" });
    }
});

// Verify invite token
router.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const room = await roomModel.findOne({ inviteToken: token }).populate("ownerId", "name email");

        if (!room) return res.status(404).json({ message: "Invalid invite link" });

        res.json({
            valid: true,
            roomName: room.name,
            ownerName: room.ownerId.name,
            ownerEmail: room.ownerId.email, // Optional, maybe redact
            roomId: room._id
        });
    } catch (err) {
        console.error("Verify Token Error:", err);
        res.status(500).json({ message: "Failed to verify token" });
    }
});

// List all rooms user is part of (owned or joined)
router.get("/list", userAuth, async (req, res) => {
    try {
        // Find rooms where user is owner OR user is in members list
        // Actually, we can rely on user.joinedRooms if we keep it in sync, 
        // but a direct query is safer for now to ensure consistency.

        const ownedRooms = await roomModel.find({ ownerId: req.userId });
        const joinedRooms = await roomModel.find({ "members.userId": req.userId });

        // Combine and deduplicate (though they shouldn't overlap if logic is correct)
        const allRooms = [...ownedRooms, ...joinedRooms].reduce((acc, current) => {
            const x = acc.find(item => item._id.toString() === current._id.toString());
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        res.json(allRooms);
    } catch (err) {
        console.error("List Rooms Error:", err);
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
});

// Join a room via token
router.post("/join", userAuth, async (req, res) => {
    try {
        const { token } = req.body;
        const room = await roomModel.findOne({ inviteToken: token });

        if (!room) return res.status(404).json({ message: "Invalid invite link" });

        // Check if already member
        const isMember = room.members.some(m => m.userId.toString() === req.userId);
        const isOwner = room.ownerId.toString() === req.userId;

        if (isMember || isOwner) {
            return res.json({ message: "Already a member", room });
        }

        // Add to members
        room.members.push({ userId: req.userId, role: 'editor' });
        await room.save();

        // Add to user's joinedRooms
        await userModel.findByIdAndUpdate(req.userId, {
            $addToSet: { joinedRooms: room._id }
        });

        res.json({ message: "Joined room successfully", room });
    } catch (err) {
        console.error("Join Room Error:", err);
        res.status(500).json({ message: "Failed to join room" });
    }
});

// Get specific room details (verify access)
router.get("/:id", userAuth, async (req, res) => {
    try {
        const room = await roomModel.findById(req.params.id)
            .populate("ownerId", "name email")
            .populate("members.userId", "name email");

        if (!room) return res.status(404).json({ message: "Room not found" });

        // Check access
        const isMember = room.members.some(m => m.userId.toString() === req.userId);
        const isOwner = room.ownerId.toString() === req.userId;

        if (!isMember && !isOwner) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(room);
    } catch (err) {
        res.status(500).json({ message: "Error fetching room" });
    }
});

module.exports = router;
