const express = require("express");
const userRouter = express.Router();

const { requireAuth } = require("../middleware/requireAuth")

userRouter.get("/me", requireAuth, (req, res, next) => {
  const authReq = req;
  const authUser = authReq.user;
  return res.json({
    user: authUser,
  });
});

module.exports = userRouter;