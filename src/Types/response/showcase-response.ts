import { IProductCategory, IProductTag, IProductWithGallery } from "../entities/showcase-entity"
import { ListResponse } from "./list-response"

export type ListProductResponse = ListResponse<IProductWithGallery>
export type ListProductCategoryResponse = ListResponse<IProductCategory>
export type ListProductTagResponse = ListResponse<IProductTag>