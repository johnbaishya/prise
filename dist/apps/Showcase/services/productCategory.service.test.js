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
const productCategory_service_1 = require("./productCategory.service");
const productCategory_model_1 = __importDefault(require("../models/productCategory.model"));
const company_service_1 = require("@/core/company/company.service");
jest.mock("../models/productCategory.model");
jest.mock("@/libs/auth");
jest.mock("@/core/company/company.service");
describe("getProductCategoryWithOwnershipAndExistance", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should throw 404 if product category not found", () => __awaiter(void 0, void 0, void 0, function* () {
        productCategory_model_1.default.findById.mockResolvedValue(null);
        yield expect((0, productCategory_service_1.getProductCategoryWithOwnershipAndExistance)("1", "user1")).rejects.toThrow("Product category not found");
    }));
    it("should throw 403 if user is not owner", () => __awaiter(void 0, void 0, void 0, function* () {
        productCategory_model_1.default.findById.mockResolvedValue({
            company_id: "company1",
        });
        company_service_1.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
        yield expect((0, productCategory_service_1.getProductCategoryWithOwnershipAndExistance)("1", "user1")).rejects.toThrow("You are not authorized");
    }));
    it("should return product category if owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCategory = { company_id: "company1" };
        productCategory_model_1.default.findById.mockResolvedValue(mockCategory);
        company_service_1.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
        const result = yield (0, productCategory_service_1.getProductCategoryWithOwnershipAndExistance)("1", "user1");
        expect(result).toBe(mockCategory);
    }));
});
describe("createProductCategory test", () => {
    it("should throw 403 if user is not owner of company", () => __awaiter(void 0, void 0, void 0, function* () {
        company_service_1.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
        let inputData = {
            name: "Category 1",
            company_id: "company1",
            slug: "category-1",
            description: "This is a sample product category"
        };
        yield expect((0, productCategory_service_1.createProductCategory)(inputData, "user1")).rejects.toMatchObject({ status: 403 });
    }));
    it("should create product category if user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
        let inputData = {
            name: "Category 1",
            company_id: "company1",
            slug: "category-1",
            description: "This is a sample product category"
        };
        const mockCategory = { name: "Category 1", company_id: "company1" };
        company_service_1.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
        productCategory_model_1.default.create.mockResolvedValue(mockCategory);
        const result = yield (0, productCategory_service_1.createProductCategory)(inputData, "user1");
        expect(result).toBe(mockCategory);
    }));
});
describe("updateProductCategory Test", () => {
    it("should throw 403 if user is not owner of company", () => __awaiter(void 0, void 0, void 0, function* () {
        company_service_1.checkCompanyOwnershipByCompanyId.mockResolvedValue(false);
        let inputData = {
            name: "Category 1",
            slug: "category-1",
            description: "This is a sample product category"
        };
        yield expect((0, productCategory_service_1.updateProductCategory)("1", inputData, "user1")).rejects.toMatchObject({ status: 403 });
    }));
    it("should update product category if user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
        let inputData = {
            name: "Category 1",
            slug: "category-1",
            description: "This is a sample product category"
        };
        const mockCategory = { name: "Category 1", company_id: "company1" };
        company_service_1.checkCompanyOwnershipByCompanyId.mockResolvedValue(true);
        productCategory_model_1.default.findByIdAndUpdate.mockResolvedValue(mockCategory);
        const result = yield (0, productCategory_service_1.updateProductCategory)("1", inputData, "user1");
        expect(result).toBe(mockCategory);
    }));
});
