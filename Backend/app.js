const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const path = require("path");

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// FIXED: Enable credentials for cookies to work with CORS
app.use(
  cors({
    origin: "http://localhost:4200", // Your Angular app URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true, // CHANGED: Enable cookies/credentials
  })
);

app.options("*", cors());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/img", express.static(path.join(__dirname, "public", "img")));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes (authentication-free versions)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/posts/:postId/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meal-plans", mealPlanRoutes);

module.exports = app;