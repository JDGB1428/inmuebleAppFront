import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Booking, BookingAvailability } from '@interfaces/Booking.interfaces';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpResponseProperty } from '@interfaces/http-reponses.interfaces';
import { BookingDTO } from '@interfaces/response-dto.interfaces';
import { BookingMapper } from '../model/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = environment.LaravelAPI;
  private readonly http = inject(HttpClient);

  getBookingByPropertyIdAvailability(propertyId:number):Observable<BookingAvailability[]>{
    return this.http.get<HttpResponseProperty<BookingAvailability[]>>(`${this.apiUrl}/api/property/${propertyId}/availabilities`)
    .pipe(
      map(res => res.data),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }


  CreateBooking(propertyId:number, payload: Booking): Observable<HttpResponseProperty<Booking>> {
    return this.http.post<HttpResponseProperty<BookingDTO>>(`${this.apiUrl}/api/property/${propertyId}/booking`, payload).pipe(
      map((res) => {
        return BookingMapper.mapToHttpResponseBookingToArrayBooking(res);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }
}
