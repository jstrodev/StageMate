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

    // Create dir if it doesn't exist
    if (!fs.existsSync(staticPath)) {
      fs.mkdirSync(staticPath, { recursive: true });
    }

    // Create fallback index.html
    const indexPath = path.join(staticPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      const html = `<!DOCTYPE html>
      <html>
      <head>
        <title>StageMate</title>
        <style>
          body { font-family: Arial; text-align: center; margin-top: 50px; }
          h1 { color: #2196f3; }
        </style>
      </head>
      <body>
        <h1>Welcome to StageMate</h1>
        <p>Application is loading...</p>
      </body>
      </html>`;
      fs.writeFileSync(indexPath, html);
    }

    console.log("Serving static files from:", staticPath);
    app.use(express.static(staticPath));

    // Catch-all handler for client-side routing
    app.get("*", (req, res) => {
      console.log(`Serving index.html for path: ${req.path}`);
      res.sendFile(indexPath);
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
