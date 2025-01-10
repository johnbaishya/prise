"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0', // Correctly set version to Swagger 2.0
        info: {
            title: "Prise API",
            version: "1.0.0",
            description: "REST API documentation for the Prise project."
        },
        servers: [
            {
                url: "https://prise.vercel.app/",
                description: "My API Documentation",
            },
        ],
        tags: [
            {
                name: "Common",
                description: "Coomon api  that will be used by other modules. for example, routes related to user, company, authentication, etc "
            },
            {
                name: "ClockMe",
                description: "For tracking the working hours of employee and managing human resource to work sites."
            }
        ],
        host: "https://prise.vercel.app/",
        basePath: "/api", // Define the base path for your API
        schemes: ["http", "https"], // Supported schemes
    },
    apis: ["**/*.ts"], // Path to your controllers (adjust based on your file structure)
};
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Hello World',
//       version: '1.0.0',
//     },
//   },
//   apis: ['./src/routes*.js'], // files containing annotations as above
// };
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
