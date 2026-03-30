import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commentary } from '../interfaces/response_api.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommentaryService {

  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);

  getCommentaries(id:number):Observable<Commentary[]>{
    return this.http.get<Commentary[]>(`${this.apiUrl}/api/property/${id}/comments`);
  }

  createCommentary(id:number, data:{description:string}):Observable<Commentary>{
    return this.http.post<Commentary>(`${this.apiUrl}/api/property/${id}/comment`,data);
  }

}
