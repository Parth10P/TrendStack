const express = require("express");
const { loginMiddleware, signupMiddleware } = require("./middlewares");
const {
  create,
  login,
  logout,
  search,
  getUser,
  getUserPosts,
} = require("./controller");
const router = express.Router();

// Routes
router.post("/signup", signupMiddleware, create);
router.post("/login", loginMiddleware, login);
router.post("/logout", logout);
router.get("/search", search);
router.get("/:id/posts", getUserPosts);
router.get("/:id", getUser);

// Health check
router.get("/health", (req, res) => {
  res.json({ message: "users API ready" });
});

module.exports = { router };
