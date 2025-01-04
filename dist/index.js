"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
// import config from './config';
// const PORT = config.port || 3000;
const PORT = process.env.API_PORT || 3000;
// Start the Express server
app_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server...');
    process.exit(0);
});
