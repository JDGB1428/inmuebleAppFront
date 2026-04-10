import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpResponseProperty, HttpResponseRoleRequest } from '@interfaces/http-reponses.interfaces';
import { RoleRequest } from '@interfaces/response_api.interfaces';
import { CreateRoleRequestDTO, RoleRequestDTO } from '@interfaces/response-dto.interfaces';
import { RoleRequestMapper } from '../model/role_request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestServices {
  private readonly apiUrl = environment.LaravelAPI;
  private readonly http = inject(HttpClient);

  getAllRequest(): Observable<HttpResponseProperty<RoleRequest[]>> {
    return this.http.get<HttpResponseProperty<RoleRequestDTO[]>>(`${this.apiUrl}/api/role_requests`).pipe(
      map((data)=> RoleRequestMapper.fromApiList(data)),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }


  createRequest(payload:CreateRoleRequestDTO): Observable<CreateRoleRequestDTO> {
    return this.http.post<CreateRoleRequestDTO>(`${this.apiUrl}/api/role_request`,payload).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  getRoleRequestById():Observable<HttpResponseProperty<RoleRequest>> {
    return this.http.get<HttpResponseProperty<RoleRequestDTO>>(`${this.apiUrl}/api/role_requestById`).pipe(
      map((data)=> RoleRequestMapper.mapToApi(data)),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  roleAproveRequest(id:RoleRequest['id']): Observable<HttpResponseRoleRequest>{
    return this.http.post<HttpResponseRoleRequest>(`${this.apiUrl}/api/role_request/${id}/approve`,{})
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  roleRejectRequest(id:RoleRequest['id']): Observable<HttpResponseRoleRequest>{
    return this.http.post<HttpResponseRoleRequest>(`${this.apiUrl}/api/role_request/${id}/reject`,{})
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

}
