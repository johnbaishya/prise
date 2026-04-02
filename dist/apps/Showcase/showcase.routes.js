"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./controller/product.controller");
const auth_1 = __importDefault(require("@/middleware/auth"));
const router = (0, express_1.Router)();
const authorizedRouter = (0, express_1.Router)();
authorizedRouter.use(auth_1.default);
authorizedRouter.post("/product", product_controller_1.createProduct);
router.get("/product", () => { });
// Combine both routers into one
const combinedRouter = (0, express_1.Router)();
combinedRouter.use(authorizedRouter);
combinedRouter.use(router);
const showcaseRoutes = combinedRouter;
exports.default = showcaseRoutes;
