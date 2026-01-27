const router = require("express").Router();
const userModel = require("../models/user");
const userAuth = require("../middlewares/userMiddleware");

// Get Creator's assigned Editors (if any) or just basic settings
router.get("/get-settings", userAuth, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        res.json({ settings: user.settings || {} });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
});

// Update Settings
router.put("/settings", userAuth, async (req, res) => {
    try {
        const { settings } = req.body;
        const user = await userModel.findByIdAndUpdate(
            req.userId,
            { settings },
            { new: true }
        );
        res.json({ message: "Settings Saved", settings: user.settings });
    } catch (err) {
        res.status(500).json({ message: "Error saving settings" });
    }
});

module.exports = router;
