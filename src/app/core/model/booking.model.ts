import { map } from 'rxjs';
import { Booking } from "@interfaces/Booking.interfaces";
import { HttpResponseProperty } from "@interfaces/http-reponses.interfaces";
import { BookingDTO } from "@interfaces/response-dto.interfaces";


export class BookingMapper {

  static mapToHttpResponseBookingToBooking(dto: BookingDTO): Booking {
    return {
      propertyId: dto.property_id,
      userId: dto.user_id,
      checkIn: dto.check_in,
      checkOut: dto.check_out,
      guestsCount: dto.guests_count,
      totalPrice: dto.total_price,
      updatedAt: new Date(dto.updated_at),
      createdAt: new Date(dto.created_at),
      id: 2
    }
  }

  static mapToHttpResponseBookingToArrayBooking(dto: HttpResponseProperty<BookingDTO>): HttpResponseProperty<Booking> {
    const rawData = dto.data || (dto.data as BookingDTO);
    return {
      message: dto.message,
      data: this.mapToHttpResponseBookingToBooking(rawData)
    };
  }

  static mapToHttpResponseBookingToBookingList(dto: HttpResponseProperty<BookingDTO[]>): HttpResponseProperty<Booking[]> {
    const rawList = (dto.data as BookingDTO[]) || [];
    const cleanList = rawList.map(item => this.mapToHttpResponseBookingToBooking(item));
    return {
      message: dto.message,
      data: cleanList,
    };
  }
}
