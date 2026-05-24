"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./controller/product.controller");
const auth_1 = __importDefault(require("@/middleware/auth"));
const productCategory_controller_1 = require("./controller/productCategory.controller");
const uploadImage_1 = __importDefault(require("@/middleware/uploadImage"));
const productTag_controller_1 = require("./controller/productTag.controller");
const router = (0, express_1.Router)();
// product routes
router.post("/product", [auth_1.default, uploadImage_1.default.array('images')], product_controller_1.createProduct);
router.put("/product/:id", auth_1.default, product_controller_1.updateProduct);
router.delete("/product/:id", auth_1.default, product_controller_1.deleteProduct);
router.post("/product/:id/gallery", [auth_1.default, uploadImage_1.default.array("images")], product_controller_1.addProductGallery);
router.get("/product/:id", product_controller_1.getProductDetail);
router.get("/company/:id/products", product_controller_1.getProductsbyCompanyId);
// routes for product category
router.post("/product-category", [auth_1.default, uploadImage_1.default.single("image")], productCategory_controller_1.createProductCategory);
router.put("/product-category/:id", [auth_1.default, uploadImage_1.default.single("image")], productCategory_controller_1.updateProductCategory);
router.delete("/product-category/:id", auth_1.default, productCategory_controller_1.deleteProductCategory);
router.get("/company/:id/product-category", productCategory_controller_1.getProductCategoriesByCompanyId);
router.get("/product-category/:id", productCategory_controller_1.getProductCategoryById);
// routes for product tag
router.post("/product-tag", [auth_1.default, uploadImage_1.default.single("image")], productTag_controller_1.createProductTag);
router.put("/product-tag/:id", [auth_1.default, uploadImage_1.default.single("image")], productTag_controller_1.updateProductTag);
router.delete("/product-tag/:id", auth_1.default, productTag_controller_1.deleteProductTag);
router.get("/company/:id/product-tag", productTag_controller_1.getProductTagsByCompanyId);
router.get("/product-tag/:id", productTag_controller_1.getProductTagById);
exports.default = router;
