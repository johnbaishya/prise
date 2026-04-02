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
exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.createProduct = void 0;
const auth_1 = require("@/libs/auth");
const product_model_1 = __importDefault(require("../models/product.model"));
const createProduct = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = data.company_id;
    const isOwner = yield (0, auth_1.checkComanyOwnershipByCompanyId)(userId, companyId);
    if (!isOwner) {
        const error = new Error("You are not authorized to create a product for this company");
        error.status = 403;
        throw error;
    }
    const product = yield product_model_1.default.create(data);
    return product;
});
exports.createProduct = createProduct;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    return product;
});
exports.getProductById = getProductById;
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findByIdAndUpdate(id, data, { new: true });
    return product;
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findByIdAndDelete(id);
    return product;
});
exports.deleteProduct = deleteProduct;
const listProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.default.find();
    return products;
});
exports.listProducts = listProducts;
