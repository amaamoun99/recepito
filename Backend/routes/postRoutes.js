const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
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
  .delete(postController.deletePost, postController.removeRecipeFromUser);

// Like/Unlike route
router.patch("/:id/like", postController.toggleLike);

// Check user likes for multiple posts
router.get("/check-likes", postController.checkUserLikes);

// Comment routes
router
  .route("/:postId/comments")
  .get(commentController.getPostComments)
  .post(commentController.createComment);

router
  .route("/comments/:id")
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

// Get current user's data
router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
