const express = require("express");
const router = express.Router();
const waitlistController = require("../controllers/WaitlistController");

// Waitlist routes
router.post("/", (req, res) => waitlistController.join(req, res));
router.get("/count", (req, res) => waitlistController.getCount(req, res));

module.exports = router;
