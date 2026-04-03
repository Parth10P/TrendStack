const { prisma } = require("../../db/config");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

async function signUp(data) {
  const { name, username, email, password } = data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    const err = new Error("User already exists.");
    err.statusCode = 409;
    throw err;
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
      provider: "local",
    },
  });
  return user;
}

async function login(data) {
  const { username, password } = data;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { profile: true },
  });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  // Compare password with bcrypt
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }
  return user;
}

async function searchUsers(query) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query } },
        { name: { contains: query } },
      ],
    },
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
    take: 20,
  });
  return users;
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      profile: {
        select: {
          avatarUrl: true,
          bio: true,
          location: true,
        },
      },
    },
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const [postsCount, commentsCount] = await prisma.$transaction([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.comment.count({ where: { authorId: userId } }),
  ]);

  // Follower/following support is optional for now. If the Follow model is not
  // available in the current generated Prisma client yet, fall back to 0 so the
  // profile screen still loads cleanly.
  let followersCount = 0;
  let followingCount = 0;

  if (prisma.follow && typeof prisma.follow.count === "function") {
    [followersCount, followingCount] = await prisma.$transaction([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);
  }

  return {
    ...user,
    postsCount,
    commentsCount,
    followersCount,
    followingCount,
  };
}

async function getUserPostsById(userId) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
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
  });
}

module.exports = {
  signUp,
  login,
  searchUsers,
  getUserById,
  getUserPostsById,
};
