
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import ProfileRecipeCard from "@/components/Recipe/ProfileRecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:2059/api/v1";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  
  const { getAuthHeader } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts once when component mounts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all posts from the API
        const response = await axios.get(`${API_URL}/posts`, {
          headers: {
            ...getAuthHeader()
          }
        });
        
        if (response.data.status === 'success') {
          const fetchedPosts = response.data.data.posts;
          setAllPosts(fetchedPosts);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [getAuthHeader]);
  
  // Filter posts whenever search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecipes([]);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    const filtered = allPosts.filter(post => {
      // Check if title contains the search query
      const titleMatch = post.title?.toLowerCase().includes(lowerCaseQuery);
      
      // Check if description contains the search query
      const descriptionMatch = post.description?.toLowerCase().includes(lowerCaseQuery);
      
      // Check if any ingredient contains the search query
      const ingredientMatch = post.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(lowerCaseQuery)
      );
      
      // Check if cuisine contains the search query
      const cuisineMatch = post.cuisine?.toLowerCase().includes(lowerCaseQuery);
      
      // Return true if any of the fields match
      return titleMatch || descriptionMatch || ingredientMatch || cuisineMatch;
    });
    
    setFilteredRecipes(filtered);
  }, [searchQuery, allPosts]);

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-6">
          {loading ? "Searching..." : `Found ${filteredRecipes.length} results for "${searchQuery}"`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                <div className="relative">
                  <Skeleton className="w-full h-48" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <ProfileRecipeCard 
                    key={recipe._id} 
                    recipe={{
                      id: recipe._id,
                      title: recipe.title,
                      description: recipe.description,
                      ingredients: recipe.ingredients,
                      instructions: recipe.instructions?.map(step => step.step) || [],
                      cookingTime: recipe.cookingTime,
                      servings: recipe.servings,
                      difficulty: recipe.difficulty,
                      cuisine: recipe.cuisine,
                      author: {
                        id: recipe.author?._id,
                        username: recipe.author?.username,
                        profilePicture: recipe.author?.profilePicture,
                      },
                      imageUrl: recipe.imageUrl || `/uploads/posts/${recipe._id}.jpeg`,
                      createdAt: recipe.createdAt,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                <p className="text-muted-foreground">
                  Try searching for something else or adjust your search terms
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchResults;
