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
const company_model_1 = __importDefault(require("./company.model"));
const company_service_1 = require("./company.service");
jest.mock("./company.model");
// jest.mock("@/libs/auth");
describe("checkCompanyOwnershipByCompanyId test", () => {
    it("should return false if company does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockFindById = jest.fn().mockResolvedValue(null);
        company_model_1.default.findById = mockFindById;
        yield expect((0, company_service_1.checkCompanyOwnershipByCompanyId)("user1", "company1")).rejects.toThrow("Company not found");
    }));
    it("should return true if user is owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCompany = {
            get: jest.fn().mockReturnValue("owner123"),
        };
        company_model_1.default.findById.mockResolvedValue(mockCompany);
        const result = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)("owner123", "company1");
        expect(result).toBe(true);
    }));
    it("should return false if user is not owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCompany = {
            get: jest.fn().mockReturnValue("owner123"),
        };
        company_model_1.default.findById.mockResolvedValue(mockCompany);
        const result = yield (0, company_service_1.checkCompanyOwnershipByCompanyId)("user456", "company1");
        expect(result).rejects.toThrow("You are not authorized to perform this action");
    }));
});
