
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthModel } from '../model/auth.model';
import { UserAdapater } from '../interfaces/user.interfaces';
import { HttpResponseLaravelAPi } from '../interfaces/response_api.interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);
  private routes = inject(Router);

  authLogin(user: UserAdapater): Observable<UserAdapater> {
    return this.http.post<HttpResponseLaravelAPi>(`${this.apiUrl}/api/login`, user, {
      withCredentials: true,
    }).pipe(
      map((responseAPi) => AuthModel.mapHttpResponseLaravelApi(responseAPi)),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }


  authRegister(user: UserAdapater): Observable<UserAdapater> {
    return this.http.post<HttpResponseLaravelAPi>(`${this.apiUrl}/api/register`, user, {
      withCredentials: true,
    }).pipe(
      map((responseAPi) => AuthModel.mapHttpResponseLaravelApi(responseAPi)),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  authLogout() {
    return this.http.post(`${this.apiUrl}/api/logout`, null, {}).pipe(
      finalize(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('roles');
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  saveSession(token:string, user:UserAdapater, remember_token:boolean, roles:string){
    if(remember_token){
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('roles', roles);
    }else{
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('roles', roles);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  redirectByRole(roles:string[]){
    if(roles.includes('admin')){
      this.routes.navigate(['/admin/dashboard/home']);
    }

    if(roles.includes('agent')){
      this.routes.navigate(['/agent/dashboard/home'])
    }

    if(roles.includes('client')){
      this.routes.navigate(['/private/home'])
    }
  }
}
