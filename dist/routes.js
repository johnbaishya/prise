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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const router = (0, express_1.Router)();
router.use("/clockme", auth_1.default, routes_1.default);
router.use("/getmeal", routes_2.default);
router.use("/", routes_3.default);
router.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
const appRoutes = router;
exports.default = appRoutes;
