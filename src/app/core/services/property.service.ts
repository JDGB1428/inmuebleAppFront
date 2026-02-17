import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { PropertyModel } from '../model/property.model';
import { ApiResponse, BackendResponseDto } from '../interfaces/http-reponses.interfaces';
import { PropertyDTO } from '../interfaces/response-dto.interfaces';
import { Property } from '../interfaces/property.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PropertyServices {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);


  getAllProperty():Observable<ApiResponse<Property[]>>{
    return this.http.get<BackendResponseDto<PropertyDTO[]>>(`${this.apiUrl}/api/property`).pipe(
      tap((response) => {
        console.log(response);
      }),
      map((response) => PropertyModel.mapToHttpResponsePropertyToListProperties(response)),
      catchError(() => of( {
        message : 'Error al cargar propiedades',
        data: []
      }))
    )
  }


  createProperty(data:FormData):Observable<ApiResponse<Property>>{
    return this.http.post<BackendResponseDto<PropertyDTO>>(`${this.apiUrl}/api/property`, data).pipe(
      map((response) => {
        return PropertyModel.mapToHttpResponsePropertyToPropertyArray(response)
      }),
      catchError((error) => {
        return throwError(()=> error)
      })
    )
  }
}
