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
exports.getCompanyDetail = exports.listMyCompanies = exports.deleteCompany = exports.updateCompany = exports.addCompany = void 0;
const Company_1 = __importDefault(require("../model/Company"));
const auth_1 = require("../../../libs/auth");
const reqres_1 = require("../../../libs/reqres");
const EntityEnum_1 = require("../types/EntityEnum");
const Gallery_1 = __importDefault(require("../model/Gallery"));
const ImageHandler_1 = require("../../../services/ImageHandler");
// to create a company
const addCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        let company = yield Company_1.default.create(Object.assign({ user_id: userId }, req.body));
        res.status(201).json(company);
    }
    catch (error) {
        console.log("error from add company", error);
        res.status(500).send(error);
    }
});
exports.addCompany = addCompany;
// to edit a company 
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield Company_1.default.findById(companyId);
        if (company) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, company);
            if (!isOwner) {
                return;
            }
            let newCompany = yield Company_1.default.findByIdAndUpdate(companyId, req.body, { new: true });
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
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield Company_1.default.findById(companyId);
        if (company) {
            let isOwner = (0, auth_1.checkOwnership)(req, res, company);
            if (!isOwner) {
                return;
            }
            yield Company_1.default.findByIdAndDelete(companyId);
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
const listMyCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let companies = yield Company_1.default.find({ user_id: userId });
        res.status(200).json(companies);
    }
    catch (error) {
        console.log("error from listMyCompanies", error);
        res.status(500).send(error);
    }
});
exports.listMyCompanies = listMyCompanies;
// to get the detail of a certain company
const getCompanyDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield Company_1.default.findById(companyId);
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
const addCompanyGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield Company_1.default.findById(companyId);
        // checking if company exists
        if (!company) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "Company not found");
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
                entity_name: EntityEnum_1.EntityNameEnum.Company,
                record_id: companyId,
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
        console.log("error from addCompanyGallery", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
const deleteCompanyGalleryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageKey = req.params.id;
        let gallery = yield Gallery_1.default.findOne({ key: imageKey });
        // checkimng if gallery image exist
        if (!gallery) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "image does not exist");
            return;
        }
        let companyId = gallery.record_id;
        let galleryid = gallery.id;
        let company = yield Company_1.default.findById(companyId);
        // checking if  company exist
        if (!company) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "company not found");
            return;
        }
        // checkking if the user has created thhis image
        const isowner = (0, auth_1.checkOwnership)(req, res, company);
        if (!isowner) {
            return;
        }
        yield (0, ImageHandler_1.deleteS3Image)(imageKey);
        yield Gallery_1.default.findByIdAndDelete(galleryid);
        (0, reqres_1.sendSuccessResponse)(res, { message: "image deleted successfully" });
    }
    catch (error) {
        console.log("error from deleteCompanyGallery", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
const getCompanyGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyId = req.params.id;
        let company = yield Company_1.default.findById(companyId);
        if (!company) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "company not found");
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, company);
        if (!isOwner) {
            return;
        }
        let gallery = yield Gallery_1.default.find({ entity_name: EntityEnum_1.EntityNameEnum.Company, record_id: companyId });
        (0, reqres_1.sendSuccessResponse)(res, gallery);
    }
    catch (error) {
        console.log("error from getCompanyGaller", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
const ChangeCompanyProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let companyId = req.params.id;
        if (!userId) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "user not found");
            return;
        }
        let company = yield Company_1.default.findById(companyId);
        if (!company) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "company not found");
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
        let uCompany = yield Company_1.default.findByIdAndUpdate(companyId, { profile_pic: image.location }, { new: true });
        (0, reqres_1.sendSuccessResponse)(res, uCompany);
    }
    catch (error) {
        console.log("error from changeCompanyProfilePicture");
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
const companyController = { addCompany: exports.addCompany, deleteCompany: exports.deleteCompany, updateCompany: exports.updateCompany, listMyCompanies: exports.listMyCompanies, getCompanyDetail: exports.getCompanyDetail, addCompanyGallery, deleteCompanyGalleryImage, getCompanyGallery, ChangeCompanyProfilePicture };
exports.default = companyController;
