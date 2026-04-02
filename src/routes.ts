import express,{ Router,Request,Response } from "express";
import clockMeRoutes from "./apps/ClockMe/clockMe.routes";
import getMealRoutes from "./apps/GetMeal/getMeal.routes";
import verifyToken from "./middleware/auth";
import commonRoutes from "./core/core.routes";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import showvcaseRoutes from "./apps/Showcase/showcase.routes";
const router  = Router();


router.use("/clockme",verifyToken,clockMeRoutes);
router.use("/getmeal",getMealRoutes );
router.use("/showcase",showvcaseRoutes);
router.use("/",commonRoutes);


const appRoutes = router;
export default appRoutes;