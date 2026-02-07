export interface UserAdapater {
  id: number,
  name: string,
  email:string,
  createdAt: Date,
  updatedAt:Date,
  phone: number | string,
  token: string
  roles: String[]
}
