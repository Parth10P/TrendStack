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

module.exports = { signUp, login, searchUsers };
