// Field validators
function loginMiddleware(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ err: "username and password are required" });
  }
  next();
}

function signupMiddleware(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ err: "username, email and password are required" });
  }
  next();
}

// Simple auth based on the basic cookie we set on login/signup
// Expects a cookie named `userId`. If present, attaches it to req.userId.
// If missing, responds 401. This replaces the old JWT-based auth.
function requireAuth(req, res, next) {
  const userId = req.cookies && req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ err: "Authentication required" });
  }
  req.userId = userId;
  next();
}

module.exports = { loginMiddleware, signupMiddleware, requireAuth };
