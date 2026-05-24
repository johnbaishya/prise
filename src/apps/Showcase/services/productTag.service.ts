import { checkCompanyOwnershipByCompanyId, checkifCompanyExists } from "@/core/company/company.service";
import { createProductTagDTO, updateProductTagDTO } from "../schema/productTag.schema";
import { IProductTag } from "../../../Types/entities/showcase-entity";
import ProductTag from "../models/productTag.model";
import { th } from "zod/v4/locales";
import { ListProductTagQueryDTO } from "@/Types/request/showcase-request";
import { ListProductTagResponse } from "@/Types/response/showcase-response";
import { MulterImageFile } from "@/core/gallery/gallery.types";


// function to check if product tag exists by id
export const checkProductTagExists = async (productTagId:string):Promise<boolean>=>{
    try {
        const productTag = await ProductTag.findById(productTagId);
        if(!productTag) {
            return false;
        }
        return true;
    } catch (error) {
        throw error;
    }
};



// ===========================================================================================================================
// function to check if user is owner of the product tag by product tag id also checks if the product tag exists
export const getProductTagWithOwnershipAndExistance = async (productTagId:string,userId:string):Promise<IProductTag>=>{
    const productTag: IProductTag | null = await ProductTag.findById(productTagId);
    if (!productTag) {
        const error = new Error("Product tag not found");
        (error as any).status = 404;
        throw error;
    }
    const isOwner = await checkCompanyOwnershipByCompanyId(userId, productTag.company.toString()); 
    if (!isOwner) {
        const error = new Error("You are not authorized to access this product tag");
        (error as any).status = 403;
        throw error;
    }
    return productTag;
};






// to verify if user is owner of the product tag by product tag id also checks if the product tag exists
export const checkProductTagOwnership = async (productTagId:string,userId:string):Promise<boolean>=>{
    try {
        const productTag: IProductTag | null = await ProductTag.findById(productTagId);
        if (!productTag) {
            return false;
        }
        const isOwner:boolean = await checkCompanyOwnershipByCompanyId(userId, productTag.company.toString());
        return isOwner;
    } catch (error) {
        return false;
    }  
};







// ===========================================================================================================================
// function to create a product tag with company ownership check
export const createProductTag = async (data: createProductTagDTO,userId:string,file?:MulterImageFile): Promise<IProductTag> => {
    
    try {
        const {companyId} = data;
        const isOwner = await checkCompanyOwnershipByCompanyId(userId, companyId); 
    
        if (!isOwner) {
            const error = new Error("You are not authorized to create a product tag for this company");
            (error as any).status = 403;
            throw error;
        }
    
        let newData:createProductTagDTO = {...data}
        if(!!file){
            newData.image = file.location;
        }
    
        const payload = {
                ...newData,
                company:newData.companyId
            }
    
    
        const productTag = await ProductTag.create(payload);
        return productTag;
        
    } catch (error) {
        throw error;
    }
}





export const updateProductTag = async (id: string, data: Partial<updateProductTagDTO>,userId:string,file?:MulterImageFile): Promise<IProductTag> => {
    try {
        const {name,slug,description} = data
        await getProductTagWithOwnershipAndExistance(id, userId);

        let newData:updateProductTagDTO = {name,slug,description};
        if(!!file){
            newData.image = file.location;
        }
        const updatedProductTag = await ProductTag.findByIdAndUpdate(id,newData,{new:true});
        return updatedProductTag;
    } catch (error) {
        throw error;
    }
};




export const deleteProductTag = async (id: string,userId:string): Promise<IProductTag | null> => {
    try {
        await getProductTagWithOwnershipAndExistance(id, userId);
        const deletedProductTag = await ProductTag.findByIdAndDelete(id);
        return deletedProductTag;
    } catch (error) {
        throw error;
    }
};




export const getProductTagsByCompanyId = async (
    companyId:string,
    query:ListProductTagQueryDTO
):Promise<ListProductTagResponse>=>{
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
        // const productTags:IProductTag[] = await ProductTag.find({company:companyId});

        const productTags= await ProductTag.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean<IProductTag[]>();

        const total = await ProductTag.countDocuments(filter);

        const response:ListProductTagResponse = {
            data:productTags,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
        return response;
    } catch (error) {
        throw error;
    }   
};



export const getProductTagById = async (id:string):Promise<IProductTag>=>{
    try {
        const productTag = await ProductTag.findById(id);
        if (!productTag) {
            const error = new Error("Product tag not found");
            (error as any).status = 404;
            throw error;
        }
        return productTag;
    } catch (error) {
        throw error;
    }
};


// service to verify if a product tag belongs to a company
export const verifyProductTagOfCompany = async (companyId:string,productTagId:string):Promise<void>=>{
    const productTag = await ProductTag.findById(productTagId);
    if (!productTag) {
        const error = new Error("Product tag not found");
        (error as any).status = 404;
        throw error;
    }
    let isOfCompany = productTag.company.toString() === companyId;
    if(!isOfCompany) {
        const error = new Error("you are not authorized to use this product tag for this company");
        (error as any).status = 403;
        throw error;
    }
}