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
exports.updateClock = exports.startClock = exports.checkUserHasRunningClock = void 0;
const reqres_1 = require("../../../libs/reqres");
const ClockMeUserSiteAssigned_1 = __importDefault(require("../models/ClockMeUserSiteAssigned"));
const Clock_1 = __importDefault(require("../models/Clock"));
const auth_1 = require("../../../libs/auth");
const enums_1 = require("../types/enums");
// to check if a user is already has a running clock. 
// in other words if user is currently working. 
// user has clocked in but hasnt clocked out yet. 
const checkUserHasRunningClock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let runningClock = yield Clock_1.default.findOne({
            user_id,
            status: { $in: [enums_1.clockStatusEnum.active, enums_1.clockStatusEnum.inactive] }
        });
        if (runningClock) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "you already have an ongoing clock. please end that clock first");
            return true;
        }
        return false;
    }
    catch (error) {
        console.log("error from checkUserHasRunningClock", error);
        (0, reqres_1.sendErrorResponse)(res, error);
        return true;
    }
});
exports.checkUserHasRunningClock = checkUserHasRunningClock;
// for starting a new clock for a user. 
// for creating a clock.
// this methods executes when a user clock_in on a working site
/**
 * @swagger
 * /api/clockme/site/:id/clock-in:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: clock_in
 *     description: api for when user clock_in at a working site. it creates a new clock entry
 *     responses:
 *       201:
 *         description: Clock Started .
 *       500:
 *         description: some error.
 *       401:
 *         description: unauthorized
 */
const startClock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // cheking if user has already started and not ended any other clock (onGoing clock / running clock);
        let hasRunningClock = yield (0, exports.checkUserHasRunningClock)(req, res);
        if (hasRunningClock) {
            return;
        }
        let user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let clock_me_site_id = req.params.id;
        let isUserAssignedToSite = yield ClockMeUserSiteAssigned_1.default.findOne({ user_id, clock_me_site_id });
        if (!isUserAssignedToSite) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "you are not authorized for this site");
            return;
        }
        let clock_in = new Date().toISOString();
        let clock = yield Clock_1.default.create({ user_id, clock_me_site_id, clock_in });
        (0, reqres_1.sendSuccessResponse)(res, clock);
    }
    catch (error) {
        console.log("error from start clock", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.startClock = startClock;
//  to update a clock
/**
 * @swagger
 * /api/clockme/clock/:id:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [ClockMe]
 *     summary: update a clock
 *     description: create a schedule for a user (worker) to work at a certain site.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum:
 *                   - clock_out
 *                   - break_start
 *                   - break_end
 *     responses:
 *       200:
 *         description: Schedule.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: something wrong
 *
 */
const updateClock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let clockId = req.params.id;
        let body = req.body;
        let clock = yield Clock_1.default.findById(clockId);
        if (!clock) {
            (0, reqres_1.sendResponseWithMessage)(res, 400, "clock  data not found");
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, clock);
        if (!isOwner) {
            return;
        }
        let currentTime = new Date().toISOString();
        let axnEnm = enums_1.updateClockActionEnum;
        let action = body.action;
        let status = enums_1.clockStatusEnum.active;
        switch (action) {
            case axnEnm.clock_out:
                status = enums_1.clockStatusEnum.completed;
                break;
            case axnEnm.break_start:
                status = enums_1.clockStatusEnum.inactive;
                break;
            case axnEnm.break_end:
                status = enums_1.clockStatusEnum.active;
            default:
                break;
        }
        let newBody = {
            [action]: currentTime,
            status
        };
        let updatedClock = yield Clock_1.default.findByIdAndUpdate(clockId, newBody, { new: true });
        (0, reqres_1.sendSuccessResponse)(res, updatedClock);
    }
    catch (error) {
        console.log("error from updateClock", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.updateClock = updateClock;
