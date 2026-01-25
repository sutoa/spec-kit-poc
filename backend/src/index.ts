import express from 'express';
import * as dotenv from 'dotenv';
import { setupSecurity } from './middleware/security';
import { errorHandler } from './middleware/error';
import apiRouter from './api'; // Import the main API router

import './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
setupSecurity(app);
app.use(express.json());

// API routes
app.use('/api', apiRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
