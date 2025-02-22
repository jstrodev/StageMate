require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow any localhost port in development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Place this before routes
app.use(express.json());

// Middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders) {
    return res.status(400).json("No authorization headers present");
  }
  console.log("Authorization headers:", authHeaders);
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    console.log("Token verified successfully");
    req.user = decoded;
    next();
  });
};

app.post("/api/users/register", async (req, res, next) => {
  console.log("Processing registration request");
  const { email, firstName, lastName, password, venueName } = req.body;

  // Validate required fields
  if (!email || !firstName || !lastName || !password || !venueName) {
    return res.status(400).json({
      message: "All fields are required",
      missing: {
        email: !email,
        firstName: !firstName,
        lastName: !lastName,
        password: !password,
        venueName: !venueName,
      },
    });
  }

  try {
    // Check for existing email in database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user record in database
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        venueName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        venueName: true,
      },
    });

    console.log("New user created successfully");

    // Generate authentication token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        venueName: newUser.venueName,
      },
    });
  } catch (error) {
    console.error("Registration error:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

app.post("/api/users/login", async (req, res, next) => {
  console.log("Login attempt received:", { email: req.body.email }); // Log login attempt

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User found:", user ? "yes" : "no"); // Log if user was found

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    console.log("Password check:", passwordCheck ? "passed" : "failed"); // Log password check result

    if (!passwordCheck) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    console.log("Login successful for:", user.email); // Log successful login

    res.status(200).json({
      token,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
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
