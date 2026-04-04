import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyServices } from '../../../core/services/property.service';
import { switchMap } from 'rxjs';
import { Property } from '../../../core/interfaces/property.interfaces';
import { CurrencyPipe, DatePipe, Location, NgClass } from '@angular/common';
import { ConfirmModalComponent } from "../../../shared/component/confirm-modal/confirm-modal.component";
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingShowPropertyComponent } from "../../../shared/component/loading-show-property/loading-show-property.component";
import { ComentaryClient } from "../../../private-front/components/comentary-client/comentary-client.component";

@Component({
  selector: 'app-property-show-page',
  templateUrl: './property-show-page.component.html',
  imports: [CurrencyPipe, ConfirmModalComponent, NgClass, RouterLink, LoadingShowPropertyComponent, ComentaryClient]
})
export class PropertyShowPageComponent implements OnInit {
  loading = signal<boolean>(true);

  // Nueva señal para prevenir múltiples clics mientras carga el Like
  isLiking = signal<boolean>(false);

  private readonly propertyService = inject(PropertyServices);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);

  isClient = this.authService.isClient();
  isAgent = this.authService.isAgent();

  property = signal<Property | null>(null);
  propertyIdDelete = signal<Property['id']>(0);
  likedProperty = signal<Property[]>([]);

  id = this.activatedRoute.snapshot.params['id'];


  isliked = computed(() => {
    const currentProperty = this.property();

    if (!currentProperty) return false;

    return this.likedProperty().some(liked => liked.id === currentProperty.id);
  })

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent

  ngOnInit(): void {
    this.getPropertyById();

    if (this.isClient) {
      this.loadLikes();
    }

  }

  private readonly featureTranslations: Record<string, string> = {
    pool: 'Piscina',
    bbq_zone: 'Zona BBQ',
    balcony: 'Balcón',
    security_24_7: 'Seguridad 24/7',
    gym: 'Gimnasio',
    parking: 'Parqueadero',
    patio: 'Patio',
    terrace: 'Terraza',
    gated_community: 'Conjunto Cerrado',
    adminstration: 'Administracion'
  };

  getActiveFeatures(): string[] {
    const currentProperty = this.property();
    if (!currentProperty || !currentProperty.features) return [];

    let featuresObj = currentProperty.features;
    if (typeof featuresObj === 'string') {
      featuresObj = JSON.parse(featuresObj);
    }
    const featuresMap = featuresObj as Record<string, any>;
    const activeFeatures: string[] = [];

    Object.keys(featuresMap).forEach(key => {
      if (key === 'administration') {
        return;
      }

      if (featuresMap[key] === true || featuresMap[key] === 'true' || featuresMap[key] === '1' || featuresMap[key] === 1) {
        activeFeatures.push(this.featureTranslations[key] || key);
      }
    });

    return activeFeatures;
  }

  loadLikes() {
    this.propertyService.loadUserLikes().subscribe({
      next: (response) => {
        this.likedProperty.set(response.data);
      },
      error: () => {
        this.likedProperty.set([]);
      }
    });
  }



  getPropertyById() {
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.propertyService.showProperty(id))
    ).subscribe((property) => {
      const { data } = property
      this.property.set(data);
      this.loading.set(false);
    })
  }

  // --- NUEVO MÉTODO PARA EL LIKE ---
  toggleLike() {
    const currentProperty = this.property();

    // Validamos que la propiedad exista antes de enviar
    if (!currentProperty || !currentProperty.id) return;

    this.isLiking.set(true);

    this.propertyService.toggleLike(currentProperty.id).subscribe({
      next: (response) => {
        if (response.is_liked) {
          // Agregamos el objeto completo de la propiedad al array
          this.likedProperty.update(properties => [...properties, currentProperty]);
        } else {
          // Filtramos excluyendo el objeto que tenga este ID
          this.likedProperty.update(properties => properties.filter(prop => prop.id !== currentProperty.id));
        }

        this.isLiking.set(false);
      },
      error: (err) => {
        this.toastService.show('Error al dar like. ¿Iniciaste sesión?', 'error', 3000);
        this.isLiking.set(false);
      }
    });
  }

  // ---------------------------------

  getBadgeColor(state: string | undefined): string {
    switch (state) {
      case 'available': return 'badge-success';
      case 'not-available': return 'badge-error';
      case 'sold': return 'badge-neutral';
      case 'rented': return 'badge-warning';
      case 'published': return 'badge-info';
      default: return 'badge-ghost';
    }
  }

  translateState(state: string | undefined): string {
    const translations: Record<string, string> = {
      'available': 'Disponible',
      'not-available': 'No Disponible',
      'sold': 'Vendido',
      'rented': 'Rentado',
      'published': 'Publicado'
    };
    return state && translations[state] ? translations[state] : 'Desconocido';
  }

  openDeleteConfirmation(id: number) {
    this.propertyIdDelete.set(id);
    this.deleteModal.open();
  }

  destroyProperty() {
    if (!this.propertyIdDelete()) return;

    this.propertyService.deleteProperty(this.propertyIdDelete()).subscribe({
      next: () => {
        this.toastService.show('Inmueble eliminado exitosamente', 'success', 3000);
        this.propertyIdDelete.set(0);
        this.deleteModal.close();
        this.location.back();
      },
      error: (err) => {
        this.toastService.show('Error al eliminar', 'error', 3000);
        this.propertyIdDelete.set(0);
      }
    });
  }
}
