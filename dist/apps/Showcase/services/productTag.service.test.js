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
const productTag_model_1 = __importDefault(require("../models/productTag.model"));
const productTagService = __importStar(require("./productTag.service"));
const companyService = __importStar(require("@/core/company/company.service"));
jest.mock("@/core/company/company.service");
jest.mock("../models/productTag.model");
describe("productTag.service", () => {
    const mockUserId = "user123";
    const mockCompanyId = "company123";
    const mockProductTagId = "tag123";
    const mockProductTag = {
        _id: mockProductTagId,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic products",
        company_id: mockCompanyId,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("checkProductTagExists", () => {
        it("should return true if product tag exists", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(mockProductTag);
            const result = yield productTagService.checkProductTagExists(mockProductTagId);
            expect(result).toBe(true);
            expect(productTag_model_1.default.findById).toHaveBeenCalledWith(mockProductTagId);
        }));
        it("should return false if product tag does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(null);
            const result = yield productTagService.checkProductTagExists(mockProductTagId);
            expect(result).toBe(false);
        }));
        it("should throw error on database failure", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockRejectedValue(new Error("DB Error"));
            yield expect(productTagService.checkProductTagExists(mockProductTagId)).rejects.toThrow("DB Error");
        }));
    });
    describe("getProductTagWithOwnershipAndExistance", () => {
        it("should return product tag if exists and user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(mockProductTag);
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            const result = yield productTagService.getProductTagWithOwnershipAndExistance(mockProductTagId, mockUserId);
            expect(result).toEqual(mockProductTag);
        }));
        it("should throw 404 if product tag not found", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(null);
            yield expect(productTagService.getProductTagWithOwnershipAndExistance(mockProductTagId, mockUserId)).rejects.toMatchObject({
                message: "Product tag not found",
                status: 404,
            });
        }));
        it("should throw 403 if user is not owner", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(mockProductTag);
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
            yield expect(productTagService.getProductTagWithOwnershipAndExistance(mockProductTagId, mockUserId)).rejects.toMatchObject({
                message: "You are not authorized to access this product tag",
                status: 403,
            });
        }));
    });
    describe("createProductTag", () => {
        it("should create product tag if user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productTag_model_1.default.create.mockResolvedValue(mockProductTag);
            const result = yield productTagService.createProductTag({ companyId: mockCompanyId, name: "Electronics", slug: "electronics", description: "Electronic products" }, mockUserId);
            expect(result).toEqual(mockProductTag);
            expect(productTag_model_1.default.create).toHaveBeenCalled();
        }));
        it("should throw 403 if user is not owner", () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
            yield expect(productTagService.createProductTag({ companyId: mockCompanyId, name: "Electronics", slug: "electronics", description: "Electronic products" }, mockUserId)).rejects.toMatchObject({
                message: "You are not authorized to create a product tag for this company",
                status: 403,
            });
        }));
    });
    describe("updateProductTag", () => {
        it("should update product tag if user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedTag = Object.assign(Object.assign({}, mockProductTag), { name: "Updated" });
            productTag_model_1.default.findById.mockResolvedValue(mockProductTag);
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productTag_model_1.default.findByIdAndUpdate.mockResolvedValue(updatedTag);
            const result = yield productTagService.updateProductTag(mockProductTagId, { name: "Updated" }, mockUserId);
            expect(result).toEqual(updatedTag);
            expect(productTag_model_1.default.findByIdAndUpdate).toHaveBeenCalledWith(mockProductTagId, { name: "Updated" }, { new: true });
        }));
        it("should throw error if user is not authorized", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(mockProductTag);
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
            yield expect(productTagService.updateProductTag(mockProductTagId, { name: "Updated" }, mockUserId)).rejects.toMatchObject({
                status: 403,
            });
        }));
    });
    describe("deleteProductTag", () => {
        it("should delete product tag if user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(mockProductTag);
            companyService.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
            productTag_model_1.default.findByIdAndDelete.mockResolvedValue(mockProductTag);
            const result = yield productTagService.deleteProductTag(mockProductTagId, mockUserId);
            expect(result).toEqual(mockProductTag);
            expect(productTag_model_1.default.findByIdAndDelete).toHaveBeenCalledWith(mockProductTagId);
        }));
        it("should throw 404 if product tag not found", () => __awaiter(void 0, void 0, void 0, function* () {
            productTag_model_1.default.findById.mockResolvedValue(null);
            yield expect(productTagService.deleteProductTag(mockProductTagId, mockUserId)).rejects.toMatchObject({
                status: 404,
            });
        }));
    });
    describe("getProductTagsByCompanyId", () => {
        it("should return product tags for valid company", () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkifCompanyExists.mockResolvedValue(true);
            productTag_model_1.default.find.mockResolvedValue([mockProductTag]);
            const result = yield productTagService.getProductTagsByCompanyId(mockCompanyId);
            expect(result).toEqual([mockProductTag]);
            expect(productTag_model_1.default.find).toHaveBeenCalledWith({ company_id: mockCompanyId });
        }));
        it("should throw 404 if company does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            companyService.checkifCompanyExists.mockResolvedValue(false);
            yield expect(productTagService.getProductTagsByCompanyId(mockCompanyId)).rejects.toMatchObject({
                message: "Company not found",
                status: 404,
            });
        }));
    });
});
