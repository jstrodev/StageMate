const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("I am listening on port 3000");
});
