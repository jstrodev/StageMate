require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Create Express app
const app = express();

// Add basic middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API test endpoint
app.get("/api/test", (req, res) => {
  try {
    res.json({
      status: "ok",
      message: "API is working",
    });
  } catch (error) {
    console.error("API test error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Static file serving and fallback for client-side routing
if (process.env.NODE_ENV === "production") {
  try {
    const staticPath = path.join(__dirname, "client/dist");
    console.log("Serving static files from:", staticPath);

    // Serve static files
    app.use(express.static(staticPath));

    // All routes not starting with /api fall back to React router
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        console.log(`Serving React app for path: ${req.path}`);
        res.sendFile(path.join(staticPath, "index.html"));
      }
    });
  } catch (error) {
    console.error("Static file setup error:", error);
    // Add a fallback route handler if static setup fails
    app.get("*", (req, res) => {
      res.send("Welcome to StageMate. Service is being updated.");
    });
  }
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).send("Something went wrong!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
