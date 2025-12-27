import express from 'express';

// Controllers
import { getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';

const materialRouter = express.Router();

// Routes
materialRouter.get('/get-material', getMaterial);
materialRouter.post('/create-material', createMaterial);
materialRouter.put('/update-material/:id', updateMaterial);
materialRouter.delete('/delete-material/:id', deleteMaterial);

export { materialRouter };