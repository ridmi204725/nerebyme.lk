// backend/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import dayoutRoutes from './routes/dayoutRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import functionRoutes from './routes/functionRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Model එක import කරගැනීම (ඔබේ database model එක ඇතිနေရာට අනුව මෙය වෙනස් විය හැක)
import Item from './models/Item.js'; // හෝ Hotel Model එක

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Enable Socket.io with CORS settings
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

// Make `io` accessible inside routes if needed via `req.io`
app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
app.use('/api/seller', sellerRoutes);

// ── HOTELS & ITEMS GET ENDPOINTS (404 දෝෂය මඟහරවා ගැනීමට මෙහි එකතු කරන ලදී) ──

app.get('/api/hotels', async (req, res) => {
    try {
        const { category, isApproved, district, city, subCategory, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (isApproved) query.isApproved = isApproved === 'true';
        if (district) query.district = district;
        if (city) query.location = city;
        if (subCategory) query.subCategory = subCategory;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await Item.find(query);
        res.status(200).json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/items', async (req, res) => {
    try {
        const { category, isApproved, district, city, subCategory, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (isApproved && isApproved !== 'all') query.isApproved = isApproved === 'true';
        if (district) query.district = district;
        if (city) query.location = city;
        if (subCategory) query.subCategory = subCategory;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await Item.find(query);
        res.status(200).json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.send('Holiday.lk API is running...');
});

// ── Socket.io Real-time Connection Logic ──
io.on('connection', (socket) => {
    console.log(`⚡ A user connected: ${socket.id}`);

    socket.on('placeUpdated', (updatedData) => {
        console.log('🔄 Place updated event received:', updatedData);
        io.emit('item-data-changed', updatedData);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
server.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

export default app;