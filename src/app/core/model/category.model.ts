import { CategoryAdapter } from "@interfaces/category.interfaces"
import { CategoryDTO } from "@interfaces/response-dto.interfaces"

export class CategoryModel {

  static mapHttpResponseCategoryToCategoryAdapter(data: CategoryDTO): CategoryAdapter {
    return {
      id: data.id,
      name: data.name,
      icon: data.icon,
    }
  }

  static mapHttpReponseCategoryToCategoryAdapterArray( data: CategoryDTO[]): CategoryAdapter[]{
    return data.map(this.mapHttpResponseCategoryToCategoryAdapter)
  }
}
