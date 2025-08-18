const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/santa-teresa.db');
const sqlPath = path.join(__dirname, '../database/init.sql');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Read the SQL initialization script
const initSQL = fs.readFileSync(sqlPath, 'utf8');

// Create and initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Execute the initialization script
db.exec(initSQL, (err) => {
    if (err) {
        console.error('Error initializing database:', err.message);
        return;
    }
    console.log('Database initialized successfully!');
    console.log('Sample data has been inserted.');
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
            return;
        }
        console.log('Database connection closed.');
    });
});