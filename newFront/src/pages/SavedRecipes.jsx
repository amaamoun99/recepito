
import { useState, useEffect } from  "react";
import MainLayout from "@/components/Layout/MainLayout";
import RecipeCard from "@/components/Recipe/RecipeCard";
import { Input } from  "@/components/ui/input";
import { Button } from  "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Search, FilterX } from  "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from  "@/components/ui/select";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const SavedRecipes = () => {
  const { user, isAuthenticated, getAuthHeader } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [likesMap, setLikesMap] = useState({});

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        if (!isAuthenticated) {
          throw new Error('Not authenticated');
        }

        setLoading(true);
        // Get user's saved recipes
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: {
            ...getAuthHeader()
          }
        });

        // Fetch all posts to get full recipe details
        const savedRecipeIds = response.data.data.user.savedRecipes;
        if (savedRecipeIds.length > 0) {
          const postsResponse = await axios.get(`${API_URL}/posts`, {
            headers: {
              ...getAuthHeader()
            }
          });

          // Filter the posts to get only the saved ones
          const savedRecipes = postsResponse.data.data.posts.filter(
            post => savedRecipeIds.includes(post._id)
          );

          setSavedRecipes(savedRecipes);
          
          // Fetch like status for saved recipes
          if (savedRecipes.length > 0) {
            await fetchLikesStatus(savedRecipes);
          }
        } else {
          setSavedRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        setSavedRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikesStatus = async (recipesArray) => {
      try {
        // Extract post IDs
        const postIds = recipesArray.map(post => post._id).join(',');
        
        // Fetch like status for all posts in a single request
        const likesResponse = await axios.get(`${API_URL}/posts/check-likes?posts=${postIds}`, {
          headers: {
            ...getAuthHeader()
          }
        });
        
        if (likesResponse.data.status === 'success') {
          setLikesMap(likesResponse.data.data.likes);
        }
      } catch (err) {
        console.error('Error fetching likes status:', err);
      }
    };

    if (user?.token) {
      fetchSavedRecipes();
      if (savedRecipes.length > 0) {
        fetchLikesStatus(savedRecipes);
      }
    }
  }, [isAuthenticated, getAuthHeader]);
  
  const filteredRecipes = savedRecipes
    .filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "popularity") {
        return b.likes.length - a.likes.length;
      }
      return 0;
    });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Recipes</h1>
          <p className="text-muted-foreground mb-6">
            View and manage all your favorite saved recipes.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search your saved recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {searchQuery ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full" 
                  onClick={handleClearSearch}
                >
                  <FilterX className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              ) : (
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
            </div>
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={{
                  id: recipe._id,
                  title: recipe.title,
                  description: recipe.description,
                  ingredients: recipe.ingredients,
                  instructions: recipe.instructions.map(step => step.step),
                  cookingTime: recipe.cookingTime,
                  servings: recipe.servings,
                  difficulty: recipe.difficulty,
                  cuisine: recipe.cuisine,
                  author: {
                    id: recipe.author._id,
                    username: recipe.author.username,
                    profilePicture: recipe.author.profilePicture,
                  },
                  imageUrl: recipe.imageUrl || `/uploads/posts/${recipe._id}.jpeg`,
                  likes: recipe.likes,
                  createdAt: recipe.createdAt,
                }}
                likeInfo={likesMap[recipe._id]}
                onLikeUpdate={(postId, newLikeInfo) => {
                  setLikesMap(prev => ({
                    ...prev,
                    [postId]: newLikeInfo
                  }));
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recipe-primary mx-auto"></div>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">No saved recipes found</h3>
                {searchQuery ? (
                  <p className="text-muted-foreground">
                    No recipes matching "{searchQuery}" in your saved collection.
                  </p>
                ) : (
                  <div className="mt-4">
                    <p className="mb-4">
                      You haven't saved any recipes yet.
                    </p>
                    <Button variant="default" asChild>
                      <a href="/">Browse recipes</a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SavedRecipes;
