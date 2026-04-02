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
exports.deleteProductCategory = exports.updateProductCategory = exports.getProductCategoryById = exports.getProductCategoriesByCompanyId = exports.createProductCategory = exports.getProductCategoryWithOwnershipAndExistance = exports.checkProductCategoryExists = void 0;
const auth_1 = require("@/libs/auth");
const productCategory_model_1 = __importDefault(require("../models/productCategory.model"));
const company_service_1 = require("@/core/company/company.service");
// function to check if product category exists by id
const checkProductCategoryExists = (productCategoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productCategory = yield productCategory_model_1.default.findById(productCategoryId);
        if (!productCategory) {
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.checkProductCategoryExists = checkProductCategoryExists;
// ==========================================================================================================
// function to check if user is owner of the product category by product category id also checks if the product category exists
const getProductCategoryWithOwnershipAndExistance = (productCategoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const productCategory = yield productCategory_model_1.default.findById(productCategoryId);
    if (!productCategory) {
        const error = new Error("Product category not found");
        error.status = 404;
        throw error;
    }
    const isOwner = yield (0, auth_1.checkComanyOwnershipByCompanyId)(userId, productCategory.company_id.toString());
    if (!isOwner) {
        const error = new Error("You are not authorized to perform this action");
        error.status = 403;
        throw error;
    }
    return productCategory;
});
exports.getProductCategoryWithOwnershipAndExistance = getProductCategoryWithOwnershipAndExistance;
// ===========================================================================================================================
// function to create a product category with company ownership check
const createProductCategory = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOwner = (0, auth_1.checkComanyOwnershipByCompanyId)(userId, data.company_id);
        if (!isOwner) {
            const error = new Error("You are not authorized to create a product category for this company");
            error.status = 403;
            throw error;
        }
        const productCategory = yield productCategory_model_1.default.create(data);
        return productCategory;
    }
    catch (error) {
        throw error;
    }
});
exports.createProductCategory = createProductCategory;
// ===========================================================================================================================
// function to get product categories by company id with company ownership check
const getProductCategoriesByCompanyId = (companyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyExist = yield (0, company_service_1.checkifCompanyExists)(companyId);
        if (!companyExist) {
            const error = new Error("Company not found");
            error.status = 404;
            throw error;
        }
        const productCategories = yield productCategory_model_1.default.find({ company_id: companyId });
        return productCategories;
    }
    catch (error) {
        throw error;
    }
});
exports.getProductCategoriesByCompanyId = getProductCategoriesByCompanyId;
// ==========================================================================================================================
const getProductCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productCategory = yield productCategory_model_1.default.findById(id);
        if (!productCategory) {
            const error = new Error("Product category not found");
            error.status = 404;
            throw error;
        }
        return productCategory;
    }
    catch (error) {
        throw error;
    }
});
exports.getProductCategoryById = getProductCategoryById;
// ==========================================================================================================================
// function to update product category by id with company ownership check
const updateProductCategory = (productCategoryId, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.getProductCategoryWithOwnershipAndExistance)(productCategoryId, userId);
        const updatedProductCategory = yield productCategory_model_1.default.findByIdAndUpdate(productCategoryId, data, { new: true });
        return updatedProductCategory;
    }
    catch (error) {
        throw error;
    }
});
exports.updateProductCategory = updateProductCategory;
// ==========================================================================================================================
// function to delete product category by id with company ownership check
const deleteProductCategory = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.getProductCategoryWithOwnershipAndExistance)(id, userId);
        const productCategory = yield productCategory_model_1.default.findByIdAndDelete(id);
        return productCategory;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteProductCategory = deleteProductCategory;
