const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const examRoutes = require("./routes/exams");
const resultRoutes = require("./routes/results");

const app = express();
const PORT = 5000;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/exam-portal");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

// Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend connected to backend successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
