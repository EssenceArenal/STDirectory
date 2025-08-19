const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../database/santa-teresa.db');
const db = new sqlite3.Database(dbPath);

// GET /api/categories - List all categories
router.get('/', (req, res) => {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching categories:', err.message);
            return res.status(500).json({ error: 'Failed to fetch categories' });
        }
        res.json(rows);
    });
});

// GET /api/categories/with-counts - List categories with business counts
router.get('/with-counts', (req, res) => {
    const query = `
        SELECT 
            c.id,
            c.name,
            c.icon,
            COUNT(b.id) as business_count
        FROM categories c
        LEFT JOIN businesses b ON c.name = b.category
        GROUP BY c.id, c.name, c.icon
        ORDER BY c.name ASC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching categories with counts:', err.message);
            return res.status(500).json({ error: 'Failed to fetch categories' });
        }
        res.json(rows);
    });
});

// POST /api/categories - Add new category (admin)
router.post('/', (req, res) => {
    const { name, icon } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    
    const query = 'INSERT INTO categories (name, icon) VALUES (?, ?)';
    
    db.run(query, [name, icon || null], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Category already exists' });
            }
            console.error('Error adding category:', err.message);
            return res.status(500).json({ error: 'Failed to add category' });
        }
        
        // Return the created category
        db.get('SELECT * FROM categories WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error('Error fetching created category:', err.message);
                return res.status(500).json({ error: 'Category created but failed to fetch' });
            }
            res.status(201).json(row);
        });
    });
});

module.exports = router;