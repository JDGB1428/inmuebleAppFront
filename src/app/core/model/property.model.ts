import { HttpResponseProperty } from "../interfaces/http-reponses.interfaces";
import { Property, Features } from "../interfaces/property.interfaces";
import { PropertyDTO, FeaturesDTO } from "../interfaces/response-dto.interfaces";

export class PropertyModel {

  // 1. Mapeo Principal
  static mapToHttpResponsePropertyToProperty(dto: PropertyDTO): Property {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      price: Number(dto.price),
      direction: dto.direction,
      room: Number(dto.room),
      area_m2: Number(dto.area_m2),
      bathrooms: Number(dto.bathrooms),
      state: dto.state,
      category_id: Number(dto.category_id),
      image: this.parseImages(dto.image),
      user_id: dto.user_id,
      features: this.mapToFeatures(dto.features),
      updated_at: new Date(dto.updated_at),
      created_at: new Date(dto.created_at),
      deleted_at: dto.deleted_at ? new Date(dto.deleted_at) : null,
    };
  }

  // 2. Mapeo Anidado de Features
  private static parseBoolean(value: any): boolean {
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true;
    }
    return false; // Cualquier otra cosa ("false", 0, null, undefined) será false
  }

  // 2. Mapeo Anidado de Features CORREGIDO
  private static mapToFeatures(featureDTO: FeaturesDTO | string | null | undefined): Features {
    if (!featureDTO) {
      return this.createEmptyFeatures();
    }

    let parsedDto: Partial<FeaturesDTO> = {};

    if (typeof featureDTO === 'string') {
      try {
        parsedDto = JSON.parse(featureDTO);
      } catch {
        return this.createEmptyFeatures();
      }
    } else {
      parsedDto = featureDTO;
    }

    // Usamos nuestra función segura en vez de !!
    return {
      patio: this.parseBoolean(parsedDto.patio),
      terrace: this.parseBoolean(parsedDto.terrace),
      pool: this.parseBoolean(parsedDto.pool),
      gated_community: this.parseBoolean(parsedDto.gated_community),
      security_24_7: this.parseBoolean(parsedDto.security_24_7),
      bbq_zone: this.parseBoolean(parsedDto.bbq_zone),
      balcony: this.parseBoolean(parsedDto.balcony),
      gym: this.parseBoolean(parsedDto.gym),
      parking: this.parseBoolean(parsedDto.parking),
      administration: Number(parsedDto.administration) || 0
    };
  }

  private static createEmptyFeatures(): Features {
    return {
      patio: false,
      terrace: false,
      pool: false,
      gated_community: false,
      security_24_7: false,
      bbq_zone: false,
      balcony: false,
      gym: false,
      parking: false,
      administration: 0
    };
  }

  static mapToHttpResponsePropertyToPropertyArray(response: HttpResponseProperty<PropertyDTO>): HttpResponseProperty<Property> {
    const rawData = response.data || (response.data as PropertyDTO);
    if (!rawData) {
      throw new Error('Respuesta sin datos válidos');
    }
    return {
      message: response.message,
      data: this.mapToHttpResponsePropertyToProperty(rawData)
    };
  }

  static mapToHttpResponsePropertyToListProperties(response: HttpResponseProperty<PropertyDTO[]>): HttpResponseProperty<Property[]> {
    const rawList = (response.data as PropertyDTO[]) || [];
    const cleanList = rawList.map(item => this.mapToHttpResponsePropertyToProperty(item));

    return {
      message: response.message,
      data: cleanList,
    };
  }

  // 5. Parseo de Imágenes
  private static parseImages(image: string[] | string | null): string[] {
    if (!image) return [];
    if (Array.isArray(image)) return image;
    try {
      return JSON.parse(image);
    } catch {
      return [];
    }
  }
}
