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
exports.listProducts = exports.deleteProduct = exports.getProductById = exports.addProductGalleryImages = exports.updateProduct = exports.createProduct = exports.verifyProductUpdateEligibilityForUser = exports.verifyProductCreationEligibilityForUser = exports.verifyProductOwnership = exports.verifyproductOfCompany = exports.verifyProductOwnershipByProductId = void 0;
const company_service_1 = require("@/core/company/company.service");
const product_model_1 = __importDefault(require("../models/product.model"));
const productCategory_service_1 = require("./productCategory.service");
const errorHandler_1 = __importDefault(require("@/libs/errorHandler"));
const productTag_service_1 = require("./productTag.service");
const gallery_service_1 = require("@/core/gallery/gallery.service");
const gallery_types_1 = require("@/core/gallery/gallery.types");
const gallery_model_1 = __importDefault(require("@/core/gallery/gallery.model"));
// to check if the product belongs to the company that user owns before allowing them to update the product
const verifyProductOwnershipByProductId = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            const error = new errorHandler_1.default("Product not found", 404);
            throw error;
        }
        // check if the user is the owner of the company that the product belongs to before allowing them to update the product
        const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, product.company.toString());
        if (!isOwner) {
            throw new errorHandler_1.default("You are not authorized to update this product", 403);
        }
    }
    catch (error) {
        throw new errorHandler_1.default("You are not authorized to update this product", 403);
    }
});
exports.verifyProductOwnershipByProductId = verifyProductOwnershipByProductId;
// service to verify if a product belongs to a company
const verifyproductOfCompany = (productId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    const isOfCompany = product.company.toString() === companyId;
    if (!isOfCompany) {
        const error = new Error("Product does not belong to the specified company");
        error.status = 400;
        throw error;
    }
});
exports.verifyproductOfCompany = verifyproductOfCompany;
// to verify if a user is authorized to access a product by checking if the product belongs to a company that the user owns
const verifyProductOwnership = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, product.company.toString());
    if (!isOwner) {
        const error = new Error("You are not authorized to access this product");
        error.status = 403;
        throw error;
    }
});
exports.verifyProductOwnership = verifyProductOwnership;
// to verify if user is the owner of the company and if the category and tags belong to the company before allowing them to create a product
const verifyProductCreationEligibilityForUser = (userId, companyId, productCategoryId, productTagIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first check if the user is the owner of the company before allowing them to create a product for that company
        const isOwner = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, companyId);
        if (!isOwner) {
            throw new errorHandler_1.default("You are not authorized to create a product for this company", 403);
        }
        // then check if the product category belongs to the company and if the product tags belong to the company before allowing them to create a product for that company
        yield (0, productCategory_service_1.verifyProductCategoryofCompany)(companyId, productCategoryId);
        for (const tagId of productTagIds !== null && productTagIds !== void 0 ? productTagIds : []) {
            yield (0, productTag_service_1.verifyProductTagOfCompany)(companyId, tagId);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.verifyProductCreationEligibilityForUser = verifyProductCreationEligibilityForUser;
// to verify if user is eligible to update a product by checking if they are the owner of the company and if the category and tags belong to the company before allowing them to update a product for that company
const verifyProductUpdateEligibilityForUser = (userId, productId, productCategoryId, productTagIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first check if the product exists
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            throw new errorHandler_1.default("Product not found", 404);
        }
        const companyId = product.company.toString();
        // verify if the user is the owner of the company that the product belongs to before allowing them to update the product
        yield (0, company_service_1.checkCompanyOwnershipByCompanyId)(userId, companyId);
        // check if the product belongs to the company before allowing them to update the product
        yield (0, exports.verifyproductOfCompany)(productId, companyId);
        // then check if the product category belongs to the company and if the product tags belong to the company before allowing them to update a product for that company
        if (productCategoryId) {
            yield (0, productCategory_service_1.verifyProductCategoryofCompany)(companyId, productCategoryId);
        }
        for (const tagId of productTagIds !== null && productTagIds !== void 0 ? productTagIds : []) {
            yield (0, productTag_service_1.verifyProductTagOfCompany)(companyId, tagId);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.verifyProductUpdateEligibilityForUser = verifyProductUpdateEligibilityForUser;
// function to create a product 
const createProduct = (data, userId, imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId, productCategoryId, tags } = data;
    try {
        // check user eligibility to create a product for the company by checking if they are the owner of the company and if the category and tags belong to the company
        yield (0, exports.verifyProductCreationEligibilityForUser)(userId, companyId, productCategoryId, tags);
        const product = yield product_model_1.default.create(data);
        // if images are provided, add them to the gallery of the product
        const gallery = yield (0, gallery_service_1.addGalleryImages)(gallery_types_1.EntityType.Product, product._id.toString(), imageFiles !== null && imageFiles !== void 0 ? imageFiles : []);
        return Object.assign(Object.assign({}, product.toObject()), { gallery: gallery });
    }
    catch (error) {
        throw error;
    }
});
exports.createProduct = createProduct;
// function to update a product by id with ownership and eligibility checks
const updateProduct = (id, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productCategoryId } = data;
    try {
        yield (0, exports.verifyProductUpdateEligibilityForUser)(userId, id, productCategoryId, (_a = data.tags) !== null && _a !== void 0 ? _a : []);
        const product = yield product_model_1.default.findByIdAndUpdate(id, data, { new: true });
        if (!product) {
            throw new errorHandler_1.default("Product not found", 404);
        }
        const gallery = yield (0, gallery_service_1.getGalleryImages)(gallery_types_1.EntityType.Product, id);
        return Object.assign(Object.assign({}, product === null || product === void 0 ? void 0 : product.toObject()), { gallery: gallery });
    }
    catch (error) {
        throw error;
    }
});
exports.updateProduct = updateProduct;
// function to add gallery images to a product after checking if the user is the owner of the company that the product belongs to
const addProductGalleryImages = (productId, userId, imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.verifyProductOwnership)(productId, userId);
        const gallery = yield (0, gallery_service_1.addGalleryImages)(gallery_types_1.EntityType.Product, productId, imageFiles);
        return gallery;
    }
    catch (error) {
        throw error;
    }
});
exports.addProductGalleryImages = addProductGalleryImages;
// function to get a product by id 
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            throw new errorHandler_1.default("Product not found", 404);
        }
        const gallery = yield (0, gallery_service_1.getGalleryImages)(gallery_types_1.EntityType.Product, id);
        return Object.assign(Object.assign({}, product.toObject()), { gallery });
    }
    catch (error) {
        throw new errorHandler_1.default(error.message, 500);
    }
});
exports.getProductById = getProductById;
// function to delete a product by id with ownership check
const deleteProduct = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first verify if the user is the owner of the company that the product belongs to before allowing them to delete the product
        yield (0, exports.verifyProductOwnership)(id, userId);
        // then delete the product from the database
        yield product_model_1.default.findByIdAndDelete(id);
        // after deleting the product from the database we need to delete the gallery images of the product from s3 and from the database
        yield (0, gallery_service_1.deleteMultipleGalleryImagesByEntityId)(gallery_types_1.EntityType.Product, id);
    }
    catch (error) {
        throw new errorHandler_1.default(error.message, error.status || 500);
    }
});
exports.deleteProduct = deleteProduct;
// export const listProducts = async (): Promise<IProduct[]> => {
//   const products = await Product.find();
//   return products;
// };  
const listProducts = (companyId, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search, tag, category, sortBy = "createdAt", order = "desc" } = query;
        const filter = { company: companyId };
        // 🔍 search
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        // 🏷 tag filter
        if (tag) {
            const tagsArray = tag.split(",");
            filter.tags = { $in: tagsArray };
        }
        // 📂 category filter
        if (category) {
            filter.productCategory = category;
        }
        const skip = (page - 1) * limit;
        const products = yield product_model_1.default.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const productIds = products.map(p => p._id);
        const galleries = yield gallery_model_1.default.find({
            entityType: gallery_types_1.EntityType.Product,
            entityId: { $in: productIds }
        }).lean();
        const galleryMap = new Map();
        galleries.forEach(g => {
            const key = g.entityId.toString();
            if (!galleryMap.has(key)) {
                galleryMap.set(key, []);
            }
            galleryMap.get(key).push(g);
        });
        const productsWithGallery = products.map(product => (Object.assign(Object.assign({}, product), { gallery: galleryMap.get(product._id.toString()) || [] })));
        const total = yield product_model_1.default.countDocuments(filter);
        return {
            data: productsWithGallery,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    catch (error) {
        throw new errorHandler_1.default(error.message, 500);
    }
});
exports.listProducts = listProducts;
