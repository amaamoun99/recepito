import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  user$ = this.authService.user$;
  isAuthenticated$ = this.authService.token$.pipe(map(token => !!token));
  searchTerm: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  handleSearch(event: Event): void {
    event.preventDefault();
    if (this.searchTerm.trim()) {
      this.router.navigate(['/'], { queryParams: { q: this.searchTerm.trim() } });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

