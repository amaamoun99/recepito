
import { useEffect } from  "react";
import { useNavigate } from  "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 rounded-lg shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-4">RecipeShare</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
