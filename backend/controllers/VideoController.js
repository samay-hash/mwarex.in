const BaseController = require("./BaseController");
const VideoService = require("../services/VideoService");
const uploadToYoutube = require("../services/youtubeUploader");
const { getOAuth2Client } = require("../tools/googleClient");

class VideoController extends BaseController {
    constructor(videoService) {
        super();
        this.videoService = videoService;
    }

    emitVideoUpdate(req, video, eventType = "video_updated") {
        if (!req.io) return;
        const roomId = video.roomId || req.body.roomId;
        if (roomId) {
            req.io.to(`room_${roomId}`).emit(eventType, {
                video,
                action: eventType,
                updatedAt: new Date().toISOString(),
            });
        }
    }

    async upload(req, res) {
        try {
            const video = await this.videoService.uploadVideo({
                file: req.file,
                title: req.body.title,
                description: req.body.description,
                creatorId: req.body.creatorId,
                editorId: req.body.editorId,
                roomId: req.body.roomId,
                role: req.role,
                userId: req.userId,
            });

            this.emitVideoUpdate(req, video, "video_uploaded");

            return this.success(res, { message: "uploaded", video });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async uploadRaw(req, res) {
        try {
            const video = await this.videoService.uploadRawVideo({
                file: req.file,
                title: req.body.title,
                description: req.body.description,
                creatorId: req.body.creatorId,
                editorId: req.body.editorId,
                roomId: req.body.roomId,
                thumbnailUrl: req.body.thumbnailUrl,
                role: req.role,
                userId: req.userId,
            });

            this.emitVideoUpdate(req, video, "video_uploaded");

            return this.success(res, { message: "raw video uploaded", video });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async getAll(req, res) {
        try {
            const videos = await this.videoService.getVideos(
                req.userId,
                req.role,
                req.query.roomId
            );
            return this.success(res, videos);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async getPending(req, res) {
        try {
            const videos = await this.videoService.getPendingVideos(req.userId, req.role);
            return this.success(res, videos);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async approve(req, res) {
        try {
            const { video, creatorId } = await this.videoService.approveVideo(
                req.params.id,
                req.userId
            );

            try {
                const testClient = await getOAuth2Client(creatorId);
                await testClient.getAccessToken();
            } catch (tokenErr) {
                console.error("Token pre-flight failed:", tokenErr.message);
            }

            this.emitVideoUpdate(req, video, "video_approved");

            this.success(res, { message: "Video approved. Uploading to YouTube in background..." });

            uploadToYoutube(video, creatorId)
                .then(async (yt) => {
                    console.log("YouTube Upload Success:", yt.id);
                    video.status = "uploaded";
                    video.youtubeId = yt.id;
                    await video.save();

                    if (req.io && video.roomId) {
                        req.io.to(`room_${video.roomId}`).emit("video_updated", {
                            video,
                            action: "youtube_uploaded",
                            updatedAt: new Date().toISOString(),
                        });
                    }
                })
                .catch(async (uploadErr) => {
                    console.error("YouTube Upload Error:", uploadErr.message);
                    video.status = "upload_failed";
                    await video.save();
                });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async reject(req, res) {
        try {
            const video = await this.videoService.rejectVideo(req.params.id, req.body.reason);

            this.emitVideoUpdate(req, video, "video_rejected");

            return this.success(res, { message: "Video Rejected" });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async rawReview(req, res) {
        try {
            const video = await this.videoService.reviewRawVideo(
                req.params.id,
                req.userId,
                req.body.action,
                req.body.reason
            );

            const eventType = req.body.action === "accept" ? "video_accepted" : "video_rejected";
            this.emitVideoUpdate(req, video, eventType);

            return this.success(res, { message: "Review submitted", video });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async uploadEdit(req, res) {
        try {
            const video = await this.videoService.uploadEditedVideo(
                req.params.id,
                req.file,
                req.body.title,
                req.body.description,
                req.body.thumbnailUrl
            );

            this.emitVideoUpdate(req, video, "video_uploaded");

            return this.success(res, { message: "Edited video uploaded", video });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async getById(req, res) {
        try {
            const video = await this.videoService.getVideoById(req.params.id);
            return this.success(res, video);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async updateThumbnail(req, res) {
        try {
            const video = await this.videoService.updateThumbnail(
                req.params.id,
                req.body.thumbnailUrl
            );
            return this.success(res, video);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async addComment(req, res) {
        try {
            const comments = await this.videoService.addComment(
                req.params.id,
                req.userId,
                req.body.text,
                req.io
            );
            return this.success(res, comments);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async updateEditSettings(req, res) {
        try {
            const video = await this.videoService.updateEditSettings(
                req.params.id,
                req.body.editSettings
            );
            return this.success(res, video);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async youtubeStatus(req, res) {
        try {
            const status = await this.videoService.getYoutubeStatus(req.userId);
            return this.success(res, status);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async storeYoutubeTokens(req, res) {
        try {
            const result = await this.videoService.storeYoutubeTokens(
                req.userId,
                req.body.accessToken,
                req.body.refreshToken
            );
            return this.success(res, result);
        } catch (err) {
            return this.handleError(res, err);
        }
    }
}

module.exports = new VideoController(VideoService);
