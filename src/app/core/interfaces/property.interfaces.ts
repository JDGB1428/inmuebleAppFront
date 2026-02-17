export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  direction: string;
  room: number;
  area_m2: number;
  bathrooms: number;
  state: string;
  category_id: number;
  image: string[];
  user_id: number;
  updated_at: Date;
  created_at: Date;
}
