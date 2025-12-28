import express from 'express';

// Middlewares
import { sheetsPerUnitVerification, uniqueMeasurementVerifier } from '../middlewares/helpers.js';

// Controllers
import { getMeasurement ,createMeasurement, updateMeasurement } from '../controllers/measurementController.js';

const measurementRouter = express.Router();

// Routes
measurementRouter.get('/get-measurement', getMeasurement);
measurementRouter.post('/create-measurement', sheetsPerUnitVerification, uniqueMeasurementVerifier, createMeasurement);
measurementRouter.put('/update-measurement/:id', sheetsPerUnitVerification, uniqueMeasurementVerifier, updateMeasurement);

export { measurementRouter };