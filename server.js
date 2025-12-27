import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';

// ROUTERS
import { materialRouter } from './routes/materialRouter.js';
import { measurementRouter } from './routes/measurementRouter.js';

dotenv.config();

const app = express();

app.use(express.json())

await connectdb()

// API ROutes
app.use('/material', materialRouter);
app.use('/measurement', measurementRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});