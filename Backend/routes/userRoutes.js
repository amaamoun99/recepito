const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const userController = require('../controllers/userController');
const { protect } = require('../controllers/authController'); // Import protect middleware

// Destructure controller functions
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getMe,
    updateMe,
    deleteMe,
    getUserRecipes,
    getUserComments,
    followUser,
    addRecipeToUser,
    removeRecipeFromUser,
    resizeProfileImage
} = userController;

// Make sure uploads directory exists
const fs = require('fs');
const path = require('path');
const userImagesPath = path.join('public', 'img', 'users');

if (!fs.existsSync(userImagesPath)) {
    fs.mkdirSync(userImagesPath, { recursive: true });
}

// PUBLIC ROUTES (no authentication needed)
router.post('/', createUser);      // create account
router.get('/', getAllUsers);      // list all users

// Public view routes - anyone can view profiles and recipes
router.get('/:id', getUser);
router.get('/:id/recipes', getUserRecipes);
router.get('/:id/comments', getUserComments);


// Current user profile management
router.get('/me', protect, getMe, getUser);
router.patch('/me',
    protect,
    upload.single('profilePicture'),
    resizeProfileImage,
    updateMe
);
router.delete('/me', protect, deleteMe);

// User operations that require authentication
router.patch('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

// Follow/unfollow - REQUIRES AUTHENTICATION
router.patch('/:id/follow', protect, followUser);

module.exports = router;