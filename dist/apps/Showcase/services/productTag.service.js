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
exports.getProductTagById = exports.getProductTagsByCompanyId = exports.deleteProductTag = exports.updateProductTag = exports.createProductTag = exports.getProductTagWithOwnershipAndExistance = exports.checkProductTagExists = void 0;
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
    const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, productTag.company_id.toString());
    if (!isOwner) {
        const error = new Error("You are not authorized to access this product tag");
        error.status = 403;
        throw error;
    }
    return productTag;
});
exports.getProductTagWithOwnershipAndExistance = getProductTagWithOwnershipAndExistance;
// ===========================================================================================================================
// function to create a product tag with company ownership check
const createProductTag = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = data.company_id;
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
const getProductTagsByCompanyId = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyExist = yield (0, company_service_1.checkifCompanyExists)(companyId);
        if (!companyExist) {
            const error = new Error("Company not found");
            error.status = 404;
            throw error;
        }
        const productTags = yield productTag_model_1.default.find({ company_id: companyId });
        return productTags;
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
