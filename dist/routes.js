"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clockMe_routes_1 = __importDefault(require("./api/apps/ClockMe/clockMe.routes"));
const getMeal_routes_1 = __importDefault(require("./api/apps/GetMeal/getMeal.routes"));
const auth_1 = __importDefault(require("./middleware/auth"));
const core_routes_1 = __importDefault(require("./api/core/core.routes"));
const router = (0, express_1.Router)();
router.use("/clockme", auth_1.default, clockMe_routes_1.default);
router.use("/getmeal", getMeal_routes_1.default);
router.use("/", core_routes_1.default);
const appRoutes = router;
exports.default = appRoutes;
