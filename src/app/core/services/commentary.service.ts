import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentaryService {

  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);

  getCommentaries(id:number, data:any){
    return this.http.get(`${this.apiUrl}/api/property/${id}/comments`,data);
  }

  createCommentary(id:number, data:any){
    return this.http.post(`${this.apiUrl}/api/property/${id}/comment`,data);
  }

}
