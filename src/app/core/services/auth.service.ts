
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
      tap((response) => {
        if (response.token) localStorage.setItem('token', response.token);
        if (response.user.roles[0]) localStorage.setItem('role', String(response.user.roles[0]))
      }),
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
      tap((response) => {
        if(response.user.roles[0]) localStorage.setItem('role', String(response.user.roles[0]))
      }),
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
        localStorage.removeItem('role');
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
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
