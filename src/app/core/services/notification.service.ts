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

    // 1. Inicializamos Echo solo si no existe aún
    if (!this.echo) {
      (window as any).Pusher = Pusher;
      this.echo = new Echo({
        broadcaster: 'reverb',
        key: environment.reverb.key,
        wsHost: environment.reverb.host,
        wsPort: environment.reverb.port,
        wssPort: environment.reverb.port, // Importante para evitar cierres prematuros
        forceTLS: environment.reverb.useTLS,
        disableStats: true,
        enableTransports: ['ws', 'wss'],  // Mantener conexión viva
        activityTimeout: 120000,          // Evitar desconexiones por ping
        pongTimeout: 30000,
        authEndpoint: `${environment.LaravelAPI}/api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      });

      // 2. Pasar configuraciones seguras de Sanctum al conector
      if (this.echo.connector && this.echo.connector.pusher) {
        if (!this.echo.connector.pusher.config.auth) {
          this.echo.connector.pusher.config.auth = { headers: {} };
        }

        this.echo.connector.pusher.config.auth.headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        };

        // Habilitar credenciales CORS para Sanctum SPA
        this.echo.connector.pusher.config.auth.withCredentials = true;

        this.echo.connector.pusher.config.channelAuthorization = {
          endpoint: `${environment.LaravelAPI}/api/broadcasting/auth`,
          transport: 'ajax',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        };
      }
    }

    const channel = this.echo.private(`App.Models.User.${userId}`);

    // ESCUCHAR EL NUEVO NOMBRE DEL EVENTO (Importante el punto inicial)
    channel.notification((notification: any) => {
      this.ngZone.run(() => {
        const payload = notification.data ? notification.data : notification;

        const newNotif = { notif_id: `temporal-${payload.property_id}`, ...payload };
        this.notifications.update(current => [newNotif, ...current]);
      });
    });
  }

  // Método para desconectar al usuario cuando hace logout
  public disconnect(): void {
    if (this.echo) {
      this.echo.disconnect();
    }
  }
}
