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

// Fallback HTML content
const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StageMate</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background: #f8f9fa;
      color: #212529;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .container {
      max-width: 800px;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2196f3;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.6;
      color: #495057;
      margin-bottom: 1.5rem;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #2196f3;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background 0.3s;
    }
    .btn:hover {
      background: #0d8aee;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to StageMate</h1>
    <p>Connecting venues with the perfect musical talent.</p>
    <p>Our site is currently undergoing maintenance. Please check back soon!</p>
    
    <a href="mailto:support@stagemate.com" class="btn">Contact Support</a>
  </div>
</body>
</html>`;

// Handle all requests
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }

  try {
    // Try to serve from static directory first
    const staticPath = path.join(__dirname, "client/dist");
    const indexPath = path.join(staticPath, "index.html");

    if (fs.existsSync(indexPath)) {
      console.log(`Serving built index.html from: ${indexPath}`);
      return res.sendFile(indexPath);
    } else {
      // If no built file exists, serve fallback
      console.log(`No built index.html found, serving fallback HTML`);
      return res.send(fallbackHTML);
    }
  } catch (error) {
    console.error("Error serving content:", error);
    return res.send(fallbackHTML);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
