import express from 'express';

import { inventoryTransectionVerifier, materialVerifier, workOrderVerifier, workOrderFromTransactionVerifier } from '../middlewares/documentsVerifier.js';
import {
    prepareInventoryTransaction,
    verifyOnboardingPrice,
    verifySourceId,
    checkNotCompletedWorkOrder,
    verifyMaterialStockForCompletion,
    prepareInventoryTransactionsForCompletion,
    preventDoubleReversal,
    loadWorkOrderInventoryTransactions,
    prepareReversalTransactions,
    verifyOnboardingItems,
    prepareInventoryTransactionsForOnboarding,
    prepareOnboardingDocument
} from '../middlewares/inventoryTransectionMiddleware.js';
import { quantityVerification } from '../middlewares/helpers.js';

import {
    completeWorkOrderInventoryController,
    revertWorkOrderController,
    getInventoryTransactionsByMaterial,
    completeOnBoardingInventoryController
} from '../controllers/inventoryTransectionController.js'

const inventoryTransectionRouter = express.Router();

// Routes
// inventoryTransectionRouter.post('/create-inventory-transection', materialVerifier, quantityVerification, verifyOnboardingPrice, prepareInventoryTransaction, verifySourceId, createInventoryTransaction);
inventoryTransectionRouter.get('/get-inventory-transections/:page', materialVerifier, getInventoryTransactionsByMaterial);

inventoryTransectionRouter.post('/work-order-complete/:id',
    workOrderVerifier, // id need to passed in path param.
    checkNotCompletedWorkOrder,
    verifyMaterialStockForCompletion,
    prepareInventoryTransactionsForCompletion,
    completeWorkOrderInventoryController);

inventoryTransectionRouter.post('/work-order-revert/:id',
    workOrderVerifier,
    preventDoubleReversal,
    loadWorkOrderInventoryTransactions,
    prepareReversalTransactions,
    revertWorkOrderController
);

inventoryTransectionRouter.post('/onboarding-complete',
    verifyOnboardingItems,
    prepareInventoryTransactionsForOnboarding,
    prepareOnboardingDocument,
    completeOnBoardingInventoryController
);

export { inventoryTransectionRouter };