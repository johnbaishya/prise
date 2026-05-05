import "dotenv/config";
import app from './app';
import { VercelRequest, VercelResponse } from '@vercel/node';
import redoc from "redoc-express";
import swaggerDoc from "./swagger.json";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerSpec from "./swagger";

// const PORT = config.port || 3000;
const PORT:number = parseInt(process.env.PORT||"3000", 10);

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

app.get('/api-doc', redoc({
  title: 'API Documentation',
  specUrl: '/swagger.json?=' + Date.now() // Cache busting,
}));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(swaggerJSDoc(options));
  // res.json(swaggerSpec);
});



// Start the Express server
// uncomment this code while running in local-------------------
app.listen(PORT,"0.0.0.0", () => {
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