import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { DatePipe } from '@angular/common';
import { ProfileService } from '@services/profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentaryService } from '@services/commentary.service';
import { Commentary } from '@interfaces/response_api.interfaces';

@Component({
  selector: 'comentary-client',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './comentary-client.component.html',
})
export class ComentaryClient implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);
  private readonly commentaryService = inject(CommentaryService);
  avatar = signal<string | undefined>('');
  isClient = this.authService.isClient();
  commentary = signal<Commentary[]>([]);

  propertyId = input.required<number>();



  ngOnInit(): void {
    this.profileService.getProfileById().subscribe({
      next: (profile) => {
        this.avatar.set(profile.profile?.avatar)
      }
    })

    this.commentaryService.getCommentaries(this.propertyId()).subscribe((data) => {
      this.commentary.set(data);
    })
  }

  commentaryForm:FormGroup  = this.fb.group({
    'description':['', Validators.required]
  });


  onSubmit(){
    if(this.commentaryForm.valid){
      const payload = {
        description : this.commentaryForm.value.description
      }
      this.commentaryService.createCommentary(this.propertyId(), payload).subscribe(() => {
        this.commentaryForm.reset();
      })
    }

  }




}
