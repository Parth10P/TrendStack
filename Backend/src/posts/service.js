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

async function getComments(postId) {
  return prisma.comment.findMany({
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
    },
  });
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
};

