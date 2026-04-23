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
exports.deleteProductTag = exports.getProductTagById = exports.getProductTagsByCompanyId = exports.updateProductTag = exports.createProductTag = void 0;
const reqest_1 = require("@/libs/reqest");
const productTagService = __importStar(require("../services/productTag.service"));
// to create a Product Tag
/**
 * @swagger
 * /api/product-tag:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Add Product Tag
 *     description: create a new product tag.
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
 *               company_id:
 *                 type: string
 *                 format: objectId
 *             required:
 *               - name
 *               - slug
 *               - company_id
 *     responses:
 *       200:
 *         description: created product tag.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 */
const createProductTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const productTag = yield productTagService.createProductTag(data, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        (0, reqest_1.sendSuccessResponse)(res, productTag);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status || 500, error.message || "internal server error");
    }
});
exports.createProductTag = createProductTag;
// to update a product tag by id with company ownership check
/**
 *
 * @swagger
 * /api/product-tag/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Update Product Tag
 *     description: update an existing product tag.
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
 *         description: updated product tag.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 */
const updateProductTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productTagId = req.params.id;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updatedProductTag = yield productTagService.updateProductTag(productTagId, data, userId);
        (0, reqest_1.sendSuccessResponse)(res, updatedProductTag);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status, error.message);
    }
});
exports.updateProductTag = updateProductTag;
/**
 *
 * @swagger
 * /api/product-tag/company/{companyId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Tags by Company Id
 *     description: Get all product tags of a company by company id.
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: List of product tags.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Company not found.
 *       500:
 *         description: something wrong
 */
const getProductTagsByCompanyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.id;
        const productTags = yield productTagService.getProductTagsByCompanyId(companyId);
        (0, reqest_1.sendSuccessResponse)(res, productTags);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, 500, "internal server error");
    }
});
exports.getProductTagsByCompanyId = getProductTagsByCompanyId;
/**
 * @swagger
 * /api/product-tag/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Get Product Tag by Id
 *     description: Get a product tag by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product tag found.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product tag not found.
 *       500:
 *         description: something wrong
 */
const getProductTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productTagId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const productTag = yield productTagService.getProductTagById(productTagId);
        (0, reqest_1.sendSuccessResponse)(res, productTag);
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status, error.message);
    }
});
exports.getProductTagById = getProductTagById;
/**
 * @swagger
 * /api/product-tag/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Showcase]
 *     summary: Delete Product Tag by Id
 *     description: Delete a product tag by its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *     responses:
 *       200:
 *         description: Product tag deleted successfully.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: Product tag not found.
 *       500:
 *         description: something wrong
 */
const deleteProductTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productTagId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield productTagService.deleteProductTag(productTagId, userId);
        (0, reqest_1.sendResponseWithMessage)(res, 200, "product tag deleted successfully");
    }
    catch (error) {
        (0, reqest_1.sendResponseWithMessage)(res, error.status, error.message);
    }
});
exports.deleteProductTag = deleteProductTag;
