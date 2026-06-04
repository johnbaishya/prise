"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const company_controller_1 = __importDefault(require("./company/company.controller"));
const auth_controller_1 = require("./user/auth.controller");
const uploadImage_1 = __importDefault(require("../middleware/uploadImage"));
const testController_1 = require("../modules/Common/controller/testController");
const gallery_controller_1 = require("./gallery/gallery.controller");
const router = (0, express_1.Router)();
// route to check if token is valid 
router.get("/user/verify-token", auth_1.default, auth_controller_1.verifyAuthentication);
// routes for user
router.get("/asd", testController_1.testFunction);
router.post("/user/register", auth_controller_1.userRegister);
// router.post("/user/register",testFunction);
router.post("/user/login", auth_controller_1.userLogin);
router.post("/user/google-login", auth_controller_1.googleLogin);
router.post("/user/facebook-login", auth_controller_1.facebookLogin);
router.post("/user/profile-pic", [auth_1.default, uploadImage_1.default.single("image")], auth_controller_1.ChangeUserProfilePicture);
router.put("/user/profile", auth_1.default, auth_controller_1.updateUser);
router.get("/user/profile", auth_1.default, auth_controller_1.getUser);
// routes for company
router.post("/company", [auth_1.default, uploadImage_1.default.single("brand_logo")], company_controller_1.default.createCompany);
router.get("/company", auth_1.default, company_controller_1.default.listMyCompanies);
router.put("/company/:id", auth_1.default, company_controller_1.default.updateCompany);
router.post("/company/:id/profile-pic", [auth_1.default, uploadImage_1.default.single("image")], company_controller_1.default.ChangeCompanyProfilePicture);
router.post("/company/:id/brand-logo", [auth_1.default, uploadImage_1.default.single("brand_logo")], company_controller_1.default.ChangeCompanyBrandLogo);
router.delete("/company/:id", auth_1.default, company_controller_1.default.deleteCompany);
router.get("/company/:id", auth_1.default, company_controller_1.default.getCompanyDetail);
router.post("/company/:id/gallery", [auth_1.default, uploadImage_1.default.array("images")], company_controller_1.default.addCompanyGallery);
router.get("/company/:id/gallery", auth_1.default, company_controller_1.default.getCompanyGallery);
router.delete("/company/gallery/:id", auth_1.default, company_controller_1.default.deleteCompanyGalleryImage);
// routes for galeery
router.delete("/gallery/:id", auth_1.default, gallery_controller_1.deleteGallery);
const commonRoutes = router;
exports.default = commonRoutes;
