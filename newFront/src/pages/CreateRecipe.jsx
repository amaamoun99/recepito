
import { useState } from  "react";
import { useNavigate } from  "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from  "@/components/ui/button";
import { Input } from  "@/components/ui/input";
import { Label } from  "@/components/ui/label";
import { Textarea } from  "@/components/ui/textarea";
import { useToast } from  "@/components/ui/use-toast";
import { X, Plus, Trash2, UploadCloud, Loader2, Upload } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";


const API_URL = "http://localhost:2059/api/v1";

const CreateRecipe = () => {
  const { user, getAuthHeader } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file (JPG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!title || !description || ingredients.some(i => !i.name || !i.amount) || 
          instructions.some(i => !i) || !prepTime || !servings || tags.length === 0 || !image) {
        throw new Error("Please fill out all required fields");
      }

      // Create form data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("cuisine", "International"); // Default cuisine
      formData.append("difficulty", "Medium"); // Default difficulty
      formData.append("servings", servings);
      formData.append("cookingTime", parseInt(prepTime) + parseInt(cookTime));
      formData.append("prepTime", prepTime);
      formData.append("diet", "Regular"); // Default diet
      formData.append("image", image);

      // Add ingredients
      ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}][name]`, ingredient.name);
        formData.append(`ingredients[${index}][quantity]`, ingredient.amount);
      });

      // Add instructions
      instructions.forEach((instruction, index) => {
        formData.append(`instructions[${index}]`, instruction);
      });

      // Add tags
      formData.append("tags", JSON.stringify(tags));

      // Make API call
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader() // Use the getAuthHeader utility from AuthContext
        }
      });

      toast({
        title: "Recipe created!",
        description: "Your recipe has been published successfully.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create recipe",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Recipe</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Homemade Chocolate Chip Cookies"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your recipe..."
                  className="resize-none h-24"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time (mins)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cookTime">Cook Time (mins)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-recipe-accent/20 text-recipe-primary px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-recipe-primary hover:text-recipe-primary/80"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter (e.g., dessert, vegan, quick)"
                />
              </div>
            </div>
          </div>
          
          {/* Ingredients Section */}
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            
            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      placeholder="Amount (e.g., 1 cup)"
                      required
                    />
                  </div>
                  <div className="flex-[2]">
                    <Input
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddIngredient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
          </div>
          
          {/* Instructions Section */}
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-recipe-primary text-white flex items-center justify-center font-semibold mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInstruction(index)}
                    disabled={instructions.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddInstruction}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recipe Image</h2>
            
            <div>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Recipe preview" 
                    className="w-full h-64 object-cover rounded-lg" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF (max. 5MB)
                  </p>
                  <label htmlFor="image" className="block mt-4">
                    <span className="bg-recipe-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-recipe-primary/90 transition-colors">
                      Select Image
                    </span>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-recipe-primary hover:bg-recipe-primary/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateRecipe;
