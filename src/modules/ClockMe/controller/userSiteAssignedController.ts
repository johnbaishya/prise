import { Response } from "express";
import { UserRequest } from "../../../Types/request";
import ClockMeUserSiteAssigned from "../models/ClockMeUserSiteAssigned";
import ClockMeSite from "../models/ClockMeSite";
import { checkOwnership } from "../../../libs/auth";
import User from "../../Common/model/User";
import { sendErrorResponse } from "../../../libs/reqres";


//  to assign a site to a user
/**
 * @swagger
 * /api/clockme/user-site-assign:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Assign User to a Site
 *     description: assign a user to a certain site.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               clock_me_site_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                   - cancelled
 *                   - completed
 *             required:
 *               - user_id
 *               - clock_me_site_id
 *     responses:
 *       200:
 *         description: assigned user site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const assignUserToSite = async(req:UserRequest,res:Response)=>{
    try {
        let siteId = req.body.clock_me_site_id;
        let userId  = req.body.user_id;
        let site = await ClockMeSite.findById(siteId);
        let user = await User.findById(userId);
        if(!site){
            res.status(400).json({message:"site not found"})
            return;
        }
        if(!user){
            res.status(400).json({message:"user not found"})
            return;
        }
        let isOwner = checkOwnership(req,res,site);
        if(!isOwner){
            return
        }
        let userSiteAssigned = await ClockMeUserSiteAssigned.create(req.body);
        res.status(200).json(userSiteAssigned);
    } catch (error) {
        console.log("error from assignUserToSite",error);
        sendErrorResponse(res,error);
    }
}



//  to update a user site assign
/**
 * @swagger
 * /api/clockme/user-site-assign/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Update user site assign
 *     description: update user site assign.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                   - cancelled
 *                   - completed
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: updated assigned user site.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const updateUserSiteStatus = async(req:UserRequest,res:Response)=>{
    try {
        let userSiteId = req.params.id;
        let userSite = await ClockMeUserSiteAssigned.findById(userSiteId);
        if(!userSite){
            res.status(400).json({message:"Data not found"})
            return 
        }
        let isOwner = checkOwnership(req,res,userSite);
        if(!isOwner){
            return
        }
        let status = req.body.status;
        let userSiteUpdated = await ClockMeUserSiteAssigned.findByIdAndUpdate(userSiteId,{status},{new:true});
        res.status(200).json(userSiteUpdated)
        
    } catch (error) {
        console.log("error from UpdateUserSiteStatus",error);
        sendErrorResponse(res,error);
    }
}



//  to delete a user site assign
/**
 * @swagger
 * /api/clockme/user-site-assign/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: delete user site assign
 *     description: delete a user site assign.
 *     responses:
 *       200:
 *         description:  user site assign deleted.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const deleteUserSiteAssigned = async(req:UserRequest,res:Response)=>{
    try {
        let userSiteId = req.params.id;
        let userSite = await ClockMeUserSiteAssigned.findById(userSiteId);
        if(!userSite){
            res.status(400).json({message:"Data not found"})
            return 
        }
        let isOwner = checkOwnership(req,res,userSite);
        if(!isOwner){
            return
        }
        await ClockMeUserSiteAssigned.findByIdAndDelete(userSiteId);
        res.status(200).json({message:"user Site asssignment deleted"})
    } catch (error) {
        console.log("error from deleteUserSiteAssigned",error)
        sendErrorResponse(res,error);
    }
}


//  to get user site assign of the current user
/**
 * @swagger
 * /api/clockme/user-site-assign:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: get user sites assigned
 *     description: get all user site assigned of current user.
 *     responses:
 *       200:
 *         description: assigned user site[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getSitesAssigned = async(req:UserRequest,res:Response)=>{
    try {
        let user_id = req.user?.id;
        let  data = await ClockMeUserSiteAssigned.find({user_id}).populate({path:"clock_me_site_id",populate:{path:"user_id"}});

        const assignedSites = data.map((item) => {
            const site = item.clock_me_site_id;
            const user = site.user_id;
            return {
              ...item.toObject(),
              site: {
                _id: site._id, // Keep just the site ID
                user: user, // Include the populated user
                address: site.address,
                description: site.description,
              },
              clock_me_site_id: site.id, // Remove the original key
            };
          });
        res.status(200).json(assignedSites); 
    } catch (error) {
        console.log("error from getSitesAssigned",error);
        sendErrorResponse(res,error);
    }
}


//  to get user site assign of certain site
/**
 * @swagger
 * /api/clockme/site/:id/user-site-assign:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: get user sites assigned by site
 *     description: get all user site assigned of a certain site.
 *     responses:
 *       200:
 *         description: assigned user site[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *     
 */
export const getSiteAssignedBySiteId = async(req:UserRequest,res:Response)=>{
    try {
        let siteId = req.params.id;
        let site = await ClockMeSite.findById(siteId);
        if(!site){
            res.status(400).json({message:"site not found"})
            return;
        }
        let isOwner = checkOwnership(req,res,site);
        if(!isOwner){
            return;
        }
        let siteAssignedList = await ClockMeUserSiteAssigned.find({clock_me_site_id:siteId}).populate("user_id");
        res.status(200).json(siteAssignedList);
    } catch (error) {
        console.log("error from getSiteAssignedBySiteId",error)
        sendErrorResponse(res,error);
    }
}