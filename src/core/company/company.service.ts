import { checkOwnershipStatus } from "@/libs/auth";
import Company from "./company.model";
import AppError from "@/libs/errorHandler";


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
