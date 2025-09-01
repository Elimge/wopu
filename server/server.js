
/**
 * File: server/server.js
 *
 * Main entry point for the Wopu backend server.
 * Initializes the Express application, sets up middleware, defines routes,
 * and starts listening for incoming requests.
 */

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connection = require('./config/database');

const app = express();

// Define allowed origins
const allowedOrigins = [
    'https://wopu.netlify.app', 
    'http://127.0.0.1:5500'                 
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// --- Database Connection ---
// --- Database Connection ---
// The connection pool is created and will connect automatically on the first query.
console.log('Database connection pool configured.');

// --- Routes ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Wopu API!' });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Profile routes
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

// Task routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes); // All task routes are protected by authMiddleware

// Finance routes
const financeRoutes = require('./routes/financeRoutes');
app.use('/api/finances', financeRoutes);

// User management routes (for admins)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
