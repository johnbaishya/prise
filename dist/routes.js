"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = __importDefault(require("./modules/ClockMe/routes"));
const routes_2 = __importDefault(require("./modules/GetMeal/routes"));
const auth_1 = __importDefault(require("./middleware/auth"));
const routes_3 = __importDefault(require("./modules/Common/routes"));
const router = (0, express_1.Router)();
router.use("/clockme", auth_1.default, routes_1.default);
router.use("/getmeal", routes_2.default);
router.use("/", routes_3.default);
const appRoutes = router;
exports.default = appRoutes;
