import { Router, Request,Response } from "express";

const router  = Router();

router.get("/page",(req:Request,res:Response)=>{
    res.send("this is page 1 of get meal")
})


const getMealRoutes  = router;
export default getMealRoutes;