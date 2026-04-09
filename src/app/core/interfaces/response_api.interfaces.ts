import { AuthUserResponseDTO } from "./response-dto.interfaces";

export interface User {
    name:       string;
    email:      string;
    phone:      number;
    updated_at: Date;
    created_at: Date;
    id:         number;
    roles:      String[]
}

export interface PropertyImage {
  id: number;
  url: string;
}

// model/profile.model.ts

export interface UserTheProfile {
  id: number;
  name: string;
  email: string;
}

export interface Profile {
  id: number;
  userId: number;
  address: string;
  nationality: string;
  avatar: string;
  phone: string;
  license_number: string;
  whatsapp: string;
  jobTitle: string;        // Quitamos el null para simplificar el HTML
  yearsOfExperience: number | null;
  specialties: string | null;
  socialLinks: string | null;
  user: UserTheProfile;
}

export interface ProfileGroups {
  active: Profile[];
  trashed: Profile[];
}

export interface AuthUserApiResponse {
  data: AuthUserResponseDTO;
}

export interface UserProfileData {
  id: number;
  userId: number;
  address: string;
  nationality: string;
  avatar: string;
  phone: string;
  license_number: string,
  whatsapp: string;
  jobTitle: string;
  yearsOfExperience: number | null;
  specialties: string | null;
  socialLinks: string | null;
}

// Usuario adaptado
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  profile: UserProfileData | null;
}

export interface Commentary {
  id:          number;
  name:        string;
  avatar:      string;
  description: string;
  created_at:  Date;
}

export interface RoleRequest {
  id:          number;
  userId:      number;
  description: string;
  status:      string;
  createdAt:   Date;
  updatedAt:   Date;
  user:        UserTheProfile;
}








