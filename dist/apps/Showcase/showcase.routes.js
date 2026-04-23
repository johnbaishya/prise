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
const authorizedRouter = (0, express_1.Router)();
authorizedRouter.use(auth_1.default);
// routes for product
authorizedRouter.post("/product", uploadImage_1.default.array('images'), product_controller_1.createProduct);
authorizedRouter.put("/product/:id", product_controller_1.updateProduct);
authorizedRouter.delete("/product/:id", product_controller_1.deleteProduct);
authorizedRouter.post("/product/:id/gallery", uploadImage_1.default.array("images"), product_controller_1.addProductGallery);
router.get("/product/:id", product_controller_1.getProductDetail);
router.get("/company/:id/products", product_controller_1.getProductsbyCompanyId);
// routes for product category
authorizedRouter.post("/product-category", productCategory_controller_1.createProductCategory);
authorizedRouter.put("/product-category/:id", productCategory_controller_1.updateProductCategory);
router.get("/company/:id/product-category", productCategory_controller_1.getProductCategoriesByCompanyId);
router.get("/product-category/:id", productCategory_controller_1.getProductCategoryById);
authorizedRouter.delete("/product-category/:id", productCategory_controller_1.deleteProductCategory);
// routes for product tag
authorizedRouter.post("/product-tag", productTag_controller_1.createProductTag);
authorizedRouter.put("/product-tag/:id", productTag_controller_1.updateProductTag);
router.get("/company/:id/product-tag", productTag_controller_1.getProductTagsByCompanyId);
router.get("/product-tag/:id", productTag_controller_1.getProductTagById);
authorizedRouter.delete("/product-tag/:id", productTag_controller_1.deleteProductTag);
// Combine both routers into one
const combinedRouter = (0, express_1.Router)();
combinedRouter.use(authorizedRouter);
combinedRouter.use(router);
const showcaseRoutes = combinedRouter;
exports.default = showcaseRoutes;
