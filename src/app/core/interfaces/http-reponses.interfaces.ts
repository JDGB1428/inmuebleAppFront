import { CategoryDTO } from "./response-dto.interfaces";
import { User } from "./response_api.interfaces";

export interface HttpResponseLaravelAPi{
    token: string;
    data:  User;
}

export interface HttpResponseProperty<T> {
    message?: string;
    data: T;
}

export interface HTTPResponseCategory {
    data: CategoryDTO[];
}

export interface HttpResponseRoleRequest {
  message:string
}
