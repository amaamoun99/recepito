const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide password by default
  profilePicture: { type: String },
  bio: { type: String },
  location: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  savedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  passwordChangedAt: Date, // Track password changes
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Update passwordChangedAt timestamp
  this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to check if user has saved a recipe
userSchema.methods.hasSavedRecipe = function(recipeId) {
  return this.savedRecipes.some(saved => saved.toString() === recipeId.toString());
};

// Method to add a recipe to user's saved recipes
userSchema.methods.addSavedRecipe = function(recipeId) {
  if (!this.hasSavedRecipe(recipeId)) {
    this.savedRecipes.push(recipeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a recipe from saved recipes
userSchema.methods.removeSavedRecipe = function(recipeId) {
  this.savedRecipes = this.savedRecipes.filter(saved => saved.toString() !== recipeId.toString());
  return this.save();
};

module.exports = mongoose.model('User', userSchema);