require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const path = require("path");

// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN
        : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Place this before routes
app.use(express.json());

// Middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

app.post("/api/users/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, venueName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        venueName,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      venueName: user.venueName,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: "Registration failed" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      venueName: user.venueName,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: "Login failed" });
  }
});

app.put("/api/users/update", verifyToken, async (req, res) => {
  try {
    console.log("Received update request:", req.body); // ✅ Log incoming request
    const userIdFromToken = req.user.id; // ✅ Get user ID from token
    console.log("User ID from token:", userIdFromToken);

    const { firstName, lastName, email, password } = req.body;

    // Fetch the existing user
    const existingUser = await prisma.user.findUnique({
      where: { id: userIdFromToken },
    });

    if (!existingUser) {
      console.log("User not found in database"); // ✅ Log missing user
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updating user:", existingUser.id); // ✅ Log user ID

    // Build update object
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    console.log("Updating with data:", updateData); // ✅ Log update data

    const updatedUser = await prisma.user.update({
      where: { id: userIdFromToken }, // ✅ Match user by ID from token
      data: updateData,
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    console.log("Update successful:", updatedUser); // ✅ Log successful update
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); // ✅ Log detailed error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/users/aboutMe", verifyToken, async (req, res, next) => {
  console.log(req.user);
  res.status(201).json({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
});

//Endpoint to get all users
app.get("/api/users/all", verifyToken, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true }, // Exclude passwords
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/musicians/all", async (req, res, next) => {
  try {
    const musicians = await prisma.musician.findMany({});

    res.status(200).json(musicians);
  } catch (error) {
    console.error("Error fetching musicians:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Endpoint to get a single user
app.get("/api/users/:id", verifyToken, async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true }, // Exclude password
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a user by ID (Protected)
app.delete("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent users from deleting themselves
    if (req.user.id === userId) {
      return res.status(403).json({ message: "You cannot delete yourself" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a user (Protected)
app.put("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Restrict users to update only their own data
    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own account" });
    }

    const { email, firstName, lastName, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password if it's provided
    let hashedPassword = existingUser.password; // Keep existing password if not updating
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user information
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: { id: true, firstName: true, lastName: true, email: true }, // Exclude password from response
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/users/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Add new endpoint for creating prospects
app.post("/api/prospects/add", verifyToken, async (req, res) => {
  try {
    const { musicianId } = req.body;
    const userId = req.user.id;

    // Check if prospect already exists
    const existingProspect = await prisma.prospect.findFirst({
      where: {
        userId,
        musicianId,
      },
    });

    if (existingProspect) {
      return res.status(400).json({ message: "Musician already in prospects" });
    }

    // Create new prospect
    const prospect = await prisma.prospect.create({
      data: {
        userId,
        musicianId,
        status: "INTERESTED", // You can add different status types
      },
      include: {
        musician: true,
      },
    });

    res.status(201).json({
      message: "Added to prospects successfully",
      prospect,
    });
  } catch (error) {
    console.error("Error adding prospect:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API test endpoint
app.get("/api/test", async (req, res) => {
  try {
    // Try to query the database
    const userCount = await prisma.user.count();
    res.json({
      status: "ok",
      message: "Server and database are working",
      userCount,
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  const clientBuildPath = path.join(__dirname, "client", "dist");
  console.log("Serving static files from:", clientBuildPath);

  app.use(express.static(clientBuildPath));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    const indexPath = path.join(clientBuildPath, "index.html");
    console.log("Serving index.html from:", indexPath);
    res.sendFile(indexPath);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

// Add error handling for database connection
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        console.log("Server closed");
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

module.exports = app;
