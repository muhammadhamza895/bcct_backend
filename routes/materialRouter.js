import express from 'express';

// Controllers
import { createMaterial } from '../controllers/materialController.js';

const materialRouter = express.Router();

// Routes
materialRouter.get('/get-material', createMaterial);

export { materialRouter };