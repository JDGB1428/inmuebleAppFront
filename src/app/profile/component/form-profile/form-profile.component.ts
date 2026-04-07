import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { ProfileService } from '@services/profile.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'form-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './form-profile.component.html',
})
export class FormProfileComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly toastService = inject(ToastService);

  profileForm: FormGroup;
  avatarPreview = signal<string>('https://ui-avatars.com/api/?name=Usuario&background=random');
  selectedAvatarFile = signal<File | null>(null);

  isAgent = this.authService.isAgent();
  isClient = this.authService.isClient();
  user = this.authService.currentUser;

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      whatsapp: ['', Validators.required],
      address: ['', Validators.required],
      nationality: ['', Validators.required],
      jobTitle: ['', Validators.required],
      experience: ['', Validators.required],

      // Controles para specialties
      spec_sales: [true],
      spec_rent: [false],
      spec_commercial: [false],
      spec_luxury: [false],

      // Controles para socialLinks
      facebook: ['', Validators.required],
      instagram: ['', Validators.required],
      linkedin: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.ajustarValidacionesSegunRol();
    this.loadProfileData();
  }

  // -------------------------------------------------------------
  // 1. CARGAR DATOS DEL BACKEND
  // -------------------------------------------------------------
  private loadProfileData() {
    this.profileService.getProfileById(this.user()?.id ?? 0).subscribe({
      next: (user) => {
        if (!user) return;

        if (user.name) {
          this.profileForm.get('fullName')?.setValue(user.name);

          if (!user.profile?.avatar || user.profile.avatar === 'assets/default-avatar.png') {
            this.avatarPreview.set(`https://ui-avatars.com/api/?name=${user.name}&background=random`);
          }
        }

        if (user.profile) {
          const p = user.profile;

          // Desempaquetar specialties (Si viene como JSON string, lo parseamos)
          let parsedSpecialties: any = {};
          if (typeof p.specialties === 'string') {
            try { parsedSpecialties = JSON.parse(p.specialties); } catch (e) { }
          } else if (p.specialties) {
            parsedSpecialties = p.specialties;
          }

          // Desempaquetar social_links
          let parsedSocial: any = {};
          if (typeof p.socialLinks === 'string') {
            try { parsedSocial = JSON.parse(p.socialLinks); } catch (e) { }
          } else if (p.socialLinks) {
            parsedSocial = p.socialLinks;
          }

          this.profileForm.patchValue({
            phone: p.phone !== 'N/A' ? p.phone : '',
            whatsapp: p.whatsapp !== 'N/A' ? p.whatsapp : '',
            address: p.address !== 'Sin dirección' ? p.address : '',
            jobTitle: p.jobTitle !== 'Sin cargo' ? p.jobTitle : '',
            experience: p.yearsOfExperience,
            nationality: p.nationality,

            // Asignar los valores a los checkboxes (si existen en el JSON)
            spec_sales: parsedSpecialties.sales || false,
            spec_rent: parsedSpecialties.rent || false,
            spec_commercial: parsedSpecialties.commercial || false,
            spec_luxury: parsedSpecialties.luxury || false,

            // Asignar redes sociales
            facebook: parsedSocial.facebook || '',
            instagram: parsedSocial.instagram || '',
            linkedin: parsedSocial.linkedin || ''
          });

          if (p.avatar && p.avatar !== 'assets/default-avatar.png') {
            this.avatarPreview.set(p.avatar);
          }
        }
      },
      error: (err) => console.error("Error cargando el perfil", err)
    });
  }

  // -------------------------------------------------------------
  // LÓGICA DE ROLES
  // -------------------------------------------------------------
  private ajustarValidacionesSegunRol() {
    if (!this.isAgent) {
      const jobTitleControl = this.profileForm.get('jobTitle');
      if (jobTitleControl) {
        jobTitleControl.clearValidators();
        jobTitleControl.updateValueAndValidity();
      }

      this.profileForm.get('jobTitle')?.disable();
      this.profileForm.get('experience')?.disable();
      this.profileForm.get('spec_sales')?.disable();
      this.profileForm.get('spec_rent')?.disable();
      this.profileForm.get('spec_commercial')?.disable();
      this.profileForm.get('spec_luxury')?.disable();
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedAvatarFile.set(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // -------------------------------------------------------------
  // 2. ENVIAR AL BACKEND (Crear o Actualizar)
  // -------------------------------------------------------------
  onSubmit() {
    if (this.profileForm.valid) {
      const formData = new FormData();
      const formValues = this.profileForm.getRawValue();

      const fieldMap: Record<string, string> = {
        fullName: 'fullName',
        phone: 'phone',
        whatsapp: 'whatsapp',
        address: 'address',
        jobTitle: 'job_title',
        experience: 'years_of_experience',
        nationality: 'nationality',
      };

      // Iteramos sobre las llaves del diccionario y agregamos al FormData
      Object.entries(fieldMap).forEach(([ngKey, laravelKey]) => {
        const value = formValues[ngKey];
        if (value) {
          formData.append(laravelKey, value);
        }
      });

      // 2. Empaquetar Especialidades en un JSON String
      const specialtiesObj = {
        sales: formValues.spec_sales ? true : false,
        rent: formValues.spec_rent ? true : false,
        commercial: formValues.spec_commercial ? true : false,
        luxury: formValues.spec_luxury ? true : false,
      };
      formData.append('specialties', JSON.stringify(specialtiesObj));

      // 3. Empaquetar Redes Sociales en un JSON String
      const socialLinksObj = {
        facebook: formValues.facebook || '',
        instagram: formValues.instagram || '',
        linkedin: formValues.linkedin || ''
      };
      formData.append('social_links', JSON.stringify(socialLinksObj));

      // 4. Adjuntar foto si existe
      const avatarFile = this.selectedAvatarFile();
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // Llamada al backend
      this.profileService.createOrUpdate(formData).subscribe({
        next: (res) => {
          this.toastService.show('Perfil guardado exitosamente', 'success', 3000);
          this.selectedAvatarFile.set(null);
        },
        error: (err) => {
          this.toastService.show('Hubo un error al guardar el perfil', 'error', 3000);
          console.error(err);
        }
      });

    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
