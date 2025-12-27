import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';

// ROUTERS
import { materialRouter } from './routes/materialRouter.js';

dotenv.config();
const app = express();

await connectdb()

// API ROutes
app.use('/material', materialRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});