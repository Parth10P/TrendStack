const express = require("express");
const { createPostMiddleware } = require("./middlewares");
const { requireAuth } = require("../users/middlewares");
const {
  create,
  getAll,
  search,
  likePost,
  commentOnPost,
  getPostComments,
} = require("./controller");
const router = express.Router();

// Routes
// Create a new post (requires authentication)
router.post("/", requireAuth, createPostMiddleware, create);

// Get all posts (for feed) - requireAuth is used to get current user for like status
router.get("/", requireAuth, getAll);
router.get("/search", search);
router.post("/:id/like", requireAuth, likePost);
router.post("/:id/comments", requireAuth, commentOnPost);
router.get("/:id/comments", getPostComments);

// Health check
router.get("/health", (req, res) => {
  res.json({ message: "posts API ready" });
});

module.exports = { router };

