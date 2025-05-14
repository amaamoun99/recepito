const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Remove bodyParser as express.json() and express.urlencoded() are sufficient
// app.use(bodyParser.json({ limit: "5mb" }));
// app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// Enable CORS for all requests
app.use(cors());

app.options("*", cors());

// Serve static files
// Update the static file serving to include the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/img", express.static(path.join(__dirname, "public", "img")));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
// app.use("/api/v1/properties", propertiesRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/posts/:postId/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
