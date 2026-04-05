const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authMiddleware = require('./middleware');

const app = express();
const PORT = process.env.PORT || 5000;

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'https://shop-frontend-3la2is-projects.vercel.app/login',
  'https://watersupplements.netlify.app',
];
const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors(corsOptions));

app.use(express.json());

// Auth routes (unprotected)
app.use('/api/auth', require('./Routes/auth'));

// Protected routes
app.use(authMiddleware);

app.use('/api/client', require('./Routes/client'));
app.use('/api/product', require('./Routes/product'));
app.use('/api/purchase', require('./Routes/purchase'));


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});