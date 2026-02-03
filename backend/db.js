const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mwarex";
    console.log("Connecting to MongoDB...");

    const startTime = Date.now();

    await mongoose.connect(mongoURI, {
      maxPoolSize: 5,                    // Reduced from 10 for faster initial connection
      minPoolSize: 1,                    // Keep at least 1 connection ready
      serverSelectionTimeoutMS: 10000,   // Increased for cold starts (10 seconds)
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,           // Connection timeout
      heartbeatFrequencyMS: 10000,       // Check connection health every 10 seconds
      retryWrites: true,
      retryReads: true,
    });

    const connectionTime = Date.now() - startTime;
    console.log(`MongoDB connected in ${connectionTime}ms`);
  } catch (e) {
    console.log("Database Error:", e.message);
  }
}

// Add connection event listeners for better debugging
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = {
  connectDB
}