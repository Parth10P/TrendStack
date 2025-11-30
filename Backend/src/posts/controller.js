const {
  createPost,
  getAllPosts,
  searchPosts,
  toggleLike,
  addComment,
  getComments,
} = require("./service");
const { requireAuth } = require("../users/middlewares");

const { toggleCommentLike, togglePinComment } = require("./service");

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
    // userId might be undefined if not authenticated, but feed usually requires auth
    // or we can make it optional
    const userId = req.userId;
    const posts = await getAllPosts(userId);
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

async function likePost(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await toggleLike(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ err: "Failed to toggle like" });
  }
}

async function commentOnPost(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ err: "Content is required" });
    }
    const comment = await addComment(id, userId, content);
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ err: "Failed to add comment" });
  }
}

async function getPostComments(req, res) {
  try {
    const { id } = req.params;
    // pass optional userId to include per-user like info
    const userId = req.userId;
    const comments = await getComments(id, userId);
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ err: "Failed to get comments" });
  }
}

async function commentLike(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params; // comment id
    const result = await toggleCommentLike(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    const code = error.statusCode || 500;
    return res
      .status(code)
      .json({ err: error.message || "Failed to toggle comment like" });
  }
}

async function pinComment(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params; // comment id
    const result = await togglePinComment(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    const code = error.statusCode || 500;
    return res
      .status(code)
      .json({ err: error.message || "Failed to toggle pin" });
  }
}

module.exports = {
  create,
  getAll,
  search,
  likePost,
  commentOnPost,
  getPostComments,
  commentLike,
  pinComment,
};
