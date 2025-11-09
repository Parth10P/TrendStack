const express = require("express");
const cookieParser = require("cookie-parser");
const { router } = require("./src/users/routes");

const app = express();

// Middleware
app.use(cookieParser()); // Enable cookie parsing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/", router);

// Root health check
app.get("/", (req, res) => {
  res.send("TrendStack backend is working");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
