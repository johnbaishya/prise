import { Router } from "express";
import verifyToken from "../../middleware/auth";
import companyController from "./controller/companyController";
import { ChangeUserProfilePicture, userLogin, userRegister } from "./controller/authController";
import uploadImage from "../../middleware/uploadImage";
import { testFunction } from "./controller/testController";


const router = Router();

// routes for user
router.get("/",testFunction)
router.post("/user/register",userRegister);
router.post("/user/login",userLogin);
router.post("/user/profile-pic",[verifyToken,uploadImage.single("image")],ChangeUserProfilePicture)


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