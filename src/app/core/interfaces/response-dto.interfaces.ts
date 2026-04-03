
export type PropertyDTO = {
  id: number;
  title: string;
  description: string;
  price: string | number;
  direction: string;
  room: string | number;
  area_m2: string | number;
  bathrooms: string | number;
  state: string;
  category_id: string | number;
  image: string[] | string | null;
  user_id: number;
  updated_at: string;
  created_at: string;
  deleted_at?: string | null;
  features: FeaturesDTO;
}

export type CategoryDTO = {
  id: number;
  name: string;
  icon: string;
}

export type FeaturesDTO = {
  patio?: boolean;
  terrace?: boolean;
  pool?: boolean;
  gated_community?: boolean;
  security_24_7?: boolean;
  bbq_zone?: boolean;
  balcony?: boolean;
  gym?: boolean;
  parking?: boolean;
  administration?: boolean;
}


export type UserResponseDTO = {
  id: number;
  name: string;
  email: string;
}

export type ProfileResponseDTO = {
  id: number;
  user_id: number;
  address: string;
  nationality: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  job_title: string | null;
  years_of_experience: number | null;
  specialties: string | null;
  social_links: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: UserResponseDTO;
}

export type ProfileGroupsResponse =  {
  active: ProfileResponseDTO[];
  trashed: ProfileResponseDTO[];
}

export type ApiResponse =  {
  data: ProfileGroupsResponse;
}

export type SingleProfileResponseDTO = {
  id: number;
  user_id: number;
  address: string;
  nationality: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  job_title: string | null;
  years_of_experience: number | null;
  specialties: string | null;
  social_links: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type AuthUserResponseDTO = {
  id: number;
  name: string;
  email: string;
  profile: SingleProfileResponseDTO | null; // Puede no tener perfil aún
}



