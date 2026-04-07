import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@services/auth.service';
import { ProfileService } from '@services/profile.service';
import { NotificationService } from '@services/notification.service';
import { AuthUser } from '@interfaces/response_api.interfaces';

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly location = inject(Location);

  user = computed(() => this.authService.currentUser());
  isClient = computed(() => this.authService.isClient());
  isAgent = computed(() => this.authService.isAgent());
  isAdmin = computed(() => this.authService.isAdmin());

  profiles = signal<AuthUser | null>(null);

  notifications = this.notificationService.notifications;
  unreadCount = computed(() => this.notifications().length);

  // 4. ViewChild moderno
  dropdownElement = viewChild<ElementRef<HTMLDivElement>>('notifDropdown');

  ngOnInit(): void {
    if (this.isClient() || this.isAdmin() || this.isAgent()) {
      this.getProfile();
      this.initNotifications();
    }
  }

  getProfile(): void {
    const currentUser = this.user();
    if (!currentUser?.id) return;

    this.profileService.getProfileById(currentUser.id).subscribe({
      next: (profile) => this.profiles.set(profile),
      error: (err) => console.error('Error cargando perfil:', err)
    });
  }

  initNotifications(): void {
    const currentUser = this.user();

    if (currentUser?.id && this.isClient()) {
      this.notificationService.fetchUnreadNotificationsFromDB();
      this.notificationService.listenForProperties(currentUser.id);
    }
  }

  markAsRead(): void {
    this.notificationService.markAsReadInDB();
  }

  logout(): void {
    this.authService.authLogout().subscribe({
      next: () => {
        this.profiles.set(null);
        this.location.back();
      },
      error: (err) => console.error('Error al cerrar sesión:', err)
    });
  }

  goToProperty(propertyId: number): void {
    this.notificationService.markPropertyAsRead(propertyId);
    this.router.navigate(['/private/home/show', propertyId]);
    // Cierra el dropdown de DaisyUI quitando el foco del botón
    this.dropdownElement()?.nativeElement.blur();
  }
}
