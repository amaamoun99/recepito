
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import RecipeDetailHeader from "@/components/Recipe/RecipeDetailHeader";
import RecipeIngredientsList from "@/components/Recipe/RecipeIngredientsList";
import RecipeInstructions from "@/components/Recipe/RecipeInstructions";
import RecipeComments from "@/components/Recipe/RecipeComments";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getAuthHeader } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts/${id}`, {
          headers: {
            ...getAuthHeader()
          }
        });
        
        setRecipe(response.data.data.post);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err.message);
        if (err.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, getAuthHeader, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <RecipeDetailHeader 
          recipe={recipe}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <RecipeInstructions 
              instructions={recipe.instructions}
            />
          </div>
          <div className="md:col-span-1">
            <RecipeIngredientsList 
              ingredients={recipe.ingredients}
              recipe={recipe}
            />
          </div>
        </div>
        <RecipeComments 
          comments={recipe.comments}
          recipeId={recipe._id}
        />
      </div>
    </MainLayout>
  );
};

export default RecipeDetail;
