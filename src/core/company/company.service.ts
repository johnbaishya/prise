import { checkOwnershipStatus } from "@/libs/auth";
import Company from "./company.model";


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
        return false;
    }
    let isOwner:boolean  = checkOwnershipStatus(userId,ownerId);
    return isOwner;
}
