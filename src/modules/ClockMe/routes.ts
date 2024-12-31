import { Router, Request,Response } from "express";
import { addSite, addSiteGallery, deleteSite, deleteSiteGalleryImage, getMySites, getSiteDetail, getSiteGallery, getsitesByCompanyId, updateSite } from "./controller/siteController";
import { assignUserToSite, deleteUserSiteAssigned, getSiteAssignedBySiteId, getSitesAssigned, updateUserSiteStatus } from "./controller/userSiteAssignedController";
import { createSchedule, deleteSchedule, getScheduleByUserSiteAssign, getScheduleDetail, updateSchedule } from "./controller/userSiteScheduleController";
import { test1 } from "./controller/testController";
import uploadImage from "../../middleware/uploadImage";

const router  = Router();

// routes for sites
router.get("/site",getMySites)
router.get("/site/:id",getSiteDetail)
router.get("/company/:id/site",getsitesByCompanyId)
router.post("/site",addSite)
router.put("/site/:id",updateSite)
router.delete("/site/:id",deleteSite)
router.post("/site/:id/gallery",uploadImage.array("images"),addSiteGallery)
router.get("/site/:id/gallery",getSiteGallery)
router.delete("/site/gallery/:id",deleteSiteGalleryImage);

// routes for user site assigned
router.get("/user-site-assign",getSitesAssigned);
router.get("/site/:id/user-site-assign",getSiteAssignedBySiteId)
router.post("/user-site-assign",assignUserToSite);
router.put("/user-site-assign/:id",updateUserSiteStatus);
router.delete("/user-site-assign/:id", deleteUserSiteAssigned);

// routes for user site schedule
router.post("/schedule",createSchedule);
router.get("/user-site-assign/:id/schedule",getScheduleByUserSiteAssign);
router.get("/schedule/:id",getScheduleDetail);
router.put("/schedule/:id",updateSchedule);
router.delete("/schedule/:id",deleteSchedule);

// teting routes
router.post("/test",uploadImage.single("image"),test1);





const clockMeRoutes  = router;
export default clockMeRoutes;