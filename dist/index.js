"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const swagger_1 = __importDefault(require("./swagger"));
const redoc_express_1 = __importDefault(require("redoc-express"));
// import config from './config';
// const PORT = config.port || 3000;
const PORT = process.env.API_PORT || 3000;
// const CSS_URL ="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";
// app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec,{
//   customCssUrl: CSS_URL
// }))
app_1.default.get('/api-docs', (0, redoc_express_1.default)({
    title: 'API Documentation',
    specUrl: '/swagger.json',
}));
app_1.default.get('/swagger.json', (req, res) => {
    res.json(swagger_1.default);
});
// Start the Express server
// uncomment this code while running in local-------------------
app_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// ----------------------------------------------------------
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server...');
    process.exit(0);
});
exports.default = (req, res) => {
    (0, app_1.default)(req, res);
};
