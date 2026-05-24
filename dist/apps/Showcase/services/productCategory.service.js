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
exports.deleteProductCategory = exports.updateProductCategory = exports.getProductCategoryById = exports.getProductCategoriesByCompanyId = exports.createProductCategory = exports.updateProductCategoryImage = exports.checkProductCategoryOwnership = exports.getProductCategoryWithOwnershipAndExistance = exports.verifyProductCategoryofCompany = exports.checkProductCategoryExists = void 0;
const productCategory_model_1 = __importDefault(require("../models/productCategory.model"));
const company_service_1 = require("@/core/company/company.service");
const errorHandler_1 = __importDefault(require("@/libs/errorHandler"));
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
// serviuce to verify if a Product category belongs to a companyq
const verifyProductCategoryofCompany = (companyId, productCategoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const productCategory = yield productCategory_model_1.default.findById(productCategoryId);
    if (!productCategory) {
        const error = new Error("Product category not found");
        error.status = 404;
        throw error;
    }
    let isOfCompany = productCategory.company.toString() === companyId;
    if (!isOfCompany) {
        const error = new Error("you are not authorized to use this product category for this company");
        error.status = 403;
        throw error;
    }
});
exports.verifyProductCategoryofCompany = verifyProductCategoryofCompany;
// ==========================================================================================================
// function to check if user is owner of the product category by product category id also checks if the product category exists
const getProductCategoryWithOwnershipAndExistance = (productCategoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const productCategory = yield productCategory_model_1.default.findById(productCategoryId);
    if (!productCategory) {
        const error = new Error("Product category not found");
        error.status = 404;
        throw error;
    }
    const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, productCategory.company.toString());
    if (!isOwner) {
        const error = new Error("You are not authorized to perform this action");
        error.status = 403;
        throw error;
    }
    return productCategory;
});
exports.getProductCategoryWithOwnershipAndExistance = getProductCategoryWithOwnershipAndExistance;
// function to check if product category exists by id and if user is owner
const checkProductCategoryOwnership = (productCategoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productCategory = yield productCategory_model_1.default.findById(productCategoryId);
        if (!productCategory) {
            return false;
        }
        const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, productCategory.company.toString());
        return isOwner;
    }
    catch (error) {
        return false;
    }
});
exports.checkProductCategoryOwnership = checkProductCategoryOwnership;
// =======================================================================================================
// function to upload the image of the product Category
const updateProductCategoryImage = (file, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!file) {
            const error = new errorHandler_1.default("no image ", 400);
            throw error;
        }
        const category = yield productCategory_model_1.default.findByIdAndUpdate(categoryId, { image: file.location }, { new: true });
        if (!category) {
            const error = new errorHandler_1.default("Product Category not found ", 500);
            throw error;
        }
        return category;
    }
    catch (error) {
        throw error;
    }
});
exports.updateProductCategoryImage = updateProductCategoryImage;
// ===========================================================================================================================
// function to create a product category with company ownership check
const createProductCategory = (data, userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, data.companyId);
        if (!isOwner) {
            const error = new Error("You are not authorized to create a product category for this company");
            error.status = 403;
            throw error;
        }
        if (file) {
            const imageUrl = file.location;
            data.image = imageUrl;
        }
        const payload = Object.assign(Object.assign({}, data), { company: data.companyId });
        const productCategory = yield productCategory_model_1.default.create(payload);
        return productCategory;
    }
    catch (error) {
        throw error;
    }
});
exports.createProductCategory = createProductCategory;
// ===========================================================================================================================
// function to get product categories by company id 
const getProductCategoriesByCompanyId = (companyId, query) => __awaiter(void 0, void 0, void 0, function* () {
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
        // const productCategories:IProductCategory[] = await ProductCategory.find({company:companyId});   
        const productCategories = yield productCategory_model_1.default.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield productCategory_model_1.default.countDocuments(filter);
        const response = {
            data: productCategories,
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
const updateProductCategory = (productCategoryId, data, userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, description } = data;
        let newData = { name, slug, description };
        if (file) {
            const imageUri = file.location;
            newData.image = imageUri;
        }
        yield (0, exports.getProductCategoryWithOwnershipAndExistance)(productCategoryId, userId);
        const updatedProductCategory = yield productCategory_model_1.default.findByIdAndUpdate(productCategoryId, newData, { new: true });
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
