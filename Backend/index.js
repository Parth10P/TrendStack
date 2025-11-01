const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello this side Patel");
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "field empty username and password" });
  }

  //   abhi baki ka likh na baki hh
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(404).json({ message: "All field must be required" });
  }
  const data = await prisma.user.create({
    data: {
      username,
      email,
      password,
    }
  });
  return res.status(201).json({message:data})
});
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
