import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/storage-keys';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private readonly http = inject(HttpClient);

  login(body: LoginRequest): Observable<AuthResponse> {
    // Mock login for demo purposes
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      email: body.email,
      role: 'PATIENT',
      firstName: 'Usuario',
      lastName: 'Demo'
    };
    return of(mockResponse).pipe(
      delay(1000), // Simulate network delay
      tap((res) => this.persistAuth(res))
    );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    // Mock register for demo purposes
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      email: body.email,
      role: 'PATIENT',
      firstName: body.name?.split(' ')[0] || 'Usuario',
      lastName: body.name?.split(' ').slice(1).join(' ') || 'Demo'
    };
    return of(mockResponse).pipe(
      delay(1000), // Simulate network delay
      tap((res) => this.persistAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getCurrentUser(): AuthResponse | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }

  private persistAuth(response: AuthResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response));
  }
}
