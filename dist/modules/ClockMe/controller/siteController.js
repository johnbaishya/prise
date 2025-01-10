"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteGallery = exports.deleteSiteGalleryImage = exports.addSiteGallery = exports.getsitesByCompanyId = exports.getSiteDetail = exports.getMySites = exports.deleteSite = exports.updateSite = exports.addSite = void 0;
const ClockMeSite_1 = __importDefault(require("../models/ClockMeSite"));
const auth_1 = require("../../../libs/auth");
const Company_1 = __importDefault(require("../../Common/model/Company"));
const reqres_1 = require("../../../libs/reqres");
const EntityEnum_1 = require("../../Common/types/EntityEnum");
const Gallery_1 = __importDefault(require("../../Common/model/Gallery"));
const ImageHandler_1 = require("../../../services/ImageHandler");
//  to add a site
/**
 * @swagger
 * /api/clockme/site:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Add Site
 *     description: create a new site.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_id:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon:
 *                 type: string
 *             required:
 *               - address
 *     responses:
 *       200:
 *         description: created Site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const addSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user;
        let reqBody = req.body;
        // let site:typeof ClockMeSite = await ClockMeSite.create({user_id:user.id,address,lat,lon})
        if (reqBody.company_id) {
            let companyId = reqBody.company_id;
            let company = yield Company_1.default.findById(companyId);
            if (company) {
                let isOwner = (0, auth_1.checkOwnership)(req, res, company);
                if (!isOwner) {
                    return;
                }
            }
            else {
                res.status(400).json({ message: "company not found" });
                return;
            }
        }
        let site = new ClockMeSite_1.default(Object.assign({ user_id: user.id }, reqBody));
        let newSite = yield site.save();
        res.status(201).json(newSite);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).send(error);
    }
});
exports.addSite = addSite;
// to update the site
/**
 * @swagger
 * /api/clockme/site/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Update Site
 *     description: update the site.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_id:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon:
 *                 type: string
 *     responses:
 *       200:
 *         description: updated Site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const updateSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let user = req.user;
        let siteId = req.params.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        if (site) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, site);
            if (!isOwner) {
                return;
            }
            // let newSite = await site.updateOne(req.body)
            let newSite = yield ClockMeSite_1.default.findByIdAndUpdate(siteId, req.body, { new: true });
            res.status(201).json(newSite);
        }
        else {
            res.status(400).json({ message: "site not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.updateSite = updateSite;
// to delete the site
/**
 * @swagger
 * /api/clockme/site/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Delete Site
 *     description: delete the site.
 *     responses:
 *       200:
 *         description: created Site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const deleteSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let user = req.user;
        let siteId = req.params.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        if (site) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, site);
            if (!isOwner) {
                return;
            }
            yield ClockMeSite_1.default.findByIdAndDelete(siteId, req.body);
            res.status(201).json({ message: "site deleted" });
        }
        else {
            res.status(400).json({ message: "site not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.deleteSite = deleteSite;
// to get the user's sites
/**
 * @swagger
 * /api/clockme/site:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Get user Sites
 *     description: to get all the sites created by current user.
 *     responses:
 *       200:
 *         description: site[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getMySites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let sites = yield ClockMeSite_1.default.find({ user_id: user_id });
        // only sites created by current user is shown
        res.status(200).json(sites);
    }
    catch (error) {
        console.log("error from getMySite", error);
        res.status(500).send(error);
    }
});
exports.getMySites = getMySites;
// to get the detail of a site
/**
 * @swagger
 * /api/clockme/site/:id:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Get Site Detail
 *     description: to get the details of a site.
 *     responses:
 *       200:
 *         description: site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getSiteDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let siteId = req.params.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        if (site) {
            res.status(200).json(site);
        }
        else {
            res.status(400).json({ message: "Site not found" });
        }
    }
    catch (error) {
        console.log("error from getSiteDetail", error);
        res.status(500).send(error);
    }
});
exports.getSiteDetail = getSiteDetail;
// to get all the sites of a certain Company
/**
 * @swagger
 * /api/clockme/company/:id/site:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Get Sites by Company
 *     description: to get all the sites of a certain company.
 *     responses:
 *       200:
 *         description: site[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getsitesByCompanyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield Company_1.default.findById(companyId);
        if (company) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, company);
            if (!isOwner) {
                return;
            }
        }
        else {
            res.status(400).json({ message: "company not found" });
            return;
        }
        let sites = yield ClockMeSite_1.default.find({ company_id: companyId });
        res.status(200).json(sites);
    }
    catch (error) {
        console.log("error from getSitesByCompanyId", error);
        res.status(500).send(error);
    }
});
exports.getsitesByCompanyId = getsitesByCompanyId;
// function to add gallery images of a site
/**
 * @swagger
 * /api/clockme/site/:id/gallery:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: add site Gallery
 *     description: Add images to gallery of site.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: gallery[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const addSiteGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let siteId = req.params.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        // checking if company exists
        if (!site) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "site not found");
            return;
        }
        // checking if the current user owns the company
        let isOwner = (0, auth_1.checkOwnership)(req, res, site);
        if (!isOwner) {
            return;
        }
        // let body:AddGalleryReqBody = req.body;
        let files = req.files;
        // checking if there are no any files;
        if (!files) {
            files = [];
            ;
            (0, reqres_1.sendSuccessResponse)(res, []);
            return;
        }
        // checking if files are in other format rather than array.
        if (!Array.isArray(files)) {
            files = [];
            (0, reqres_1.sendSuccessResponse)(res, []);
            return;
        }
        let galleriesBody = files.map((item) => {
            return {
                entity_name: EntityEnum_1.EntityNameEnum.ClockMeSite,
                record_id: siteId,
                key: item.key,
                location: item.location,
                bucket: item.bucket,
                acl: item.acl
            };
        });
        let gallery = yield Gallery_1.default.create(galleriesBody);
        (0, reqres_1.sendSuccessResponse)(res, gallery);
    }
    catch (error) {
        console.log("error from addSiteGallery", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.addSiteGallery = addSiteGallery;
//  to delete the site gallery
/**
 * @swagger
 * /api/clockme/site/gallery/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: delete site gallery
 *     description: delete an image from the site's gallery
 *     responses:
 *       200:
 *         description: image deleted successfully.
 *       401:
 *         description: unauthorized.
 *       500:
 *         description: something wrong
 *
 */
const deleteSiteGalleryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageKey = req.params.id;
        let gallery = yield Gallery_1.default.findOne({ key: imageKey });
        // checkimng if gallery image exist
        if (!gallery) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "image does not exist");
            return;
        }
        let siteId = gallery.record_id;
        let galleryid = gallery.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        // checking if  company exist
        if (!site) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "site not found");
            return;
        }
        // checkking if the user has created thhis image
        const isowner = (0, auth_1.checkOwnership)(req, res, site);
        if (!isowner) {
            return;
        }
        yield (0, ImageHandler_1.deleteS3Image)(imageKey);
        yield Gallery_1.default.findByIdAndDelete(galleryid);
        (0, reqres_1.sendSuccessResponse)(res, { message: "image deleted successfully" });
    }
    catch (error) {
        console.log("error from deleteSiteGallery", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.deleteSiteGalleryImage = deleteSiteGalleryImage;
// to get the gallery of site
/**
 * @swagger
 * /api/clockme/site/:id/gallery:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: get Site's gallery
 *     description: get all the images of site's gallery.
 *     responses:
 *       200:
 *         description: gallery[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getSiteGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let siteId = req.params.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        if (!site) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "site not found");
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, site);
        if (!isOwner) {
            return;
        }
        let gallery = yield Gallery_1.default.find({ entity_name: EntityEnum_1.EntityNameEnum.ClockMeSite, record_id: siteId });
        (0, reqres_1.sendSuccessResponse)(res, gallery);
    }
    catch (error) {
        console.log("error from getSiteGallery", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.getSiteGallery = getSiteGallery;
