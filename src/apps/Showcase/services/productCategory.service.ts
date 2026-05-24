import ProductCategory from "../models/productCategory.model";
import { IProductCategory } from "../../../Types/entities/showcase-entity";
import { check } from "zod";
import { get } from "http";
import Product from "../models/product.model";
import { checkCompanyOwnershipByCompanyId, checkifCompanyExists } from "@/core/company/company.service";
import { createProductCategoryDTO, ListProductCategoryQueryDTO, updateProductCategoryDTO } from "@/Types/request/showcase-request";
import { ListProductCategoryResponse } from "@/Types/response/showcase-response";
import { MulterImageFile } from "@/core/gallery/gallery.types";
import AppError from "@/libs/errorHandler";




// function to check if product category exists by id
export const checkProductCategoryExists = async (productCategoryId:string):Promise<boolean>=>{
    try {
        const productCategory = await ProductCategory.findById(productCategoryId);
        if(!productCategory) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};


// serviuce to verify if a Product category belongs to a companyq
export const verifyProductCategoryofCompany = async (companyId:string,productCategoryId:string):Promise<void>=>{
    const productCategory:IProductCategory|null = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
        const error = new Error("Product category not found");
        (error as any).status = 404;
        throw error;
    }
    let isOfCompany = productCategory.company.toString() === companyId;
    if(!isOfCompany) {
        const error = new Error("you are not authorized to use this product category for this company");
        (error as any).status = 403;
        throw error;
    }
}



// ==========================================================================================================
// function to check if user is owner of the product category by product category id also checks if the product category exists
export const getProductCategoryWithOwnershipAndExistance = async (productCategoryId:string,userId:string):Promise<IProductCategory>=>{
    const productCategory:IProductCategory | null = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
        const error = new Error("Product category not found");
        (error as any).status = 404;
        throw error;
    }
    const isOwner = await checkCompanyOwnershipByCompanyId(userId, productCategory.company.toString());
    if(!isOwner){
        const error = new Error("You are not authorized to perform this action");
        (error as any).status = 403;
        throw error;    
    }
    return productCategory;
};





// function to check if product category exists by id and if user is owner
export const checkProductCategoryOwnership = async (productCategoryId:string,userId:string):Promise<boolean>=>{
    try {
        const productCategory:IProductCategory | null = await ProductCategory.findById(productCategoryId);
        if (!productCategory) {
            return false;
        }
        const isOwner = await checkCompanyOwnershipByCompanyId(userId, productCategory.company.toString());
        return isOwner;
    } catch (error) {
        return false;
    }
};



// =======================================================================================================
// function to upload the image of the product Category
export const updateProductCategoryImage = async(file:MulterImageFile,categoryId:string):Promise<IProductCategory> =>{
    try {
        if(!file){
            const error = new AppError("no image ",400)
            throw error;
        }
            const category = await ProductCategory.findByIdAndUpdate(categoryId,{image:file.location},{new:true});
            if(!category){
                const error = new AppError("Product Category not found ",500)
                throw error;
            }
            return category as IProductCategory;
        
    } catch (error) {
        throw error;
    }
}




// ===========================================================================================================================
// function to create a product category with company ownership check
export const createProductCategory = async (data:createProductCategoryDTO,userId:string,file?:MulterImageFile):Promise<IProductCategory>=>{
    try {
        const isOwner = await checkCompanyOwnershipByCompanyId(userId,data.companyId);
        if (!isOwner) {
            const error = new Error("You are not authorized to create a product category for this company");
            (error as any).status = 403;
            throw error;
        }

        if(file){
            const imageUrl = file.location;
            data.image = imageUrl;
        }

        const payload = {
            ...data,
            company:data.companyId
        }

        const productCategory:IProductCategory = await ProductCategory.create(payload); 
        return productCategory;
    } catch (error) {
        throw error
    }
};



// ===========================================================================================================================
// function to get product categories by company id 
export const getProductCategoriesByCompanyId = async (
    companyId:string,
    query:ListProductCategoryQueryDTO
):Promise<ListProductCategoryResponse>=>{
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = "createdAt",
            order = "desc"
        } = query;

        // build the filter obhject and make sure to list the categories only of a company
        const filter: any = { company: companyId };

        // 🔍 search
        // search from the name or the desctiption of the category
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // to skip the data of previous pages and get the data of the current page
        const skip = (page - 1) * limit;

        const companyExist = await checkifCompanyExists(companyId);
        if (!companyExist) {
            const error = new Error("Company not found");
            (error as any).status = 404;
            throw error;
        }

        // const productCategories:IProductCategory[] = await ProductCategory.find({company:companyId});   

        const productCategories = await ProductCategory.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean<IProductCategory[]>();

        const total = await ProductCategory.countDocuments(filter);

        const response:ListProductCategoryResponse = {
            data: productCategories,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
         return response;
    } catch (error) {
        throw error
    }
};



// ==========================================================================================================================
export const getProductCategoryById = async (id:string):Promise<IProductCategory>=>{
    try {
        const productCategory = await ProductCategory.findById(id);
        if (!productCategory) {
            const error = new Error("Product category not found");
            (error as any).status = 404;
            throw error;
        }   
        return productCategory;
    } catch (error) {
        throw error
    }
};



// ==========================================================================================================================
// function to update product category by id with company ownership check
export const updateProductCategory = async (productCategoryId:string,data:updateProductCategoryDTO,userId:string,file?:MulterImageFile):Promise<IProductCategory>=>{
    try {
        const {name,slug,description} = data
        let newData:updateProductCategoryDTO = {name,slug,description}
        if(file){
            const imageUri = file.location;
            newData.image = imageUri
        }
        await getProductCategoryWithOwnershipAndExistance(productCategoryId,userId);
        const updatedProductCategory = await ProductCategory.findByIdAndUpdate(productCategoryId,newData,{new:true});
        return updatedProductCategory;
    } catch (error) {
        throw error
    }
};




// ==========================================================================================================================
// function to delete product category by id with company ownership check
export const deleteProductCategory = async (id:string,userId:string)=>{
    try {
        await getProductCategoryWithOwnershipAndExistance(id,userId);
        const productCategory = await ProductCategory.findByIdAndDelete(id);
        return productCategory;
    } catch (error) {
        throw error
    }
};