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
module.exports = { loginMiddleware, signupMiddleware };
