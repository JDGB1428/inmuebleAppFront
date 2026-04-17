export interface Booking {
  propertyId:  number;
  userId:      number;
  checkIn:     Date;
  checkOut:    Date;
  guestsCount: number;
  totalPrice:  number;
  updatedAt:   Date;
  createdAt:   Date;
  id:           number;
}


export interface BookingAvailability {
  check_in:      Date;
  check_out:     Date;
  is_my_booking: boolean;
}
