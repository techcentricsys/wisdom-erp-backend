
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./prisma/auth/auth.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

// Backend test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wisdom ERP Backend is running successfully!",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
  });
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Wisdom ERP Backend running on port ${PORT}`);
});
