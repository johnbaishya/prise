import express,{ Router,Request,Response } from "express";
import clockMeRoutes from "./modules/ClockMe/routes";
import getMealRoutes from "./modules/GetMeal/routes";
import verifyToken from "./middleware/auth";
import commonRoutes from "./modules/Common/routes";
const app = express();
const router  = Router();


router.use("/clockme",verifyToken,clockMeRoutes)
router.use("/getmeal",getMealRoutes )
router.use("/",commonRoutes)

const appRoutes = router;
export default appRoutes;