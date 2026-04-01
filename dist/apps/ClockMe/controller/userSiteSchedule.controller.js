"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.getScheduleDetail = exports.getScheduleByUserSiteAssign = exports.updateSchedule = exports.createSchedule = void 0;
const ClockMeUserSiteAssigned_1 = __importDefault(require("../models/ClockMeUserSiteAssigned"));
const ClockMeSite_1 = __importDefault(require("../models/ClockMeSite"));
const auth_1 = require("../../../libs/auth");
const ClockMeUserSiteSchedule_1 = __importDefault(require("../models/ClockMeUserSiteSchedule"));
const reqres_1 = require("../../../libs/reqres");
/*
post bosy structure is
{
    clock_me_user_site_assigned_id:id,
    time_Schedule =[{
        clock_in:date,
        clock_out:date,
        break_duration:timeDuration
    },{...}]
}
 */
//  to create a schedule
/**
 * @swagger
 * /api/clockme/schedule:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: Create Schedule
 *     description: create a schedule for a user (worker) to work at a certain site.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clock_me_user_site_assigned_id:
 *                 type: string
 *               time_Schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     clock_in:
 *                       type: string
 *                       format: date-time
 *                     clock_out:
 *                       type: string
 *                       format: date-time
 *                     break_duration:
 *                       type: number
 *                       description: Duration in minutes.
 *             required:
 *               - clock_me_user_site_assigned_id
 *               - time_Schedule
 *     responses:
 *       200:
 *         description: Schedule.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const createSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let userSiteAssignedId = body.clock_me_user_site_assigned_id;
        let userSiteAssigned = yield ClockMeUserSiteAssigned_1.default.findById(userSiteAssignedId);
        if (!userSiteAssigned) {
            res.status(400).json({ message: "user site assigned data not found" });
            return;
        }
        let siteId = userSiteAssigned.clock_me_site_id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        if (!site) {
            res.status(400).json({ message: "site not found" });
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, site);
        if (!isOwner) {
            return;
        }
        let newRecords = body.time_Schedule.map((item) => {
            return {
                clock_me_user_site_assigned_id: body.clock_me_user_site_assigned_id,
                clock_in: item.clock_in,
                clock_out: item.clock_out,
                break_duration: item.break_duration
            };
        });
        let savedData = yield ClockMeUserSiteSchedule_1.default.insertMany(newRecords);
        res.status(201).json(savedData);
    }
    catch (error) {
        console.log("error from create schedule", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.createSchedule = createSchedule;
// to check if a user is the creator of a schedule
const checkIsSchedculeCreator = (req, res, schedule) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let scheduleId = req.params.id;
        // let schedule = await ClockMeUserSiteSchedule.findById(scheduleId);
        // checking if schedule exist
        if (!schedule) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "Schedule not found");
            return false;
        }
        let clock_me_user_site_assigned_id = schedule.clock_me_user_site_assigned_id;
        let UserSiteAssign = yield ClockMeUserSiteAssigned_1.default.findById(clock_me_user_site_assigned_id);
        // checking is the user site assigned data exists
        if (!UserSiteAssign) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "user site assign not found");
            return false;
        }
        let siteId = UserSiteAssign.clock_me_site_id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        // checking if site exists
        if (!site) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "site not found");
            return false;
        }
        let isowner = (0, auth_1.checkOwnership)(req, res, site);
        // checking if the current user owns the site
        if (!isowner) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.log("error from updateSchedule");
        (0, reqres_1.sendErrorResponse)(res, error);
        return false;
    }
});
//  to update a schedule
/**
 * @swagger
 * /api/clockme/schedule/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: update Schedule
 *     description: update a schedule.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time_Schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     clock_in:
 *                       type: string
 *                       format: date-time
 *                     clock_out:
 *                       type: string
 *                       format: date-time
 *                     break_duration:
 *                       type: number
 *                       description: Duration in minutes.
 *             required:
 *               - time_Schedule
 *     responses:
 *       200:
 *         description: updated schedule.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const updateSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let scheduleId = req.params.id;
        let schedule = yield ClockMeUserSiteSchedule_1.default.findById(scheduleId);
        // // checking if schedule exist
        // if(!schedule){
        //     sendResponseWithMessage(res,400,"Schedule not found");
        //     return;
        // }
        // let clock_me_user_site_assigned_id = schedule.clock_me_user_site_assigned_id;
        // let UserSiteAssign = await ClockMeUserSiteAssigned.findById(clock_me_user_site_assigned_id);
        // // checking is the user site assigned data exists
        // if(!UserSiteAssign){
        //     sendResponseWithMessage(res,400,"user site assign not found");
        //     return;
        // }
        // let siteId = UserSiteAssign.clock_me_site_id;
        // let site = await ClockMeSite.findById(siteId);
        // // checking if site exists
        // if(!site){
        //     sendResponseWithMessage(res,400,"site not found");
        //     return;
        // }
        // let isowner  = checkOwnership(req,res,site);
        // // checking if the current user owns the site
        // if(!isowner){
        //     return;
        // }
        let isScheduleCreator = yield checkIsSchedculeCreator(req, res, schedule);
        if (!isScheduleCreator) {
            return;
        }
        let updatedSchedule = yield ClockMeUserSiteSchedule_1.default.findByIdAndUpdate(scheduleId, req.body, { new: true });
        (0, reqres_1.sendSuccessResponse)(res, updatedSchedule);
    }
    catch (error) {
        console.log("error from updateSchedule");
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.updateSchedule = updateSchedule;
//  get sxhedules by user site assign Id
/**
 * @swagger
 * /api/clockme/user-site-assign/:id/schedule:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: get Schedules by user site assign id
 *     description: get Schedules by user site assign id
 *     responses:
 *       200:
 *         description: schedule[].
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getScheduleByUserSiteAssign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // need to make it (only be accessible by site owner and assigned user) for later
    try {
        let userSiteAssignId = req.params.id;
        let userSiteAssigned = yield ClockMeUserSiteAssigned_1.default.findById(userSiteAssignId);
        if (!userSiteAssigned) {
            res.status(400).json({ message: "user site assigned not found" });
            return;
        }
        let schedules = ClockMeUserSiteSchedule_1.default.find({ clock_me_user_site_assigned_id: userSiteAssignId });
        res.status(200).json(schedules);
    }
    catch (error) {
        console.log("error from getSchedulesByUserSiteAssign", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.getScheduleByUserSiteAssign = getScheduleByUserSiteAssign;
//  to get schedule detail
/**
 * @swagger
 * /api/clockme/schedule/:id:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: get Schedule details
 *     description: get details of a certain schedule
 *     responses:
 *       200:
 *         description: schedule.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const getScheduleDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let scheduleId = req.params.id;
        let schedule = ClockMeUserSiteSchedule_1.default.findById(scheduleId);
        if (!schedule) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "schedule not found");
            return;
        }
        res.status(200).json(schedule);
    }
    catch (error) {
        console.log("error getScheduleDetail", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.getScheduleDetail = getScheduleDetail;
//  to delete a schedule
/**
 * @swagger
 * /api/clockme/schedule/:id:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: delete Schedule
 *     description: delete a certain schedule
 *     responses:
 *       200:
 *         description: schedule deleted successfully.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const deleteSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let scheduleId = req.params.id;
        let schedule = yield ClockMeUserSiteSchedule_1.default.findById(scheduleId);
        let isScheduleCreator = yield checkIsSchedculeCreator(req, res, schedule);
        if (!isScheduleCreator) {
            return;
        }
        yield ClockMeUserSiteSchedule_1.default.findByIdAndDelete(scheduleId);
        (0, reqres_1.sendResponseWithMessage)(res, 200, "Schedule Deleted successfully");
    }
    catch (error) {
        console.log("error from deleteSchedule", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.deleteSchedule = deleteSchedule;
