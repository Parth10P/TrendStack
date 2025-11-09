const { signUp, login: loginService } = require("./service");

async function create(req, res) {
  try {
    const data = req.body;
    const dataFromService = await signUp(data);
    return res.status(201).json({ user: dataFromService });
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ err: error.message || "Internal error" });
  }
}
async function login(req, res) {
  try {
    const data = req.body;
    const user = await loginService(data);
    return res.status(200).json({ user });
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ err: error.message || "Internal error" });
  }
}

module.exports = { create, login };
