const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  meals: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    breakfast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    lunch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    dinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    snacks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  }]
}, { timestamps: true });

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
module.exports = MealPlan;

