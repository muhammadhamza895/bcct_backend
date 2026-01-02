import express from 'express';

import { materialVerifier } from '../middlewares/documentsVerifier';
import { prepareInventoryTransaction, verifyOnboardingPrice, verifySourceId } from '../middlewares/inventoryTransectionMiddleware';
import { quantityVerification } from '../middlewares/helpers';

import { createInventoryTransaction } from '../controllers/inventoryTransectionController';

const inventoryTransectionRouter = express.Router();

// Routes
inventoryTransectionRouter.post('/create-inventory-transection', materialVerifier, quantityVerification, verifyOnboardingPrice, prepareInventoryTransaction, verifySourceId, createInventoryTransaction);

export { materialRouter };