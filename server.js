const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const authMiddleware = require('./middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
const allowedOrigins = (process.env.FRONT_API_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, origin || allowedOrigins[0]);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Auth routes (unprotected)
app.use('/api/auth', require('./Routes/auth'));

// Client routes (protected)
app.use(authMiddleware)

app.use('/api/client', require('./Routes/client'));
app.use('/api/product', require('./Routes/product'));
app.use('/api/purchase', require('./Routes/purchase'));

// Example Route
app.get('/', (req, res) => {
  res.send('Backend is running now ✅');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
