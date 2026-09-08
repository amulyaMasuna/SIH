const jwt = require("jsonwebtoken");

function createAccessToken(userId, role, tokenVersion) {
  const payload = {
    sub: userId, role, tokenVersion
  }

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '14d'});
}

function createRefreshToken(userId, tokenVersion) {
  const payload = {
    sub: userId, tokenVersion
  }

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken, verifyAccessToken };