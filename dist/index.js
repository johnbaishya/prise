"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
// import config from './config';
// const PORT = config.port || 3000;
const PORT = process.env.API_PORT || 3000;
// Start the Express server
// uncomment this code while running in local-------------------
app_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// ----------------------------------------------------------
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.2/swagger-ui.min.css";
app_1.default.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    customCssUrl: CSS_URL
}));
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server...');
    process.exit(0);
});
exports.default = (req, res) => {
    (0, app_1.default)(req, res);
};
