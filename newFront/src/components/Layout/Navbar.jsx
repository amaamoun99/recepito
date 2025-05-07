import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  SearchIcon as Search, 
  Menu,
  User,
  PlusCircle,
  Settings,
  Bookmark,
  LogOut
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to home page with search query parameter
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };
  
  // Clear search when clicking on the home link
  const handleHomeClick = () => {
    setSearchTerm("");
    navigate('/');
  };

  // Update search term when URL query parameter changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const updateSuggestions = () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      // Get all posts from the backend
      fetch('http://localhost:2059/api/v1/posts')
        .then(response => response.json())
        .then(data => {
          const allRecipes = data.data.posts;
          const matchedRecipes = allRecipes
            .filter(recipe => 
              recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5) // Limit to 5 suggestions
            .map(recipe => ({ id: recipe._id, title: recipe.title }));

          setSuggestions(matchedRecipes);
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
          setSuggestions([]);
        });
    };

    updateSuggestions();
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 ${isLoading ? 'opacity-50 cursor-wait' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recipe-primary"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={handleHomeClick}>
             
              <span className="font-bold text-xl hidden md:inline">Recipito</span>
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-recipe-primary"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    {suggestions.map((suggestion) => (
                      <li 
                        key={suggestion.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                        onClick={() => handleSuggestionClick(suggestion.id)}
                      >
                        {suggestion.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
               
                <Button className="bg-recipe-primary hover:bg-recipe-primary/90" size="sm" asChild>
                  <Link to="/create">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Recipe
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1">
                      <Avatar>
                        <AvatarImage 
                          src={`http://localhost:2059${user?.profilePicture}` || 'https://i.pravatar.cc/150'} 
                          alt={user?.username || 'User'} 
                        />
                        <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/profile/${user?.id || ''}`}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/saved">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Saved Recipes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button className="bg-recipe-primary hover:bg-recipe-primary/90" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-recipe-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSearch} className="mb-4" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search recipes..."
                className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <ul className="py-1">
                  {suggestions.map((suggestion) => (
                    <li 
                      key={suggestion.id}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                      onClick={() => handleSuggestionClick(suggestion.id)}
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          {isAuthenticated ? (
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link to={`/profile/${user?.id || ''}`}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/saved">
                  <Bell className="mr-2 h-4 w-4" />
                  Saved Recipes
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button className="w-full bg-recipe-primary hover:bg-recipe-primary/90" asChild>
                <Link to="/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Recipe
                </Link>
              </Button>
              <Button className="w-full" variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button className="w-full" variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button className="w-full bg-recipe-primary hover:bg-recipe-primary/90" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
