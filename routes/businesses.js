const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../database/santa-teresa.db');
const db = new sqlite3.Database(dbPath);

// GET /api/businesses - List all businesses with optional filters
router.get('/', (req, res) => {
    const { category, search, featured } = req.query;
    
    let query = 'SELECT * FROM businesses WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
    }
    
    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (featured === 'true') {
        query += ' AND featured = 1';
    }
    
    query += ' ORDER BY featured DESC, name ASC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching businesses:', err.message);
            return res.status(500).json({ error: 'Failed to fetch businesses' });
        }
        res.json(rows);
    });
});

// GET /api/businesses/:id - Get single business
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM businesses WHERE id = ?';
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error fetching business:', err.message);
            return res.status(500).json({ error: 'Failed to fetch business' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Business not found' });
        }
        
        res.json(row);
    });
});

// POST /api/businesses - Add new business
router.post('/', (req, res) => {
    const {
        name,
        category,
        description,
        address,
        phone,
        email,
        website,
        hours,
        latitude,
        longitude,
        image_url,
        featured
    } = req.body;
    
    // Validation
    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const query = `
        INSERT INTO businesses (
            name, category, description, address, phone, email, 
            website, hours, latitude, longitude, image_url, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        name, category, description || null, address || null,
        phone || null, email || null, website || null, hours || null,
        latitude || null, longitude || null, image_url || null,
        featured ? 1 : 0
    ];
    
    db.run(query, params, function(err) {
        if (err) {
            console.error('Error adding business:', err.message);
            return res.status(500).json({ error: 'Failed to add business' });
        }
        
        // Return the created business
        db.get('SELECT * FROM businesses WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error('Error fetching created business:', err.message);
                return res.status(500).json({ error: 'Business created but failed to fetch' });
            }
            res.status(201).json(row);
        });
    });
});

// PUT /api/businesses/:id - Update business
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {
        name,
        category,
        description,
        address,
        phone,
        email,
        website,
        hours,
        latitude,
        longitude,
        image_url,
        featured
    } = req.body;
    
    // Validation
    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const query = `
        UPDATE businesses SET 
            name = ?, category = ?, description = ?, address = ?, phone = ?, 
            email = ?, website = ?, hours = ?, latitude = ?, longitude = ?, 
            image_url = ?, featured = ?
        WHERE id = ?
    `;
    
    const params = [
        name, category, description || null, address || null,
        phone || null, email || null, website || null, hours || null,
        latitude || null, longitude || null, image_url || null,
        featured ? 1 : 0, id
    ];
    
    db.run(query, params, function(err) {
        if (err) {
            console.error('Error updating business:', err.message);
            return res.status(500).json({ error: 'Failed to update business' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Business not found' });
        }
        
        // Return the updated business
        db.get('SELECT * FROM businesses WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error fetching updated business:', err.message);
                return res.status(500).json({ error: 'Business updated but failed to fetch' });
            }
            res.json(row);
        });
    });
});

// DELETE /api/businesses/:id - Delete business
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM businesses WHERE id = ?';
    
    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error deleting business:', err.message);
            return res.status(500).json({ error: 'Failed to delete business' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Business not found' });
        }
        
        res.json({ message: 'Business deleted successfully' });
    });
});

module.exports = router;