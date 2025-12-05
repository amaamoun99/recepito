import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_STORAGE_KEY = 'recipito_token';
  private readonly USER_STORAGE_KEY = 'recipito_user';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = localStorage.getItem(this.TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);

    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        this.userSubject.next(parsedUser);
      } catch {
        localStorage.removeItem(this.USER_STORAGE_KEY);
      }
    } else if (storedToken) {
      this.refreshUserData().pipe(take(1)).subscribe();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: any) => this.handleAuthSuccess(response))
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signup`, userData).pipe(
      tap((response: any) => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    const headers = this.getAuthHeader();
    this.http.get(`${environment.apiUrl}/auth/logout`, { headers }).pipe(take(1)).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
    this.router.navigate(['/login']);
  }

  getAuthHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.tokenSubject.value;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  refreshUserData(): Observable<any> {
    if (!this.tokenSubject.value) {
      return of(null);
    }

    return this.http.get(`${environment.apiUrl}/auth/me`, { headers: this.getAuthHeader() }).pipe(
      map((response: any) => response.data?.user || null),
      tap((user: any) => {
        if (user) {
          const normalizedUser = this.normalizeUser(user);
          this.persistSession(this.tokenSubject.value as string, normalizedUser);
        }
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  get currentToken(): string | null {
    return this.tokenSubject.value;
  }

  private handleAuthSuccess(response: any): void {
    if (response?.token && response?.data?.user) {
      const normalizedUser = this.normalizeUser(response.data.user);
      this.persistSession(response.token, normalizedUser);
    }
  }

  private normalizeUser(user: any): User {
    const id = user._id || user.id;
    return {
      ...user,
      id,
      _id: id
    };
  }

  private persistSession(token: string, user: User): void {
    this.tokenSubject.next(token);
    this.userSubject.next(user);

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  private clearSession(): void {
    this.tokenSubject.next(null);
    this.userSubject.next(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }
}
