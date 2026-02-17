
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, tap} from 'rxjs';
import { CategoryAdapter } from '../interfaces/category.interfaces';
import { CategoryModel } from '../model/category.model';
import { HTTPResponseCategory } from '../interfaces/http-reponses.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);


  getCategories(): Observable<CategoryAdapter[]>{
    return this.http.get<HTTPResponseCategory>(`${this.apiUrl}/api/category`).pipe(
      map((response) => {
        return CategoryModel.mapHttpReponseCategoryToCategoryAdapterArray(response.data);
      }),
      catchError(() => of([]))
    )
  }
}
