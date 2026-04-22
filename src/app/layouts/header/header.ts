import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = false;
  menuOpen = false;

  constructor() {
    // Check if user is logged in using AuthService
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  navigateToSection(section: string): void {
    void this.router.navigate(['/dashboard'], { fragment: section }).then(() => {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
