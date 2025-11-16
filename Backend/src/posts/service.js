const { prisma } = require("../../db/config");

// Create a new post
async function createPost(data) {
  const { authorId, content, attachments } = data;

  // Create the post
  const post = await prisma.post.create({
    data: {
      authorId: parseInt(authorId),
      content,
      attachments: attachments || null,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  return post;
}

// Get all posts (for feed)
async function getAllPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  return posts;
}

module.exports = { createPost, getAllPosts };

