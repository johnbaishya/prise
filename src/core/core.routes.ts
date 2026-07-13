import { Router } from "express";
import verifyToken from "../middleware/auth";
import companyController from "./company/company.controller";
import { ChangeUserProfilePicture, facebookLogin, getUser, googleLogin, updateUser, userLogin, userRegister, verifyAuthentication } from "./user/auth.controller";
import uploadImage from "../middleware/uploadImage";
import { testFunction } from "../modules/Common/controller/testController";
import { deleteGallery } from "./gallery/gallery.controller";


const router = Router();

// route to check if token is valid 
router.get("/user/verify-token",verifyToken,verifyAuthentication);

// routes for user
router.get("/asd",testFunction)
router.post("/user/register",userRegister);
// router.post("/user/register",testFunction);
router.post("/user/login",userLogin);
router.post("/user/google-login",googleLogin)
router.post("/user/facebook-login",facebookLogin)
router.post("/user/profile-pic",[verifyToken,uploadImage.single("profile_pic")],ChangeUserProfilePicture)
router.put("/user/profile",verifyToken,updateUser)
router.get("/user/profile",verifyToken,getUser)


// routes for company
router.post("/company",[verifyToken,uploadImage.single("brand_logo")],companyController.createCompany);
router.get("/company",verifyToken,companyController.listMyCompanies);
router.put("/company/:id",verifyToken,companyController.updateCompany);
router.post("/company/:id/profile-pic",[verifyToken,uploadImage.single("image")],companyController.ChangeCompanyProfilePicture)
router.post("/company/:id/brand-logo",[verifyToken,uploadImage.single("brand_logo")],companyController.ChangeCompanyBrandLogo)
router.delete("/company/:id",verifyToken,companyController.deleteCompany);
router.get("/company/:id",verifyToken,companyController.getCompanyDetail);
router.post("/company/:id/gallery",[verifyToken,uploadImage.array("images")],companyController.addCompanyGallery)
router.get("/company/:id/gallery",verifyToken,companyController.getCompanyGallery);
router.delete("/company/gallery/:id",verifyToken,companyController.deleteCompanyGalleryImage);


// routes for galeery
router.delete("/gallery/:id",verifyToken,deleteGallery)

const commonRoutes = router;

export default commonRoutes;