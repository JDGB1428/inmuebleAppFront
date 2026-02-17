import { ApiResponse, BackendResponseDto, HttpResponseProperty } from "../interfaces/http-reponses.interfaces";
import { Property } from "../interfaces/property.interfaces";
import { PropertyDTO } from "../interfaces/response-dto.interfaces";

export class PropertyModel {

  static mapToHttpResponsePropertyToProperty(dto: PropertyDTO): Property {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      price: Number(dto.price),
      direction: dto.description,
      room: Number(dto.room),
      area_m2: Number(dto.area_m2),
      bathrooms: Number(dto.bathrooms),
      state: dto.state,
      category_id: Number(dto.category_id),
      image: this.parseImages(dto.image),
      user_id: Number(dto.user_id),
      updated_at: new Date(dto.updated_at),
      created_at: new Date(dto.created_at)
    }
  }


  static mapToHttpResponsePropertyToPropertyArray(response: BackendResponseDto<PropertyDTO>): ApiResponse<Property> {
    const rawData = response.property || (response.data as PropertyDTO);

    if (!rawData) {
      throw new Error('Respuesta sin datos válidos');
    }

    return {
      message: response.message,
      data: this.mapToHttpResponsePropertyToProperty(rawData)
    };
  }

  // Para listas de propiedades
  static mapToHttpResponsePropertyToListProperties(response: BackendResponseDto<PropertyDTO[]>): ApiResponse<Property[]> {
    const rawList = (response.data as PropertyDTO[]) || [];
    const cleanList = rawList.map(item => this.mapToHttpResponsePropertyToProperty(item));
    return {
      message: response.message,
      data: cleanList,
    };
  }

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
