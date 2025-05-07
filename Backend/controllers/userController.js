const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

// CRUD operations using handler factory
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.createUser = handlerFactory.createOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

// Get current user's profile
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// Middleware to resize profile image
exports.resizeProfileImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    
    // Set the full path for the image URL
    req.file.path = `/img/users/${req.file.filename}`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

// Update current user's profile
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = {
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        location: req.body.location
    };
    
    // 3) If there is a file upload, add the filename to the update
    if (req.file) {
        filteredBody.profilePicture = req.file.path;
    }

    // 4) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Delete current user's profile
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Get user's recipes
exports.getUserRecipes = catchAsync(async (req, res, next) => {
    const recipes = await User.findById(req.params.id)
        .populate('recipes')
        .populate('savedRecipes');

    if (!recipes) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            recipes: recipes.recipes,
            savedRecipes: recipes.savedRecipes
        }
    });
});

// Get user's comments
exports.getUserComments = catchAsync(async (req, res, next) => {
    const comments = await User.findById(req.params.id)
        .populate('comments')
        .populate('likes');

    if (!comments) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            comments: comments.comments,
            likes: comments.likes
        }
    });
});

// Follow/unfollow user
exports.followUser = catchAsync(async (req, res, next) => {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
        return next(new AppError('No user found with that ID', 404));
    }

    if (currentUser.following.includes(userToFollow.id)) {
        // Remove from following
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToFollow.id.toString()
        );
        userToFollow.followers = userToFollow.followers.filter(
            id => id.toString() !== currentUser.id.toString()
        );
    } else {
        // Add to following
        currentUser.following.push(userToFollow.id);
        userToFollow.followers.push(currentUser.id);
    }

    await currentUser.save({ validateBeforeSave: false });
    await userToFollow.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            user: currentUser
        }
    });
});
