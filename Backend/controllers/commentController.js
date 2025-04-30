const Comment = require('../models/commentModel');
const Post = require('../models/postsModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new comment
exports.createComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  
  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const newComment = await Comment.create({
    post: req.params.postId,
    author: req.user.id,
    text: req.body.text
  });

  // Add comment to post's comments array
  post.comments.push(newComment._id);
  await post.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment
    }
  });
});

// Get all comments for a post
exports.getPostComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username profilePicture')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments
    }
  });
});

// Update a comment
exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user.id) {
    return next(new AppError('You can only update your own comments', 403));
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      comment: updatedComment
    }
  });
});

// Delete a comment
exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  // Check if user is the author of the comment
  if (comment.author.toString() !== req.user.id) {
    return next(new AppError('You can only delete your own comments', 403));
  }

  // Remove comment from post's comments array
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id }
  });

  await Comment.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 