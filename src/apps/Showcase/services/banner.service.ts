import { verifyCompanyOwnershipByCompanyId } from "@/core/company/company.service";
import { addGalleryImages, getGalleryImages } from "@/core/gallery/gallery.service";
import { EntityType, IGallery, MulterImageFile } from "@/core/gallery/gallery.types";



// function to add banner images to a product after checking if the user is the owner of the company
export const addShowcaseBannerImages = async (companyID:string,userId:string,imageFiles:MulterImageFile[]):Promise<IGallery[]>=>{
    try {
        await verifyCompanyOwnershipByCompanyId(userId,companyID);
        const gallery = await addGalleryImages(EntityType.ShowcaseBanner,companyID,imageFiles);
        return gallery;
    } catch (error) {
      throw error;
    }
}




export const getShowcaseBannerImages  = async (companyId:string):Promise<IGallery[]>=>{
  try {
    const gallery = await getGalleryImages(EntityType.ShowcaseBanner,companyId);
    return gallery;
  } catch (error) {
    throw error;
  }
}
