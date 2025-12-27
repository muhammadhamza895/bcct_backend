import express from 'express';

// Controllers
import { getMaterial, createMaterial, updateMaterial } from '../controllers/materialController.js';

const materialRouter = express.Router();

// Routes
materialRouter.get('/get-material', getMaterial);
materialRouter.post('/create-material', createMaterial);
materialRouter.put('/update-material/:id', updateMaterial);

export { materialRouter };