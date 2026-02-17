import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { PropertyServices } from '../../../core/services/property.service';
import { ErrorFormComponent } from "../../../auth/component/error-form/error-form.component";
import { CategoryServices } from '../../../core/services/category.service';
import { CategoryAdapter } from '../../../core/interfaces/category.interfaces';
import { ToastService } from '../../../core/services/toast.service';
import { Location } from '@angular/common';


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
  private location = inject(Location)
  selectedFiles: File[] = [];
  imagePreviews: string[] = []
  categories: CategoryAdapter[] = [];
  states: States[] = [];

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
  }



  propertyForm: FormGroup = this.fb.group({
    'title': [''],
    'description': [''],
    'price': [],
    'direction': [''],
    'room': [],
    'area_m2': [],
    'bathrooms': [],
    'state': ['available'],
    'category_id': [],
  })

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

      // 1. Agregar todos los campos de texto
      Object.keys(this.propertyForm.controls).forEach(key => {
        const value = this.propertyForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      this.selectedFiles.forEach((file) => {
        formData.append('image[]', file); // OJO: 'images[]' con corchetes
      });


      this.propertyService.createProperty(formData).subscribe({
        next: (res) => {
          this.propertyForm.reset();
          this.location.back();
          this.toastService.show(`${res.message}` ,'success', 3000)
        },
        error: (err) => {
          this.toastService.show(`${err.message}` ,'error', 3000)
        }
      });
    }
  }
}
