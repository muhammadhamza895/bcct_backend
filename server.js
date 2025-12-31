import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';

// ROUTERS
import { materialRouter } from './routes/materialRouter.js';
import { measurementRouter } from './routes/measurementRouter.js';
import { onloadingRouter } from './routes/onloadingRouter.js';
import { userrouter } from './routes/userRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())

try {
    await connectdb();
    console.log('Database connected');
} catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
}


// API ROutes
app.use('/material', materialRouter);
app.use('/measurement', measurementRouter);
app.use('/onloading', onloadingRouter);
app.use('/user', userrouter);

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});