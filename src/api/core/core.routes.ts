import { Router } from "express";
import verifyToken from "../../middleware/auth";
import companyController from "./company.controller";
import { ChangeUserProfilePicture, facebookLogin, getUser, googleLogin, updateUser, userLogin, userRegister, verifyAuthentication } from "./auth.controller";
import uploadImage from "../../middleware/uploadImage";
import { testFunction } from "../../modules/Common/controller/testController";


const router = Router();

// route to check if token is valid 
router.get("/user/verify-token",verifyToken,verifyAuthentication);

// routes for user
router.get("/",testFunction)
router.post("/user/register",userRegister);
router.post("/user/login",userLogin);
router.post("/user/google-login",googleLogin)
router.post("/user/facebook-login",facebookLogin)
router.post("/user/profile-pic",[verifyToken,uploadImage.single("image")],ChangeUserProfilePicture)
router.put("/user/profile",verifyToken,updateUser)
router.get("/user/profile",verifyToken,getUser)


// routes for company
router.post("/company",verifyToken,companyController.addCompany);
router.get("/company",verifyToken,companyController.listMyCompanies);
router.put("/company/:id",verifyToken,companyController.updateCompany);
router.post("/company/:id/profile-pic",[verifyToken,uploadImage.single("image")],companyController.ChangeCompanyProfilePicture)
router.delete("/company/:id",verifyToken,companyController.deleteCompany);
router.get("/company/:id",verifyToken,companyController.getCompanyDetail);
router.post("/company/:id/gallery",[verifyToken,uploadImage.array("images")],companyController.addCompanyGallery)
router.get("/company/:id/gallery",verifyToken,companyController.getCompanyGallery);
router.delete("/company/gallery/:id",verifyToken,companyController.deleteCompanyGalleryImage)

const commonRoutes = router;

export default commonRoutes;