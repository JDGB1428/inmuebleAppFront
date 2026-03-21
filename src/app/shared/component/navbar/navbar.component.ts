import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthUser, AuthUserApiResponse, Profile } from '../../../core/interfaces/response_api.interfaces';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})

export class Navbar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly notificationService = inject(NotificationService);
  private location = inject(Location);

  isClient = this.authService.isClient();
  isAgent = this.authService.isAgent();
  isAdmin = this.authService.isAdmin();
  profiles = signal<AuthUser|null>(null);

  notifications = this.notificationService.notifications;
  unreadCount = computed(() => this.notifications().length);

  ngOnInit(): void {
    this.getProfile();
    this.initNotifications();

  }


  getProfile():void{
    this.profileService.getProfileById().subscribe((profile) => {
      this.profiles.set(profile);
    })
  }

  initNotifications(): void {
    const user = this.authService.currentUser();
    const isClientRole = this.authService.isClient();

    if (user && isClientRole) {
      this.notificationService.listenForProperties(user.id);
    }
  }

  markAsRead(): void {
    this.notificationService.notifications.set([]);
  }



  logout():void {
    this.authService.authLogout().subscribe(() => {
      this.location.back();
    });
  }

}
