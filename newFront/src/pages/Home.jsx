import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import RecipeCard from "@/components/Recipe/RecipeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  
  const [activeTab, setActiveTab] = useState("forYou");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesMap, setLikesMap] = useState({});
  const { user, isAuthenticated, getAuthHeader } = useAuth();

  // Function to filter posts by title
  const filterPosts = (postsToFilter, query) => {
    if (!query) {
      return postsToFilter;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    return postsToFilter.filter(post => 
      post.title.toLowerCase().includes(lowerCaseQuery)
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts`, {
          headers: {
            ...getAuthHeader() // Add authorization header if user is logged in
          }
        });

        const fetchedPosts = response.data.data.posts;
        setPosts(fetchedPosts);
        
        // Apply search filter if there's a query
        if (searchQuery) {
          setFilteredPosts(filterPosts(fetchedPosts, searchQuery));
        } else {
          setFilteredPosts(fetchedPosts);
        }
        
        // If user is authenticated, fetch like status for all posts
        if (isAuthenticated && fetchedPosts.length > 0) {
          await fetchLikesStatus(fetchedPosts);
        } else {
          // If not authenticated, still set up likes count
          const likesMapFromPosts = {};
          fetchedPosts.forEach(post => {
            likesMapFromPosts[post._id] = {
              isLiked: false,
              likesCount: post.likes.length
            };
          });
          setLikesMap(likesMapFromPosts);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch like status for all posts
    const fetchLikesStatus = async (postsArray) => {
      try {
        // Create a fallback likes map in case the API fails
        const fallbackLikesMap = {};
        postsArray.forEach(post => {
          const userId = user?._id || user?.id;
          fallbackLikesMap[post._id] = {
            isLiked: userId ? post.likes.some(id => id.toString() === userId.toString()) : false,
            likesCount: post.likes.length
          };
        });
        
        try {
          // Extract post IDs - limit to smaller batches to avoid URL length issues
          const BATCH_SIZE = 5;
          const firstBatch = postsArray.slice(0, BATCH_SIZE);
          const postIds = firstBatch.map(post => post._id).join(',');
          
          // Fetch like status for the first batch of posts
          const likesResponse = await axios.get(`${API_URL}/posts/check-likes?posts=${postIds}`, {
            headers: {
              ...getAuthHeader()
            }
          });
        
          if (likesResponse.data.status === 'success') {
            console.debug('Received likes map:', likesResponse.data.data.likes);
            // Merge with fallback map for any missing posts
            const combinedMap = { ...fallbackLikesMap, ...likesResponse.data.data.likes };
            setLikesMap(combinedMap);
          } else {
            // Use fallback if API returns success: false
            setLikesMap(fallbackLikesMap);
          }
        } catch (apiErr) {
          console.error('Error fetching likes status from API, using fallback:', apiErr);
          // Use fallback if API call fails
          setLikesMap(fallbackLikesMap);
        }
      } catch (err) {
        console.error('Error in likes processing:', err);
        // If everything fails, just use an empty map
        setLikesMap({});
      }
    };


    
    fetchPosts();
  }, [user, isAuthenticated, getAuthHeader, searchQuery]);
  
  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/');
    }
  };
  
  // Effect to filter posts when search query changes
  useEffect(() => {
    setFilteredPosts(filterPosts(posts, searchQuery));
  }, [searchQuery, posts]);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-background p-6 md:p-8 rounded-lg shadow-sm mb-8">
          {searchQuery && (
            <div className="mb-4 p-2 bg-muted rounded-md">
              <p className="text-sm">
                Showing results for "{searchQuery}" ({filteredPosts.length} found)
                <Button 
                  variant="link" 
                  className="ml-2 p-0 h-auto" 
                  onClick={() => navigate('/')}
                >
                  Clear
                </Button>
              </p>
            </div>
          )}

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="forYou">For You</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : (
              <>
                <TabsContent value="forYou" className="mt-6">
                  <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                    {filteredPosts.map((post) => (
                      <RecipeCard
                        key={post._id}
                        recipe={{
                          id: post._id,
                          title: post.title,
                          description: post.description,
                          ingredients: post.ingredients,
                          instructions: post.instructions.map(
                            (step) => step.step
                          ),
                          cookingTime: post.cookingTime,
                          servings: post.servings,
                          difficulty: post.difficulty,
                          cuisine: post.cuisine,
                          author: {
                            id: post.author._id,
                            username: post.author.username,
                            profilePicture: post.author.profilePicture,
                          },
                          imageUrl: post.imageUrl || `/uploads/posts/${post._id}.jpeg`,
                          comments: post.comments,
                          likes: post.likes,
                          createdAt: post.createdAt,
                        }}
                        likeInfo={likesMap[post._id]}
                        onLikeUpdate={(postId, newLikeInfo) => {
                          setLikesMap(prev => ({
                            ...prev,
                            [postId]: newLikeInfo
                          }));
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="mt-6">
                  <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                    {filteredPosts
                      .sort((a, b) => {
                        const aLikes = likesMap[a._id]?.likesCount || a.likes.length;
                        const bLikes = likesMap[b._id]?.likesCount || b.likes.length;
                        return bLikes - aLikes;
                      })
                      .map((post) => (
                        <RecipeCard
                          key={post._id}
                          recipe={{
                            id: post._id,
                            title: post.title,
                            description: post.description,
                            ingredients: post.ingredients,
                            instructions: post.instructions.map(
                              (step) => step.step
                            ),
                            cookingTime: post.cookingTime,
                            servings: post.servings,
                            difficulty: post.difficulty,
                            cuisine: post.cuisine,
                            profilePicture: post.author.profilePicture,

                            author: {
                              id: post.author._id,
                              username: post.author.username,
                              profilePicture: post.author.profilePicture,
                            },
                            imageUrl: post.imageUrl || `/uploads/posts/${post._id}.jpeg`,
                            comments: post.comments,
                            likes: post.likes,
                            createdAt: post.createdAt,
                          }}
                          likeInfo={likesMap[post._id]}
                          onLikeUpdate={(postId, newLikeInfo) => {
                            setLikesMap(prev => ({
                              ...prev,
                              [postId]: newLikeInfo
                            }));
                          }}
                        />
                      ))}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
