import { HttpResponseLaravelAPi } from "@interfaces/http-reponses.interfaces";
import { UserAdapater } from "@interfaces/user.interfaces";

export class AuthModel {

  static mapHttpResponseLaravelApi(data: HttpResponseLaravelAPi): UserAdapater {
    return {
      id: data.data.id,
      name: data.data.name,
      email: data.data.email,
      phone: Number(data.data.phone),
      createdAt: new Date(data.data.created_at),
      updatedAt: new Date(data.data.updated_at),
      token: data.token,
      roles: data.data.roles
    }
  }

  static mapHttpReponseLaravelApiArrayToUserAdapaterArray( data: HttpResponseLaravelAPi[]): UserAdapater[]{
    return data.map(this.mapHttpResponseLaravelApi)
  }
}
