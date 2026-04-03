// Validation middleware for creating a post
function createPostMiddleware(req, res, next) {
  const { content, attachments } = req.body;
  const hasText = Boolean(content && content.trim().length > 0);
  const hasAttachments =
    Array.isArray(attachments) && attachments.length > 0;

  // Allow either text, media, or both.
  if (!hasText && !hasAttachments) {
    return res
      .status(400)
      .json({ err: "Post must include text or at least one attachment" });
  }

  // Optional: Check content length (e.g., max 5000 characters)
  if (content && content.length > 5000) {
    return res
      .status(400)
      .json({ err: "Post content is too long (max 5000 characters)" });
  }

  next();
}

module.exports = { createPostMiddleware };
