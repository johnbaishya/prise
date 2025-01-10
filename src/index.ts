import "dotenv/config";
import app from './app';
import { VercelRequest, VercelResponse } from '@vercel/node';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

// import config from './config';

// const PORT = config.port || 3000;
const PORT = process.env.API_PORT||3000;

// Start the Express server
// uncomment this code while running in local-------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// ----------------------------------------------------------

const CSS_URL ="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.2/swagger-ui.min.css";

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec,{
  customCssUrl: CSS_URL
}))

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  process.exit(0);
});

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};