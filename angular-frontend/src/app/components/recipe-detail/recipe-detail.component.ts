import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: any[];
  instructions: any[];
  cookingTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  imageUrl?: string;
  comments: any[];
  likes: string[];
  ratings?: Array<{
    user: any;
    rating: number;
    review?: string;
    createdAt: string;
  }>;
  averageRating?: number;
  createdAt: string;
}

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  loading: boolean = true;
  error: string | null = null;
  isLiked: boolean = false;
  isSaved: boolean = false;
  currentUser: any = null;
  comments: any[] = [];
  newComment: string = '';
  userRating: number = 0;
  userReview: string = '';
  showRatingForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRecipe(id);
      this.fetchComments(id);
    }
  }

  fetchRecipe(id: string): void {
    this.loading = true;
    this.error = null;

    this.apiService.getPost(id).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data?.post) {
          
          const post = response.data.post;
          this.recipe = {
            ...post,
            imageUrl: post.imageUrl ? `${environment.baseUrl}${post.imageUrl}` : undefined
          };
          this.checkLikeStatus();
          this.checkSaveStatus();
          this.loadUserRating();
        } else {
          this.error = 'Recipe not found';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching recipe:', err);
        this.error = err.message || 'Failed to load recipe';
        if (err.status === 404) {
          this.router.navigate(['/404']);
        }
        this.loading = false;
      }
    });
  }

  checkLikeStatus(): void {
    if (this.recipe && this.currentUser) {
      this.isLiked = this.recipe.likes?.some((like: any) => 
        (typeof like === 'string' ? like : like._id || like) === this.currentUser._id
      ) || false;
    }
  }

  checkSaveStatus(): void {
    // This would need to be fetched from user profile
    // For now, we'll assume false
    this.isSaved = false;
  }

  loadUserRating(): void {
    if (this.recipe?.ratings && this.currentUser) {
      const userRating = this.recipe.ratings.find((r: any) => 
        (r.user?._id || r.user) === this.currentUser._id
      );
      if (userRating) {
        this.userRating = userRating.rating;
        this.userReview = userRating.review || '';
      }
    }
  }

  toggleLike(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.recipe) {
      this.apiService.toggleLike(this.recipe._id).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.isLiked = response.data.isLiked;
            if (this.recipe) {
              this.recipe.likes = response.data.post.likes || [];
            }
          }
        },
        error: (err: any) => {
          console.error('Error toggling like:', err);
        }
      });
    }
  }

  toggleSave(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.recipe) {
      this.apiService.saveRecipe(this.recipe._id).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.isSaved = response.data.isSaved;
          }
        },
        error: (err: any) => {
          console.error('Error saving recipe:', err);
        }
      });
    }
  }

  fetchComments(postId: string): void {
    this.apiService.getComments(postId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.comments = response.data.comments || [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching comments:', err);
      }
    });
  }

  addComment(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.newComment.trim() || !this.recipe) {
      return;
    }

    this.apiService.createComment(this.recipe._id, this.newComment).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.comments.push(response.data.comment);
          this.newComment = '';
          if (this.recipe) {
            this.recipe.comments = this.recipe.comments || [];
            this.recipe.comments.push(response.data.comment._id);
          }
        }
      },
      error: (err: any) => {
        console.error('Error adding comment:', err);
      }
    });
  }

  submitRating(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.userRating || !this.recipe) {
      return;
    }

    this.apiService.rateRecipe(this.recipe._id, this.userRating, this.userReview).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          if (this.recipe) {
            this.recipe.averageRating = response.data.averageRating;
            this.recipe.ratings = response.data.post.ratings || [];
          }
          this.showRatingForm = false;
          alert('Rating submitted successfully!');
        }
      },
      error: (err: any) => {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating');
      }
    });
  }

  getAverageRating(): number {
    if (this.recipe?.averageRating) {
      return this.recipe.averageRating;
    }
    if (this.recipe?.ratings && this.recipe.ratings.length > 0) {
      const sum = this.recipe.ratings.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
      return Math.round((sum / this.recipe.ratings.length) * 10) / 10;
    }
    return 0;
  }
}

