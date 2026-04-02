import { checkComanyOwnershipByCompanyId } from "@/libs/auth";
import ProductCategory from "../models/productCategory.model";
import { createProductCategoryDTO } from "../schema/productCategory.schema";
import { IProductCategory } from "../types/showcase.interface";
import { check } from "zod";
import { get } from "http";
import Product from "../models/product.model";
import { checkifCompanyExists } from "@/core/company/company.service";




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


// ==========================================================================================================
// function to check if user is owner of the product category by product category id also checks if the product category exists
export const getProductCategoryWithOwnershipAndExistance = async (productCategoryId:string,userId:string):Promise<IProductCategory>=>{
    const productCategory = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
        const error = new Error("Product category not found");
        (error as any).status = 404;
        throw error;
    }
    const isOwner = await checkComanyOwnershipByCompanyId(userId, productCategory.company_id.toString());
    if(!isOwner){
        const error = new Error("You are not authorized to perform this action");
        (error as any).status = 403;
        throw error;    
    }
    return productCategory;
};





// ===========================================================================================================================
// function to create a product category with company ownership check
export const createProductCategory = async (data:createProductCategoryDTO,userId:string):Promise<IProductCategory>=>{
    try {
        const isOwner = checkComanyOwnershipByCompanyId(userId,data.company_id);
        if (!isOwner) {
            const error = new Error("You are not authorized to create a product category for this company");
            (error as any).status = 403;
            throw error;
        }
        const productCategory:IProductCategory = await ProductCategory.create(data); 
        return productCategory;
    } catch (error) {
        throw error
    }
};



// ===========================================================================================================================
// function to get product categories by company id with company ownership check
export const getProductCategoriesByCompanyId = async (companyId:string,userId:string):Promise<IProductCategory[]>=>{
    try {
        const companyExist = await checkifCompanyExists(companyId);
        if (!companyExist) {
            const error = new Error("Company not found");
            (error as any).status = 404;
            throw error;
        }

        const productCategories:IProductCategory[] = await ProductCategory.find({company_id:companyId});   
        return productCategories;
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
export const updateProductCategory = async (productCategoryId:string,data:createProductCategoryDTO,userId:string):Promise<IProductCategory>=>{
    try {
        await getProductCategoryWithOwnershipAndExistance(productCategoryId,userId);
        const updatedProductCategory = await ProductCategory.findByIdAndUpdate(productCategoryId,data,{new:true});
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