require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
const articleRoutes = require("./routes/articleRoutes");
const app = express();
const feedbackRoutes = require("./routes/feedbackRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/dashboard", dashboardRoutes);
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => {
  res.send("CliMateAcT Backend is Running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "CliMateAcT API is running",
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});