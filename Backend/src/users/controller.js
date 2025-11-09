const { signUp, login: loginService } = require("./service");

async function create(req, res) {
  try {
    const data = req.body;
    const user = await signUp(data);

    // Set simple cookie with user ID
    res.cookie("userId", user.id);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ err: error.message || "Internal error" });
  }
}

async function login(req, res) {
  try {
    const data = req.body;
    const user = await loginService(data);

    // Set simple cookie with user ID
    res.cookie("userId", user.id);

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ err: error.message || "Internal error" });
  }
}

async function logout(req, res) {
  try {
    // Clear the cookie
    res.clearCookie("userId");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ err: "Logout failed" });
  }
}

module.exports = { create, login, logout };
