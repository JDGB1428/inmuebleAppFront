import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { PropertyModel } from '../model/property.model';
import { PropertyDTO } from '../interfaces/response-dto.interfaces';
import { Property } from '../interfaces/property.interfaces';
import { HttpResponseProperty } from '../interfaces/http-reponses.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PropertyServices {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);


  getAllProperty(): Observable<HttpResponseProperty<Property[]>> {
    return this.http.get<HttpResponseProperty<PropertyDTO[]>>(`${this.apiUrl}/api/property`).pipe(
      map((response) => PropertyModel.mapToHttpResponsePropertyToListProperties(response)),
      catchError(() => of({
        message: 'Error al cargar propiedades',
        data: []
      }))
    )
  }


  createProperty(data: FormData): Observable<HttpResponseProperty<Property>> {
    return this.http.post<HttpResponseProperty<PropertyDTO>>(`${this.apiUrl}/api/property`, data).pipe(
      map((response) => {
        return PropertyModel.mapToHttpResponsePropertyToPropertyArray(response)
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  showProperty(data: number): Observable<HttpResponseProperty<Property>> {
    return this.http.get<HttpResponseProperty<PropertyDTO>>(`${this.apiUrl}/api/property/${data}`).pipe(
      map((response) => {
        return PropertyModel.mapToHttpResponsePropertyToPropertyArray(response);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  updateProperty(id: number, data: FormData) {
    return this.http.post<HttpResponseProperty<any>>(`${this.apiUrl}/api/property/${id}`, data).pipe(
      map((response) => {
        return PropertyModel.mapToHttpResponsePropertyToPropertyArray(response);
      }),
      catchError((error) => {
        return throwError (() => error);
      })
    )
  }

  deleteProperty(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/api/property/${id}`);
  }

  // 2. Método para Traer SOLO las propiedades eliminadas (Papelera)
  getTrashedProperties(): Observable<HttpResponseProperty<Property[]>> {
    return this.http.get<HttpResponseProperty<PropertyDTO[]>>(`${this.apiUrl}/api/property/trashed`).pipe(
      map(response => PropertyModel.mapToHttpResponsePropertyToListProperties(response)),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  restoreProperty(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/api/property/${id}/restore`, {});
  }

  toggleLike(id: number) {
    return this.http.post<{ message: string, is_liked: boolean }>(`${this.apiUrl}/api/property/${id}/like`, {property_id : id});
  }

  loadUserLikes() {
    return this.http.get<{ data: number[] }>(`${this.apiUrl}/api/user/likes`);
  }
}
