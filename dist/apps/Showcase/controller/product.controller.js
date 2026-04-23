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
exports.getProductsbyCompanyId = exports.getProductDetail = exports.addProductGallery = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const productService = __importStar(require("@/apps/Showcase/services/product.service"));
const reqest_1 = require("@/libs/reqest");
// function to create a product with ownership check
/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Showcase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               price:
 *                 type: number
 *               company:
 *                 type: string
 *               productCategory:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // acess the images if any
        const images = req.files;
        const product = yield productService.createProduct(data, userId, images);
        (0, reqest_1.sendSuccessResponse)(res, product);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               price:
 *                 type: number
 *               productCategory:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
// to update a product with ownership and eligibility checks
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = req.params.id;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updatedProduct = yield productService.updateProduct(productId, data, userId);
        (0, reqest_1.sendSuccessResponse)(res, updatedProduct);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});
exports.updateProduct = updateProduct;
/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
// to delete a product with ownership check
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield productService.deleteProduct(productId, userId);
        (0, reqest_1.sendSuccessResponse)(res, { message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
/**
 * @swagger
 * /api/product/{id}/gallery:
 *   post:
 *     summary: Add gallery images to a product
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Gallery images added successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
// to add the product gallery with ownership check
const addProductGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const productId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const addedImages = yield productService.addProductGalleryImages(productId, userId, files);
        (0, reqest_1.sendSuccessResponse)(res, addedImages);
    }
    catch (error) {
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.addProductGallery = addProductGallery;
// 
/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product details by ID
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product detail retrieved successfully
 *       404:
 *         description: Product not found
 */
// to get the product detail with gallery by product id
const getProductDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const productDetail = yield productService.getProductById(productId);
        (0, reqest_1.sendSuccessResponse)(res, productDetail);
    }
    catch (error) {
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.getProductDetail = getProductDetail;
/**
 * @swagger
 * /api/product/company/{id}:
 *   get:
 *     summary: List products for a company
 *     tags: [Showcase]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term for filtering products
 *     responses:
 *       200:
 *         description: Company products retrieved successfully
 *       404:
 *         description: Company not found
 */
const getProductsbyCompanyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.id;
        const query = req.query;
        const result = yield productService.listProducts(companyId, query);
        (0, reqest_1.sendSuccessResponse)(res, result);
    }
    catch (error) {
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.getProductsbyCompanyId = getProductsbyCompanyId;
