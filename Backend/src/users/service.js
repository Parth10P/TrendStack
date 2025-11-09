const { prisma } = require("../../db/config");

// function hashPassword(pwd) {
//   return crypto.createHash("sha256").update(pwd).digest("hex");
// }

// function sanitize(user) {
//   if (!user) return user;
//   const { password, ...rest } = user;
//   return rest;
// }

async function signUp(data) {
  const { username, email, password } = data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    const err = new Error("User already exists.");
    err.statusCode = 409;
    throw err;
  }


  const user = await prisma.user.create({
    data: { username, email, password: password, provider: "local" },
  });
  return (user);
}

async function login(data) {
  const { username, password } = data;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }
  if (user.password !== password) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }
  return(user);
}

module.exports = { signUp, login };
