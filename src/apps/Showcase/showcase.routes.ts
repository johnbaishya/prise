import { Router } from "express";
import { addProductGallery, createProduct, deleteProduct, getProductDetail, getProductsbyCompanyId, updateProduct } from "./controller/product.controller";
import verifyToken from "@/middleware/auth";
import { createProductCategory, deleteProductCategory, getProductCategoriesByCompanyId, getProductCategoryById, updateProductCategory } from "./controller/productCategory.controller";
import uploadImage from "@/middleware/uploadImage";
import { createProductTag, deleteProductTag, getProductTagById, getProductTagsByCompanyId, updateProductTag } from "./controller/productTag.controller";

const router = Router();
const authorizedRouter = Router();
authorizedRouter.use(verifyToken)









// routes for product
authorizedRouter.post("/product",uploadImage.array('images'), createProduct);
authorizedRouter.put("/product/:id",updateProduct);
authorizedRouter.delete("/product/:id",deleteProduct);
authorizedRouter.post("/product/:id/gallery",uploadImage.array("images"),addProductGallery)
router.get("/product/:id",getProductDetail);
router.get("/company/:id/products",getProductsbyCompanyId);






// routes for product category
authorizedRouter.post("/product-category",createProductCategory);
authorizedRouter.put("/product-category/:id",updateProductCategory);
router.get("/company/:id/product-category",getProductCategoriesByCompanyId);
router.get("/product-category/:id",getProductCategoryById);
authorizedRouter.delete("/product-category/:id",deleteProductCategory);








// routes for product tag
authorizedRouter.post("/product-tag",createProductTag);
authorizedRouter.put("/product-tag/:id",updateProductTag);
router.get("/company/:id/product-tag",getProductTagsByCompanyId);
router.get("/product-tag/:id",getProductTagById);
authorizedRouter.delete("/product-tag/:id",deleteProductTag);







// Combine both routers into one
const combinedRouter = Router();
combinedRouter.use(authorizedRouter);
combinedRouter.use(router);

const showcaseRoutes = combinedRouter;

export default showcaseRoutes;