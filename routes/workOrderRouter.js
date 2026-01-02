import express from 'express';

import { getWorkOrdersByPage, createWorkOrder, updateWorkOrderStatus, editWorkOrder, deleteWorkOrder } from '../controllers/workOrderController.js';
import { jobVerifier, workOrderVerifier } from '../middlewares/documentsVerifier.js';
import { checkPriority, checkDeliveryDate, checkWorkOrderStatus, checkPendingStatus } from '../middlewares/workOrderMiddleware.js';
import { checkTasks } from '../middlewares/jobMiddleware.js';

const workOrderRouter = express.Router();

workOrderRouter.get("/get-work-order/:page", getWorkOrdersByPage)
workOrderRouter.post("/create-work-order", jobVerifier, checkPriority, checkTasks, createWorkOrder)
workOrderRouter.put("/update-work-order-status/:id", checkWorkOrderStatus, updateWorkOrderStatus)
workOrderRouter.put("/edit-work-order/:id", workOrderVerifier, checkPendingStatus, jobVerifier, checkPriority, checkTasks, editWorkOrder)
workOrderRouter.delete("/delete-work-order/:id", checkPendingStatus, deleteWorkOrder)



export { workOrderRouter };