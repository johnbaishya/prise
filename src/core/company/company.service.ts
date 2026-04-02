import Company from "./company.model";


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