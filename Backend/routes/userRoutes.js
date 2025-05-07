const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { protect } = require('../controllers/authController');
const userController = require('../controllers/userController');

// Destructure controller functions for easier use
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

// Public routes
router.post('/', createUser);
router.get('/', getAllUsers);

// Protected routes
router.use(protect);

// Routes that require authentication
// Make sure the uploads directory exists
const fs = require('fs');
const path = require('path');
const userImagesPath = path.join('public', 'img', 'users');
if (!fs.existsSync(userImagesPath)) {
    fs.mkdirSync(userImagesPath, { recursive: true });
}

router
    .route('/me')
    .get(getMe, getUser)
    .patch(
        upload.single('profilePicture'),
        resizeProfileImage,
        updateMe
    )
    .delete(deleteMe);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

router
    .route('/:id/recipes')
    .get(getUserRecipes);

router
    .route('/:id/comments')
    .get(getUserComments);

router
    .route('/:id/follow')
    .patch(followUser);

module.exports = router;
