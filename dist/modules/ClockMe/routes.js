"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siteController_1 = require("./controller/siteController");
const userSiteAssignedController_1 = require("./controller/userSiteAssignedController");
const userSiteScheduleController_1 = require("./controller/userSiteScheduleController");
const testController_1 = require("./controller/testController");
const uploadImage_1 = __importDefault(require("../../middleware/uploadImage"));
const router = (0, express_1.Router)();
// routes for sites
router.get("/site", siteController_1.getMySites);
router.get("/site/:id", siteController_1.getSiteDetail);
router.get("/company/:id/site", siteController_1.getsitesByCompanyId);
router.post("/site", siteController_1.addSite);
router.put("/site/:id", siteController_1.updateSite);
router.delete("/site/:id", siteController_1.deleteSite);
router.post("/site/:id/gallery", uploadImage_1.default.array("images"), siteController_1.addSiteGallery);
router.get("/site/:id/gallery", siteController_1.getSiteGallery);
router.delete("/site/gallery/:id", siteController_1.deleteSiteGalleryImage);
// routes for user site assigned
router.get("/user-site-assign", userSiteAssignedController_1.getSitesAssigned);
router.get("/site/:id/user-site-assign", userSiteAssignedController_1.getSiteAssignedBySiteId);
router.post("/user-site-assign", userSiteAssignedController_1.assignUserToSite);
router.put("/user-site-assign/:id", userSiteAssignedController_1.updateUserSiteStatus);
router.delete("/user-site-assign/:id", userSiteAssignedController_1.deleteUserSiteAssigned);
// routes for user site schedule
router.post("/schedule", userSiteScheduleController_1.createSchedule);
router.get("/user-site-assign/:id/schedule", userSiteScheduleController_1.getScheduleByUserSiteAssign);
router.get("/schedule/:id", userSiteScheduleController_1.getScheduleDetail);
router.put("/schedule/:id", userSiteScheduleController_1.updateSchedule);
router.delete("/schedule/:id", userSiteScheduleController_1.deleteSchedule);
// teting routes
router.post("/test", uploadImage_1.default.single("image"), testController_1.test1);
const clockMeRoutes = router;
exports.default = clockMeRoutes;
