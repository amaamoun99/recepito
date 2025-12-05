const sharp = require("sharp");
const Post = require("../models/postsModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Middleware to resize image
exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  
  // Set the full path for the image URL
  req.file.path = `/uploads/posts/${req.file.filename}`;

  await sharp(req.file.buffer)
    .resize(1080, 1080)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/uploads/posts/${req.file.filename}`);

  next();
});

// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
  // Validate required fields
  const requiredFields = ['title', 'description', 'cuisine', 'difficulty', 'servings', 'cookingTime'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
  }

  // Validate difficulty level
  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!validDifficulties.includes(req.body.difficulty)) {
    return next(new AppError(`Invalid difficulty level. Must be one of: ${validDifficulties.join(', ')}`, 400));
  }

  // Transform instructions array to match schema
  const instructions = req.body.instructions.map(step => ({ step }));

  // Transform ingredients array to match schema
  const ingredients = req.body.ingredients.map(ingredient => ({
    name: ingredient.name,
    quantity: ingredient.quantity
  }));

  // Create the new post
  const newPost = await Post.create({
    ...req.body,
    author: req.user.id,
    imageUrl: req.file ? req.file.path : req.body.imageUrl || '',
    instructions,
    ingredients
  });

  // Add the recipe to the user's collection
  const user = await User.findById(req.user.id);
  if (user) {
    user.recipes.push(newPost._id);
    await user.save({ validateBeforeSave: false });
  }

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
    .populate("author", "username profilePicture")
    .populate("comments")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments();

  res.status(200).json({
    status: "success",
    results: posts.length,
    total,
    data: {
      posts,
    },
  });
});

// Get a single post
exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username profilePicture")
    .populate("comments");

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

// Update a post
exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  // Allow admin to update any post
  if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
    return next(new AppError("You can only update your own posts", 403));
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { caption: req.body.caption },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      post: updatedPost,
    },
  });
});

// Delete a post
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  // Allow admin to delete any post
  if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
    return next(new AppError("You can only delete your own posts", 403));
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Like/Unlike a post
exports.toggleLike = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
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

  // After toggling, check if the user's ID is now in the likes array
  const isNowLiked = post.likes.includes(req.user.id);
  
  res.status(200).json({
    status: "success",
    data: {
      post,
      isLiked: isNowLiked, // Return whether the post is now liked by the user
      likesCount: post.likes.length
    },
  });
});

// Check if user has liked posts
exports.checkUserLikes = catchAsync(async (req, res, next) => {
  // Get post IDs from query (comma-separated)
  const postIds = req.query.posts ? req.query.posts.split(',') : [];
  
  if (postIds.length === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        likes: {}
      }
    });
  }
  
  // Find all posts with the given IDs
  const posts = await Post.find({ _id: { $in: postIds } });
  
  // Create a map of post ID to like status
  const likeStatusMap = {};
  
  posts.forEach(post => {
    // Convert user ID to string for consistent comparison
    const userId = req.user.id.toString();
    
    // Check if user has liked this post (comparing as strings)
    const isLiked = post.likes.some(id => id.toString() === userId);
    
    likeStatusMap[post._id] = {
      isLiked,
      likesCount: post.likes.length
    };
  });
  
  res.status(200).json({
    status: "success",
    data: {
      likes: likeStatusMap
    }
  });
});


// Add recipe to user
exports.addRecipeToUser = catchAsync(async (req, res, next) => {
  const { recipeId } = req.params;
  const user = await User.findById(req.user.id);
  const recipe = await Post.findById(recipeId);

  if (!user) {
      return next(new AppError('No user found with that ID', 404));
  }

  if (!recipe) {
      return next(new AppError('No recipe found with that ID', 404));
  }

  // Check if recipe is already in user's recipes
  if (user.recipes.includes(recipeId)) {
      return next(new AppError('Recipe is already in your collection', 400));
  }

  // Add recipe to user's recipes
  user.recipes.push(recipeId);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
      status: 'success',
      data: {
          user
      }
  });
});

// Remove recipe from user
exports.removeRecipeFromUser = catchAsync(async (req, res, next) => {
  const { recipeId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
      return next(new AppError('No user found with that ID', 404));
  }

  // Check if recipe exists in user's recipes
  const recipeIndex = user.recipes.indexOf(recipeId);
  if (recipeIndex === -1) {
      return next(new AppError('Recipe not found in your collection', 404));
  }

  // Remove recipe from user's recipes
  user.recipes = user.recipes.filter(id => id.toString() !== recipeId.toString());
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
      status: 'success',
      data: {
          user
      }
  });
});

// Admin: Get analytics (number of users and posts)
exports.getAnalytics = catchAsync(async (req, res, next) => {
  const User = require("../models/userModel");
  const Post = require("../models/postsModel");
  const userCount = await User.countDocuments();
  const postCount = await Post.countDocuments();
  res.status(200).json({
    status: "success",
    data: { userCount, postCount },
  });
});

// Admin: Get all posts (no pagination, all posts)
exports.adminGetAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate("author", "username profilePicture")
    .populate("comments")
    .sort("-createdAt");
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: { posts },
  });
});

// Admin: Update any post
exports.adminUpdatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    data: { post: updatedPost },
  });
});

// Admin: Delete any post
exports.adminDeletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Save/Unsave a recipe
exports.saveRecipe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  const recipe = await Post.findById(id);

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  const isSaved = user.savedRecipes.some(saved => saved.toString() === id);
  
  if (isSaved) {
    // Unsave
    user.savedRecipes = user.savedRecipes.filter(saved => saved.toString() !== id);
  } else {
    // Save
    user.savedRecipes.push(id);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      isSaved: !isSaved,
      savedRecipes: user.savedRecipes
    }
  });
});

// Rate and review a recipe
exports.rateRecipe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError("Rating must be between 1 and 5", 400));
  }

  // Check if user has already rated
  const existingRatingIndex = post.ratings.findIndex(
    r => r.user.toString() === req.user.id.toString()
  );

  if (existingRatingIndex !== -1) {
    // Update existing rating
    post.ratings[existingRatingIndex].rating = rating;
    post.ratings[existingRatingIndex].review = review || "";
    post.ratings[existingRatingIndex].createdAt = Date.now();
  } else {
    // Add new rating
    post.ratings.push({
      user: req.user.id,
      rating,
      review: review || "",
      createdAt: Date.now()
    });
  }

  await post.save();

  res.status(200).json({
    status: "success",
    data: {
      post,
      averageRating: post.averageRating
    }
  });
});

