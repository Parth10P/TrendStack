const { createPost, getAllPosts } = require("./service");
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

module.exports = { create, getAll };

