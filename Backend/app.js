const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const path = require("path"); // Import path module for consistency

const app = express();

// Increase payload size limit
app.use(bodyParser.json({ limit: "5mb" })); //middleware

app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(
  cors({
    origin: "*", // frontend URL change to production URL
    credentials: true, // Allow credentials (cookies) to be sent
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Serve static files (e.g., images) from a folder
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

module.exports = app;
