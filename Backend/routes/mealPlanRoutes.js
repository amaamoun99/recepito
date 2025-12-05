
const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const { protect } = require('../controllers/authController'); // Import protect middleware

// All meal plan routes require authentication
router
  .route('/')
  .post(protect, mealPlanController.createOrUpdateMealPlan)
  .get(protect, mealPlanController.getMealPlan);

router
  .route('/shopping-list')
  .get(protect, mealPlanController.generateShoppingList);

module.exports = router;