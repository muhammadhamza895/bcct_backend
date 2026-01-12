import express from 'express';

//Middlewares
import { quantityVerification, thresholdQuantityVerification, nameChecker } from '../middlewares/helpers.js';
import { measureUnitVerifier } from '../middlewares/documentsVerifier.js';
import { checkMaterialHasNoTransactions } from '../middlewares/materialMiddleware.js';

// Controllers
import { getMaterial, createMaterial, updateMaterial, deleteMaterial, getMaterialsCount } from '../controllers/materialController.js';

const materialRouter = express.Router();

// Routes
materialRouter.get('/get-material', getMaterial);
materialRouter.post('/create-material', measureUnitVerifier, nameChecker, quantityVerification, thresholdQuantityVerification, createMaterial);
materialRouter.put('/update-material/:id', measureUnitVerifier, nameChecker, quantityVerification, updateMaterial);
materialRouter.delete('/delete-material/:id', checkMaterialHasNoTransactions, deleteMaterial);

materialRouter.get('/get-material-count', getMaterialsCount);


export { materialRouter };