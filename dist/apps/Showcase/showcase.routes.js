"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./controller/product.controller");
const auth_1 = __importDefault(require("@/middleware/auth"));
const productCategory_controller_1 = require("./controller/productCategory.controller");
const router = (0, express_1.Router)();
const authorizedRouter = (0, express_1.Router)();
authorizedRouter.use(auth_1.default);
// routes for product
authorizedRouter.post("/product", product_controller_1.createProduct);
router.get("/product", () => { });
// routes for product category
authorizedRouter.post("/product-category", productCategory_controller_1.createProductCategory);
authorizedRouter.put("/product-category/:id", productCategory_controller_1.updateProductCategory);
router.get("/product-category/company/:companyId", productCategory_controller_1.getProductCategoriesByCompanyId);
router.get("/product-category/:id", productCategory_controller_1.getProductCategoryById);
authorizedRouter.delete("/product-category/:id", productCategory_controller_1.deleteProductCategory);
// Combine both routers into one
const combinedRouter = (0, express_1.Router)();
combinedRouter.use(authorizedRouter);
combinedRouter.use(router);
const showcaseRoutes = combinedRouter;
exports.default = showcaseRoutes;
