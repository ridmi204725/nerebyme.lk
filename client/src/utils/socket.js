// src/utils/socket.js
import { io } from 'socket.io-client';

// Local development සඳහා port 5001 පාවිච්චි කරන නිසා එය fallback එකක් ලෙස දෙමු
const SOCKET_URL =
    process.env.REACT_APP_BACKEND_URL ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
    'http://localhost:5001';

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling']
});