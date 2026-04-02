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
exports.checkOwnershipStatus = exports.checkComanyOwnershipByCompanyId = exports.checkOwnership = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const company_model_1 = __importDefault(require("@/core/company/company.model"));
const createToken = ({ id, email, first_name, last_name }) => {
    const token = jsonwebtoken_1.default.sign({ id, email, first_name, last_name }, process.env.TOKEN_KEY);
    return token;
};
exports.createToken = createToken;
// ===========================================================================================================================
// function to check ownership by comparing user id from token with user id in the document
const checkOwnership = (req, res, doc) => {
    var _a;
    let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    let userIdInDocument = doc.get("user_id");
    let isowner = userId.toString() === userIdInDocument.toString();
    if (!isowner) {
        res.status(403).json({ message: "you are not authorized for this action" });
        return false;
    }
    return true;
};
exports.checkOwnership = checkOwnership;
// =--==========================================================================================================================
// function to check company ownership by company id
// it will be used in the controllers and services to check if the user is the owner of the company before allowing them to perform certain actions (like creating a product, etc.)
const checkComanyOwnershipByCompanyId = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    let company = yield company_model_1.default.findById(companyId);
    let isOwner = (0, exports.checkOwnershipStatus)(userId, company);
    return isOwner;
});
exports.checkComanyOwnershipByCompanyId = checkComanyOwnershipByCompanyId;
// =============================================================================================================================
// function to check ownership status by comparing user id from token with user id in the document
const checkOwnershipStatus = (userId, doc) => {
    try {
        console.log("user id from token:", userId);
        let userIdInDocument = doc.get("user_id");
        let isowner = userId.toString() === userIdInDocument.toString();
        if (!isowner) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.checkOwnershipStatus = checkOwnershipStatus;
