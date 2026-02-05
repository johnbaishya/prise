import express,{ Router,Request,Response } from "express";
import clockMeRoutes from "./api/apps/ClockMe/clockMe.routes";
import getMealRoutes from "./api/apps/GetMeal/getMeal.routes";
import verifyToken from "./middleware/auth";
import commonRoutes from "./api/core/core.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
const router  = Router();


router.use("/clockme",verifyToken,clockMeRoutes)
router.use("/getmeal",getMealRoutes )
router.use("/",commonRoutes)

const appRoutes = router;
export default appRoutes;