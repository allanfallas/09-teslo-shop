import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  constructor() { }
  private baseUrl = environment.baseUrl;
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private router = inject(Router);
  private http = inject(HttpClient);

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated'
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  isAdmin(){
    return this.user()?.roles.includes('admin');
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`,
      {
        email, password
      }).pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }

  register(fullName: string, email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`,
      {
        fullName,
        email,
        password
      }).pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false)
    }

    return this.http.get<AuthResponse>(`${this.baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // } Ver Interceptors
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  logout(redirect = false) {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
    if(redirect) this.router.navigateByUrl('');
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user);
    this._authStatus.set('authenticated');
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

}
