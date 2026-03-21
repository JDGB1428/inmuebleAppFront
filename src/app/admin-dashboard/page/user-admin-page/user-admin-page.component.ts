import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile} from '../../../core/interfaces/response_api.interfaces';

@Component({
  selector: 'app-user-admin-page',
  imports: [],
  templateUrl: './user-admin-page.component.html',
})
export class UserAdminPageComponent implements OnInit {


  private readonly profileService = inject(ProfileService);

  profiles = signal<Profile[]>([]);

  ngOnInit(): void {
    this.listProfiles();
  }

  listProfiles(){
    this.profileService.getProfiles().subscribe((profile) => {
      this.profiles.set(profile.active);
    })
  }


}
