import express from 'express';

// Controllers
import { getMeasurement ,createMeasurement, updateMeasurement } from '../controllers/measurementController.js';

const measurementRouter = express.Router();

// Routes
measurementRouter.get('/get-measurement', getMeasurement);
measurementRouter.post('/create-measurement', createMeasurement);
measurementRouter.put('/update-measurement/:id', updateMeasurement);

export { measurementRouter };