"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./config/database"));
const initializeSwaggerDocumentation_1 = __importDefault(require("./config/initializeSwaggerDocumentation"));
const testController_1 = require("./modules/Common/controller/testController");
// import errorHandler from './middleware/errorHandler';
(0, database_1.default)();
const app = (0, express_1.default)();
// Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended:false}))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4001');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Routes
app.use('/api', routes_1.default);
app.get('/', testController_1.testFunction);
(0, initializeSwaggerDocumentation_1.default)(app);
// Global Error Handler
// app.use(errorHandler);
exports.default = app;
