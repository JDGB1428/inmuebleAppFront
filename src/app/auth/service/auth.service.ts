
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);


  authRegister(user:User):Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/api/register`, user, {
      headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
    }).pipe(
      tap((response) => {
        console.log('Registro exitoso:', response);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }
}
