import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthModel } from '../model/auth.model';
import { UserAdapater } from '../interfaces/user.interfaces';
import { HttpResponseLaravelAPi } from '../interfaces/http-reponses.interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.LaravelAPI;
  private http = inject(HttpClient);
  private routes = inject(Router);

  private userSignal = signal<UserAdapater | null>(this.getInitialUser());
  private tokenSignal = signal<string>(this.getInitialToken());
  private roleSignal = signal<string>(this.getInitialRole());

  public currentUser = this.userSignal.asReadonly();
  public currentRole = this.roleSignal.asReadonly();

  // Computed Signals: Se recalculan automáticamente si el token o el rol cambian
  public isAuthenticated = computed(() => this.tokenSignal() !== '');
  public isAgent = computed(() => this.roleSignal() === 'agent');
  public isAdmin = computed(() => this.roleSignal() === 'admin');
  public isClient = computed(() => this.roleSignal() === 'client');

  // ==========================================
  // MÉTODOS HTTP (API REST)
  // ==========================================

  authLogin(user: UserAdapater): Observable<UserAdapater> {
    return this.http.post<HttpResponseLaravelAPi>(`${this.apiUrl}/api/login`, user, {
      withCredentials: true,
    }).pipe(
      map((responseAPi) => AuthModel.mapHttpResponseLaravelApi(responseAPi)),
      catchError((error) => throwError(() => error))
    );
  }

  authRegister(user: UserAdapater): Observable<UserAdapater> {
    return this.http.post<HttpResponseLaravelAPi>(`${this.apiUrl}/api/register`, user, {
      withCredentials: true,
    }).pipe(
      map((responseAPi) => AuthModel.mapHttpResponseLaravelApi(responseAPi)),
      catchError((error) => throwError(() => error))
    );
  }

  authLogout() {
    return this.http.post(`${this.apiUrl}/api/logout`, null, {}).pipe(
      finalize(() => {
        // 1. Limpiamos los Signals (Esto actualiza toda la UI inmediatamente)
        this.tokenSignal.set('');
        this.userSignal.set(null);
        this.roleSignal.set('');

        // 2. Limpiamos el Storage físico
        localStorage.clear();
        sessionStorage.clear();

        // 3. Redirigimos al inicio de sesión
        this.routes.navigate(['/login']);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  // ==========================================
  // MANEJO DE SESIÓN Y REDIRECCIÓN
  // ==========================================

  saveSession(token: string, user: UserAdapater, remember_token: boolean, roles: string) {
    // 1. Actualizamos los Signals en memoria
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    this.roleSignal.set(roles);

    // 2. Guardamos en el Storage correspondiente según la preferencia del usuario
    const storage = remember_token ? localStorage : sessionStorage;

    // Almacenamos
    storage.setItem('user', JSON.stringify(user));
    storage.setItem('token', token);
    storage.setItem('roles', roles);

    // 3. Limpiamos el almacenamiento contrario por seguridad
    const otherStorage = remember_token ? sessionStorage : localStorage;
    otherStorage.removeItem('user');
    otherStorage.removeItem('token');
    otherStorage.removeItem('roles');
  }

  getToken(): string {
    // Es mejor leer directamente del signal si la app ya está corriendo
    return this.tokenSignal();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  redirectByRole(roles: string) {
    // Lo simplifiqué para que reciba un String (ya que guardas 'roles' como string en saveSession)
    if (roles === 'admin' || roles === 'agent') {
      this.routes.navigate(['/admin/dashboard/home']);
    } else if (roles === 'client') {
      this.routes.navigate(['/private/home']);
    }
  }

  // ==========================================
  // MÉTODOS PRIVADOS DE INICIALIZACIÓN
  // ==========================================

  private getInitialToken(): string {
    return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  }

  private getInitialRole(): string {
    return sessionStorage.getItem('roles') || localStorage.getItem('roles') || '';
  }

  private getInitialUser(): UserAdapater | null {
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as UserAdapater;
    } catch {
      return null;
    }
  }
}
