import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingAvailability } from '@interfaces/Booking.interfaces';
import { AuthService } from '@services/auth.service';
import { BookingService } from '@services/booking.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'shared-calendar',
  imports: [FullCalendarModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './calendar.component.html',
  styles: `
    .calendar-wrapper{
      touch-action: manipulation;
    }
  `
})
export class CalendarComponent implements OnInit {
  @ViewChild('bookingModal') bookingModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  propertyPricePerNight: number = 150000;
  propertyMaxGuests: number = 6;
  propertyExtraGuestPrice: number = 30000;
  baseIncludedGuests: number = 0; // Significa que cobra extra desde la persona 1\

  totalNights = signal<number>(0);
  propertyId = signal<number>(0);
  userId = signal<number | null>(null);
  calendarEvents = signal<any[]>([]);
  totalDays = computed(() => this.totalNights() + 1); // Días siempre es noches + 1

  selectedRange: any = null;

  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    selectOverlap: false,
    longPressDelay: 50,
    unselectAuto: true,
    height: 'auto',
    handleWindowResize: true,
    aspectRatio: 0.85,
    validRange: {
      start: new Date().toISOString().split('T')[0]
    },
    select: this.handleDateSelect.bind(this),
    locale: 'es',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    buttonText: { today: 'Hoy' },
    events: (fetchInfo, successCallback, failureCallback) => {
      this.bookingService.getBookingByPropertyIdAvailability(this.propertyId()).subscribe({
        next: (bookedDates: BookingAvailability[]) => {

          const mappedEvents = bookedDates.map(booking => {
            const isMine = booking.is_my_booking;
            return {
              title: isMine ? 'Mi Reserva' : 'No disponible',
              start: booking.check_in,
              end: booking.check_out,
              color: isMine ? '#0ea5e9' : '#9ca3af',
              display: 'background'
            };
          });

          successCallback(mappedEvents);
        },
        error: (err) => {
          console.error('Error al cargar la disponibilidad', err);
          failureCallback(err);

        }
      });
    }
  };

  ngOnInit() {
    this.getPropertyById();

  }

  getPropertyById() {
    this.activatedRoute.params.subscribe((params) => {
      this.propertyId.set(params['id']);

    })
  }
  bookingForm: FormGroup = this.fb.group({
    guests_count: [1, [Validators.required, Validators.min(1), Validators.max(this.propertyMaxGuests)]]
  });

  // Signal conectada al formulario
  guestsSignal = toSignal(
    this.bookingForm.get('guests_count')!.valueChanges,
    { initialValue: 1 }
  );

  basePriceTotal = computed(() => this.totalNights() * this.propertyPricePerNight);

  extraGuestsFee = computed(() => {
    const guests = this.guestsSignal() || 1;
    // Solo cobra extra si los huéspedes superan el número base incluido
    if (guests > this.baseIncludedGuests && this.bookingForm.get('guests_count')?.valid) {
      const extraPeopleCount = guests - this.baseIncludedGuests;
      return (extraPeopleCount * this.propertyExtraGuestPrice) * this.totalNights();
    }
    return 0;
  });

  totalEstimatedPrice = computed(() => this.basePriceTotal() + this.extraGuestsFee());

  handleDateSelect(selectInfo: any) {
    const checkOutDate = new Date(selectInfo.end);
    checkOutDate.setDate(checkOutDate.getDate() - 1);

    const checkInStr = selectInfo.startStr;
    const checkOutStr = checkOutDate.toLocaleDateString('en-CA');
    this.selectedRange = { startStr: checkInStr, endStr: checkOutStr };

    const startMs = selectInfo.start.getTime();
    const endMs = checkOutDate.getTime();

    const calculatedNights = Math.round((endMs - startMs) / (1000 * 3600 * 24));
    this.totalNights.set(calculatedNights);

    const calendarApi = selectInfo.view.calendar;
    calendarApi.view.calendar.unselect();
    this.bookingModal.nativeElement.showModal();
  }

  closeModal() {
    this.bookingModal.nativeElement.close();
    this.selectedRange = null;
    this.totalNights.set(0);
  }

  saveBooking() {
    console.log(this.bookingForm.value);
    if (this.bookingForm.valid && this.selectedRange) {
      const payload = {
        user_id: this.authService.currentUser()?.id,
        property_id: this.propertyId(),
        ...this.bookingForm.value,
        check_in: this.selectedRange.startStr,
        check_out: this.selectedRange.endStr
      };

      this.bookingService.CreateBooking(this.propertyId(), payload).subscribe({
        next: (message) => {
          this.bookingForm.reset({});
          this.closeModal();
          this.fullcalendar.getApi().refetchEvents();
          this.toastService.show(`${message.message}`, 'success', 3000);
        },
        error: (err) => {
          alert(err.error.message || 'Error al guardar la reserva');
        }
      });
    }
  }
}
