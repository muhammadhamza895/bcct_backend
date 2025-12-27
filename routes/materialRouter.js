import express from 'express';

// Controllers
import { getMaterial, createMaterial } from '../controllers/materialController.js';

const materialRouter = express.Router();

// Routes
materialRouter.get('/get-material', getMaterial);
materialRouter.post('/create-material', createMaterial);

export { materialRouter };