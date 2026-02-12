import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertyServices {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);


  createProperty(data:FormData){
    return this.http.post(`${this.apiUrl}/api/property`, data).pipe(
      tap((response)=>{
        console.log(response)
      }),
      catchError((error) => {
        return throwError(()=> error)
      })
    )
  }
}
