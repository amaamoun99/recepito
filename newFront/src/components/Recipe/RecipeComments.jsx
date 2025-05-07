import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:2059/api/v1";

const RecipeComments = ({ recipeId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { user, getAuthHeader } = useAuth();

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts/${recipeId}/comments`, {
          headers: {
            ...getAuthHeader()
          }
        });

        if (response.data.status === 'success') {
          setComments(response.data.data.comments);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchComments();
    }
  }, [recipeId, getAuthHeader]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (comment.trim()) {
      try {
        setSubmitting(true);
        
        const response = await axios.post(`${API_URL}/posts/${recipeId}/comments`, 
          { content: comment.trim() },
          { headers: { ...getAuthHeader() } }
        );

        if (response.data.status === 'success') {
          // Add the new comment to the comments array
          const newComment = response.data.data.comment;
          setComments(prevComments => [newComment, ...prevComments]);
          
          toast({
            title: "Comment posted",
            description: "Your comment has been added to the recipe",
          });
          
          setComment("");
        }
      } catch (err) {
        console.error('Error posting comment:', err);
        toast({
          title: "Error",
          description: "Failed to post your comment. Please try again.",
          variant: "destructive"
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Comments ({comments.length})</h2>
      
      {/* Add comment form */}
      <div className="bg-background p-6 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSubmitComment}>
          <div className="flex gap-3 mb-4">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback>{user?.username ? user.username[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              disabled={submitting}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!comment.trim() || submitting}
              className="bg-recipe-primary hover:bg-recipe-primary/90"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 bg-background rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recipe-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading comments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-background rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage 
                    src={comment.author?.profilePicture} 
                    alt={comment.author?.username || 'User'} 
                  />
                  <AvatarFallback>
                    {comment.author?.username ? comment.author.username[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="font-medium">{comment.author?.username || 'Anonymous'}</p>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-background rounded-lg shadow-sm">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default RecipeComments;
