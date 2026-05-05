import swaggerJSDoc,{Options} from "swagger-jsdoc";
import { galleryDocs } from "./docs/core/gallery.swagger";
import { OpenAPIV3 } from "openapi-types";

const options2:Options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: "Prise API",
      version: "1.0.0",
      description: "REST API documentation for the Prise project."
    },
    components:{
      securitySchemes:{
        bearerAuth:{
          type:"http",
          scheme:"bearer",
          bearerFormat:"JWT"
        }
      }
    },
    servers: [
      {
        url: "https://prise.vercel.app/api",
        description: "Prise Api",
      },
    ],
    tags:[
      {
        name:"Common",
        description:"Common api  that will be used by other modules. for example, routes related to user, company, authentication, etc "
      },
      
      {
        name:"ClockMe",
        description:"For tracking the working hours of employee and managing human resource to work sites."
      },
      {
        name:"Showcase",
        description:"For managing the products and services of the company and showcasing them to the customers."
      }
    ],
  },
  apis: ["./src/**/*.ts"], // Path to your controllers (adjust based on your file structure)
  // apis: [], // Path to your controllers (adjust based on your file structure)
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes*.js'], // files containing annotations as above
};

const options3 = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["./src/**/*.ts"],
};


const swaggerSpec = swaggerJSDoc(options3) as OpenAPIV3.Document;

// swaggerSpec.paths = {
//   ...(swaggerSpec.paths||{}),
//   ...galleryDocs,
// }
  export default swaggerSpec;