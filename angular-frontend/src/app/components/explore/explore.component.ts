import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  recipes?: any[];
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';
  currentUser: any = null;
  followingMap: { [key: string]: boolean } = {};

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getUsers().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.users = response.data?.data || response.data?.users || [];
        } else {
          this.users = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users. Please try again later.';
        this.users = [];
        this.loading = false;
      }
    });
  }

  get filteredUsers(): User[] {
    if (!this.searchQuery.trim()) {
      return this.users;
    }
    return this.users.filter(user => 
      user?.username?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  viewProfile(userId: string): void {
    this.router.navigate(['/profile', userId]);
  }

  toggleFollow(userId: string, event: Event): void {
    event.stopPropagation();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.followUser(userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.followingMap[userId] = !this.followingMap[userId];
        }
      },
      error: (err: any) => {
        console.error('Error toggling follow:', err);
      }
    });
  }

  isFollowing(userId: string): boolean {
    return this.followingMap[userId] || false;
  }
}

