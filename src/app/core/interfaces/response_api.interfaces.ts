
export interface HttpResponseLaravelAPi {
    token: string;
    user:  User;
}

export interface User {
    name:       string;
    email:      string;
    phone:      number;
    updated_at: Date;
    created_at: Date;
    id:         number;
    roles:      String[]
}

export interface Inmueble {
    title:       string;
    description: string;
    price:       number;
    direction:   string;
    room:        number;
    area_m2:     number;
    bathrooms:   number;
    state:       string;
    images:      PropertyImage[];
}

export interface HTTPResponseCategory {
    data: CategoryDto[];
}

export interface CategoryDto {
    id:   number;
    name: string;
    icon: string;
}

export interface PropertyImage {
  id: number;
  url: string;
}

