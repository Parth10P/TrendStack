const express = require("express");
const { createPostMiddleware } = require("./middlewares");
const { requireAuth } = require("../users/middlewares");
const { create, getAll, search } = require("./controller");
const router = express.Router();

// Routes
// Create a new post (requires authentication)
router.post("/", requireAuth, createPostMiddleware, create);

// Get all posts (for feed)
router.get("/", getAll);
router.get("/search", search);

// Health check
router.get("/health", (req, res) => {
  res.json({ message: "posts API ready" });
});

module.exports = { router };

