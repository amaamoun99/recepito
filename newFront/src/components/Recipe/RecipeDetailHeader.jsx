// Recipe type is now just used as a JSX prop type, no need to import it
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Bookmark, Share2, Clock, Users } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";



const RecipeDetailHeader = ({ recipe }) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(recipe?.likes || 0);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <div className="space-y-6">
      {/* Recipe title and author info */}
      <h1 className="text-3xl font-bold">{recipe?.title || "Recipe"}</h1>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={recipe?.author?.profilePicture || '/default-avatar.png'} />
            <AvatarFallback>
              {(recipe?.author?.username || 'U')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{recipe?.author?.username || "Unknown Author"}</p>
            <p className="text-sm text-muted-foreground">
              {recipe?.createdAt ? formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true }) : "Just now"}
            </p>
          </div>
        </div>
      </div>

      {/* Recipe image */}
      <div className="aspect-video overflow-hidden rounded-lg">
        <img 
          src={`http://localhost:2059${recipe?.imageUrl}` || "/placeholder-food.jpg"} 
          alt={recipe?.title || "Recipe"} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Recipe stats and actions */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Prep: {recipe.prepTime} min
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Cook: {recipe.cookTime} min
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Serves: {recipe.servings}
          </div>
        </div>

        <div className="flex gap-2">
         
          
          {/* <Button 
            variant="outline"
            size="sm"
            className={saved ? "text-recipe-primary border-recipe-primary" : ""}
            onClick={handleSave}
          >
            <Bookmark className={saved ? "fill-current" : ""} />
            Save
          </Button> */}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({
                title: "Link copied!",
                description: "Recipe link has been copied to clipboard",
              });
            }}
          >
            <Share2 className="mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Recipe tags */}
      <div className="flex flex-wrap gap-2">
        {(recipe?.tags || []).map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Recipe description */}
      <p className="text-muted-foreground">{recipe?.description || "No description available"}</p>
    </div>
  );
};

export default RecipeDetailHeader;
