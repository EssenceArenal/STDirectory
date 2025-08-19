// Vercel serverless function for categories API
const { getDatabase } = require('./db');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const db = getDatabase();
    const { method, url } = req;

    try {
        if (method === 'GET') {
            // Check if requesting categories with counts
            if (url.includes('with-counts')) {
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
                    res.status(200).json(rows);
                });
            } else {
                // Get all categories
                const query = 'SELECT * FROM categories ORDER BY name ASC';
                
                db.all(query, [], (err, rows) => {
                    if (err) {
                        console.error('Error fetching categories:', err.message);
                        return res.status(500).json({ error: 'Failed to fetch categories' });
                    }
                    res.status(200).json(rows);
                });
            }
        } else if (method === 'POST') {
            // Add new category
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
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};