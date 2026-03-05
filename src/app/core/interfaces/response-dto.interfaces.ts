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
  feature: FeaturesDTO;
}

export type CategoryDTO = {
  id: number;
  name: string;
  icon: string;
}

export type FeaturesDTO = {
  patio: boolean;
  terrace: boolean;
  pool: boolean;
  gated_community: boolean;
  security_24_7: boolean;
}
