const express = require("express");
const { loginMiddleware, signupMiddleware } = require("./middlewares");
const { create, login, logout } = require("./controller");
const router = express.Router();

// Routes
router.post("/signup", signupMiddleware, create);
router.post("/login", loginMiddleware, login);
router.post("/logout", logout);

// Health check
router.get("/", (req, res) => {
  res.send("users API ready");
});

module.exports = { router };
