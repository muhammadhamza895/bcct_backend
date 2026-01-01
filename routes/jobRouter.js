import express from 'express';

import { getJobsByPage, createJob, updateJob } from '../controllers/jobControllers.js';
import { checkJobId, checkDepartment, checkTasks } from '../middlewares/jobMiddleware.js';

const jobRouter = express.Router();

jobRouter.get("/get-job/:page", getJobsByPage)
jobRouter.post("/create-job", checkJobId, checkDepartment, checkTasks, createJob)
jobRouter.put("/update-job/:job_id", checkDepartment, checkTasks, updateJob)


export { jobRouter };