import express from 'express';

import { getWorkOrdersByPage, createWorkOrder, updateWorkOrderStatus } from '../controllers/workOrderController.js';
import { jobVerifier } from '../middlewares/documentsVerifier.js';
import { checkPriority, checkDeliveryDate, checkWorkOrderStatus } from '../middlewares/workOrderMiddleware.js';
import { checkTasks } from '../middlewares/jobMiddleware.js';

const workOrderRouter = express.Router();

workOrderRouter.get("/get-work-order/:page", getWorkOrdersByPage)
workOrderRouter.post("/create-work-order", jobVerifier, checkPriority, checkTasks, createWorkOrder)
workOrderRouter.put("/update-work-order-status/:id", checkWorkOrderStatus, updateWorkOrderStatus)



export { workOrderRouter };