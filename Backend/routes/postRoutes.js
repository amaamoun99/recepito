const express = require("express");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const upload = require("../utils/multerConfig");
const { protect } = require("../controllers/authController"); // Import protect middleware

const router = express.Router();

// Public routes (no authentication needed)
router.get("/", postController.getAllPosts);

// Protected routes (authentication required)
router.post(
  "/",
  protect, // Add authentication
  upload.single("image"),
  postController.resizeImage,
  postController.createPost
);

// IMPORTANT: Put specific routes BEFORE /:id route
router.get("/check-likes", protect, postController.checkUserLikes);

// Generic /:id routes
router
  .route("/:id")
  .get(postController.getPost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

// Like/Unlike route
router.patch("/:id/like", protect, postController.toggleLike);

// Comment routes (protected)
router
  .route("/:postId/comments")
  .get(commentController.getPostComments)
  .post(protect, commentController.createComment);

router
  .route("/comments/:id")
  .patch(protect, commentController.updateComment)
  .delete(protect, commentController.deleteComment);

// Save/Unsave recipe
router.patch("/:id/save", protect, postController.saveRecipe);

// Rate and review recipe
router.post("/:id/rate", protect, postController.rateRecipe);

module.exports = router;