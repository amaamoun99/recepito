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

    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
            bio: req.body.bio,
            location: req.body.location
        },
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
