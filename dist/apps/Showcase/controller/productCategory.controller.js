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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductCategory = exports.getProductCategoryById = exports.getProductCategoriesByCompanyId = exports.updateProductCategory = exports.createProductCategory = void 0;
const reqest_1 = require("@/libs/reqest");
const productCategoryService = __importStar(require("../services/productCategory.service"));
// to create a Product Category
/**
 * @swagger
 * /api/product-category:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Add Product Category
 *     description: create a new product category.
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
 *               slug:
 *                 type: string
 *                 required: true
 *               companyId:
 *                 type: string
 *                 format: objectId
 *             required:
 *               - name
 *               - slug
 *               - companyId
 *     responses:
 *       200:
 *         description: created product category.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const createProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const productCategory = yield productCategoryService.createProductCategory(data, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        (0, reqest_1.sendSuccessResponse)(res, productCategory);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status || 500, error.message || "internal server error");
    }
});
exports.createProductCategory = createProductCategory;
// to update a product category by id with company ownership check
/**
 *
 * @swagger
 * /api/product-category/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Update Product Category
 *     description: update an existing product category.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
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
 *               slug:
 *                 type: string
 *             required:
 *               - name
 *               - slug
 *     responses:
 *       200:
 *         description: updated product category.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 */
const updateProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productCategoryId = req.params.id;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updatedProductCategory = yield productCategoryService.updateProductCategory(productCategoryId, data, userId);
        (0, reqest_1.sendSuccessResponse)(res, updatedProductCategory);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status, error.message);
    }
});
exports.updateProductCategory = updateProductCategory;
/**
 *
 * @swagger
 * /api/product-category/company/{companyId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Categories by Company Id
 *     description: Get all product categories of a company by company id.
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: List of product categories.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Company not found.
 *       500:
 *         description: something wrong
 */
const getProductCategoriesByCompanyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.id;
        const productCategories = yield productCategoryService.getProductCategoriesByCompanyId(companyId);
        (0, reqest_1.sendSuccessResponse)(res, productCategories);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, 500, "internal server error");
    }
});
exports.getProductCategoriesByCompanyId = getProductCategoriesByCompanyId;
/**
 * @swagger
 * /api/product-category/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Category by Id
 *     description: Get a product category by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product category found.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product category not found.
 *       500:
 *         description: something wrong
 */
const getProductCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productCategoryId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const productCategory = yield productCategoryService.getProductCategoryById(productCategoryId);
        (0, reqest_1.sendSuccessResponse)(res, productCategory);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status, error.message);
    }
});
exports.getProductCategoryById = getProductCategoryById;
/**
 * @swagger
 * /api/product-category/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Delete Product Category by Id
 *     description: Delete a product category by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product category deleted successfully.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product category not found.
 *       500:
 *         description: something wrong
 */
const deleteProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productCategoryId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield productCategoryService.deleteProductCategory(productCategoryId, userId);
        (0, reqest_1.sendResponseWithMessage)(res, 200, "product category deleted successfully");
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status, error.message);
    }
});
exports.deleteProductCategory = deleteProductCategory;
