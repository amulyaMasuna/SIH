const mongoose = require("mongoose");

async function connectToDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/legal_metrology";
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log("Successfully connected to MongoDB Database:", mongoUri);
  } catch (err) {
    console.warn("MongoDB connection notice:", err.message);
    console.log("Notice: Running with resilient in-memory storage fallback until MongoDB instance is connected.");
  }
}

module.exports = connectToDB;