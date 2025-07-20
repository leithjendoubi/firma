import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  addPhoto,
  loginAdmin,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import { 
  validateRegistration, 
  validateLogin, 
  validateEmail, 
  validateOTP, 
  validatePasswordReset 
} from "../middleware/validation.js";
import { validateAdminLogin } from "../middleware/adminAuth.js";
import { authRateLimit, registerRateLimit } from "../middleware/security.js";

const authRouter = express.Router();

// Public routes with validation and rate limiting
authRouter.post("/register", registerRateLimit, validateRegistration, register);
authRouter.post("/login", authRateLimit, validateLogin, login);
authRouter.post("/admin-login", authRateLimit, validateAdminLogin, loginAdmin);
authRouter.post("/logout", logout);
authRouter.post("/send-reset-otp", authRateLimit, sendResetOtp);
authRouter.post("/reset-password", authRateLimit, validatePasswordReset, resetPassword);

// Protected routes with validation
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, validateOTP, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/add-photo", userAuth, addPhoto);

export default authRouter;
