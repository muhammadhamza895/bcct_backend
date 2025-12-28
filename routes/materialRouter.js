import express from 'express';

//Middlewares
import { quantityVerification, sheetsPerUnitVerification } from '../middlewares/helpers.js';
import { measureUnitVerifier } from '../middlewares/documentsVerifier.js';

// Controllers
import { getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';

const materialRouter = express.Router();

// Routes
materialRouter.get('/get-material', getMaterial);
materialRouter.post('/create-material', measureUnitVerifier, quantityVerification, createMaterial);
materialRouter.put('/update-material/:id', measureUnitVerifier, quantityVerification, updateMaterial);
materialRouter.delete('/delete-material/:id', deleteMaterial);

export { materialRouter };