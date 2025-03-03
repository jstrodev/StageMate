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

// Serve static files
const staticPath = path.join(__dirname, "client/dist");
if (fs.existsSync(staticPath)) {
  console.log("Static directory exists at:", staticPath);
  console.log("Contents:", fs.readdirSync(staticPath));

  // Serve static files
  app.use(express.static(staticPath));
} else {
  console.log("Static directory does not exist at:", staticPath);
  try {
    console.log("Creating static directory");
    fs.mkdirSync(staticPath, { recursive: true });
  } catch (err) {
    console.error("Error creating static directory:", err);
  }
}

// Fallback HTML content
const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StageMate</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      color: #333;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #2196f3;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #2196f3;
      color: white;
      text-decoration: none;
      border-radius: 0.25rem;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to StageMate</h1>
    <p>Connecting venues with the perfect musical talent.</p>
    <p>Our application is currently being updated. Please check back soon!</p>
    <a href="/auth" class="btn">Login</a>
  </div>
</body>
</html>`;

// Ensure we have a basic index.html file
const indexPath = path.join(staticPath, "index.html");
if (!fs.existsSync(indexPath)) {
  console.log("index.html not found, creating fallback version");
  try {
    fs.writeFileSync(indexPath, fallbackHTML);
    console.log("Created fallback index.html at:", indexPath);
  } catch (err) {
    console.error("Error creating fallback index.html:", err);
  }
}

// Handle all routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }

  // Try to send the index.html file
  if (fs.existsSync(indexPath)) {
    console.log(`Serving index.html for path: ${req.path}`);
    return res.sendFile(indexPath);
  } else {
    console.log(
      `No index.html found, serving inline fallback HTML for path: ${req.path}`
    );
    return res.send(fallbackHTML);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
