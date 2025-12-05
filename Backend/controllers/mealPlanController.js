const MealPlan = require('../models/mealPlanModel');
const Post = require('../models/postsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create or update meal plan
exports.createOrUpdateMealPlan = catchAsync(async (req, res, next) => {
  const { weekStartDate, meals } = req.body;
  const userId = req.user.id;

  // Find existing meal plan for this week
  const startOfWeek = new Date(weekStartDate);
  startOfWeek.setHours(0, 0, 0, 0);

  let mealPlan = await MealPlan.findOne({
    user: userId,
    weekStartDate: startOfWeek
  });

  if (mealPlan) {
    // Update existing meal plan
    mealPlan.meals = meals;
    await mealPlan.save();
  } else {
    // Create new meal plan
    mealPlan = await MealPlan.create({
      user: userId,
      weekStartDate: startOfWeek,
      meals
    });
  }

  await mealPlan.populate({
    path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
    select: 'title imageUrl cookingTime servings'
  });

  res.status(200).json({
    status: 'success',
    data: {
      mealPlan
    }
  });
});

// Get user's meal plan
exports.getMealPlan = catchAsync(async (req, res, next) => {
  const { weekStartDate } = req.query;
  const userId = req.user.id;

  let query = { user: userId };
  
  if (weekStartDate) {
    const startOfWeek = new Date(weekStartDate);
    startOfWeek.setHours(0, 0, 0, 0);
    query.weekStartDate = startOfWeek;
  }

  const mealPlans = await MealPlan.find(query)
    .populate({
      path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
      select: 'title imageUrl cookingTime servings ingredients'
    })
    .sort('-weekStartDate');

  res.status(200).json({
    status: 'success',
    data: {
      mealPlans
    }
  });
});

// Generate shopping list from meal plan
exports.generateShoppingList = catchAsync(async (req, res, next) => {
  const { weekStartDate } = req.query;
  const userId = req.user.id;

  const startOfWeek = new Date(weekStartDate);
  startOfWeek.setHours(0, 0, 0, 0);

  const mealPlan = await MealPlan.findOne({
    user: userId,
    weekStartDate: startOfWeek
  }).populate({
    path: 'meals.breakfast meals.lunch meals.dinner meals.snacks',
    select: 'ingredients'
  });

  if (!mealPlan) {
    return next(new AppError('No meal plan found for this week', 404));
  }

  // Aggregate all ingredients
  const ingredientMap = new Map();

  mealPlan.meals.forEach(meal => {
    const recipes = [
      meal.breakfast,
      meal.lunch,
      meal.dinner,
      ...(meal.snacks || [])
    ].filter(Boolean);

    recipes.forEach(recipe => {
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase().trim();
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            // Try to combine quantities if possible
            ingredientMap.set(key, {
              name: ing.name,
              quantity: existing.quantity + ', ' + ing.quantity,
              category: categorizeIngredient(ing.name)
            });
          } else {
            ingredientMap.set(key, {
              name: ing.name,
              quantity: ing.quantity,
              category: categorizeIngredient(ing.name)
            });
          }
        });
      }
    });
  });

  // Group by category
  const categorized = {};
  ingredientMap.forEach((value, key) => {
    const category = value.category;
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push({
      name: value.name,
      quantity: value.quantity
    });
  });

  res.status(200).json({
    status: 'success',
    data: {
      shoppingList: categorized,
      totalItems: ingredientMap.size
    }
  });
});

// Helper function to categorize ingredients
function categorizeIngredient(ingredientName) {
  const name = ingredientName.toLowerCase();
  
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
      name.includes('fish') || name.includes('meat') || name.includes('turkey')) {
    return 'Meat & Seafood';
  }
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
      name.includes('butter') || name.includes('cream')) {
    return 'Dairy';
  }
  if (name.includes('bread') || name.includes('flour') || name.includes('pasta') || 
      name.includes('rice') || name.includes('cereal')) {
    return 'Bakery & Grains';
  }
  if (name.includes('apple') || name.includes('banana') || name.includes('orange') || 
      name.includes('berry') || name.includes('fruit')) {
    return 'Fruits';
  }
  if (name.includes('lettuce') || name.includes('tomato') || name.includes('onion') || 
      name.includes('pepper') || name.includes('vegetable') || name.includes('carrot')) {
    return 'Vegetables';
  }
  if (name.includes('oil') || name.includes('vinegar') || name.includes('sauce') || 
      name.includes('spice') || name.includes('herb')) {
    return 'Condiments & Spices';
  }
  
  return 'Other';
}

exports.categorizeIngredient = categorizeIngredient;

