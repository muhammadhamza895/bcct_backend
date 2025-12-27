import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';

dotenv.config();
const app = express();

await connectdb()

app.get('/test', (req, res) => {
    return res.send('backend deployed')
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});