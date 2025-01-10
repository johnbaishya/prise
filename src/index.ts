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

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  process.exit(0);
});

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};