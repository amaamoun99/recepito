import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Utensils } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * A simplified recipe card component specifically for profile pages
 * Doesn't include like functionality to avoid errors
 */
const ProfileRecipeCard = ({ recipe }) => {
  // Format date
  const formattedDate = recipe.createdAt 
    ? formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })
    : "some time ago";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <Link to={`/recipe/${recipe.id}`}>
          <img
            src={`http://localhost:2059${recipe.imageUrl}` || "/placeholder-food.jpg"}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      </div>

      <CardContent className="p-4">
        <Link to={`/recipe/${recipe.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {recipe.cookingTime} min
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Utensils className="mr-1 h-4 w-4" />
            {recipe.servings} servings
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage 
              src={recipe.author?.profilePicture || null} 
              alt={recipe.author?.username || "User"} 
            />
            <AvatarFallback>
              {recipe.author?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {recipe.author?.username || "Unknown"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </CardFooter>
    </Card>
  );
};

export default ProfileRecipeCard;
