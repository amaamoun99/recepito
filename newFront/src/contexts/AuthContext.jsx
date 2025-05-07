import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext(null);

// API base URL
const API_URL = "http://localhost:2059/api/v1";

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");

      if (storedToken && isTokenValid(storedToken)) {
        try {
          const response = await axios.get(
            `${API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            }
          );

          // Add debug logging
          console.debug(" User response:", response);

          if (response.data.status === "success" && response.data.data?.user) {
            setUser(response.data.data.user);
            setToken(storedToken);
          }
        } catch (err) {
          console.error("Failed to initialize auth:", {
            status: err.response?.status,
            message: err.response?.data?.message,
            error: err,
          });
          localStorage.removeItem("token");
          setToken(null);
        }
      } else if (storedToken) {
        // Token exists but is invalid
        localStorage.removeItem("token");
        setToken(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login method
  const login = async ({ email, password }) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.data.status === "success" && response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        setToken(newToken);

        const userResponse = await axios.get(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          }
        );
        
        if (
          userResponse.data.status === "success" &&
          userResponse.data.data?.user
        ) {
          setUser(userResponse.data.data.user);
          return { success: true };
        }
      }

      return { success: false, error: "Login failed. Please try again." };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register method
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/auth/signup`,
        userData
      );
      
      if (response.data.status === "success") {
        const newToken = response.data.token;
        const user = response.data.data?.user;

        localStorage.setItem("token", newToken);
        setToken(newToken);
      setUser(user);

      return { success: true };
      }
      
      return { success: false, error: "Registration failed" };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Get auth header - utility function for components to use
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    getAuthHeader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
