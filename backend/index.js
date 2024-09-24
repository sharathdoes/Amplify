import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jobRoutes from './routes/Jobroute.js';
import authRoutes from './routes/SignInroute.js';
import feedbackroute from './routes/feedbackroute.js';
import seekerroute from './routes/Seekerroute.js';

const app = express();

// Allowed origins for CORS
const allowedOrigins = [process.env.ORIGIN, 'http://localhost:3000']; // Add localhost for dev environment if needed

// CORS middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow credentials (cookies, HTTP auth, etc.)
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api', jobRoutes);
app.use('/api', authRoutes);
app.use('/api', feedbackroute);
app.use('/api', seekerroute);

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Base route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Server listening on the specified port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

