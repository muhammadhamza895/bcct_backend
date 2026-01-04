import express from 'express';

import { inventoryTransectionVerifier, materialVerifier, workOrderVerifier, onboaringVerifier } from '../middlewares/documentsVerifier.js';
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
    prepareOnboardingDocument,
    preventDoubleOnboardingReversal,
    loadOnboaringInventoryTransactions,
    prepareOnboardingReversalTransactions,
    createNewWorkOrderDocument
} from '../middlewares/inventoryTransectionMiddleware.js';
import { quantityVerification } from '../middlewares/helpers.js';

import {
    completeWorkOrderInventoryController,
    revertWorkOrderController,
    getInventoryTransactionsByMaterial,
    completeOnBoardingInventoryController,
    revertOnboaringController
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
    createNewWorkOrderDocument,
    revertWorkOrderController
);

inventoryTransectionRouter.post('/onboarding-complete',
    verifyOnboardingItems,
    prepareInventoryTransactionsForOnboarding,
    prepareOnboardingDocument,
    completeOnBoardingInventoryController
);

inventoryTransectionRouter.post('/onboarding-revert/:id',
    onboaringVerifier,
    preventDoubleOnboardingReversal,
    loadOnboaringInventoryTransactions,
    prepareOnboardingReversalTransactions,
    revertOnboaringController
);

export { inventoryTransectionRouter };