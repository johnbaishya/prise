import { Router } from "express";
import { createProduct } from "./controller/product.controller";
import verifyToken from "@/middleware/auth";

const router = Router();
const authorizedRouter = Router();
authorizedRouter.use(verifyToken)

authorizedRouter.post("/product", createProduct)
router.get("/product",()=>{})


// Combine both routers into one
const combinedRouter = Router();
combinedRouter.use(authorizedRouter);
combinedRouter.use(router);

const showcaseRoutes = combinedRouter;

export default showcaseRoutes;