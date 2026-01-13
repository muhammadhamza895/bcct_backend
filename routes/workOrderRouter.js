import express from 'express';

import { getWorkOrdersByPage, createWorkOrder, updateWorkOrderStatus, editWorkOrder, deleteWorkOrder, getWorkOrderStatusCounts, getWorkOrdersById } from '../controllers/workOrderController.js';
import { jobVerifier, workOrderVerifier } from '../middlewares/documentsVerifier.js';
import { checkPriority, checkDeliveryDate, checkWorkOrderStatus, checkPendingStatus, checkWorkOrderUsedInInventory, checkWorkOrderId, checkWorkIDExistence } from '../middlewares/workOrderMiddleware.js';
import { checkTasks } from '../middlewares/jobMiddleware.js';

const workOrderRouter = express.Router();
// work_id

workOrderRouter.get("/get-work-order/:page", getWorkOrdersByPage)
workOrderRouter.post("/get-work-order-details", checkWorkOrderId, getWorkOrdersById)
workOrderRouter.post("/create-work-order", checkWorkOrderId, checkWorkIDExistence, jobVerifier, checkPriority, checkTasks, createWorkOrder)
workOrderRouter.put("/update-work-order-status/:id", workOrderVerifier, checkWorkOrderStatus, updateWorkOrderStatus)
workOrderRouter.put("/edit-work-order/:id", workOrderVerifier, checkPendingStatus, jobVerifier, checkPriority, checkTasks, editWorkOrder)
workOrderRouter.delete("/delete-work-order/:id", workOrderVerifier, checkPendingStatus, checkWorkOrderUsedInInventory, deleteWorkOrder)

workOrderRouter.get("/get-work-order-counts", getWorkOrderStatusCounts)



export { workOrderRouter };