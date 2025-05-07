

const RecipeInstructions = ({ instructions }) => {
  if (!instructions || instructions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <div className="text-muted-foreground">
          Instructions are not available for this recipe.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
      <div className="bg-background p-6 rounded-lg shadow-sm">
        <ol className="space-y-6">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex">
              <div className="h-8 w-8 rounded-full bg-recipe-primary text-white flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                {index + 1}
              </div>
              <p className="pt-1">{instruction.step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeInstructions;
