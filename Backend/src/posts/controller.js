const { createPost, getAllPosts, searchPosts } = require("./service");
const { requireAuth } = require("../users/middlewares");

// Create a new post
async function create(req, res) {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { content, attachments } = req.body;

    const post = await createPost({
      authorId: userId,
      content,
      attachments,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ err: error.message || "Internal error" });
  }
}

// Get all posts (for feed)
async function getAll(req, res) {
  try {
    const posts = await getAllPosts();
    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ err: error.message || "Internal error" });
  }
}

async function search(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ err: "Query parameter 'q' is required" });
    }
    const posts = await searchPosts(q);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ err: "Search failed" });
  }
}

module.exports = { create, getAll, search };

