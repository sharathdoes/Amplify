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

const allowedOrigins = [process.env.ORIGIN, 'http://localhost:3000']; // Add other origins if necessary

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options('*', cors());
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
