import { HttpResponseProperty } from "@interfaces/http-reponses.interfaces";
import { RoleRequestDTO } from "@interfaces/response-dto.interfaces";
import { RoleRequest } from "@interfaces/response_api.interfaces";

export class RoleRequestMapper {

  static fromApi(dto: RoleRequestDTO): RoleRequest {
    return {
      id: dto.id,
      userId: dto.user_id,
      description: dto.description,
      status: dto.status,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      user: {
        id: dto.user.id,
        name: dto.user.name,
        email: dto.user.email
      }
    }
  }

  static mapToApi(dto: HttpResponseProperty<RoleRequestDTO>): HttpResponseProperty<RoleRequest> {
      const rawData = dto.data || (dto.data as RoleRequestDTO);
      if (!rawData) {
        throw new Error('Respuesta sin datos válidos');
      }
      return {
        message: dto.message,
        data: this.fromApi(rawData)
      };
    }

  static fromApiList(dto: HttpResponseProperty<RoleRequestDTO[]>): HttpResponseProperty<RoleRequest[]> {
    const rawList = (dto.data as RoleRequestDTO[]) || [];
    const cleanList = rawList.map(item => this.fromApi(item));

    return {
      message: dto.message,
      data: cleanList,
    };
  }
}
