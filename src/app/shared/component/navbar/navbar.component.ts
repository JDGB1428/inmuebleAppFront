import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from '@services/profile.service';
import { AuthUser} from '@interfaces/response_api.interfaces';
import { NotificationService } from '@services/notification.service';

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
  private location = inject(Location);

  isClient = this.authService.isClient();
  isAgent = this.authService.isAgent();
  isAdmin = this.authService.isAdmin();
  profiles = signal<AuthUser | null>(null);

  notifications = this.notificationService.notifications;
  unreadCount = computed(() => this.notifications().length);

  dropdownElement = viewChild<ElementRef<HTMLDivElement>>('notifDropdown');

  ngOnInit(): void {


    if (this.isClient || this.isAdmin || this.isAgent) {
      this.getProfile();
      this.initNotifications();
    }
  }


  getProfile(): void {
    this.profileService.getProfileById().subscribe((profile) => {
      this.profiles.set(profile);
    })
  }


  initNotifications(): void {
    const user = this.authService.currentUser();
    const isClientRole = this.authService.isClient();

    if (user && isClientRole) {
      this.notificationService.fetchUnreadNotificationsFromDB();
      this.notificationService.listenForProperties(user.id);
    }
  }

  markAsRead(): void {
    this.notificationService.markAsReadInDB();
  }



  logout(): void {
    this.authService.authLogout().subscribe(() => {
      this.location.back();
    });
  }


  goToProperty(propertyId: number): void {

    this.notificationService.markPropertyAsRead(propertyId);
    this.router.navigate(['/private/home/show', propertyId]);
    this.dropdownElement()?.nativeElement.blur();
  }

}
