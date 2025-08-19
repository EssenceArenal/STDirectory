const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const dbPath = path.join(__dirname, 'database/santa-teresa.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/categories', require('./routes/categories'));

// Special Santa Teresa routes
app.get('/api/surf-report', (req, res) => {
    // Mock surf report data for Santa Teresa 2025-2026
    const surfReport = {
        location: 'Santa Teresa, Costa Rica',
        lastUpdated: new Date().toISOString(),
        season: '2025-2026',
        spots: [
            {
                name: 'Playa Santa Teresa',
                coordinates: { lat: 9.6485, lng: -85.1705 },
                currentConditions: {
                    waveHeight: '3-5 ft',
                    windSpeed: '8 mph',
                    windDirection: 'NE',
                    tide: 'Rising',
                    nextTide: '2:30 PM - High',
                    surfQuality: 'Good',
                    rating: 7.5,
                    bestTime: 'Early morning (6-9 AM)'
                }
            },
            {
                name: 'Playa Carmen',
                coordinates: { lat: 9.6456, lng: -85.1712 },
                currentConditions: {
                    waveHeight: '2-4 ft',
                    windSpeed: '6 mph',
                    windDirection: 'NE',
                    surfQuality: 'Fair to Good',
                    rating: 6.5,
                    bestTime: 'Morning sessions (7-10 AM)'
                }
            }
        ],
        weather: {
            temperature: '82°F (28°C)',
            humidity: '75%',
            sunrise: '5:45 AM',
            sunset: '5:30 PM',
            uvIndex: 9
        }
    };
    res.json(surfReport);
});

app.get('/api/yoga-schedule', (req, res) => {
    const yogaSchedule = {
        location: 'Santa Teresa, Costa Rica',
        lastUpdated: new Date().toISOString(),
        studios: [
            {
                name: 'Nahele Lodge',
                address: 'Santa Teresa Beach',
                phone: '+506 2640-1001',
                schedule: [
                    {
                        day: 'Daily',
                        classes: [
                            {
                                time: '7:00 AM',
                                type: 'Morning Flow',
                                instructor: 'Maria',
                                duration: '75 min',
                                level: 'All Levels',
                                price: '$20'
                            },
                            {
                                time: '5:30 PM',
                                type: 'Sunset Yoga',
                                instructor: 'Carlos',
                                duration: '60 min',
                                level: 'Beginner',
                                price: '$18'
                            }
                        ]
                    }
                ]
            }
        ]
    };
    res.json(yogaSchedule);
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/business/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'business-detail.html'));
});

app.get('/add-business', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-business.html'));
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/images/${req.file.filename}`;
    res.json({ imageUrl });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Santa Teresa Directory server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

module.exports = app;