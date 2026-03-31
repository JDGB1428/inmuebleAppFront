import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile} from '../../../core/interfaces/response_api.interfaces';
import { ConfirmModalComponent } from "../../../shared/component/confirm-modal/confirm-modal.component";
import { DataTableComponent } from "../../../shared/component/data-table/data-table.component";

@Component({
  selector: 'app-user-admin-page',
  imports: [DataTableComponent],
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
