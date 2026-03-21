import { Injectable, NgZone, inject, signal } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private echo!: Echo<any>;
  private ngZone = inject(NgZone);
  public notifications = signal<any[]>([]);

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
    channel.listen('.PropertyCreatedEvent', (notification: any) => {
      this.ngZone.run(() => {
        console.log('¡Nuevo inmueble recibido en canal privado!', notification);
        const data = notification.data || notification;
        this.notifications.update(current => [data, ...current]);
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
