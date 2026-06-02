import { checkOwnershipStatus } from "@/libs/auth";
import Company from "./company.model";
import AppError from "@/libs/errorHandler";
import { CreateCompanyDTO } from "@/Types/request/core-request";
import { MulterImageFile } from "../gallery/gallery.types";
import { ICompany } from "@/Types/entities/core-entities";
import { ListCompanyResponse } from "@/Types/response/core-response";
import { BaseListQueryDTO } from "@/Types/request/query";


// function to check if the company exists by id
export const checkifCompanyExists = async (companyId:string):Promise<boolean>=>{
    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return false;   
        }
        return true;
    } catch (error) {
        return false;
    }
};



// =--==========================================================================================================================
// function to check company ownership by company id
// it will be used in the controllers and services to check if the user is the owner of the company before allowing them to perform certain actions (like creating a product, etc.)
export const checkCompanyOwnershipByCompanyId = async (userId:string,companyId:string):Promise<boolean>=>{
    let company = await Company.findById(companyId);
    let ownerId = company?.get("user_id");
    if(!company) {
        const error = new AppError("Company not found", 404);
        throw error;
    }
    let isOwner:boolean  = checkOwnershipStatus(userId,ownerId);
    if(!isOwner){
        const error = new AppError("You are not authorized to perform this action", 403);
        throw error;    
    }else{
        return true;
    }
}


export const verifyCompanyOwnershipByCompanyId = async (userId:string,companyId:string):Promise<void>=>{
    try {
        const company = await Company.findById(companyId);
        if(!company) {
            const error = new AppError("Company not found", 404);
            throw error;
        }
        const ownerId = company?.get("user_id");
        const isOwner:boolean  = checkOwnershipStatus(userId,ownerId);
        if(!isOwner){
            const error = new AppError("You are not authorized to perform this action", 403);
            throw error;    
        }
    } catch (error) {
        throw error;
    }
}


export const createCompany = async(data:CreateCompanyDTO,userId:string,image?:MulterImageFile):Promise<ICompany>=>{
    try {
        const payLoad:Partial<ICompany> = {
            ...data,
            user_id:userId
        }
        if(image){
            payLoad.brand_logo = image.location;
        }
        const company = Company.create(payLoad);
        return company;

    } catch (error) {
        throw error;
    }
}



export const listCompanies = async(userId:string,query:BaseListQueryDTO)=>{

    try {
        
        const {
                page = 1,
                limit = 10,
                search,
                sortBy = "createdAt",
                order = "desc"
            } = query;
    
        const filter: any = { user_id: userId };
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

        
        // const productTags:IProductTag[] = await ProductTag.find({company:companyId});

        const companies= await Company.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean<ICompany[]>();

        const total = await Company.countDocuments(filter);

        const response:ListCompanyResponse = {
            data:companies,
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
}
