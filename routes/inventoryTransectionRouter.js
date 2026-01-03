import express from 'express';

import { materialVerifier, workOrderVerifier } from '../middlewares/documentsVerifier.js';
import { 
    prepareInventoryTransaction, 
    verifyOnboardingPrice, 
    verifySourceId, 
    checkNotCompletedWorkOrder, 
    verifyMaterialStockForCompletion,
    prepareInventoryTransactionsForCompletion 
} from '../middlewares/inventoryTransectionMiddleware.js';
import { quantityVerification } from '../middlewares/helpers.js';

import { createInventoryTransaction } from '../controllers/inventoryTransectionController.js';

const inventoryTransectionRouter = express.Router();

// Routes
// inventoryTransectionRouter.post('/create-inventory-transection', materialVerifier, quantityVerification, verifyOnboardingPrice, prepareInventoryTransaction, verifySourceId, createInventoryTransaction);
inventoryTransectionRouter.post('/work-order-complete/:id', 
    workOrderVerifier, // id need to passed in path param.
    checkNotCompletedWorkOrder,
    verifyMaterialStockForCompletion,
    prepareInventoryTransactionsForCompletion);

export { inventoryTransectionRouter };