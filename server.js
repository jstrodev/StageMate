require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

// Update the CORS configuration to allow requests from your frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Default Vite port
      "http://localhost:5174", // Alternative Vite port
      "http://localhost:5175", // Your current Vite port
      "http://127.0.0.1:5173", // Also allow localhost IP variants
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// This should be before your routes
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders) {
    return res.status(400).json("no auth headers present");
  }
  console.log(authHeaders);
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    console.log("token verified!", decoded);
    req.user = decoded;
    next();
  });
};

app.post("/api/users/register", async (req, res, next) => {
  console.log("Registration request body:", req.body);
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
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
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

    console.log("User created successfully:", newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error details:", {
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
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findMany({
      where: { email },
    });
    console.log(user);
    const passwordCheck = await bcrypt.compare(password, user[0].password);
    if (!passwordCheck) {
      return res.status(401);
    }
    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.status(201).json({ token, message: "login successful" });
  } catch (error) {}
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

const PORT = process.env.PORT || 3000;

// Add this at the bottom of server.js
const server = app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});

// Add graceful shutdown
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
