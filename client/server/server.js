// backend/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// 🔐 Routes සහ Middleware (ES Modules ක්‍රමයට නිවැරදිව .js extension සහිතව import කිරීම)
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import dayoutRoutes from './routes/dayoutRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import functionRoutes from './routes/functionRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes Middleware Stack
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dayouts', dayoutRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/movie-theaters', movieRoutes);
app.use('/api/functions', functionRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Holiday.lk API is running...');
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

// Export app instance
export default app;