const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to DB");
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectToDB; 