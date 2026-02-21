const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const VideoController = require("../controllers/VideoController");
const userAuth = require("../middlewares/userMiddleware");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mwarex_videos",
    resource_type: "video",
  },
});

const upload = multer({ storage: storage });

router.post("/upload", userAuth, upload.single("video"), (req, res) => VideoController.upload(req, res));
router.post("/upload-raw", userAuth, upload.single("video"), (req, res) => VideoController.uploadRaw(req, res));
router.get("/", userAuth, (req, res) => VideoController.getAll(req, res));
router.get("/pending", userAuth, (req, res) => VideoController.getPending(req, res));
router.get("/youtube-status", userAuth, (req, res) => VideoController.youtubeStatus(req, res));
router.post("/store-youtube-tokens", userAuth, (req, res) => VideoController.storeYoutubeTokens(req, res));
router.post("/:id/approve", userAuth, (req, res) => VideoController.approve(req, res));
router.post("/:id/reject", userAuth, (req, res) => VideoController.reject(req, res));
router.post("/:id/raw-review", userAuth, (req, res) => VideoController.rawReview(req, res));
router.post("/:id/upload-edit", userAuth, upload.single("video"), (req, res) => VideoController.uploadEdit(req, res));
router.post("/:id/comments", userAuth, (req, res) => VideoController.addComment(req, res));
router.put("/:id/thumbnail", userAuth, (req, res) => VideoController.updateThumbnail(req, res));
router.put("/:id/edit-settings", userAuth, (req, res) => VideoController.updateEditSettings(req, res));
router.get("/:id", userAuth, (req, res) => VideoController.getById(req, res));

module.exports = router;
