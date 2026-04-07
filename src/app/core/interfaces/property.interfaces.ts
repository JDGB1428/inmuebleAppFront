export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  direction: string;
  city: string,
  country:string,
  room: number;
  area_m2: number;
  bathrooms: number;
  state: string;
  category_id: number;
  image: string[];
  user_id: number;
  updated_at: Date;
  created_at: Date;
  deleted_at?: Date | null;
  features: Features
}


export interface Features {
  patio?: boolean;
  terrace?: boolean;
  pool?: boolean;
  gated_community?: boolean;
  security_24_7?: boolean;
  bbq_zone?: boolean;
  balcony?: boolean;
  gym?: boolean;
  parking?: boolean;
  administration?: number;
}
