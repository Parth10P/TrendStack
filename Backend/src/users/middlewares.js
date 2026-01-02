// Field validators
function loginMiddleware(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ err: "username and password are required" });
  }
  next();
}

function signupMiddleware(req, res, next) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({ err: "name, username, email and password are required" });
  }
  next();
}

const { prisma } = require("../../db/config");

// Simple auth based on the basic cookie we set on login/signup
// Expects a cookie named `userId`. If present, fetches user and attaches to req.user.
// If missing or user not found, responds 401.
async function requireAuth(req, res, next) {
  const userId = req.cookies && req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ err: "Authentication required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(401).json({ err: "User not found" });
    }
    req.userId = userId;
    req.user = user; // Attach full user object with role
    next();
  } catch (error) {
    return res.status(500).json({ err: "Auth error" });
  }
}

module.exports = { loginMiddleware, signupMiddleware, requireAuth };
