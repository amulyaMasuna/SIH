const { registerSchema, loginSchema } = require("./auth.schema");
const User = require("../../models/user.model");
const { hashPassword, checkPassword } = require("../../lib/hash");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../lib/email");
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("../../lib/token");
const crypto = require("crypto");

function getAppUrl() {
  return (process.env.APP_URL) || (`http://localhost:${process.env.PORT}`);
}

async function registerHandler(req, res) {
  try {
    const result = registerSchema.safeParse(req.body);
    if(!result.success) {
      return res.status(400).json({
        message: "Invalid data!", errors: result.error.flatten()
      })
    } 
    
    const { name, email, password } = result.data;
    const normalisedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalisedEmail })
    if(user) {
      return res.status(409).json({
        message: "This email is already in use. Please try with a different email.",
      })
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      email: normalisedEmail,
      passwordHash: passwordHash,
      role: "consumer",
      isEmailVerified: false,
      twoFactorEnabled: false,
    })

    const verifyToken = jwt.sign(
      { sub: newUser.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    )

    const verifyUrl = `${getAppUrl()}/auth/verify-email?token=${verifyToken}`;
    await sendEmail(newUser.email, "Verify Your Email", `<h1>Please verify your emial</h1><a href="${verifyUrl}">${verifyUrl}</a>`);

    return res.status(201).json({
      message: "User registered",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      }
    })

  } catch(err) {
    console.error("Error while handling register route:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

async function verifyEmailHandler(req, res) {
  const token = req.query.token;
  if(!token) {
    return res.status(400).json({
      message: "Verification token is missing.",
    })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub);

    if(!user) {
      return res.status(400).json({
        message: "User not found.",
      })
    }

    if(user.isEmailVerified) {
      return res.json({
        message: "Email is already verified",
      })
    }

    await User.findByIdAndUpdate(payload.sub, { isEmailVerified: true });
    return res.json({
      message: "Email is verified. You can now login.",
    })
  } catch(err) {
    console.error(err);
  }
}

async function loginHandler(req, res) {
  try {
    const result = loginSchema.safeParse(req.body);

    if(!result.success) {
      return res.status(400).json({
        message: "Invalid data!",
        errors: result.error.flatten(),
      });
    }

    const { email, password, name } = result.data;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if(!user) {
      return res.status(409).json({
        message: "Invalid email or password.",
      })
    }

    const ok = await checkPassword(password, user.passwordHash);
    if(!ok) {
      return res.status(400).json({
        message: "Invalid Credentials",
      })
    }

    if(!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in."
      })
    }

    const accessToken = createAccessToken(user.id, user.role, user.tokenVersion);

    const refreshToken = createRefreshToken(user.id, user.tokenVersion);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV === "production"),
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: "Logged successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      }
    })
  } catch(err) {
    console.error("Error while logging in:", err);
    return res.status(500).json({
      message: "Internal Server Error.",
    })
  }
}

async function refreshHandler(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if(!token) {
      return res.status(401).json({
        message: "Refresh token missing.",
      })
    }

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if(!user) {
      return res.status(401).json({
        message: "user not found.",
      })
    }

    if(user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({
        message: "Refresh token invalidated",
      })
    }

    const newAccessToken = createAccessToken(user.id, user.role, user.tokenVersion);
    const newRefreshToken = createRefreshToken(user.id, user.tokenVersion);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV === "production"),
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      message: "Token refreshed",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      }
    });

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

async function logoutHandler(req, res) {
  res.clearCookie("refreshToken", { pth: "/" });

  return res.status(200).json({
    message: "Logged out",
  })
}

async function forgotPasswordHandler(req, res) {
  const { email } = req.body;
  if(!email) {
    return res.status(400).json({
      message: "Email is required."
    })
  }

  const normalisedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalisedEmail });
    if(!user) {
      return res.status().json({
        message: "If an account with this emal exists, we will send you a reset link",
      })
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest("hex");
    
    await User.findByIdAndUpdate(user.id, { 
      resetPasswordExpires: new Date(Date.now() + (15 * 60 * 1000)), 
      resetPasswordToken: tokenHash,
    });

    const resetUrl = `${getAppUrl()}/auth/reset-password?token=${rawToken}`;

    await sendEmail(user.email, "Reset Password", `
      <h1>Reset your password</h1>
      <p>Click on the below link to reset password. The link expires in 15 minutes.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      `);

    return res.json({
      message: "If an account with this email exists, we will send you a reset link",
    })

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

async function resetPasswordHandler(req, res) {
  const { token, password } = req.body;
  if(!token) {
    return res.status(409).json({
      message: "Reset token is missing"
    })
  }

  if(!password || password.length < 6) {
    return res.status(400).json({
      message: "Password must be atleast 6 characters long",
    })
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ 
      resetPasswordToken: tokenHash,
      resetPasswordExpires: {$gt: new Date()}, // expiry must be in future
    })

    if(!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      })
    }

    const newPasswordHash = await hashPassword(password);
    await User.findByIdAndUpdate(user.id, { 
      passwordHash: newPasswordHash, 
      resetPasswordExpires: undefined,
      resetPasswordToken: undefined,
      tokenVersion: (user.tokenVersion || 0) + 1,
    });

    return res.json({
      message: "Password reset successful."
    })

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    })
  }
}

module.exports = {
  verifyEmailHandler,
  loginHandler,
  registerHandler,
  refreshHandler,
  logoutHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
}