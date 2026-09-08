const { verifyAccessToken } = require("../lib/token");
const User = require("../models/user.model");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.authorisation;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required. Please sign in."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    let user = null;
    try {
      user = await User.findById(payload.sub);
    } catch (dbErr) {
      // Fallback
    }

    req.user = {
      id: payload.sub,
      role: payload.role || (user ? user.role : "consumer"),
      email: user ? user.email : "user@metrology.gov.in",
      name: user ? user.name : "Authenticated User"
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Session expired or invalid token. Please sign in again."
    });
  }
}

module.exports = {
  requireAuth
};
