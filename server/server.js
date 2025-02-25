const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware"); // ✅ Import from separate file

const app = express();
app.use(cors({ origin: ["http://127.0.0.1:5173"] }));
app.use(express.json());

app.post("/api/users/register", async (req, res) => {
  const { email, firstName, lastName, password, venueName } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        venueName,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24H" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// app.post("/api/users/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     console.log("test");
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const passwordCheck = await bcrypt.compare(password, user.password);
//     if (!passwordCheck) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
//       process.env.JWT_SECRET,
//       { expiresIn: "24H" }
//     );

//     res.status(200).json({ token, message: "Login successful" });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id, // ✅ Make sure user ID is included in the token
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24H" }
    );

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/users/aboutMe", verifyToken, async (req, res) => {
  res.status(200).json({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
});

app.get("/api/users/all", verifyToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id === userId) {
      return res.status(403).json({ message: "You cannot delete yourself" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// old version, backup if this new updates fail  (NC)

// Fixed and improved update user profile
// app.put("/api/users/update", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { firstName, lastName, email, password } = req.body;

//     const existingUser = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!existingUser) return res.status(404).json({ message: "User not found" });

//     const updateData = {};
//     if (firstName) updateData.firstName = firstName;
//     if (lastName) updateData.lastName = lastName;
//     if (email) updateData.email = email;
//     if (password) updateData.password = await bcrypt.hash(password, 10);

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: updateData,
//       select: { id: true, firstName: true, lastName: true, email: true },
//     });

//     res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
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
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); // ✅ Log detailed error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.listen(3000, () => {
  console.log("I am listening on port 3000");
});
