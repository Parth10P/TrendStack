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
async function getAllPosts(currentUserId) {
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
          profile: {
            select: {
              avatarUrl: true,
            },
          },
        },
      },
      likes: {
        where: {
          userId: currentUserId ? parseInt(currentUserId) : -1,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  // Transform to add isLiked boolean
  return posts.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
    likes: undefined, // Remove the likes array from response
  }));
}

async function toggleLike(postId, userId) {
  const pId = parseInt(postId);
  const uId = parseInt(userId);

  // Check if like exists
  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId: pId,
        userId: uId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          postId_userId: {
            postId: pId,
            userId: uId,
          },
        },
      }),
      prisma.post.update({
        where: { id: pId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return { isLiked: false };
  } else {
    // Like
    await prisma.$transaction([
      prisma.like.create({
        data: {
          postId: pId,
          userId: uId,
        },
      }),
      prisma.post.update({
        where: { id: pId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
    return { isLiked: true };
  }
}

async function addComment(postId, userId, content) {
  const pId = parseInt(postId);
  const uId = parseInt(userId);

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        postId: pId,
        authorId: uId,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    }),
    prisma.post.update({
      where: { id: pId },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  return comment;
}

async function getComments(postId, currentUserId) {
  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profile: { select: { avatarUrl: true } },
        },
      },
      commentLikes: currentUserId
        ? {
            where: { userId: parseInt(currentUserId) },
            select: { userId: true },
          }
        : false,
    },
  });

  // map to include isLiked flag (based on currentUserId) and keep likeCount/pinned
  return comments.map((c) => ({
    ...c,
    isLiked: c.commentLikes && c.commentLikes.length > 0,
    commentLikes: undefined,
  }));
}

// Toggle like on a comment
async function toggleCommentLike(commentId, userId) {
  const cId = parseInt(commentId);
  const uId = parseInt(userId);

  const existing = await prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId: cId,
        userId: uId,
      },
    },
  });

  if (existing) {
    // Unlike
    await prisma.$transaction([
      prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId: cId,
            userId: uId,
          },
        },
      }),
      prisma.comment.update({
        where: { id: cId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return { isLiked: false };
  } else {
    // Like
    await prisma.$transaction([
      prisma.commentLike.create({ data: { commentId: cId, userId: uId } }),
      prisma.comment.update({
        where: { id: cId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
    return { isLiked: true };
  }
}

// Pin/unpin a comment. Only the author of the post can pin comments under their post.
async function togglePinComment(commentId, userId) {
  const cId = parseInt(commentId);
  const uId = parseInt(userId);

  const comment = await prisma.comment.findUnique({
    where: { id: cId },
    include: { post: true },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.post.authorId !== uId) {
    const err = new Error("Not authorized to pin this comment");
    err.statusCode = 403;
    throw err;
  }

  const updated = await prisma.comment.update({
    where: { id: cId },
    data: { pinned: !comment.pinned },
  });
  return { pinned: updated.pinned };
}

async function searchPosts(query) {
  const posts = await prisma.post.findMany({
    where: {
      content: { contains: query },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profile: {
            select: {
              avatarUrl: true,
            },
          },
        },
      },
    },
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

module.exports = {
  createPost,
  getAllPosts,
  searchPosts,
  toggleLike,
  addComment,
  getComments,
  toggleCommentLike,
  togglePinComment,
  deletePostById,
  deleteCommentById,
  getPostById,
  getCommentById,
};

async function getPostById(id) {
  return await prisma.post.findUnique({ where: { id: parseInt(id) } });
}

async function getCommentById(id) {
  return await prisma.comment.findUnique({ where: { id: parseInt(id) } });
}

// Delete a post
async function deletePostById(postId) {
  return await prisma.post.delete({
    where: { id: parseInt(postId) },
  });
}

// Delete a comment
async function deleteCommentById(commentId, postId) {
  const cId = parseInt(commentId);
  const pId = parseInt(postId);

  const [comment] = await prisma.$transaction([
    prisma.comment.delete({
      where: { id: cId },
    }),
    prisma.post.update({
      where: { id: pId },
      data: { commentCount: { decrement: 1 } },
    }),
  ]);
  return comment;
}
