import { HttpResponseLaravelAPi } from "../interfaces/response_api.interfaces";
import { UserAdapater } from "../interfaces/user.interfaces";

export class AuthModel {

  static mapHttpResponseLaravelApi(data: HttpResponseLaravelAPi): UserAdapater {
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      phone: String(data.user.phone),
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(data.user.updated_at),
      token: data.token,
      roles: data.user.roles
    }
  }

  static mapHttpReponseLaravelApiArrayToUserAdapaterArray( data: HttpResponseLaravelAPi[]): UserAdapater[]{
    return data.map(this.mapHttpResponseLaravelApi)
  }
}
