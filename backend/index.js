import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jobRoutes from './routes/Jobroute.js';
import authRoutes from './routes/SignInroute.js'; 
import feedbackroute from './routes/feedbackroute.js'
import seekerroute from './routes/Seekerroute.js'

const app = express();

app.use(cors({
  origin: process.env.ORIGIN,
  methods:["GET","PUT","POST"],
  credentials: true
}));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(express.json());

app.use('/api', jobRoutes);
app.use('/api', authRoutes);
app.use('/api',feedbackroute) // Use the authRoutes
app.use('/api',seekerroute) // Use the authRoutes

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
  
  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });  
