const router = require("express").Router();
const YouTubeController = require("../controllers/YouTubeController");
const userAuth = require("../middlewares/userMiddleware");

router.get("/dna", userAuth, (req, res) => YouTubeController.getDNA(req, res));
router.post("/analyze", userAuth, (req, res) => YouTubeController.analyze(req, res));

module.exports = router;
