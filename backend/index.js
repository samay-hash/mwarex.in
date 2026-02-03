const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { connectDB } = require("./db");
const userRoutes = require("./routes/authUser");
const adminRoutes = require("./routes/authAdmin");
const videoRoutes = require("./routes/video");
const aiRoutes = require("./routes/ai");
const editorRoutes = require("./routes/editor");
const inviteRoutes = require("./routes/invite");
const settingsRoutes = require("./routes/settings");
const paymentRoutes = require("./routes/payment");
const { verifyConnection } = require("./services/emailService");

const { google } = require("googleapis");
const googleAuthRoutes = require("./routes/googleAuth");

const http = require("http");
const { Server } = require("socket.io");

// Keep-alive configuration
const SELF_PING_URL = process.env.BACKEND_URL || "https://mwarex-in.onrender.com";
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (before Render's 15 min sleep)

const app = express();
const server = http.createServer(app);

const frontend = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
console.log("CORS Origin Allowed:", frontend);

const allowedOrigins = [
  frontend,
  "https://mwarex.in",
  "https://www.mwarex.in",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://mware-x.vercel.app"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_video", (videoId) => {
    socket.join(`video_${videoId}`);
    console.log(`Socket ${socket.id} joined video_${videoId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Inject IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();
verifyConnection();

app.use("/api/v1/user", settingsRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/v1", inviteRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/auth", googleAuthRoutes);

// ========================
// HEALTH CHECK & KEEP-ALIVE
// ========================

// Fast health check endpoint (responds in milliseconds)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Also add /ping as an alias
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Self-ping function to keep the server awake
const keepServerAlive = () => {
  const pingUrl = `${SELF_PING_URL}/health`;

  setInterval(async () => {
    try {
      const response = await axios.get(pingUrl, { timeout: 10000 });
      console.log(`[Keep-Alive] Pinged ${pingUrl} at ${new Date().toISOString()} - Status: ${response.status}`);
    } catch (error) {
      console.log(`[Keep-Alive] Ping failed: ${error.message}`);
    }
  }, PING_INTERVAL);

  console.log(`[Keep-Alive] Self-ping enabled, pinging ${pingUrl} every ${PING_INTERVAL / 60000} minutes`);
};

app.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log("TOKENS ===>", tokens);

    // Redirect to frontend callback with tokens (frontend should handle storing securely)
    // Use the state parameter if it exists (it contains the origin), otherwise fallback
    const origin = req.query.state;
    const frontend = origin || process.env.FRONTEND_URL || "https://www.mwarex.in";

    const params = new URLSearchParams();

    if (tokens.access_token) params.append("access_token", tokens.access_token);
    if (tokens.refresh_token)
      params.append("refresh_token", tokens.refresh_token);
    if (tokens.scope) params.append("scope", tokens.scope);

    return res.redirect(
      `${frontend.replace(/\/$/, "")}/oauth2callback?${params.toString()}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Token exchange failed",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start keep-alive only in production (when BACKEND_URL is set)
  if (process.env.NODE_ENV === "production" || process.env.BACKEND_URL) {
    keepServerAlive();
  }
});
