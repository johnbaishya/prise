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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = require("./product.service");
const product_model_1 = __importDefault(require("../models/product.model"));
const companyService = __importStar(require("@/core/company/company.service"));
const productCategoryService = __importStar(require("./productCategory.service"));
const productTagService = __importStar(require("./productTag.service"));
const galleryService = __importStar(require("@/core/gallery/gallery.service"));
const errorHandler_1 = __importDefault(require("@/libs/errorHandler"));
jest.mock('../models/product.model');
jest.mock('@/core/company/company.service');
jest.mock('./productCategory.service');
jest.mock('./productTag.service');
jest.mock('@/core/gallery/gallery.service');
describe('Product Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('verifyProductOwnershipByProductId', () => {
        it('should throw error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue(null);
            yield expect((0, product_service_1.verifyProductOwnershipByProductId)('userId', 'productId')).rejects.toThrow(errorHandler_1.default);
        }));
        it('should throw error if user is not company owner', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: 'companyId' });
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
            yield expect((0, product_service_1.verifyProductOwnershipByProductId)('userId', 'productId')).rejects.toThrow(errorHandler_1.default);
        }));
        it('should verify ownership successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: 'companyId' });
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            yield expect((0, product_service_1.verifyProductOwnershipByProductId)('userId', 'productId')).resolves.not.toThrow();
        }));
    });
    describe('verifyproductOfCompany', () => {
        it('should throw error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue(null);
            yield expect((0, product_service_1.verifyproductOfCompany)('productId', 'companyId')).rejects.toThrow();
        }));
        it('should throw error if product does not belong to company', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'otherCompanyId' } });
            yield expect((0, product_service_1.verifyproductOfCompany)('productId', 'companyId')).rejects.toThrow();
        }));
        it('should verify product belongs to company successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            yield expect((0, product_service_1.verifyproductOfCompany)('productId', 'companyId')).resolves.not.toThrow();
        }));
    });
    describe('verifyProductOwnership', () => {
        it('should throw error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue(null);
            yield expect((0, product_service_1.verifyProductOwnership)('productId', 'userId')).rejects.toThrow();
        }));
        it('should throw error if user is not company owner', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
            yield expect((0, product_service_1.verifyProductOwnership)('productId', 'userId')).rejects.toThrow();
        }));
        it('should verify ownership successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            yield expect((0, product_service_1.verifyProductOwnership)('productId', 'userId')).resolves.not.toThrow();
        }));
    });
    describe('verifyProductCreationEligibilityForUser', () => {
        it('should throw error if user is not company owner', () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
            yield expect((0, product_service_1.verifyProductCreationEligibilityForUser)('userId', 'companyId', 'categoryId')).rejects.toThrow(errorHandler_1.default);
        }));
        it('should throw error if category verification fails', () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productCategoryService.verifyProductCategoryofCompany.mockRejectedValue(new Error('Category error'));
            yield expect((0, product_service_1.verifyProductCreationEligibilityForUser)('userId', 'companyId', 'categoryId')).rejects.toThrow();
        }));
        it('should throw error if tag verification fails', () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productCategoryService.verifyProductCategoryofCompany.mockResolvedValue(undefined);
            productTagService.verifyProductTagOfCompany.mockRejectedValue(new Error('Tag error'));
            yield expect((0, product_service_1.verifyProductCreationEligibilityForUser)('userId', 'companyId', 'categoryId', ['tagId'])).rejects.toThrow();
        }));
        it('should verify eligibility successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productCategoryService.verifyProductCategoryofCompany.mockResolvedValue(undefined);
            yield expect((0, product_service_1.verifyProductCreationEligibilityForUser)('userId', 'companyId', 'categoryId')).resolves.not.toThrow();
        }));
    });
    describe('verifyProductUpdateEligibilityForUser', () => {
        it('should throw error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue(null);
            yield expect((0, product_service_1.verifyProductUpdateEligibilityForUser)('userId', 'productId')).rejects.toThrow(errorHandler_1.default);
        }));
        it('should throw error if user is not company owner', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            companyService.checkCompanyOwnershipByCompanyId.mockRejectedValue(new Error('Not owner'));
            yield expect((0, product_service_1.verifyProductUpdateEligibilityForUser)('userId', 'productId')).rejects.toThrow();
        }));
        it('should verify update eligibility successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productCategoryService.verifyProductCategoryofCompany.mockResolvedValue(undefined);
            yield expect((0, product_service_1.verifyProductUpdateEligibilityForUser)('userId', 'productId')).resolves.not.toThrow();
        }));
    });
    describe('createProduct', () => {
        it('should create product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProduct = { _id: 'productId', toObject: () => ({ _id: 'productId', name: 'Product' }) };
            const mockGallery = [{ _id: 'galleryId' }];
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            jest.spyOn(productCategoryService, 'verifyProductCategoryofCompany').mockResolvedValue(undefined);
            product_model_1.default.create.mockResolvedValue(mockProduct);
            galleryService.addGalleryImages.mockResolvedValue(mockGallery);
            const result = yield (0, product_service_1.createProduct)({ name: 'Product', slug: 'product', companyId: 'companyId', productCategoryId: 'categoryId', tags: [], price: 100 }, 'userId', []);
            expect(result).toHaveProperty('gallery');
        }));
        it('should throw error if verification fails', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(false);
            yield expect((0, product_service_1.createProduct)({ name: 'Product', slug: 'product', companyId: 'companyId', productCategoryId: 'categoryId', tags: [], price: 100 }, 'userId', [])).rejects.toThrow();
        }));
    });
    describe('updateProduct', () => {
        it('should update product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProduct = { _id: 'productId', toObject: () => ({ _id: 'productId', name: 'Updated' }) };
            const mockGallery = [{ _id: 'galleryId' }];
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            jest.spyOn(productCategoryService, 'verifyProductCategoryofCompany').mockResolvedValue(undefined);
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            product_model_1.default.findByIdAndUpdate.mockResolvedValue(mockProduct);
            galleryService.getGalleryImages.mockResolvedValue(mockGallery);
            const result = yield (0, product_service_1.updateProduct)('productId', { name: 'Updated' }, 'userId');
            expect(result).toBeDefined();
        }));
        it('should throw error if product not found after update', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            product_model_1.default.findByIdAndUpdate.mockResolvedValue(null);
            yield expect((0, product_service_1.updateProduct)('productId', {}, 'userId')).rejects.toThrow(errorHandler_1.default);
        }));
    });
    describe('addProductGalleryImages', () => {
        it('should add gallery images successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGallery = [{ _id: 'galleryId' }];
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            galleryService.addGalleryImages.mockResolvedValue(mockGallery);
            const result = yield (0, product_service_1.addProductGalleryImages)('productId', 'userId', []);
            expect(result).toEqual(mockGallery);
        }));
        it('should throw error if user not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(false);
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            yield expect((0, product_service_1.addProductGalleryImages)('productId', 'userId', [])).rejects.toThrow();
        }));
    });
    describe('getProductById', () => {
        it('should return product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProduct = { _id: 'productId', name: 'Product' };
            product_model_1.default.findById.mockResolvedValue(mockProduct);
            const result = yield (0, product_service_1.getProductById)('productId');
            expect(result).toEqual(mockProduct);
        }));
        it('should throw error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.findById.mockResolvedValue(null);
            yield expect((0, product_service_1.getProductById)('productId')).rejects.toThrow(errorHandler_1.default);
        }));
    });
    describe('deleteProduct', () => {
        it('should delete product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            product_model_1.default.findByIdAndDelete.mockResolvedValue({});
            galleryService.deleteMultipleGalleryImagesByEntityId.mockResolvedValue(undefined);
            yield expect((0, product_service_1.deleteProduct)('productId', 'userId')).resolves.not.toThrow();
        }));
        it('should throw error if user not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(false);
            product_model_1.default.findById.mockResolvedValue({ company: { toString: () => 'companyId' } });
            yield expect((0, product_service_1.deleteProduct)('productId', 'userId')).rejects.toThrow();
        }));
    });
    describe('listProducts', () => {
        it('should list products with default filters', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProducts = [{ _id: 'productId', name: 'Product' }];
            product_model_1.default.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockProducts)
            });
            product_model_1.default.countDocuments.mockResolvedValue(1);
            const result = yield (0, product_service_1.listProducts)('companyId', {});
            expect(result.data).toEqual(mockProducts);
            expect(result.meta.page).toBe(1);
        }));
        it('should list products with search filter', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            product_model_1.default.countDocuments.mockResolvedValue(0);
            const result = yield (0, product_service_1.listProducts)('companyId', { search: 'test' });
            expect(result.meta.total).toBe(0);
        }));
        it('should list products with tag filter', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            product_model_1.default.countDocuments.mockResolvedValue(0);
            yield (0, product_service_1.listProducts)('companyId', { tag: 'tag1,tag2' });
            expect(product_model_1.default.find).toHaveBeenCalled();
        }));
        it('should list products with category filter', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            product_model_1.default.countDocuments.mockResolvedValue(0);
            yield (0, product_service_1.listProducts)('companyId', { category: 'categoryId' });
            expect(product_model_1.default.find).toHaveBeenCalled();
        }));
        it('should list products with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            product_model_1.default.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            product_model_1.default.countDocuments.mockResolvedValue(50);
            const result = yield (0, product_service_1.listProducts)('companyId', { page: 2, limit: 20 });
            expect(result.meta.totalPages).toBe(3);
        }));
    });
});
