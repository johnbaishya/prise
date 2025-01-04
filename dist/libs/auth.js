"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnershipStatus = exports.checkOwnership = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = ({ id, email, first_name, last_name }) => {
    const token = jsonwebtoken_1.default.sign({ id, email, first_name, last_name }, process.env.TOKEN_KEY);
    return token;
};
exports.createToken = createToken;
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
const checkOwnershipStatus = (req, res, doc) => {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
