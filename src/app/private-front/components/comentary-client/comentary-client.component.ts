import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'comentary-client',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './comentary-client.component.html',
})
export class ComentaryClient implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  avatar = signal<string | undefined>('');


  isClient = this.authService.isClient();

  ngOnInit(): void {
    this.profileService.getProfileById().subscribe({
      next: (profile) => {
        this.avatar.set(profile.profile?.avatar)
      }
    })
  }
}
