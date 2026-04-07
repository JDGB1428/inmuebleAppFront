import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { AuthUser, AuthUserApiResponse, ProfileGroups } from '../interfaces/response_api.interfaces';
import { ApiResponse, ProfileGroupsResponse } from '../interfaces/response-dto.interfaces';
import { ProfileMapper } from '../model/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient)
  private baseUrl = environment.LaravelAPI;


  getProfiles(): Observable<ProfileGroups> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/api/profiles`).pipe(
      map(response => {
        const payload: ProfileGroupsResponse = 'data' in response
          ? response.data
          : response;
        return ProfileMapper.mapToProfileGroups(payload);
      }),

    );
  }

  getProfileById(id:number): Observable<AuthUser> {
    return this.http.get<AuthUserApiResponse>(`${this.baseUrl}/api/profile/${id}`).pipe(
      map(response => ProfileMapper.mapToAuthUser(response.data))
    );
  }


  createOrUpdate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/profile`, data)
  }

}
