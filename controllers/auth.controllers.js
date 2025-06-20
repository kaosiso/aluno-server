const User = require("../models/user.models.js"); // ✅ No destructuring
const bcryptjs = require("bcryptjs");
require("dotenv").config(); // near the top of your entry file (e.g., server.js or index.js)
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validateEmail = require("../utils/ValidateEmail.js");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
} = require("../sendgrid/send-email.js");
const {} = require("../sendgrid/send-email.js"); // Your email util
require("dotenv").config();
const sgMail = require("../sendgrid/emails");

const axios = require("axios");

const isStrongPassword = (password) => {
  const lengthOK = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return lengthOK && hasUpper && hasLower && hasNumber && hasSpecial;
};

const signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    if (!email || !password || !name || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 🧪 Validate email with AbstractAPI
    const { isValid, message } = await validateEmail(email);
    if (!isValid) {
      return res.status(400).json({ success: false, message });
    }

    // ✅ Email is deliverable, now continue
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password criteria must be met",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    const verificationLink = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;
    const sendResult = await sendVerificationEmail(
      user.email,
      user.name,
      verificationLink
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Verification token is missing" });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    console.log("User is verified");

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during verification" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error, message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged Out Successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate token and expiry
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Construct reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await sendPasswordResetEmail(user.email, resetURL);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // ✅ Send success email
    await sendResetSuccessEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // ✅ fix: `req.userId` and `select`

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth:", error); // ✅ fix: lowercase `error`
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
    verifyEmail,
  logout,
  login,
  forgotPassword,
  resetPassword,
  checkAuth,
};
