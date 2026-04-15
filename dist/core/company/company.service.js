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
exports.checkCompanyOwnershipByCompanyId = exports.checkifCompanyExists = void 0;
const auth_1 = require("@/libs/auth");
const company_model_1 = __importDefault(require("./company.model"));
// function to check if the company exists by id
const checkifCompanyExists = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield company_model_1.default.findById(companyId);
        if (!company) {
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.checkifCompanyExists = checkifCompanyExists;
// =--==========================================================================================================================
// function to check company ownership by company id
// it will be used in the controllers and services to check if the user is the owner of the company before allowing them to perform certain actions (like creating a product, etc.)
const checkCompanyOwnershipByCompanyId = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    let company = yield company_model_1.default.findById(companyId);
    let ownerId = company === null || company === void 0 ? void 0 : company.get("user_id");
    if (!company) {
        return false;
    }
    let isOwner = (0, auth_1.checkOwnershipStatus)(userId, ownerId);
    return isOwner;
});
exports.checkCompanyOwnershipByCompanyId = checkCompanyOwnershipByCompanyId;
