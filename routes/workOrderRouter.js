import express from 'express';

import { getWorkOrdersByPage } from '../controllers/workOrderController.js';

const workOrderRouter = express.Router();

workOrderRouter.get("/get-work-order/:page", getWorkOrdersByPage)



export { workOrderRouter };