import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jobRoutes from './routes/Jobroute.js';
import authRoutes from './routes/SignInroute.js'; 
import feedbackroute from './routes/feedbackroute.js';
import seekerroute from './routes/Seekerroute.js';

const app = express();
const __dirname = path.resolve();

app.use(cors({
  origin: process.env.ORIGIN,
  methods:["GET","PUT","POST"],
  credentials: true
}));app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use('/api', jobRoutes);
app.use('/api', authRoutes);
app.use('/api', feedbackroute);
app.use('/api', seekerroute);

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
