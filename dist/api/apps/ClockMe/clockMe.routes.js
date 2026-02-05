"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const site_controller_1 = require("./controllers/site.controller");
const userSiteAssigned_controller_1 = require("./controllers/userSiteAssigned.controller");
const userSiteSchedule_controller_1 = require("./controllers/userSiteSchedule.controller");
const testController_1 = require("../../../apps/ClockMe/controller/testController");
const uploadImage_1 = __importDefault(require("../../../middleware/uploadImage"));
const clock_controller_1 = require("./controllers/clock.controller");
const router = (0, express_1.Router)();
// routes for sites
router.get("/site", site_controller_1.getMySites);
router.get("/site/:id", site_controller_1.getSiteDetail);
router.get("/company/:id/site", site_controller_1.getsitesByCompanyId);
router.post("/site", site_controller_1.addSite);
router.put("/site/:id", site_controller_1.updateSite);
router.delete("/site/:id", site_controller_1.deleteSite);
router.post("/site/:id/gallery", uploadImage_1.default.array("images"), site_controller_1.addSiteGallery);
router.get("/site/:id/gallery", site_controller_1.getSiteGallery);
router.delete("/site/gallery/:id", site_controller_1.deleteSiteGalleryImage);
// routes for user site assigned
router.get("/user-site-assign", userSiteAssigned_controller_1.getSitesAssigned);
router.get("/site/:id/user-site-assign", userSiteAssigned_controller_1.getSiteAssignedBySiteId);
router.post("/user-site-assign", userSiteAssigned_controller_1.assignUserToSite);
router.put("/user-site-assign/:id", userSiteAssigned_controller_1.updateUserSiteStatus);
router.delete("/user-site-assign/:id", userSiteAssigned_controller_1.deleteUserSiteAssigned);
// routes for user site schedule
router.post("/schedule", userSiteSchedule_controller_1.createSchedule);
router.get("/user-site-assign/:id/schedule", userSiteSchedule_controller_1.getScheduleByUserSiteAssign);
router.get("/schedule/:id", userSiteSchedule_controller_1.getScheduleDetail);
router.put("/schedule/:id", userSiteSchedule_controller_1.updateSchedule);
router.delete("/schedule/:id", userSiteSchedule_controller_1.deleteSchedule);
// routes for clock
router.get("/site/:id/clock-in", clock_controller_1.startClock);
router.put("/clock/:id", clock_controller_1.updateClock);
// teting routes
router.post("/test", uploadImage_1.default.single("image"), testController_1.test1);
const clockMeRoutes = router;
exports.default = clockMeRoutes;
