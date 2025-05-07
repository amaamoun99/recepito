// Recipe type definition (converted from TypeScript)
// In TypeScript this would be:
// export interface Recipe {
//   id: string;
//   title: string;
//   description: string;
//   ingredients: Array<{name: string, amount: string}>;
//   instructions: string[];
//   cookTime: number;
//   prepTime: number;
//   servings: number;
//   tags: string[];
//   images: string[];
//   userId: string;
//   author: User;
//   likes: number;
//   comments: Comment[];
//   createdAt: Date;
//   saved: boolean;
//   liked: boolean;
// }

// Mock users
export const users = [
  {
    id: "1",
    username: "culinary_master",
    email: "chef@example.com",
    avatar: "https://source.unsplash.com/100x100/?portrait&1",
    bio: "Professional chef sharing my favorite recipes.",
    followers: 245,
    following: 56,
    createdAt: new Date(2023, 6, 15),
  },
  {
    id: "2",
    username: "home_baker",
    email: "baker@example.com",
    avatar: "https://source.unsplash.com/100x100/?portrait&2",
    bio: "I love baking desserts and pastries!",
    followers: 120,
    following: 85,
    createdAt: new Date(2023, 3, 22),
  },
  {
    id: "3",
    username: "veggie_love",
    email: "vegan@example.com",
    avatar: "https://source.unsplash.com/100x100/?portrait&3",
    bio: "Plant-based recipes that are both delicious and nutritious.",
    followers: 78,
    following: 42,
    createdAt: new Date(2023, 1, 10),
  },
  {
    id: "4",
    username: "current_user",
    email: "me@example.com",
    avatar: "https://source.unsplash.com/100x100/?portrait&4",
    bio: "Exploring the world one recipe at a time.",
    followers: 35,
    following: 120,
    createdAt: new Date(2023, 8, 5),
  }
];

// Mock recipes
export const recipes = [
  {
    id: "1",
    title: "Classic Chocolate Chip Cookies",
    description: "The perfect chewy chocolate chip cookies with a soft center and crisp edges.",
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "In a large bowl, cream together butter and sugars until light and fluffy.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "Combine flour, baking soda, and salt; gradually stir into the creamed mixture.",
      "Fold in chocolate chips.",
      "Drop by rounded tablespoons onto ungreased cookie sheets.",
      "Bake for 10-12 minutes until edges are golden brown.",
      "Allow cookies to cool on baking sheet for 5 minutes before transferring to a wire rack."
    ],
    ingredients: [
      { name: "butter", amount: "1 cup" },
      { name: "white sugar", amount: "1 cup" },
      { name: "brown sugar", amount: "1 cup" },
      { name: "eggs", amount: "2" },
      { name: "vanilla extract", amount: "2 tsp" },
      { name: "flour", amount: "3 cups" },
      { name: "chocolate chips", amount: "2 cups" }
    ],
    cookTime: 12,
    prepTime: 15,
    servings: 24,
    tags: ["dessert", "baking", "cookies"],
    images: ["https://source.unsplash.com/800x600/?cookies&1"],
    userId: "2",
    author: users[1],
    likes: 42,
    comments: [],
    createdAt: new Date(2024, 4, 5),
    saved: false,
    liked: false
  },
  {
    id: "2",
    title: "Spicy Thai Basil Stir-Fry",
    description: "A quick and flavorful stir-fry with vibrant Thai basil and your choice of protein.",
    instructions: [
      "Heat oil in a wok over high heat.",
      "Add garlic and chili, stir-fry for 30 seconds until fragrant.",
      "Add your choice of protein and stir-fry until cooked through.",
      "Add vegetables and continue to stir-fry for 2-3 minutes.",
      "Pour in the sauce mixture and bring to a simmer.",
      "Stir in Thai basil leaves and cook just until wilted.",
      "Serve hot over steamed rice."
    ],
    ingredients: [
      { name: "vegetable oil", amount: "2 tbsp" },
      { name: "garlic", amount: "4 cloves" },
      { name: "Thai chili", amount: "2-4" },
      { name: "protein (chicken/tofu/beef)", amount: "1 lb" },
      { name: "bell peppers", amount: "2" },
      { name: "onion", amount: "1" },
      { name: "Thai basil leaves", amount: "1 cup" },
      { name: "soy sauce", amount: "3 tbsp" },
      { name: "oyster sauce", amount: "1 tbsp" },
      { name: "fish sauce", amount: "1 tsp" }
    ],
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    tags: ["thai", "dinner", "spicy", "quick"],
    images: ["https://source.unsplash.com/800x600/?stirfry&1"],
    userId: "1",
    author: users[0],
    likes: 28,
    comments: [],
    createdAt: new Date(2024, 5, 1),
    saved: false,
    liked: true
  },
  {
    id: "3",
    title: "Vegan Buddha Bowl",
    description: "Nutritious and colorful Buddha bowl packed with vegetables, grains, and plant-based protein.",
    instructions: [
      "Cook quinoa according to package instructions and let cool.",
      "Roast sweet potatoes at 400°F for 25 minutes until tender.",
      "Prepare vegetables by washing and chopping them.",
      "Make dressing by whisking all dressing ingredients together.",
      "Assemble bowls with quinoa  base.",
      "Arrange roasted sweet potatoes, chickpeas, and raw vegetables on top.",
      "Drizzle with dressing and sprinkle with seeds."
    ],
    ingredients: [
      { name: "quinoa", amount: "1 cup" },
      { name: "sweet potato", amount: "1 large" },
      { name: "chickpeas", amount: "1 can" },
      { name: "avocado", amount: "1" },
      { name: "cucumber", amount: "1" },
      { name: "carrots", amount: "2" },
      { name: "tahini", amount: "2 tbsp" },
      { name: "lemon juice", amount: "1 tbsp" },
      { name: "maple syrup", amount: "1 tsp" },
      { name: "sesame seeds", amount: "1 tbsp" }
    ],
    cookTime: 30,
    prepTime: 20,
    servings: 2,
    tags: ["vegan", "healthy", "bowl", "lunch"],
    images: ["https://source.unsplash.com/800x600/?buddhabowl&1"],
    userId: "3",
    author: users[2],
    likes: 15,
    comments: [],
    createdAt: new Date(2024, 5, 3),
    saved: true,
    liked: false
  },
  {
    id: "4",
    title: "Homemade Sourdough Bread",
    description: "Artisanal sourdough bread with a crispy crust and chewy interior.",
    instructions: [
      "Mix starter, flour, and water. Let rest for 30 minutes.",
      "Add salt and knead until smooth.",
      "Allow to rise for 4-6 hours, folding every hour.",
      "Shape into a round loaf and place in a floured banneton.",
      "Refrigerate overnight for slow fermentation.",
      "Preheat oven to 450°F with a Dutch oven inside.",
      "Score the loaf and transfer to the hot Dutch oven.",
      "Bake covered for 20 minutes, then uncovered for 20-25 minutes."
    ],
    ingredients: [
      { name: "sourdough starter", amount: "100g" },
      { name: "bread flour", amount: "500g" },
      { name: "water", amount: "350g" },
      { name: "salt", amount: "10g" }
    ],
    cookTime: 45,
    prepTime: 25,
    servings: 8,
    tags: ["bread", "sourdough", "baking"],
    images: ["https://source.unsplash.com/800x600/?sourdough&1"],
    userId: "2",
    author: users[1],
    likes: 56,
    comments: [],
    createdAt: new Date(2024, 4, 28),
    saved: true,
    liked: false
  },
  {
    id: "5",
    title: "Fresh Summer Salad",
    description: "A light and refreshing salad perfect for hot summer days.",
    instructions: [
      "Wash and chop all vegetables.",
      "Combine in a large bowl.",
      "Whisk together olive oil, lemon juice, salt, and pepper for the dressing.",
      "Pour dressing over salad and toss gently to combine.",
      "Top with crumbled feta and serve immediately."
    ],
    ingredients: [
      { name: "mixed greens", amount: "4 cups" },
      { name: "cucumber", amount: "1" },
      { name: "cherry tomatoes", amount: "1 cup" },
      { name: "red onion", amount: "1/2" },
      { name: "feta cheese", amount: "1/2 cup" },
      { name: "olive oil", amount: "3 tbsp" },
      { name: "lemon juice", amount: "2 tbsp" },
      { name: "salt and pepper", amount: "to taste" }
    ],
    cookTime: 0,
    prepTime: 15,
    servings: 4,
    tags: ["salad", "summer", "healthy", "quick"],
    images: ["https://source.unsplash.com/800x600/?salad&1"],
    userId: "3",
    author: users[2],
    likes: 8,
    comments: [],
    createdAt: new Date(2024, 5, 4),
    saved: false,
    liked: false
  }
];

// Mock comments
export const comments = [
  {
    id: "1",
    text: "I made these cookies last night and they were amazing! My family devoured them.",
    userId: "3",
    author: users[2],
    recipeId: "1",
    createdAt: new Date(2024, 5, 5, 10, 15)
  },
  {
    id: "2",
    text: "Great recipe! I added some walnuts for extra crunch and they turned out perfect.",
    userId: "1",
    author: users[0],
    recipeId: "1",
    createdAt: new Date(2024, 5, 5, 14, 22)
  },
  {
    id: "3",
    text: "This is now my go-to stir-fry recipe. The flavors are incredible!",
    userId: "2",
    author: users[1],
    recipeId: "2",
    createdAt: new Date(2024, 5, 2, 19, 30)
  },
  {
    id: "4",
    text: "I've made this Buddha bowl twice now. So nutritious and satisfying!",
    userId: "4",
    author: users[3],
    recipeId: "3",
    createdAt: new Date(2024, 5, 4, 12, 45)
  }
];

// Helper function to get recipes for the feed
export function getFeedRecipes() {
  return [...recipes].sort(() => Math.random() - 0.5);
}

// New function to get all recipes (both feed and specific)
export const getAllRecipes = () => {
  // Combine feed recipes and any other recipes that might not be in the feed
  return getFeedRecipes();
};

// Helper function to get a user by ID
export function getUserById(id) {
  return users.find(user => user.id === id);
}

// Helper function to get recipes by user ID
export function getRecipesByUserId(userId) {
  return recipes.filter(recipe => recipe.userId === userId);
}

// Helper function to get saved recipes for a user
export function getSavedRecipes(userId) {
  return recipes.filter(recipe => recipe.saved);
}

// Helper function to get a recipe by ID
export function getRecipeById(id) {
  return recipes.find(recipe => recipe.id === id);
}

// Helper function to get comments for a recipe
export function getCommentsForRecipe(recipeId) {
  return comments.filter(comment => comment.recipeId === recipeId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Mock current user (for demo purposes)
export const currentUser = users[3];
