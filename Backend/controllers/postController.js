const Post = require('../models/postsModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    author: req.user.id,
    caption: req.body.caption,
    image: req.body.image
  });

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});

// Get all posts (with pagination)
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate('author', 'username profilePicture')
    .populate('comments')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    total,
    data: {
      posts
    }
  });
});

// Get a single post
exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username profilePicture')
    .populate('comments');

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Update a post
exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Check if user is the author of the post
  if (post.author.toString() !== req.user.id) {
    return next(new AppError('You can only update your own posts', 403));
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { caption: req.body.caption },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost
    }
  });
});

// Delete a post
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  // Check if user is the author of the post
  if (post.author.toString() !== req.user.id) {
    return next(new AppError('You can only delete your own posts', 403));
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Like/Unlike a post
exports.toggleLike = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const likeIndex = post.likes.indexOf(req.user.id);

  if (likeIndex === -1) {
    // Like the post
    post.likes.push(req.user.id);
  } else {
    // Unlike the post
    post.likes.splice(likeIndex, 1);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
}); 