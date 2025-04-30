const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const upload = require("../utils/multerConfig");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Post routes
router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    upload.single("image"),
    postController.resizeImage,
    postController.createPost
  );

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

// Like/Unlike route
router.patch("/:id/like", postController.toggleLike);

module.exports = router;
