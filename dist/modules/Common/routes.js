"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const companyController_1 = __importDefault(require("./controller/companyController"));
const authController_1 = require("./controller/authController");
const uploadImage_1 = __importDefault(require("../../middleware/uploadImage"));
const testController_1 = require("./controller/testController");
const router = (0, express_1.Router)();
// routes for user
router.get("/", testController_1.testFunction);
router.post("/user/register", authController_1.userRegister);
router.post("/user/login", authController_1.userLogin);
router.post("/user/profile-pic", [auth_1.default, uploadImage_1.default.single("image")], authController_1.ChangeUserProfilePicture);
// routes for company
router.post("/company", auth_1.default, companyController_1.default.addCompany);
router.get("/company", auth_1.default, companyController_1.default.listMyCompanies);
router.put("/company/:id", auth_1.default, companyController_1.default.updateCompany);
router.post("/company/:id/profile-pic", [auth_1.default, uploadImage_1.default.single("image")], companyController_1.default.ChangeCompanyProfilePicture);
router.delete("/company/:id", auth_1.default, companyController_1.default.deleteCompany);
router.get("/company/:id", auth_1.default, companyController_1.default.getCompanyDetail);
router.post("/company/:id/gallery", [auth_1.default, uploadImage_1.default.array("images")], companyController_1.default.addCompanyGallery);
router.get("/company/:id/gallery", auth_1.default, companyController_1.default.getCompanyGallery);
router.delete("/company/gallery/:id", auth_1.default, companyController_1.default.deleteCompanyGalleryImage);
const commonRoutes = router;
exports.default = commonRoutes;
