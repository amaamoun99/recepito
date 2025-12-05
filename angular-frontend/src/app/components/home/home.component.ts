import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface Post {
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
  createdAt: string;
}

interface LikeInfo {
  isLiked: boolean;
  likesCount: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeTab: string = 'forYou';
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchInput: string = '';
  loading: boolean = true;
  error: string | null = null;
  likesMap: { [key: string]: LikeInfo } = {};
  
  // Filter options
  showFilters: boolean = false;
  selectedCuisine: string = '';
  maxCookingTime: number | null = null;
  ingredientSearch: string = '';
  
  // Available cuisines (will be populated from posts)
  availableCuisines: string[] = [];
  
  user$ = this.authService.user$;
  isAuthenticated$ = this.authService.token$.pipe(map(token => !!token));

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['q'] || '';
      this.searchInput = searchQuery;
      this.fetchPosts(searchQuery);
    });
  }

  fetchPosts(searchQuery: string): void {
    this.loading = true;
    this.error = null;

    // Request all posts (set high limit to get all)
    this.apiService.getPosts({ limit: 1000 }).subscribe({
      next: (response: any) => {
        const fetchedPosts = response.data.posts;
        
        // Prepend backend URL to image paths
        const postsWithFullImageUrls = fetchedPosts.map((post: Post) => ({
          ...post,
          imageUrl: post.imageUrl ? `${environment.baseUrl}${post.imageUrl}` : undefined
        }));
        
        this.posts = postsWithFullImageUrls;
        
        // Extract available cuisines
        this.extractAvailableCuisines(postsWithFullImageUrls);
        
        // Apply filters
        this.applyFilters();
        
        // Fetch likes status if authenticated
        this.isAuthenticated$.subscribe(isAuth => {
          if (isAuth && postsWithFullImageUrls.length > 0) {
            this.fetchLikesStatus(postsWithFullImageUrls);
          } else {
            this.setupLikesMap(postsWithFullImageUrls);
          }
        });
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching posts:', err);
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  private extractAvailableCuisines(posts: Post[]): void {
    const cuisineSet = new Set<string>();
    posts.forEach(post => {
      if (post.cuisine) {
        cuisineSet.add(post.cuisine);
      }
    });
    this.availableCuisines = Array.from(cuisineSet).sort();
  }

  applyFilters(): void {
    let filtered = [...this.posts];

    // First apply search query (this is separate from other filters)
    if (this.searchInput && this.searchInput.trim()) {
      const query = this.searchInput.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
    }

    // Check if any filters are active
    const hasActiveFilters = this.selectedCuisine || 
                            (this.maxCookingTime !== null && this.maxCookingTime > 0) || 
                            (this.ingredientSearch && this.ingredientSearch.trim());

    // Apply OR logic for cuisine, time, and ingredient filters
    if (hasActiveFilters) {
      filtered = filtered.filter(post => {
        let matchesAnyFilter = false;

        // Check cuisine filter
        if (this.selectedCuisine && post.cuisine === this.selectedCuisine) {
          matchesAnyFilter = true;
        }

        // Check max prep time filter
        if (this.maxCookingTime !== null && this.maxCookingTime > 0 && post.cookingTime <= this.maxCookingTime) {
          matchesAnyFilter = true;
        }

        // Check ingredient filter
        if (this.ingredientSearch && this.ingredientSearch.trim()) {
          const ingredientQuery = this.ingredientSearch.toLowerCase();
          if (post.ingredients.some(ing => ing.name?.toLowerCase().includes(ingredientQuery))) {
            matchesAnyFilter = true;
          }
        }

        return matchesAnyFilter;
      });
    }

    this.filteredPosts = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCuisine = '';
    this.maxCookingTime = null;
    this.ingredientSearch = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  private setupLikesMap(postsArray: Post[]): void {
    const likesMap: { [key: string]: LikeInfo } = {};
    postsArray.forEach(post => {
      likesMap[post._id] = {
        isLiked: false,
        likesCount: post.likes.length
      };
    });
    this.likesMap = likesMap;
  }

  private fetchLikesStatus(postsArray: Post[]): void {
    const user = this.authService.currentUser;
    const fallbackLikesMap: { [key: string]: LikeInfo } = {};
    
    postsArray.forEach(post => {
      const userId = user?._id || user?.id;
      fallbackLikesMap[post._id] = {
        isLiked: userId ? post.likes.some(id => id.toString() === userId.toString()) : false,
        likesCount: post.likes.length
      };
    });

    // Fetch likes for first batch
    const BATCH_SIZE = 5;
    const firstBatch = postsArray.slice(0, BATCH_SIZE);
    const postIds = firstBatch.map(post => post._id);

    if (postIds.length > 0) {
      this.apiService.checkLikes(postIds).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.likesMap = { ...fallbackLikesMap, ...response.data.likes };
          } else {
            this.likesMap = fallbackLikesMap;
          }
        },
        error: () => {
          this.likesMap = fallbackLikesMap;
        }
      });
    } else {
      this.likesMap = fallbackLikesMap;
    }
  }

  onSearchSubmit(): void {
    if (this.searchInput.trim()) {
      this.router.navigate(['/'], { queryParams: { q: this.searchInput.trim() } });
    } else {
      this.router.navigate(['/']);
    }
  }

  clearSearch(): void {
    this.searchInput = '';
    this.router.navigate(['/']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getSortedPosts(): Post[] {
    if (this.activeTab === 'trending') {
      return [...this.filteredPosts].sort((a, b) => {
        const aLikes = this.likesMap[a._id]?.likesCount || a.likes.length;
        const bLikes = this.likesMap[b._id]?.likesCount || b.likes.length;
        return bLikes - aLikes;
      });
    }
    return this.filteredPosts;
  }

  onLikeUpdate(postId: string, newLikeInfo: LikeInfo): void {
    this.likesMap[postId] = newLikeInfo;
  }
}