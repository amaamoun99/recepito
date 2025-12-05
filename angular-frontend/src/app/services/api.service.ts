import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Posts
  getPosts(params: { page?: number; limit?: number } = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit);
    }

    return this.http.get(`${this.baseUrl}/posts`, {
      headers: this.buildHeaders(),
      params: httpParams
    });
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${id}`, {
      headers: this.buildHeaders()
    });
  }

  createPost(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts`, formData, {
      headers: this.buildHeaders()
    });
  }

  checkLikes(postIds: string[]): Observable<any> {
    if (!postIds || postIds.length === 0) {
      return of({ status: 'success', data: { likes: {} } });
    }

    const params = new HttpParams().set('posts', postIds.join(','));
    return this.http.get(`${this.baseUrl}/posts/check-likes`, {
      headers: this.buildHeaders(),
      params
    });
  }

  // Users
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, {
      headers: this.buildHeaders(false)
    });
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`, {
      headers: this.buildHeaders()
    });
  }

  getUserRecipes(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/recipes`, {
      headers: this.buildHeaders()
    });
  }

  followUser(userId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${userId}/follow`, {}, {
      headers: this.buildHeaders()
    });
  }

  // Like/Unlike
  toggleLike(postId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/posts/${postId}/like`, {}, {
      headers: this.buildHeaders()
    });
  }

  // Comments
  getComments(postId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${postId}/comments`, {
      headers: this.buildHeaders()
    });
  }

  createComment(postId: string, content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/comments`, { content }, {
      headers: this.buildHeaders()
    });
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/comments/${commentId}`, {
      headers: this.buildHeaders()
    });
  }

  // Save Recipe
  saveRecipe(postId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/posts/${postId}/save`, {}, {
      headers: this.buildHeaders()
    });
  }

  // Rate Recipe
  rateRecipe(postId: string, rating: number, review?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/rate`, { rating, review }, {
      headers: this.buildHeaders()
    });
  }

  // Meal Planning
  createOrUpdateMealPlan(weekStartDate: string, meals: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/meal-plans`, { weekStartDate, meals }, {
      headers: this.buildHeaders()
    });
  }

  getMealPlan(weekStartDate?: string): Observable<any> {
    let params = new HttpParams();
    if (weekStartDate) {
      params = params.set('weekStartDate', weekStartDate);
    }

    return this.http.get(`${this.baseUrl}/meal-plans`, {
      headers: this.buildHeaders(),
      params
    });
  }

  generateShoppingList(weekStartDate: string): Observable<any> {
    const params = new HttpParams().set('weekStartDate', weekStartDate);
    return this.http.get(`${this.baseUrl}/meal-plans/shopping-list`, {
      headers: this.buildHeaders(),
      params
    });
  }

  private buildHeaders(includeAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders();
    if (!includeAuth) {
      return headers;
    }

    const token = this.authService.currentToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
