import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

const {BASE_URI,API_PORT} = process.env;

const initializeSwaggerDocumentation = (app:Application)=>{
    const opt = {
        swaggerOptions: {
            validatorUrl: null
          }
    }
    const options = {
        definition: {
          openapi: "3.1.0",
          info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
              "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
              name: "MIT",
              url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
              name: "LogRocket",
              url: "https://logrocket.com",
              email: "info@email.com",
            },
          },
          servers: [
            {
              url: `${BASE_URI}:${API_PORT}`,
            },
          ],
        },
        apis: [".src/*.ts"],
      };

      const specs = swaggerJSDoc(options);
      app.use("/api-docs",serve,setup(opt));
}

export default initializeSwaggerDocumentation;