

const RecipeIngredientsList = ({ ingredients, recipe }) => {
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Ingredients</h3>
        <div className="text-muted-foreground">
          Ingredients are not available for this recipe.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <div className="bg-background p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 mb-4">For {recipe?.servings || '1'} servings</p>
        <ul className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start">
              <div className="h-5 w-5 rounded border border-gray-300 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-medium">{ingredient.quantity}</span> {ingredient.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeIngredientsList;
