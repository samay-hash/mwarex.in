const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const userAuth = require("../middlewares/userMiddleware");

router.post("/signup", (req, res) => AuthController.signup(req, res));
router.post("/signin", (req, res) => AuthController.signin(req, res));
router.get("/me", userAuth, (req, res) => AuthController.getProfile(req, res));
router.put("/settings", userAuth, (req, res) => AuthController.updateSettings(req, res));
router.get("/editors", userAuth, (req, res) => AuthController.getEditors(req, res));
router.delete("/editors/:id", userAuth, (req, res) => AuthController.removeEditor(req, res));

module.exports = router;
