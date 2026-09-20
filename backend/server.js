const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// ========================================
// ROUTES
// ========================================

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const submissionRoutes = require("./routes/submission");

// ========================================
// APP
// ========================================

const app = express();

const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ========================================
// MONGODB CONNECTION
// ========================================

async function connectDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB connected successfully ✅");
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
    console.error("=================================");

    process.exit(1);
  }
}

// ========================================
// BASIC ROUTES
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Prank With Friends backend is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
  });
});

// ========================================
// API ROUTES
// ========================================

// Authentication
app.use("/api/auth", authRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Prank submissions
app.use("/api/submission", submissionRoutes);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ========================================
// START SERVER
// ========================================

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log("=================================");
    console.log("😂 Prank With Friends Backend");
    console.log("=================================");
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log("=================================");
  });
}

startServer();