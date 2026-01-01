import express from 'express';

import { getJobsByPage, createJob } from '../controllers/jobControllers.js';
import { checkDepartment } from '../middlewares/jobMiddleware.js';

const jobRouter = express.Router();

jobRouter.get("/get-job/:page", getJobsByPage)
jobRouter.post("/create-job", checkDepartment, createJob)


export { jobRouter };