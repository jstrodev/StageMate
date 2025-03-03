require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Create Express app
const app = express();

// Add middleware
app.use(cors());
app.use(express.json());

// API routes go here
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// -- ADD YOUR OTHER API ROUTES HERE --

// Serve static files from client/dist in production
if (process.env.NODE_ENV === "production") {
  // Serve static files
  const staticPath = path.join(__dirname, "client/dist");
  if (fs.existsSync(staticPath)) {
    console.log("Serving static files from:", staticPath);
    app.use(express.static(staticPath));

    // Handle client-side routing - send all non-API requests to index.html
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(staticPath, "index.html"));
      } else {
        res.status(404).json({ message: "API route not found" });
      }
    });
  } else {
    console.error("Static directory not found:", staticPath);
  }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
