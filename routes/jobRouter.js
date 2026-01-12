import express from 'express';

import { getJobsByPage, getJobsById, createJob, updateJob, deleteJob, getJobsCount } from '../controllers/jobControllers.js';
import { checkJobId, checkDepartment, checkTasks, checkJobHasNoWorkOrders } from '../middlewares/jobMiddleware.js';

const jobRouter = express.Router();

jobRouter.get("/get-job/:page", getJobsByPage)
jobRouter.get("/get-job-id/:id", getJobsById)
jobRouter.post("/create-job", checkJobId, checkDepartment, checkTasks, createJob)
jobRouter.put("/update-job/:job_id", checkDepartment, checkTasks,checkJobHasNoWorkOrders, updateJob)
jobRouter.delete("/delete-job/:job_id", checkJobHasNoWorkOrders, deleteJob)

jobRouter.get('/get-job-count', getJobsCount);



export { jobRouter };