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
exports.listCompanies = exports.createCompany = exports.verifyCompanyOwnershipByCompanyId = exports.checkCompanyOwnershipByCompanyId = exports.checkifCompanyExists = void 0;
const auth_1 = require("@/libs/auth");
const company_model_1 = __importDefault(require("./company.model"));
const errorHandler_1 = __importDefault(require("@/libs/errorHandler"));
// function to check if the company exists by id
const checkifCompanyExists = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield company_model_1.default.findById(companyId);
        if (!company) {
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.checkifCompanyExists = checkifCompanyExists;
// =--==========================================================================================================================
// function to check company ownership by company id
// it will be used in the controllers and services to check if the user is the owner of the company before allowing them to perform certain actions (like creating a product, etc.)
const checkCompanyOwnershipByCompanyId = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    let company = yield company_model_1.default.findById(companyId);
    let ownerId = company === null || company === void 0 ? void 0 : company.get("user_id");
    if (!company) {
        const error = new errorHandler_1.default("Company not found", 404);
        throw error;
    }
    let isOwner = (0, auth_1.checkOwnershipStatus)(userId, ownerId);
    if (!isOwner) {
        const error = new errorHandler_1.default("You are not authorized to perform this action", 403);
        throw error;
    }
    else {
        return true;
    }
});
exports.checkCompanyOwnershipByCompanyId = checkCompanyOwnershipByCompanyId;
const verifyCompanyOwnershipByCompanyId = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield company_model_1.default.findById(companyId);
        if (!company) {
            const error = new errorHandler_1.default("Company not found", 404);
            throw error;
        }
        const ownerId = company === null || company === void 0 ? void 0 : company.get("user_id");
        const isOwner = (0, auth_1.checkOwnershipStatus)(userId, ownerId);
        if (!isOwner) {
            const error = new errorHandler_1.default("You are not authorized to perform this action", 403);
            throw error;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.verifyCompanyOwnershipByCompanyId = verifyCompanyOwnershipByCompanyId;
const createCompany = (data, userId, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payLoad = Object.assign(Object.assign({}, data), { user_id: userId });
        if (image) {
            payLoad.brand_logo = image.location;
        }
        const company = company_model_1.default.create(payLoad);
        return company;
    }
    catch (error) {
        throw error;
    }
});
exports.createCompany = createCompany;
const listCompanies = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search, sortBy = "createdAt", order = "desc" } = query;
        const filter = { user_id: userId };
        // 🔍 search
        // search from the name or the desctiption of the category
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        // to skip the data of previous pages and get the data of the current page
        const skip = (page - 1) * limit;
        // const productTags:IProductTag[] = await ProductTag.find({company:companyId});
        const companies = yield company_model_1.default.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield company_model_1.default.countDocuments(filter);
        const response = {
            data: companies,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.listCompanies = listCompanies;
