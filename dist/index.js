"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// const PORT = config.port || 3000;
const PORT = parseInt(process.env.PORT || "3000", 10);
// const CSS_URL ="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";
// app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec,{
//   customCssUrl: CSS_URL
// }))
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        },
    },
    apis: ["./src/**/*.ts"],
};
app_1.default.get('/api-doc', (0, redoc_express_1.default)({
    title: 'API Documentation',
    specUrl: '/swagger.json?=' + Date.now() // Cache busting,
}));
app_1.default.get('/swagger.json', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json((0, swagger_jsdoc_1.default)(options));
    // res.json(swaggerSpec);
});
// Start the Express server
// uncomment this code while running in local-------------------
app_1.default.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// ----------------------------------------------------------
// Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received. Closing HTTP server...');
//   process.exit(0);
// });
// export default (req: VercelRequest, res: VercelResponse) => {
//   app(req, res);
// };
