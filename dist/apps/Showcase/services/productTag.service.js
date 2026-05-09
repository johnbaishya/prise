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
exports.verifyProductTagOfCompany = exports.getProductTagById = exports.getProductTagsByCompanyId = exports.deleteProductTag = exports.updateProductTag = exports.createProductTag = exports.checkProductTagOwnership = exports.getProductTagWithOwnershipAndExistance = exports.checkProductTagExists = void 0;
const company_service_1 = require("@/core/company/company.service");
const productTag_model_1 = __importDefault(require("../models/productTag.model"));
// function to check if product tag exists by id
const checkProductTagExists = (productTagId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productTag = yield productTag_model_1.default.findById(productTagId);
        if (!productTag) {
            return false;
        }
        return true;
    }
    catch (error) {
        throw error;
    }
});
exports.checkProductTagExists = checkProductTagExists;
// ===========================================================================================================================
// function to check if user is owner of the product tag by product tag id also checks if the product tag exists
const getProductTagWithOwnershipAndExistance = (productTagId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const productTag = yield productTag_model_1.default.findById(productTagId);
    if (!productTag) {
        const error = new Error("Product tag not found");
        error.status = 404;
        throw error;
    }
    const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, productTag.company.toString());
    if (!isOwner) {
        const error = new Error("You are not authorized to access this product tag");
        error.status = 403;
        throw error;
    }
    return productTag;
});
exports.getProductTagWithOwnershipAndExistance = getProductTagWithOwnershipAndExistance;
// to verify if user is owner of the product tag by product tag id also checks if the product tag exists
const checkProductTagOwnership = (productTagId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productTag = yield productTag_model_1.default.findById(productTagId);
        if (!productTag) {
            return false;
        }
        const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, productTag.company.toString());
        return isOwner;
    }
    catch (error) {
        return false;
    }
});
exports.checkProductTagOwnership = checkProductTagOwnership;
// ===========================================================================================================================
// function to create a product tag with company ownership check
const createProductTag = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId } = data;
    const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, companyId);
    if (!isOwner) {
        const error = new Error("You are not authorized to create a product tag for this company");
        error.status = 403;
        throw error;
    }
    const productTag = yield productTag_model_1.default.create(data);
    return productTag;
});
exports.createProductTag = createProductTag;
const updateProductTag = (id, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, description } = data;
        yield (0, exports.getProductTagWithOwnershipAndExistance)(id, userId);
        const updatedProductTag = yield productTag_model_1.default.findByIdAndUpdate(id, { name, slug, description }, { new: true });
        return updatedProductTag;
    }
    catch (error) {
        throw error;
    }
});
exports.updateProductTag = updateProductTag;
const deleteProductTag = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.getProductTagWithOwnershipAndExistance)(id, userId);
        const deletedProductTag = yield productTag_model_1.default.findByIdAndDelete(id);
        return deletedProductTag;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteProductTag = deleteProductTag;
const getProductTagsByCompanyId = (companyId, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search, sortBy = "createdAt", order = "desc" } = query;
        // build the filter obhject and make sure to list the categories only of a company
        const filter = { company: companyId };
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
        const companyExist = yield (0, company_service_1.checkifCompanyExists)(companyId);
        if (!companyExist) {
            const error = new Error("Company not found");
            error.status = 404;
            throw error;
        }
        // const productTags:IProductTag[] = await ProductTag.find({company:companyId});
        const productTags = yield productTag_model_1.default.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield productTag_model_1.default.countDocuments(filter);
        const response = {
            data: productTags,
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
exports.getProductTagsByCompanyId = getProductTagsByCompanyId;
const getProductTagById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productTag = yield productTag_model_1.default.findById(id);
        if (!productTag) {
            const error = new Error("Product tag not found");
            error.status = 404;
            throw error;
        }
        return productTag;
    }
    catch (error) {
        throw error;
    }
});
exports.getProductTagById = getProductTagById;
// service to verify if a product tag belongs to a company
const verifyProductTagOfCompany = (companyId, productTagId) => __awaiter(void 0, void 0, void 0, function* () {
    const productTag = yield productTag_model_1.default.findById(productTagId);
    if (!productTag) {
        const error = new Error("Product tag not found");
        error.status = 404;
        throw error;
    }
    let isOfCompany = productTag.company.toString() === companyId;
    if (!isOfCompany) {
        const error = new Error("you are not authorized to use this product tag for this company");
        error.status = 403;
        throw error;
    }
});
exports.verifyProductTagOfCompany = verifyProductTagOfCompany;
