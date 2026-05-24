import { Router } from "express";
import { addProductGallery, createProduct, deleteProduct, getProductDetail, getProductsbyCompanyId, updateProduct } from "./controller/product.controller";
import verifyToken from "@/middleware/auth";
import { createProductCategory, deleteProductCategory, getProductCategoriesByCompanyId, getProductCategoryById, updateProductCategory } from "./controller/productCategory.controller";
import uploadImage from "@/middleware/uploadImage";
import { createProductTag, deleteProductTag, getProductTagById, getProductTagsByCompanyId, updateProductTag } from "./controller/productTag.controller";

const router = Router();









// product routes
router.post("/product",[verifyToken,uploadImage.array('images')], createProduct);
router.put("/product/:id",verifyToken,updateProduct);
router.delete("/product/:id",verifyToken,deleteProduct);
router.post("/product/:id/gallery",[verifyToken,uploadImage.array("images")],addProductGallery)



router.get("/product/:id",getProductDetail);
router.get("/company/:id/products",getProductsbyCompanyId);






// routes for product category
router.post("/product-category",[verifyToken,uploadImage.single("image")],createProductCategory);
router.put("/product-category/:id",[verifyToken,uploadImage.single("image")],updateProductCategory);
router.delete("/product-category/:id",verifyToken,deleteProductCategory);



router.get("/company/:id/product-category",getProductCategoriesByCompanyId);
router.get("/product-category/:id",getProductCategoryById);








// routes for product tag
router.post("/product-tag",[verifyToken,uploadImage.single("image")],createProductTag);
router.put("/product-tag/:id",[verifyToken,uploadImage.single("image")],updateProductTag);
router.delete("/product-tag/:id",verifyToken,deleteProductTag);


router.get("/company/:id/product-tag",getProductTagsByCompanyId);
router.get("/product-tag/:id",getProductTagById);




export default router;