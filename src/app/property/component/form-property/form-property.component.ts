import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { PropertyServices } from '../../../core/services/property.service';
import { ErrorFormComponent } from "../../../auth/component/error-form/error-form.component";
import { CategoryServices } from '../../../core/services/category.service';
import { CategoryAdapter } from '../../../core/interfaces/category.interfaces';
import { ToastService } from '../../../core/services/toast.service';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HTTPErrorResponseCustom } from '../../../core/interfaces/auth-error.interfaces';


interface States {
  value: string,
  label: string
}
@Component({
  selector: 'form-property',
  imports: [ReactiveFormsModule, FormsModule, ErrorFormComponent],
  templateUrl: './form-property.component.html',
})


export class FormPropertyComponent implements OnInit {

  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyServices);
  private categoryService = inject(CategoryServices);
  private toastService = inject(ToastService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  selectedFiles: File[] = [];
  imagePreviews: string[] = []
  categories: CategoryAdapter[] = [];
  states: States[] = [];
  error = signal<HTTPErrorResponseCustom | null>(null);
  selectedCategoryName: string = '';
  isEditMode = signal<boolean>(false);
  propertyId = input<number | null>(null);

  constructor() {
    effect(() => {
      const idToEdit = this.propertyId();
      if (idToEdit) {
        this.isEditMode.set(true);
        this.loadPropertyData(Number(idToEdit));
      } else {
        this.isEditMode.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      return this.categories = categories;
    })

    this.states = [
      { value: 'available', label: 'Disponible' },
      { value: 'not-available', label: 'No Disponible' },
      { value: 'published', label: 'Publicado' },
      { value: 'sold', label: 'Vendido' },
      { value: 'rented', label: 'Rentado' }
    ];

    this.propertyForm.get('category_id')?.valueChanges.subscribe(categoryId => {
      const category = this.categories.find(c => c.id == categoryId);
      this.selectedCategoryName = category ? category.name : '';
      this.updateFeaturesFormGroup(this.selectedCategoryName);
    });
  }

  private loadPropertyData(id: number) {
    this.propertyService.showProperty(id).subscribe({
      next: (response) => {
        const prop = response.data;

        this.propertyForm.patchValue({
          title: prop.title,
          description: prop.description,
          price: prop.price,
          direction: prop.direction,
          room: prop.room,
          area_m2: prop.area_m2,
          bathrooms: prop.bathrooms,
          state: prop.state,
          category_id: prop.category_id,
        });

        setTimeout(() => {
          this.propertyForm.get('features')?.patchValue(prop.features);
        });

        if (prop.image && Array.isArray(prop.image)) {
          this.imagePreviews = prop.image;
        }
      }
    });
  }



  propertyForm: FormGroup = this.fb.group({
    'title': [''],
    'description': [''],
    'price': [],
    'direction': [''],
    'room': [0],
    'area_m2': [0],
    'bathrooms': [0],
    'state': ['available'],
    'category_id': [],
    'features': this.fb.group({
    })
  })


  private updateFeaturesFormGroup(categoryName: string) {
    const featuresGroup = this.propertyForm.get('features') as FormGroup;

    // 1. Limpiamos cualquier control anterior
    Object.keys(featuresGroup.controls).forEach(key => {
      featuresGroup.removeControl(key);
    });

    // 2. Agregamos los booleanos correspondientes
    if (categoryName === 'Apartamento') {
      featuresGroup.addControl('pool', this.fb.control(false));
      featuresGroup.addControl('bbq_zone', this.fb.control(false));
      featuresGroup.addControl('balcony', this.fb.control(false));
      featuresGroup.addControl('security_24_7', this.fb.control(false));
      featuresGroup.addControl('gym', this.fb.control(false));
      featuresGroup.addControl('parking', this.fb.control(false));
      featuresGroup.addControl('administration', this.fb.control(0));
    } else if (categoryName === 'Casa') {
      featuresGroup.addControl('patio', this.fb.control(false));
      featuresGroup.addControl('terrace', this.fb.control(false));
      featuresGroup.addControl('pool', this.fb.control(false));
      featuresGroup.addControl('gated_community', this.fb.control(false));
      featuresGroup.addControl('security_24_7', this.fb.control(false));
    }

    this.propertyForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  onFileChange(event: Event, fileInput: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const newFiles = Array.from(input.files);

    for (const f of newFiles) {
      const exists = this.selectedFiles.some(x =>
        x.name === f.name && x.size === f.size && x.lastModified === f.lastModified
      );
      if (!exists) {
        this.selectedFiles.push(f);

        // Preview
        const reader = new FileReader();
        reader.onload = () => this.imagePreviews.push(reader.result as string);
        reader.readAsDataURL(f);
      }
    }
    fileInput.value = '';
  }


  onSubmit() {
    if (this.propertyForm.valid) {
      const formData = new FormData();

      // 1. Extraemos TODOS los valores actuales del formulario (incluso los anidados)
      const formValues = this.propertyForm.getRawValue();

      // 2. Agregamos todos los campos normales (título, precio, etc.)
      Object.keys(formValues).forEach(key => {

        // Si no es el grupo de features, lo agregamos normal
        if (key !== 'features' && formValues[key] !== null && formValues[key] !== undefined) {
          formData.append(key, formValues[key]);
        }
      });

      // 3. Procesamos específicamente el grupo de "features"
      if (formValues.features) {
        Object.keys(formValues.features).forEach(featureKey => {

          const featureValue = formValues.features[featureKey];

          // Si es administración, mandamos el valor numérico tipeado
          if (featureKey === 'administration') {
            // Si el usuario lo dejó vacío, enviamos 0
            formData.append(`features[${featureKey}]`, featureValue || 0);
          }
          // Si es un checkbox (booleano), lo mandamos como '1' o '0'
          else {
            const boolValue = featureValue ? '1' : '0';
            formData.append(`features[${featureKey}]`, boolValue);
          }
        });
      }

      // 4. Agregar imágenes locales
      this.selectedFiles.forEach((file) => {
        formData.append('image[]', file);
      });

      // 5. Agregar imágenes antiguas (si estamos editando)
      if (this.isEditMode()) {
        const oldImagesToKeep = this.imagePreviews.filter(img => img.startsWith('http'));
        oldImagesToKeep.forEach(url => {
          formData.append('existing_images[]', url);
        });
      }

      // 6. Enviar al Backend
      const currentId = this.propertyId();

      if (this.isEditMode() && currentId) {
        formData.append('_method', 'PUT');

        this.propertyService.updateProperty(Number(currentId), formData).subscribe({
          next: (res) => {
            this.location.back();
            this.toastService.show('Inmueble actualizado', 'success', 3000);
          },
          error: (err) => this.handlerError(err)
        });

      } else {
        this.propertyService.createProperty(formData).subscribe({
          next: (res) => {
            this.propertyForm.reset();
            this.location.back();
            this.toastService.show('Inmueble creado', 'success', 3000);
          },
          error: (err) => this.handlerError(err)
        });
      }
    }
  }


  removeImage(index: number) {
    const removedPreview = this.imagePreviews.splice(index, 1)[0];
    if (removedPreview.startsWith('data:image')) {
      const localImageIndex = this.imagePreviews
        .filter(img => img.startsWith('data:image'))
        .indexOf(removedPreview);

      if (localImageIndex !== -1) {
        this.selectedFiles.splice(localImageIndex, 1);
      } else {
        // Fallback por seguridad
        this.selectedFiles.splice(index, 1);
      }
    }
  }



  private handlerError(err: HttpErrorResponse): void {
    if (err.status === 422) {
      const validationError = err.error as HTTPErrorResponseCustom;
      this.error.set(validationError);
      const laravelErrors = validationError.errors;
      Object.keys(laravelErrors).forEach((field) => {
        const control = this.propertyForm.get(field);
        if (control) {
          control.setErrors({ serverError: laravelErrors[field][0] });
          this.propertyForm.markAllAsTouched();
        }
      });

      this.cdr.detectChanges();
    }
  }
}
