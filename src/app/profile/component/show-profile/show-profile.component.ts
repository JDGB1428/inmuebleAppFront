import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthUser, Profile } from '@interfaces/response_api.interfaces';
import { AuthService } from '@services/auth.service';
import { ProfileService } from '@services/profile.service';
import { switchMap } from 'rxjs';

export interface UserSpecialties {
  sales?: boolean;
  rent?: boolean;
  commercial?: boolean;
  luxury?: boolean;
}

export interface UserSocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

@Component({
  selector: 'app-show-profile',
  imports: [],
  templateUrl: './show-profile.component.html',
})

export class ShowProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  isAgent = this.authService.isAgent()
  profile = signal<AuthUser | null>(null);
  socialLinks = signal<UserSocialLinks>({});
  specialties = signal<UserSpecialties>({})

  ngOnInit(): void {
    this.getProfileById();
  }

  getProfileById(){
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.profileService.getProfileById(id))
    ).subscribe( (profile) => {
      this.profile.set(profile);

      if(profile.profile?.specialties){
        try {
          const parsedSpec = typeof profile.profile.specialties === 'string'
            ? JSON.parse(profile.profile.specialties)
            : profile.profile.specialties;
          console.log(parsedSpec);
          this.specialties.set(parsedSpec);
        } catch(e) { console.error("Error parseando especialidades"); }
      }

      if (profile.profile?.socialLinks) {
        try {
          const parsedSocial = typeof profile.profile.socialLinks === 'string'
            ? JSON.parse(profile.profile.socialLinks)
            : profile.profile.socialLinks;
          console.log(parsedSocial);
          this.socialLinks.set(parsedSocial);
        } catch(e) { console.error("Error parseando redes sociales"); }
      }
    });
  }
}
