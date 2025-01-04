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
exports.getSiteAssignedBySiteId = exports.getSitesAssigned = exports.deleteUserSiteAssigned = exports.updateUserSiteStatus = exports.assignUserToSite = void 0;
const ClockMeUserSiteAssigned_1 = __importDefault(require("../models/ClockMeUserSiteAssigned"));
const ClockMeSite_1 = __importDefault(require("../models/ClockMeSite"));
const auth_1 = require("../../../libs/auth");
const User_1 = __importDefault(require("../../Common/model/User"));
const reqres_1 = require("../../../libs/reqres");
const assignUserToSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let siteId = req.body.clock_me_site_id;
        let userId = req.body.user_id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        let user = yield User_1.default.findById(userId);
        if (!site) {
            res.status(400).json({ message: "site not found" });
            return;
        }
        if (!user) {
            res.status(400).json({ message: "user not found" });
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, site);
        if (!isOwner) {
            return;
        }
        let userSiteAssigned = yield ClockMeUserSiteAssigned_1.default.create(req.body);
        res.status(200).json(userSiteAssigned);
    }
    catch (error) {
        console.log("error from assignUserToSite", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.assignUserToSite = assignUserToSite;
const updateUserSiteStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userSiteId = req.params.id;
        let userSite = yield ClockMeUserSiteAssigned_1.default.findById(userSiteId);
        if (!userSite) {
            res.status(400).json({ message: "Data not found" });
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, userSite);
        if (!isOwner) {
            return;
        }
        let status = req.body.status;
        let userSiteUpdated = yield ClockMeUserSiteAssigned_1.default.findByIdAndUpdate(userSiteId, { status }, { new: true });
        res.status(200).json(userSiteUpdated);
    }
    catch (error) {
        console.log("error from UpdateUserSiteStatus", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.updateUserSiteStatus = updateUserSiteStatus;
const deleteUserSiteAssigned = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userSiteId = req.params.id;
        let userSite = yield ClockMeUserSiteAssigned_1.default.findById(userSiteId);
        if (!userSite) {
            res.status(400).json({ message: "Data not found" });
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, userSite);
        if (!isOwner) {
            return;
        }
        yield ClockMeUserSiteAssigned_1.default.findByIdAndDelete(userSiteId);
        res.status(200).json({ message: "user Site asssignment deleted" });
    }
    catch (error) {
        console.log("error from deleteUserSiteAssigned", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.deleteUserSiteAssigned = deleteUserSiteAssigned;
const getSitesAssigned = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let data = yield ClockMeUserSiteAssigned_1.default.find({ user_id }).populate({ path: "clock_me_site_id", populate: { path: "user_id" } });
        const assignedSites = data.map((item) => {
            const site = item.clock_me_site_id;
            const user = site.user_id;
            return Object.assign(Object.assign({}, item.toObject()), { site: {
                    _id: site._id, // Keep just the site ID
                    user: user, // Include the populated user
                    address: site.address,
                    description: site.description,
                }, clock_me_site_id: site.id });
        });
        res.status(200).json(assignedSites);
    }
    catch (error) {
        console.log("error from getSitesAssigned", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.getSitesAssigned = getSitesAssigned;
const getSiteAssignedBySiteId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let siteId = req.params.id;
        let site = yield ClockMeSite_1.default.findById(siteId);
        if (!site) {
            res.status(400).json({ message: "site not found" });
            return;
        }
        let isOwner = (0, auth_1.checkOwnership)(req, res, site);
        if (!isOwner) {
            return;
        }
        let siteAssignedList = yield ClockMeUserSiteAssigned_1.default.find({ clock_me_site_id: siteId }).populate("user_id");
        res.status(200).json(siteAssignedList);
    }
    catch (error) {
        console.log("error from getSiteAssignedBySiteId", error);
        (0, reqres_1.sendErrorResponse)(res, error);
    }
});
exports.getSiteAssignedBySiteId = getSiteAssignedBySiteId;
