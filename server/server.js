import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { Productrouter } from "./routes/productsRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderrouter from "./routes/orderRoute.js";
import livreurRouter from "./routes/livreurRoutes.js";
import administrationrouter from "./routes/administrationRouter.js";
import { initializeAdministration } from './controllers/administrationController.js';
import marcheRouter from "./routes/marcheRouter.js";
import producteurRouter from "./routes/producteurRouter.js";
import vendeurRouter from "./routes/vendeurRouter.js";
import maprouter from "./routes/mapRouter.js";
import offrerouter from "./routes/offreRoute.js";
import stockisteRouter from "./routes/stockisteRouter.js";
import equipementRouter from "./routes/equipementRoute.js";
import stockrouter from "./routes/stockRoute.js";
import mandatRouter from "./routes/mandatRouter.js";

// Security imports
import { 
  helmetConfig, 
  createRateLimit, 
  authRateLimit, 
  uploadRateLimit,
  validateEnvironment,
  corsOptions 
} from "./middleware/security.js";
import { sanitizeInput } from "./middleware/validation.js";
import { handleUploadError } from "./middleware/multer.js";

const app = express();
const port = process.env.PORT || 4000;

// Validate environment variables before starting
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));
// Removed global rate limiting to prevent 429 errors on normal usage
// Rate limiting is now applied specifically to auth routes

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Create uploads directory if it doesn't exist
import fs from 'fs';
import path from 'path';
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));

// Auth routes with specific rate limiting (already applied in authRoutes.js)
app.use("/api/auth", authRouter);

// Protected routes
app.use("/api/user", userRouter);
app.use("/api/mandat", mandatRouter);
app.use("/api/equipement", equipementRouter);
app.use("/api/product", Productrouter);
app.use("/api/cart", cartRouter);
app.use("/api/stockiste", stockisteRouter);
app.use("/api/order", orderrouter);
app.use("/api/stock", stockrouter);
app.use("/api/map", maprouter);
app.use("/api/livreur", livreurRouter);
app.use("/api/administration", administrationrouter);
app.use("/api/marche", marcheRouter);
app.use("/api/producteur", producteurRouter);
app.use("/api/vendeur", vendeurRouter);
app.use("/api/offre", offrerouter);

// File upload error handling
app.use(handleUploadError);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors
    });
  }
  
  if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value'
    });
  }
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB first
    await initializeAdministration(); // Then initialize administration data
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log('Security features enabled:');
      console.log('- Helmet security headers');
      console.log('- Auth-specific rate limiting');
      console.log('- Input validation and sanitization');
      console.log('- Secure file uploads');
      console.log('- Enhanced authentication');
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();