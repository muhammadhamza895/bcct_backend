import express from 'express';

import { getJobsByPage, createJob } from '../controllers/jobControllers.js';

const jobRouter = express.Router();

jobRouter.get("/get-job/:page", getJobsByPage)
jobRouter.post("/create-job", createJob)


export { jobRouter };