import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import './likeAnimation.css';

const API_BASE_URL = 'http://localhost:2059/api/v1';

const RecipeCard = ({ recipe, likeInfo, onLikeUpdate }) => {
  // Initialize like state from likeInfo if available, otherwise calculate from recipe
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user, isAuthenticated, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!recipe) return;
    
    // If we have likeInfo from parent, use that (more accurate and efficient)
    if (likeInfo) {
      setLiked(likeInfo.isLiked);
      setLikesCount(likeInfo.likesCount);
      return;
    }
    
    // Fallback to calculating from recipe data if likeInfo is not available
    const userId = user?._id || user?.id;
    const recipeId = recipe?._id || recipe?.id;
    if (!recipeId) return;
    
    // Check if user has liked this post
    const likeArray = Array.isArray(recipe.likes) ? recipe.likes : [];
    
    // Debug to check what's in the likes array
    console.debug('Like array for post', recipeId, ':', likeArray);
    console.debug('Current user ID:', userId);
    
    // Check if user ID is in the likes array (comparing as strings to be safe)
    const hasLiked = userId && likeArray.some(likeId => {
      // Convert both IDs to strings for comparison
      const likeIdStr = typeof likeId === 'object' && likeId !== null ? likeId._id || likeId.id || likeId.toString() : likeId?.toString();
      const userIdStr = userId.toString();
      
      return likeIdStr === userIdStr;
    });
    
    console.debug('Has liked:', hasLiked);
    
    setLiked(hasLiked);
    setLikesCount(likeArray.length);
  }, [recipe, user, likeInfo]);

  const handleLike = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please log in to like recipes');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    const recipeId = recipe?._id || recipe?.id;
    if (!recipeId) {
      toast.error('Unable to like recipe');
      return;
    }

    // Optimistic UI update
    const newLikedState = !liked;
    setLiked(newLikedState);
    const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;
    setLikesCount(newLikesCount);
    
    try {
      const response = await axios.patch(`${API_BASE_URL}/posts/${recipeId}/like`, {}, {
        headers: {
          ...getAuthHeader()
        }
      });
      
      if (response.data.status === 'success') {
        // Server response contains the actual updated state
        const { isLiked, likesCount: serverLikesCount } = response.data.data;
        
        // Update UI with server data
        setLiked(isLiked);
        setLikesCount(serverLikesCount);
        
        // Notify parent component about the like update
        if (onLikeUpdate) {
          onLikeUpdate(recipeId, { isLiked, likesCount: serverLikesCount });
        }
        
        // Show subtle toast notification
        toast.success(isLiked ? 'Liked' : 'Unliked', {
          duration: 1500,
          position: 'bottom-right'
        });
      }
    } catch (error) {
      // Revert back to the original state if the request fails
      setLiked(!newLikedState);
      setLikesCount(newLikedState ? likesCount - 1 : likesCount + 1);
      toast.error(error.response?.data?.message || 'Failed to update like');
    }
  }, [recipe, user, isAuthenticated, navigate, liked, likesCount, onLikeUpdate]);

  // Bookmark functionality removed

  if (!recipe) return null;

  const {
    id = '',
    title = 'Untitled Recipe',
    description = 'No description available',
    imageUrl = '/placeholder-food.jpg',
    author = { username: 'Unknown Chef', profilePicture: null },
    tags = [],
    cookingTime = '?',
    servings = '?',
    comments = [],
    createdAt = new Date()
  } = recipe;

  return (
    <Link to={`/recipe/${id}`} className="block">
      <div className="recipe-card group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-60 overflow-hidden">
          <img
            src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:2059${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-food.jpg';
            }}
          />
          {tags.length > 0 && (
            <div className="absolute top-2 right-2 flex gap-1">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge key={`${tag}-${index}`} variant="outline" className="bg-white/80 text-gray-800">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.profilePicture || '/default-avatar.png'} alt={author.username} />
              <AvatarFallback>{(author.username[0] || '?').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{author.username}</p>
              <p className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-1 line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-0 hover:text-recipe-primary ${liked ? 'text-recipe-primary' : 'text-gray-500'}`}
                onClick={handleLike}
                title={liked ? "Unlike" : "Like"}
              >
                <Heart 
                  className={`h-5 w-5 mr-1 heart-icon ${liked ? 'animate-like' : ''}`} 
                  fill={liked ? "currentColor" : "none"} 
                />
                <span className="like-count">{likesCount}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 text-gray-500 hover:text-recipe-primary"
                title="Comments"
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>{Array.isArray(comments) ? comments.length : 0}</span>
              </Button>
            </div>
            
            {/* Bookmark button removed */}
          </div>

          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            {cookingTime && <span>{cookingTime} min</span>}
            {servings && <span>{servings} servings</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
