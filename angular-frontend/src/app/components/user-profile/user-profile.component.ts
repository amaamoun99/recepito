import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
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
  createdAt: string;
}

interface Profile {
  _id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  recipes?: Recipe[];
  savedRecipes?: Recipe[];
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profile: Profile | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  isCurrentUser: boolean = false;
  activeTab: string = 'recipes';
  currentUser: any = null;
  isFollowing: boolean = false;
  followersCount: number = 0;
  followingCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.currentUser = user;
      if (user) {
        this.fetchProfile();
      } else {
        alert('You must be logged in to view profiles');
        this.router.navigate(['/login']);
      }
    });
  }

  // Helper function to add full image URLs
  private addFullImageUrls(recipes: Recipe[]): Recipe[] {
    if (!recipes || !Array.isArray(recipes)) return [];
    return recipes.map(recipe => ({
      ...recipe,
      imageUrl: recipe.imageUrl ? `${environment.baseUrl}${recipe.imageUrl}` : undefined
    }));
  }

  fetchProfile(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const userId = id || this.currentUser?._id || this.currentUser?.id;

    if (!userId) {
      this.error = 'User ID not found';
      this.isLoading = false;
      return;
    }

    this.isCurrentUser = userId === (this.currentUser?._id || this.currentUser?.id);
    this.isLoading = true;
    this.error = null;

    forkJoin([
      this.apiService.getUser(userId).pipe(
        catchError((err: any) => {
          console.error('Error fetching user:', err);
          return of({ status: 'error', data: {} });
        })
      ),
      this.apiService.getUserRecipes(userId).pipe(
        catchError((err: any) => {
          console.error('Error fetching recipes:', err);
          return of({ status: 'error', data: { recipes: [], savedRecipes: [] } });
        })
      )
    ]).subscribe({
      next: ([userResponse, recipesResponse]: any[]) => {
        const userData = userResponse.data?.user || userResponse.data?.data;
        const recipesData = recipesResponse.data || { recipes: [], savedRecipes: [] };

        if (!userData) {
          this.error = 'User data not found';
          this.isLoading = false;
          return;
        }

        // FIXED: Use savedRecipes from the API response
        this.profile = {
          ...userData,
          recipes: this.addFullImageUrls(recipesData.recipes || []),
          savedRecipes: this.addFullImageUrls(recipesData.savedRecipes || [])
        };

        console.log('Profile with saved recipes:', this.profile); // Debug log

        // Check if current user is following this profile
        if (this.currentUser && this.profile) {
          this.isFollowing = userData.followers?.some((f: any) => 
            (f._id || f) === (this.currentUser._id || this.currentUser.id)
          ) || false;
          this.followersCount = userData.followers?.length || 0;
          this.followingCount = userData.following?.length || 0;
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.message || 'Failed to load profile';
        console.error('Error fetching profile:', err);
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }


  createRecipe(): void {
    this.router.navigate(['/create']);
  }

  browseRecipes(): void {
    this.router.navigate(['/']);
  }

  toggleFollow(): void {
    if (!this.currentUser) {
      this.router.navigate(['/']);
      return;
    }

    if (!this.profile) return;

    const profileId = this.profile._id;
    this.apiService.followUser(profileId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.isFollowing = !this.isFollowing;
          if (this.isFollowing) {
            this.followersCount++;
          } else {
            this.followersCount = Math.max(0, this.followersCount - 1);
          }
        }
      },
      error: (err: any) => {
        console.error('Error toggling follow:', err);
        alert('Failed to update follow status');
      }
    });
  }
}