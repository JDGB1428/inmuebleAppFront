import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { PropertyServices } from '../../../core/services/property.service';
import { ErrorFormComponent } from "../../../auth/component/error-form/error-form.component";
import { CategoryServices } from '../../../core/services/category.service';
import { CategoryAdapter } from '../../../core/interfaces/category.interfaces';


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
    'category_id':[],
  })

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files); // Convertir a array real
      this.imagePreviews = []; // Limpiar previos anteriores

      // Generar previsualizaciones
      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
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
        next: (res) => console.log('Éxito', res),
        error: (err) => console.error(err)
      });

      console.log(this.propertyForm.value);
    }
  }
}
