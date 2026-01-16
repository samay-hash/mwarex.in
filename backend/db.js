const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mwarex";
    console.log("Connecting to MongoDB at:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (e) {
    console.log("Database Error:", e.message);
  }
}

module.exports = {
  connectDB
}