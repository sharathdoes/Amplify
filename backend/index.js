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
  origin: process.env.ORIGIN, // Set this to your frontend URL (e.g., "https://amplify-51zx.vercel.app")
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true // Allow credentials like cookies
}));

// Set CORS headers for preflight requests (OPTIONS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN); // Specific origin for security
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies and credentials
  next();
});

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
