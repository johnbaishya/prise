"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getCompanyDetail = exports.listMyCompanies = exports.deleteCompany = exports.updateCompany = exports.createCompany = void 0;
const company_model_1 = __importDefault(require("./company.model"));
const auth_1 = require("../../libs/auth");
const reqest_1 = require("../../libs/reqest");
const gallery_types_1 = require("../gallery/gallery.types");
const gallery_model_1 = __importDefault(require("../gallery/gallery.model"));
const ImageHandler_1 = require("../gallery/ImageHandler");
const companyService = __importStar(require("./company.service"));
// to create a company
/**
 * @swagger
 * /api/company:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: Add Company
 *     description: create a new company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon:
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *             required:
 *               - name
 *               - category
 *     responses:
 *       200:
 *         description: created company.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const image = req.file;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const company = yield companyService.createCompany(data, userId, image);
        (0, reqest_1.sendSuccessResponse)(res, company);
    }
    catch (error) {
        (0, reqest_1.sendErrorResponse)(res, error);
    }
    // let userId = req.user?.id;
    // try {
    //     let company = await Company.create({user_id:userId,...req.body});
    //     res.status(201).json(company)
    // } catch (error) {
    //     console.log("error from add company",error);
    //     res.status(500).send(error)
    // }
});
exports.createCompany = createCompany;
// to edit a company 
/**
 * @swagger
 * /api/company/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: update Company
 *     description: update a company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               lat:
 *                 type: string
 *               lon:
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: updated company.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield company_model_1.default.findById(companyId);
        if (company) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, company);
            if (!isOwner) {
                return;
            }
            let newCompany = yield company_model_1.default.findByIdAndUpdate(companyId, req.body, { new: true });
            res.status(200).json(newCompany);
        }
        else {
            res.status(400).json({ message: "company not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.updateCompany = updateCompany;
// to delete a company 
// to edit a company 
/**
 * @swagger
 * /api/company/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: delete Company
 *     description: remove a company.
 *     responses:
 *       200:
 *         description: company deleted successsfully.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield company_model_1.default.findById(companyId);
        if (company) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, company);
            if (!isOwner) {
                return;
            }
            yield company_model_1.default.findByIdAndDelete(companyId);
            res.status(200).json({ messagwe: "Company deleted Successfully" });
        }
        else {
            res.status(400).json({ message: "Company not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.deleteCompany = deleteCompany;
// to list the sites created by user
// to edit a company 
/**
 * @swagger
 * /api/company:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: list Company
 *     description: list all the companies created by user.
 *     responses:
 *       200:
 *         description: company[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const listMyCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let query = req.query;
        // let companies  = await Company.find({user_id:userId});
        let companies = yield companyService.listCompanies(userId, query);
        (0, reqest_1.sendSuccessResponse)(res, companies);
    }
    catch (error) {
        console.log("error from listMyCompanies", error);
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.listMyCompanies = listMyCompanies;
// to get the detail of a certain company
// to edit a company 
/**
 * @swagger
 * /api/company/:id:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: get Company detail
 *     description: get the description of the company.
 *     responses:
 *       200:
 *         description: company.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getCompanyDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield company_model_1.default.findById(companyId);
        if (company) {
            res.status(200).json(company);
        }
        else {
            res.status(400).json({ message: "Company not found" });
        }
    }
    catch (error) {
        console.log("error from getCompanyDetail", error);
        res.status(500).send(error);
    }
});
exports.getCompanyDetail = getCompanyDetail;
// function to add gallery images to a Company
// to edit a company 
/**
 * @swagger
 * /api/company/:id/gallery:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: add Company Gallery
 *     description: Add images to gallery of company.
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
const addCompanyGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield company_model_1.default.findById(companyId);
        // checking if company exists
        if (!company) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "Company not found");
            return;
        }
        // checking if the current user owns the company
        let isOwner = (0, auth_1.checkOwnership)(req, res, company);
        if (!isOwner) {
            return;
        }
        // let body:AddGalleryReqBody = req.body;
        let files = req.files;
        // checking if there are no any files;
        if (!files) {
            files = [];
            ;
            (0, reqest_1.sendSuccessResponse)(res, []);
            return;
        }
        // checking if files are in other format rather than array.
        if (!Array.isArray(files)) {
            files = [];
            (0, reqest_1.sendSuccessResponse)(res, []);
            return;
        }
        let galleriesBody = files.map((item) => {
            return {
                entityType: gallery_types_1.EntityType.Company,
                entityId: companyId,
                key: item.key,
                location: item.location,
                bucket: item.bucket,
                acl: item.acl
            };
        });
        let gallery = yield gallery_model_1.default.create(galleriesBody);
        (0, reqest_1.sendSuccessResponse)(res, gallery);
    }
    catch (error) {
        console.log("error from addCompanyGallery", error);
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
//  to delete the company gallery
/**
 * @swagger
 * /api/company/gallery/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: delete Company gallery
 *     description: delete an image from the company gallery
 *     responses:
 *       200:
 *         description: image deleted successfully.
 *       401:
 *         description: unauthorized.
 *       500:
 *         description: something wrong
 *
 */
const deleteCompanyGalleryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageKey = req.params.id;
        let gallery = yield gallery_model_1.default.findOne({ key: imageKey });
        // checkimng if gallery image exist
        if (!gallery) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "image does not exist");
            return;
        }
        let companyId = gallery.record_id;
        let galleryid = gallery.id;
        let company = yield company_model_1.default.findById(companyId);
        // checking if  company exist
        if (!company) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "company not found");
            return;
        }
        // checkking if the user has created thhis image
        const isowner = (0, auth_1.checkOwnership)(req, res, company);
        if (!isowner) {
            return;
        }
        yield (0, ImageHandler_1.deleteS3Image)(imageKey);
        yield gallery_model_1.default.findByIdAndDelete(galleryid);
        (0, reqest_1.sendSuccessResponse)(res, { message: "image deleted successfully" });
    }
    catch (error) {
        console.log("error from deleteCompanyGallery", error);
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
// to get the gallery of company
/**
 * @swagger
 * /api/company/:id/gallery:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: get Company gallery
 *     description: get all the images of company's gallery.
 *     responses:
 *       200:
 *         description: gallery[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getCompanyGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield company_model_1.default.findById(companyId);
        if (!company) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "company not found");
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, company);
        if (!isOwner) {
            return;
        }
        let gallery = yield gallery_model_1.default.find({ entityType: gallery_types_1.EntityType.Company, entityId: companyId });
        (0, reqest_1.sendSuccessResponse)(res, gallery);
    }
    catch (error) {
        console.log("error from getCompanyGaller", error);
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
// to change the profile picture of a company
/**
 * @swagger
 * /api/company/:id/profile-pic:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Common]
 *     summary: Company profile picture update
 *     description: update the Company's profile picture.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary # Indicates file upload in Swagger
 *     responses:
 *       200:
 *         description: updated user.
 *       401:
 *         description: Invalid credentials.
 *
 */
const ChangeCompanyProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let companyId = req.params.id;
        if (!userId) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "user not found");
            return;
        }
        let company = yield company_model_1.default.findById(companyId);
        if (!company) {
            (0, reqest_1.sendResponseWithMessage)(res, 400, "company not found");
            return;
        }
        let isowner = (0, auth_1.checkOwnership)(req, res, company);
        if (!isowner) {
            return;
        }
        let file = req.file;
        if (!file) {
            return;
        }
        let image = file;
        let uCompany = yield company_model_1.default.findByIdAndUpdate(companyId, { profile_pic: image.location }, { new: true });
        (0, reqest_1.sendSuccessResponse)(res, uCompany);
    }
    catch (error) {
        console.log("error from changeCompanyProfilePicture");
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
const companyController = { createCompany: exports.createCompany, deleteCompany: exports.deleteCompany, updateCompany: exports.updateCompany, listMyCompanies: exports.listMyCompanies, getCompanyDetail: exports.getCompanyDetail, addCompanyGallery, deleteCompanyGalleryImage, getCompanyGallery, ChangeCompanyProfilePicture };
exports.default = companyController;
