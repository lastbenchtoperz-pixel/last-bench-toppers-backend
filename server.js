const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const pyqRoutes = require("./routes/pyqRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const searchRoutes = require("./routes/searchRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files (uploaded PDFs)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/pyqs", pyqRoutes);
app.use("/api/dashboard", dashboardRoutes );
app.use("/api/announcements", announcementRoutes);
app.use("/api/search", searchRoutes);

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'last_bench_toppers',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});