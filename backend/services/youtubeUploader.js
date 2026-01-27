const { google } = require("googleapis");
const { getOAuth2Client } = require("../tools/googleClient");
const axios = require("axios");

async function uploadToYoutube(video, userId) {
  const oauth2Client = await getOAuth2Client(userId);
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
  const res = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title: video.title,
        description: video.description,
      },
      status: {
        privacyStatus: "private",
      },
    },
    media: {
      body: (await axios({
        method: "get",
        url: video.fileUrl,
        responseType: "stream",
      })).data,
    },
  });

  // Upload Thumbnail if exists
  if (video.thumbnailUrl) {
    try {
      console.log("Uploading thumbnail...", video.thumbnailUrl);
      const thumbRes = await axios({
        method: "get",
        url: video.thumbnailUrl,
        responseType: "stream",
      });

      await youtube.thumbnails.set({
        videoId: res.data.id,
        media: {
          body: thumbRes.data
        }
      });
      console.log("Thumbnail set successfully");
    } catch (err) {
      console.error("Thumbnail upload failed:", err.message);
    }
  }

  return res.data;
}

module.exports = uploadToYoutube;
