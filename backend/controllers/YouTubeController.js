const CreatorDNA = require("../models/creatorDNA");
const AIService = require("../services/AIService");
const { getOAuth2Client } = require("../tools/googleClient");
const { google } = require("googleapis");

class YouTubeController {
  constructor() {
    this.aiService = require("../services/AIService");
  }

  async getDNA(req, res) {
    try {
      const dna = await CreatorDNA.findOne({ userId: req.userId });
      if (!dna) {
        return res.status(200).json({ data: null });
      }
      return res.status(200).json({ data: dna });
    } catch (error) {
      console.error("[YouTubeController] getDNA Error:", error);
      return res.status(500).json({ error: "Failed to fetch Creator DNA" });
    }
  }

  async analyze(req, res) {
    try {
      const oauth2Client = await getOAuth2Client(req.userId);
      const youtube = google.youtube({
        version: "v3",
        auth: oauth2Client,
      });

      // Fetch the user's channel ID
      const channelRes = await youtube.channels.list({
        part: "snippet,contentDetails,statistics",
        mine: true,
      });

      if (!channelRes.data.items || channelRes.data.items.length === 0) {
        return res.status(404).json({ error: "No YouTube channel found for this account." });
      }

      const channel = channelRes.data.items[0];
      const channelName = channel.snippet.title;
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

      // Fetch latest 15 videos
      const playlistRes = await youtube.playlistItems.list({
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: 15,
      });

      const videoIds = playlistRes.data.items.map(item => item.snippet.resourceId.videoId).join(",");

      let videoStats = [];
      if (videoIds) {
        // Fetch stats for these videos
        const statsRes = await youtube.videos.list({
          part: "snippet,statistics,contentDetails",
          id: videoIds,
        });
        
        videoStats = statsRes.data.items.map(video => {
          const views = parseInt(video.statistics.viewCount || 0);
          const likes = parseInt(video.statistics.likeCount || 0);
          const comments = parseInt(video.statistics.commentCount || 0);
          const engagementRate = views > 0 ? (((likes + comments) / views) * 100).toFixed(2) + "%" : "0%";
          
          return {
            title: video.snippet.title,
            description: video.snippet.description?.substring(0, 500), // First 500 chars to avoid token bloat
            duration: video.contentDetails?.duration,
            tags: video.snippet.tags || [],
            viewCount: views,
            likeCount: likes,
            commentCount: comments,
            engagementRate: engagementRate
          };
        });
      }

      const channelData = {
        channelName,
        subscriberCount: channel.statistics.subscriberCount,
        totalViews: channel.statistics.viewCount,
        videoCount: channel.statistics.videoCount,
        recentVideos: videoStats,
        videosAnalyzed: videoStats.length
      };

      // Generate Creator DNA using AI
      const dnaInsights = await this.aiService.analyzeCreatorChannel(channelData);
      dnaInsights.videosAnalyzed = videoStats.length;

      // Save to database
      const updatedDNA = await CreatorDNA.findOneAndUpdate(
        { userId: req.userId },
        { 
          $set: {
            channelName,
            ...dnaInsights,
            lastSyncedAt: new Date()
          }
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({ data: updatedDNA });
    } catch (error) {
      console.error("[YouTubeController] analyze Error:", error);
      return res.status(500).json({ error: "Failed to analyze YouTube channel" });
    }
  }
}

module.exports = new YouTubeController();
