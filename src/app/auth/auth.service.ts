import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private tokenTimer: any;
  private userId: string;
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post(BACKEND_URL + '/signup', authData)
      .subscribe(
        res => this.router.navigate(['/login']),
        error => this.authStatusListener.next(false)
        );
  }

  login(email: string, password: string) {
    const authData = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + '/login', authData)
      .subscribe(res => {
        if (res.token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.token = res.token;
          this.authStatusListener.next(true);
          this.userId = res.userId;
          const now = new Date();
          const expDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      error => this.authStatusListener.next(false));
    }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }

  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.userId = null;
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expDate) {
      return;
    } else {
      return {
        token,
        expirationDate: new Date(expDate),
        userId
      };
    }
  }
}
