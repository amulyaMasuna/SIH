const { verifyAccessToken } = require("../lib/token");
const User = require("../models/user.model");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorisation;
  if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "You are not an authenticated user, You cannot access the data."
    })
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if(!user) {
      return res.status(401).json({
        message: "User not found!"
      })
    }
    if(user.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({
        message: "Token invalidated"
      })
    }
    const authReq = req;
    authReq.user = {
      user: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    }

    next()

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      message: "Invalid Token."
    })
  }
}

module.exports = {
  requireAuth,
};

