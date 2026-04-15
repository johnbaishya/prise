import { Router } from "express";
import { createProduct } from "./controller/product.controller";
import verifyToken from "@/middleware/auth";
import { createProductCategory, deleteProductCategory, getProductCategoriesByCompanyId, getProductCategoryById, updateProductCategory } from "./controller/productCategory.controller";

const router = Router();
const authorizedRouter = Router();
authorizedRouter.use(verifyToken)

// routes for product
authorizedRouter.post("/product", createProduct)
router.get("/product",()=>{})

// routes for product category
authorizedRouter.post("/product-category",createProductCategory);
authorizedRouter.put("/product-category/:id",updateProductCategory);
router.get("/product-category/company/:companyId",getProductCategoriesByCompanyId);
router.get("/product-category/:id",getProductCategoryById);
authorizedRouter.delete("/product-category/:id",deleteProductCategory);



// Combine both routers into one
const combinedRouter = Router();
combinedRouter.use(authorizedRouter);
combinedRouter.use(router);

const showcaseRoutes = combinedRouter;

export default showcaseRoutes;