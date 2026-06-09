const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Allow requests from the frontend dev server (Vite default)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: FRONTEND_ORIGIN }));

// API routes
app.use('/api/auth', require('./routes/auth'));

// In production you could serve the built frontend here. For development
// we run the Vite dev server separately, so we do not force static serving.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
