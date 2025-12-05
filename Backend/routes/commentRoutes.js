const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router({ mergeParams: true }); // To access params from parent router

// Comment routes
router
  .route('/')
  .get(commentController.getPostComments)
  .post(commentController.createComment);

router
  .route('/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router; 