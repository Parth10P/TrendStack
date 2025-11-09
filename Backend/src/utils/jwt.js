const jwt = require("jsonwebtoken");

// Use environment variable or default secret (change in production!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // 7 days

/**
 * Generate JWT token for a user
 * @param {Object} user - User object with id, username, email
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const err = new Error("Token expired");
      err.statusCode = 401;
      throw err;
    }
    if (error.name === "JsonWebTokenError") {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      throw err;
    }
    throw error;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
};
