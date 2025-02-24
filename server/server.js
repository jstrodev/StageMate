const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
app.use(cors({origin:["http://127.0.0.1:5173"]}));
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
  const { email, firstName, lastName, password, venueName } = req.body;
  try {
    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Save user to the database
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        venueName,
      },
    });

    // Create a JSON Web Token (JWT)
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24H",
      }
    );

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/users/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log("test")
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
        expiresIn: "24H",
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

app.listen(3000, () => {
  console.log("I am listening on port 3000");
});
