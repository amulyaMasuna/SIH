const express = require("express");
const requireRole = require("../middleware/requireRole");
const { requireAuth } = require("../middleware/requireAuth");
const adminRouter = express.Router();
const User = require("../models/user.model");

adminRouter.get("/users", requireAuth, requireRole("officer"), async (req, res, next) => {
  try {
    const users = await User.find({}, {
      email: 1,
      role: 1,
      isEmailVerified: 1,
      createdAt: 1,
    });

    const result = users.map(val => ({
      id: val.id,
      email: val.email,
      role: val.role,
      isEmailVerified: val.isEmailVerified,
      createdAt: val.createdAt,
    }))

    return res.json({users: result});
  } catch(err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    })
  }
})

module.exports = adminRouter;
