import { CategoryAdapter } from "../interfaces/category.interfaces"
import { CategoryDto } from "../interfaces/response_api.interfaces"

export class CategoryModel {

  static mapHttpResponseCategoryToCategoryAdapter(data: CategoryDto): CategoryAdapter {
    return {
      id: data.id,
      name: data.name,
      icon: data.icon,
    }
  }

  static mapHttpReponseCategoryToCategoryAdapterArray( data: CategoryDto[]): CategoryAdapter[]{
    return data.map(this.mapHttpResponseCategoryToCategoryAdapter)
  }
}
