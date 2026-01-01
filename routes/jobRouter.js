import express from 'express';

import { getJobsByPage, createJob } from '../controllers/jobControllers.js';
import { checkJobId, checkDepartment, checkTasks } from '../middlewares/jobMiddleware.js';

const jobRouter = express.Router();

jobRouter.get("/get-job/:page", getJobsByPage)
jobRouter.post("/create-job", checkDepartment, checkJobId, checkTasks, createJob)


export { jobRouter };