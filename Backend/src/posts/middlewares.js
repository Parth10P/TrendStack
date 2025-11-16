// Validation middleware for creating a post
function createPostMiddleware(req, res, next) {
  const { content } = req.body;

  // Check if content exists and is not empty
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ err: "Post content is required" });
  }

  // Optional: Check content length (e.g., max 5000 characters)
  if (content.length > 5000) {
    return res.status(400).json({ err: "Post content is too long (max 5000 characters)" });
  }

  next();
}

module.exports = { createPostMiddleware };

