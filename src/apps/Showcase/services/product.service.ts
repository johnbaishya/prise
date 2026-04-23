import { checkCompanyOwnershipByCompanyId } from "@/core/company/company.service";
import Product from "../models/product.model";
import { CreateProductDTO, ListProductsQueryDTO, UpdateProductDTO } from "../schema/product.schema";
import { IProduct, IProductWithGallery } from "../types/showcase.interface";
import { verifyProductCategoryofCompany } from "./productCategory.service";
import app from "@/app";
import AppError from "@/libs/errorHandler";
import { verifyProductTagOfCompany } from "./productTag.service";
import { addGalleryImages, deleteMultipleGalleryImagesByEntityId, getGalleryImages } from "@/core/gallery/gallery.service";
import { EntityType, IGallery, MulterImageFile } from "@/core/gallery/gallery.types";
import { verify } from "crypto";
import Gallery from "@/core/gallery/gallery.model";











// to check if the product belongs to the company that user owns before allowing them to update the product
export const verifyProductOwnershipByProductId = async (userId:string,productId:string):Promise<void>=>{
  try{
    const product = await Product.findById(productId);
    if(!product) {
      const error = new AppError("Product not found", 404);
      throw error;
    }
    // check if the user is the owner of the company that the product belongs to before allowing them to update the product
    const isOwner = await checkCompanyOwnershipByCompanyId(userId, product.company.toString());
    if (!isOwner) {
      throw new AppError("You are not authorized to update this product", 403);
    }
  }catch(error){
    throw new AppError("You are not authorized to update this product", 403);
  }
}











// service to verify if a product belongs to a company
export const verifyproductOfCompany = async (productId: string, companyId: string): Promise<void> => {
  const product:IProduct|null = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    (error as any).status = 404;
    throw error;
    }
    const isOfCompany = product.company.toString() === companyId;
    if (!isOfCompany) {
      const error = new Error("Product does not belong to the specified company");
      (error as any).status = 400;
      throw error;
    }
};












// to verify if a user is authorized to access a product by checking if the product belongs to a company that the user owns
export const verifyProductOwnership = async (productId: string, userId: string): Promise<void> => {
    const product = await Product.findById(productId);
    if (!product) {
        const error = new Error("Product not found");
        (error as any).status = 404;
        throw error;
    }
    const isOwner = await checkCompanyOwnershipByCompanyId(userId, product.company.toString());
    if (!isOwner) {
        const error = new Error("You are not authorized to access this product");
        (error as any).status = 403;
        throw error;
    }
}











// to verify if user is the owner of the company and if the category and tags belong to the company before allowing them to create a product
export const verifyProductCreationEligibilityForUser = async (userId:string,companyId:string,productCategoryId:string,productTagIds?:string[]):Promise<void>=>{
  try {
    // first check if the user is the owner of the company before allowing them to create a product for that company
    const isOwner = await checkCompanyOwnershipByCompanyId(userId, companyId);
    if (!isOwner) {
      throw new AppError("You are not authorized to create a product for this company", 403);
    }
    // then check if the product category belongs to the company and if the product tags belong to the company before allowing them to create a product for that company
    await verifyProductCategoryofCompany(companyId, productCategoryId);
    for (const tagId of productTagIds??[]) {
      await verifyProductTagOfCompany(companyId, tagId);
    }
    
  } catch (error) {
    throw error;
  }
}












// to verify if user is eligible to update a product by checking if they are the owner of the company and if the category and tags belong to the company before allowing them to update a product for that company
export const verifyProductUpdateEligibilityForUser = async (userId:string,productId:string,productCategoryId?:string,productTagIds?:string[]):Promise<void>=>{
  try {
    // first check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const companyId = product.company.toString(); 
    // verify if the user is the owner of the company that the product belongs to before allowing them to update the product
    await checkCompanyOwnershipByCompanyId(userId, companyId);
    // check if the product belongs to the company before allowing them to update the product
    await verifyproductOfCompany(productId, companyId);
    // then check if the product category belongs to the company and if the product tags belong to the company before allowing them to update a product for that company
    if (productCategoryId) {
      await verifyProductCategoryofCompany(companyId, productCategoryId);
    }
    for (const tagId of productTagIds ?? []) {
      await verifyProductTagOfCompany(companyId, tagId);
    }
  } catch (error) {
    throw error;
  }
}
















// function to create a product 
export const createProduct = async (data: CreateProductDTO,userId:string, imageFiles?:MulterImageFile[]): Promise<IProductWithGallery> => {
  const {companyId,productCategoryId,tags} = data;
  try {
    // check user eligibility to create a product for the company by checking if they are the owner of the company and if the category and tags belong to the company
    await verifyProductCreationEligibilityForUser(userId,companyId,productCategoryId,tags);
    const product = await Product.create(data);

    // if images are provided, add them to the gallery of the product
    const gallery = await addGalleryImages(EntityType.Product,product._id.toString(),imageFiles??[]);

    return{
      ...product.toObject(),
      gallery:gallery
    } as IProductWithGallery;
  } catch (error) {
    throw error;
  }
};















// function to update a product by id with ownership and eligibility checks
export const updateProduct = async (id: string, data: Partial<UpdateProductDTO>,userId:string): Promise<IProductWithGallery> => {
  const {productCategoryId} = data;
  try {
    await verifyProductUpdateEligibilityForUser(userId,id,productCategoryId,data.tags??[]);
    const product:IProduct| null = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const gallery = await getGalleryImages(EntityType.Product,id);
    return {
      ...product?.toObject(),
      gallery:gallery
    } as IProductWithGallery;
  } catch (error) {
    throw error;
  }
};











// function to add gallery images to a product after checking if the user is the owner of the company that the product belongs to
export const addProductGalleryImages = async (productId:string,userId:string,imageFiles:MulterImageFile[]):Promise<IGallery[]>=>{
    try {
        await verifyProductOwnership(productId,userId);
        const gallery = await addGalleryImages(EntityType.Product,productId,imageFiles);
        return gallery;
    } catch (error) {
      throw error;
    }
}














// function to get a product by id 
export const getProductById = async (id: string): Promise<IProductWithGallery> => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const gallery = await getGalleryImages(EntityType.Product,id);
    return {
      ...product.toObject(),
      gallery
    } as IProductWithGallery;
    
  } catch (error) {
    throw new AppError((error as Error).message, 500);
  }
};









// function to delete a product by id with ownership check
export const deleteProduct = async (id: string, userId: string): Promise<void> => {
  try {
    // first verify if the user is the owner of the company that the product belongs to before allowing them to delete the product
    await verifyProductOwnership(id, userId);
    // then delete the product from the database
    await Product.findByIdAndDelete(id);
    // after deleting the product from the database we need to delete the gallery images of the product from s3 and from the database
    await deleteMultipleGalleryImagesByEntityId(EntityType.Product, id);
  } catch (error) {
    throw new AppError((error as Error).message, (error as any).status || 500);
  }
}






// export const listProducts = async (): Promise<IProduct[]> => {
//   const products = await Product.find();
//   return products;
// };  





export const listProducts = async (
  companyId:string,
  query: ListProductsQueryDTO
) => {
  try {
    
    const {
      page = 1,
      limit = 10,
      search,
      tag,
      category,
      sortBy = "createdAt",
      order = "desc"
    } = query;
  
    const filter: any = { company: companyId };
  
    // 🔍 search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
  
    // 🏷 tag filter
    if (tag) {
      const tagsArray = tag.split(",");
      filter.tags = { $in: tagsArray };
    }
  
    // 📂 category filter
    if (category) {
      filter.productCategory = category;
    }
  
    const skip = (page - 1) * limit;
  
    const products = await Product.find(filter)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .lean<IProduct[]>();
  
      
    const productIds = products.map(p => p._id);
      
    const galleries = await Gallery.find({
      entityType: EntityType.Product,
      entityId: { $in: productIds }
    }).lean();
      
      
    const galleryMap = new Map<string, any[]>();
    
    galleries.forEach(g => {
      const key = g.entityId.toString();
      
      if (!galleryMap.has(key)) {
        galleryMap.set(key, []);
      }
      
      galleryMap.get(key)!.push(g);
    });
      
      
    const productsWithGallery = products.map(product => ({
      ...product,
      gallery: galleryMap.get(product._id.toString()) || []
    }));
      
    const total = await Product.countDocuments(filter);
    return {
      data: productsWithGallery,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new AppError((error as Error).message, 500);
  }
};