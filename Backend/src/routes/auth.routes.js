const express = require("express");
const authRouter = express.Router();

const { registerHandler, loginHandler, verifyEmailHandler, refreshHandler, logoutHandler, forgotPasswordHandler, resetPasswordHandler } = require("../controllers/auth/auth.controller");

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/verify-email", verifyEmailHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/forgot-password", forgotPasswordHandler);
authRouter.post("/reset-password", resetPasswordHandler);

module.exports = authRouter;