import express, { Application, Request,Response } from "express";
import appRoutes from "./routes";
import connectDb from "./config/database";
import initializeSwaggerDocumentation from "./config/initializeSwaggerDocumentation";

// import errorHandler from './middleware/errorHandler';

connectDb();
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4001');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

// Routes
app.use('/api', appRoutes);
initializeSwaggerDocumentation(app);

// Global Error Handler
// app.use(errorHandler);

export default app;