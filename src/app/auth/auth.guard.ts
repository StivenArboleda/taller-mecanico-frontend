import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  private isAuthenticated(): boolean {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('AuthGuard: token encontrado:', token);
    return !!token;
  }

  canActivate(): boolean | UrlTree {
    if (this.isAuthenticated()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
