import { Toaster as UIToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RecipeDetail from "./pages/RecipeDetail";
import CreateRecipe from "./pages/CreateRecipe";
import UserProfile from "./pages/UserProfile";
import SavedRecipes from "./pages/SavedRecipes";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";
import Explore from "./pages/Explore";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UIToaster />
        <SonnerToaster />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// ✅ PrivateRoute must be inside AuthProvider
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recipe-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Extracted AppRoutes so it's inside AuthProvider
const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/recipe/:id"
      element={
        <PrivateRoute>
          <RecipeDetail />
        </PrivateRoute>
      }
    />
    <Route
      path="/create"
      element={
        <PrivateRoute>
          <CreateRecipe />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile/:id?"
      element={
        <PrivateRoute>
          <UserProfile />
        </PrivateRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      }
    />
    <Route
      path="/search"
      element={
        <PrivateRoute>
          <SearchResults />
        </PrivateRoute>
      }
    />
    <Route
      path="/saved"
      element={
        <PrivateRoute>
          <SavedRecipes />
        </PrivateRoute>
      }
    />
    <Route
      path="/explore"
      element={
        <PrivateRoute>
          <Explore />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
