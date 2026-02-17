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
}

export type CategoryDto = {
    id:   number;
    name: string;
    icon: string;
}
