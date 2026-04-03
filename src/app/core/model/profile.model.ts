import { AuthUserResponseDTO, ProfileResponseDTO, SingleProfileResponseDTO } from '@interfaces/response-dto.interfaces';
// model/profile.mapper.ts

import { ProfileGroupsResponse,} from "@interfaces/response-dto.interfaces";
import { AuthUser, Profile, ProfileGroups, UserProfileData } from "@interfaces/response_api.interfaces";

export class ProfileMapper {

  static mapToProfile(dto: ProfileResponseDTO): Profile {
    return {
      id: dto.id,
      userId: dto.user_id,
      address: dto.address || 'Sin dirección',
      nationality: dto.nationality || 'Sin nacionalidad',
      avatar: dto.avatar || 'assets/default-avatar.png',
      phone: dto.phone || 'N/A',
      whatsapp: dto.whatsapp || 'N/A',
      jobTitle: dto.job_title || 'Sin cargo',
      yearsOfExperience: dto.years_of_experience,
      specialties: dto.specialties,
      socialLinks: dto.social_links,
      user: {
        id: dto.user.id,
        name: dto.user.name,
        email: dto.user.email
      }
    };
  }

  static mapToProfileGroups(dto: ProfileGroupsResponse): ProfileGroups {
    return {
      active: dto.active.map(profile => this.mapToProfile(profile)),
      trashed: dto.trashed.map(profile => this.mapToProfile(profile))
    };
  }

  static mapToUserProfileData(dto: SingleProfileResponseDTO | null | undefined): UserProfileData | null {
    if (!dto) return null;

    return {
      id: dto.id,
      userId: dto.user_id,
      address: dto.address || 'Sin dirección',
      nationality: dto.nationality,
      avatar: dto.avatar || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
      phone: dto.phone || 'N/A',
      whatsapp: dto.whatsapp || 'N/A',
      jobTitle: dto.job_title || 'Sin cargo',
      yearsOfExperience: dto.years_of_experience,
      specialties: dto.specialties,
      socialLinks: dto.social_links,
    };
  }

  // Mapea el objeto User principal
  static mapToAuthUser(dto: AuthUserResponseDTO): AuthUser {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      profile: this.mapToUserProfileData(dto.profile)
    };
  }
}
