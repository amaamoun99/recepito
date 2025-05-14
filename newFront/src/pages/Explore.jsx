import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const Explore = () => {
  const { getAuthHeader } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    return users.filter(user => 
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            ...getAuthHeader()
          }
        });

        console.log('Full API response:', response.data);
        
        if (response.data.status === 'success') {
          // Based on the handlerFactory.js, the users will be in response.data.data.data
          const userData = response.data.data.data || [];
          console.log('User data from API:', userData);
          setUsers(userData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAuthHeader]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Explore Users</h1>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <Card key={user?._id || index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_BASE_URL}${user.profilePicture}`) : null} 
                          alt={user?.username || 'User'} 
                        />
                        <AvatarFallback>{(user?.username || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user?.username || 'Unknown User'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user?.recipes?.length || 0} recipes
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button asChild className="w-full" variant="outline">
                        <Link to={`/profile/${user?._id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredUsers.length === 0 && searchQuery && (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  No users match your search for "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearSearch} 
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground">
              There are no users registered in the system yet.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Explore;
