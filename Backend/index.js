const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { router: userRouter } = require("./src/users/routes");
const { router: postRouter } = require("./src/posts/routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins in development (adjust for production)
    credentials: true, // Allow cookies to be sent
  })
);
app.use(cookieParser()); // Enable cookie parsing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/users", userRouter); // Mount user routes at /api/users
app.use("/api/posts", postRouter); // Mount post routes at /api/posts

// Root health check
app.get("/", (req, res) => {
  res.send("TrendStack backend is working");
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:3001`);
});
