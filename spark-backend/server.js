const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS (so your frontend can make requests to the backend)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Ensure this points to your frontend URL
}));

// Serve static files (uploaded images)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Define API routes
app.use('/api/auth', require('./routes/auth'));               // Authentication routes
app.use('/api/bikes', require('./routes/bikeRoutes'));        // Bike management routes
app.use('/api/stations', require('./routes/stationRoutes'));  // Station management routes
app.use('/api/reservations', require('./routes/reservationRoutes')); // Reservation management routes
app.use('/api/analytics', require('./routes/analyticsRoutes')); // Analytics routes

// Catch-all route for undefined API endpoints
app.use((req, res, next) => {
    res.status(404).json({ message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Define the server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
