
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserIcon } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import ProfileRecipeCard from "@/components/Recipe/ProfileRecipeCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, getAuthHeader } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before fetching profile
    if (authLoading) return;
    
    const fetchProfile = async () => {
      try {
        if (!isAuthenticated) {
          toast.error('You must be logged in to view profiles');
          navigate('/login');
          return;
        }
        
        setIsLoading(true);
        
        // Determine which user ID to use
        const userId = id || user?._id || user?.id;
        
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        // Check if this is the current user's profile
        setIsCurrentUser(userId === (user?._id || user?.id));

        // Get user profile
        const userResponse = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            ...getAuthHeader()
          }
        });

        // Get the user's recipes
        const recipesResponse = await axios.get(`${API_URL}/users/${userId}/recipes`, {
          headers: {
            ...getAuthHeader()
          }
        });

        // Extract user data correctly based on API response structure
        const userData = userResponse.data.data.user || userResponse.data.data.data;
        const recipesData = recipesResponse.data.data;
        
        if (!userData) {
          throw new Error('User data not found');
        }
        
        // Update the profile with both user info and recipes
        setProfile({
          ...userData,
          ...recipesData
        });
        
        // Log the recipes data for debugging
        if (recipesData && recipesData.recipes && recipesData.recipes.length > 0) {
          console.log(`Found ${recipesData.recipes.length} recipes for user`);
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };



    fetchProfile();
  }, [id, user, isAuthenticated, getAuthHeader, authLoading, navigate]);

  if (isLoading || authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-recipe-primary" />
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="text-center p-8 bg-red-50 rounded-lg shadow-sm">
            <UserIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Error Loading Profile</h2>
            <p className="text-gray-600">{error}</p>
            <Button 
              className="mt-6" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={`${import.meta.env.VITE_BASE_URL}${profile?.profilePicture}` || '/default-avatar.png'} alt={profile?.username} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="mt-4 md:mt-0 md:ml-8 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <h1 className="text-2xl font-bold dark:text-white">{profile?.username}</h1>
                
                {isCurrentUser && (
                  <Button 
                    variant="outline" 
                    className="mt-4 md:mt-0"
                    onClick={() => navigate('/settings')}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {profile?.bio && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">{profile?.bio}</p>
              )}
              
              {profile?.location && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">📍 {profile?.location}</p>
              )}
              
              <div className="flex gap-4 mt-4">
                <div>
                  <span className="font-medium mr-1 dark:text-white">{profile?.recipes?.length || 0}</span>
                  <span className="text-gray-500 dark:text-gray-400">Recipes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for recipes and saved content */}
        <Tabs defaultValue="recipes">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            {isCurrentUser && <TabsTrigger value="saved">Saved</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="recipes" className="mt-6">
            {profile?.recipes?.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                {profile?.recipes?.map(recipe => (
                  console.log(recipe),
                  <ProfileRecipeCard
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
                      createdAt: recipe.createdAt,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  {isCurrentUser ? 'You haven\'t created any recipes yet.' : 'This user hasn\'t created any recipes yet.'}
                </p>
                {isCurrentUser && (
                  <Button className="mt-4" onClick={() => navigate('/create')}>
                    Create Your First Recipe
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          {isCurrentUser && (
            <TabsContent value="saved" className="mt-6">
              {profile?.savedRecipes?.length > 0 ? (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                  {profile?.savedRecipes?.map(recipe => (
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
                        author: recipe.author ? {
                          id: recipe.author._id,
                          username: recipe.author.username,
                          profilePicture: recipe.author.profilePicture,
                        } : {
                          username: 'Unknown'
                        },
                        imageUrl: recipe.imageUrl || `/uploads/posts/${recipe._id}.jpeg`,
                        createdAt: recipe.createdAt,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">You haven't saved any recipes yet.</p>
                  <Button className="mt-4" onClick={() => navigate('/')}>
                    Browse Recipes
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
    </MainLayout>
  );
};

export default UserProfile;
