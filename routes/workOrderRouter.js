import express from 'express';

import { getWorkOrdersByPage, createWorkOrder } from '../controllers/workOrderController.js';
import { jobVerifier } from '../middlewares/documentsVerifier.js';
import { checkPriority, checkDeliveryDate } from '../middlewares/workOrderMiddleware.js';
import { checkTasks } from '../middlewares/jobMiddleware.js';

const workOrderRouter = express.Router();

workOrderRouter.get("/get-work-order/:page", getWorkOrdersByPage)
workOrderRouter.post("/create-work-order", jobVerifier, checkPriority, checkTasks, createWorkOrder)



export { workOrderRouter };