const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
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
    removeRecipeFromUser
} = require('../controllers/userController');

// Public routes
router.post('/', createUser);
router.get('/', getAllUsers);

// Protected routes
router.use(protect);

// Routes that require authentication
router
    .route('/me')
    .get(getMe, getUser)
    .patch(updateMe)
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
