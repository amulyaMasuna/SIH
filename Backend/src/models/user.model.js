const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  }, passwordHash: {
    type: String,
    required: true,
  }, role: {
    type: String,
    enum: ["consumer", "officer"],
    default: "consumer",
  }, isEmailVerified: {
    type: Boolean,
    default: false,
  }, name: {
    type: String,
  }, twoFactorEnabled: {
    type: Boolean,
    default: false,
  }, twofactorSecret: {
    type: String,
    default: undefined
  }, tokenVersion: {
    type: Number,
    default: 0,
  }, resetPasswordToken: {
    type: String,
    default: undefined,
  }, resetPasswordExpires: {
    type: Date,
    default: undefined,
  }
}, {
  timestamps: true
})

module.exports = User = mongoose.model("User", userSchema);