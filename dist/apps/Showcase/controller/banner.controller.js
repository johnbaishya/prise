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
exports.getShowcaseBannerImages = exports.addShowcaseBannerImages = void 0;
const bannerService = __importStar(require("../services/banner.service"));
const reqest_1 = require("@/libs/reqest");
/**
 * @swagger
 * /api/showcase/company/{id}/banner:
 *   post:
 *     summary: Add banner images for showcase to show it in the main website as banner
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
const addShowcaseBannerImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        const companyId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const addedImages = yield bannerService.addShowcaseBannerImages(companyId, userId, files);
        (0, reqest_1.sendSuccessResponse)(res, addedImages);
    }
    catch (error) {
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.addShowcaseBannerImages = addShowcaseBannerImages;
/**
 * @swagger
 * /api/showcase/company/{id}/banner:
 *   get:
 *     summary: list showcase banner images of a company
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
 *         description: List of Gallery
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
// to get the product gallery 
const getShowcaseBannerImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.id;
        const banners = yield bannerService.getShowcaseBannerImages(companyId);
        (0, reqest_1.sendSuccessResponse)(res, banners);
    }
    catch (error) {
        (0, reqest_1.sendErrorResponse)(res, error);
    }
});
exports.getShowcaseBannerImages = getShowcaseBannerImages;
