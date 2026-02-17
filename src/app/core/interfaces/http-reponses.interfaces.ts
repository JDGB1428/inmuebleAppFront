import { CategoryDto } from "./response-dto.interfaces";
import { User } from "./response_api.interfaces";

export interface HttpResponseLaravelAPi {
    token: string;
    user:  User;
}

export interface HttpResponseProperty<T> {
    message: string;
    data: T;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface BackendResponseDto<T> {
  message: string;
  data?: T | T[];
  property?: T;
  user?: T;
}

export interface HTTPResponseCategory {
    data: CategoryDto[];
}
