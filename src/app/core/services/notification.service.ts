import { Injectable, NgZone, inject, signal } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private echo!: Echo<any>;
  private ngZone = inject(NgZone);
  private readonly apiUrl = environment.LaravelAPI
  private readonly http = inject(HttpClient);
  public notifications = signal<any[]>([]);
  private currentListeningUserId: number | null = null;


  public fetchUnreadNotificationsFromDB(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/notifications/unread`).subscribe({
      next: (dbNotifications) => {
        const mappedData = dbNotifications.map(notif => notif.data);
        this.notifications.set(mappedData);
      },
      error: (err) => console.error('Error cargando notificaciones:', err)
    });
  }

  public markAsReadInDB(): void {
    this.http.post(`${environment.LaravelAPI}/api/notifications/mark-read`, {}).subscribe({
      next: () => {
        this.notifications.set([]); // Limpiamos la campanita localmente
      }
    });
  }

  public markPropertyAsRead(propertyId: number): void {
    this.http.post(`${environment.LaravelAPI}/api/notifications/${propertyId}/mark-read`, {})
      .subscribe({
        next: () => {
          this.notifications.update(current =>
            current.filter(notif => notif.property_id !== propertyId)
          );
        }

      });


  }

  public listenForProperties(userId: number): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.warn('No hay token, cancelando conexión a WebSockets');
      return;
    }

    if (!this.echo) {
      (window as any).Pusher = Pusher;
      this.echo = new Echo({
        broadcaster: 'reverb',
        key: environment.reverb.key,
        wsHost: environment.reverb.host,
        wsPort: environment.reverb.port,
        wssPort: environment.reverb.port,
        forceTLS: environment.reverb.useTLS,
        disableStats: true,
        enableTransports: ['ws', 'wss'],
        activityTimeout: 120000,
        pongTimeout: 30000,
        authEndpoint: `${this.apiUrl}/api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      });

      if (this.echo.connector && this.echo.connector.pusher) {
        if (!this.echo.connector.pusher.config.auth) {
          this.echo.connector.pusher.config.auth = { headers: {} };
        }

        this.echo.connector.pusher.config.auth.headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        };

        this.echo.connector.pusher.config.auth.withCredentials = true;

        this.echo.connector.pusher.config.channelAuthorization = {
          endpoint: `${this.apiUrl}/api/broadcasting/auth`,
          transport: 'ajax',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        };
      }
    }

    if (this.currentListeningUserId === userId) {
      return;
    }

    if (this.currentListeningUserId && this.currentListeningUserId !== userId) {
      this.echo.leave(`App.Models.User.${this.currentListeningUserId}`);
    }

    this.currentListeningUserId = userId;

    const channel = this.echo.private(`App.Models.User.${userId}`);

    channel.notification((notification: any) => {
      this.ngZone.run(() => {
        const payload = notification.data ? notification.data : notification;

        const newNotif = { notif_id: `temporal-${payload.property_id}-${Date.now()}`, ...payload };

        this.notifications.update(current => {
          // Verificamos si la notificación ya existe (evita duplicados si llega por HTTP y WS al mismo tiempo)
          const exists = current.some(n =>
            n.property_id === newNotif.property_id &&
            n.title === newNotif.title &&
            n.name === newNotif.name // Asegura que es la misma interacción
          );

          if (exists) {
            return current;
          }

          return [newNotif, ...current];
        });
      });
    });
  }

  public disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
    }
    this.currentListeningUserId = null;
    this.notifications.set([]);
  }
}
