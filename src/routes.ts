import express,{ Router,Request,Response } from "express";
import clockMeRoutes from "./modules/ClockMe/routes";
import getMealRoutes from "./modules/GetMeal/routes";
import verifyToken from "./middleware/auth";
import commonRoutes from "./modules/Common/routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
const router  = Router();


router.use("/clockme",verifyToken,clockMeRoutes)
router.use("/getmeal",getMealRoutes )
router.use("/",commonRoutes)
router.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

const appRoutes = router;
export default appRoutes;