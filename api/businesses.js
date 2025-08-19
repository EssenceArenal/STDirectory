// Vercel serverless function for businesses API
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
    const urlParts = url.split('/');
    const businessId = urlParts[urlParts.length - 1];

    try {
        if (method === 'GET') {
            // Check if requesting specific business
            if (businessId && businessId !== 'businesses' && !isNaN(businessId)) {
                // Get single business
                const query = 'SELECT * FROM businesses WHERE id = ?';
                
                db.get(query, [businessId], (err, row) => {
                    if (err) {
                        console.error('Error fetching business:', err.message);
                        return res.status(500).json({ error: 'Failed to fetch business' });
                    }
                    
                    if (!row) {
                        return res.status(404).json({ error: 'Business not found' });
                    }
                    
                    res.status(200).json(row);
                });
            } else {
                // Get all businesses with filters
                const { category, search, featured, surf_report, yoga_schedule, luxury_villa } = req.query || {};
                
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
                
                if (surf_report === 'true') {
                    query += ' AND surf_report = 1';
                }
                
                if (yoga_schedule === 'true') {
                    query += ' AND yoga_schedule = 1';
                }
                
                if (luxury_villa === 'true') {
                    query += ' AND luxury_villa = 1';
                }
                
                query += ' ORDER BY featured DESC, name ASC';
                
                db.all(query, params, (err, rows) => {
                    if (err) {
                        console.error('Error fetching businesses:', err.message);
                        return res.status(500).json({ error: 'Failed to fetch businesses' });
                    }
                    res.status(200).json(rows);
                });
            }
        } else if (method === 'POST') {
            // Add new business
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
                featured,
                surf_report,
                yoga_schedule,
                luxury_villa
            } = req.body;
            
            // Validation
            if (!name || !category) {
                return res.status(400).json({ error: 'Name and category are required' });
            }
            
            const query = `
                INSERT INTO businesses (
                    name, category, description, address, phone, email, 
                    website, hours, latitude, longitude, image_url, featured,
                    surf_report, yoga_schedule, luxury_villa
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                name, category, description || null, address || null,
                phone || null, email || null, website || null, hours || null,
                latitude || null, longitude || null, image_url || null,
                featured ? 1 : 0, surf_report ? 1 : 0, yoga_schedule ? 1 : 0, luxury_villa ? 1 : 0
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
        } else if (method === 'PUT' && businessId && !isNaN(businessId)) {
            // Update business
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
                featured,
                surf_report,
                yoga_schedule,
                luxury_villa
            } = req.body;
            
            // Validation
            if (!name || !category) {
                return res.status(400).json({ error: 'Name and category are required' });
            }
            
            const query = `
                UPDATE businesses SET 
                    name = ?, category = ?, description = ?, address = ?, phone = ?, 
                    email = ?, website = ?, hours = ?, latitude = ?, longitude = ?, 
                    image_url = ?, featured = ?, surf_report = ?, yoga_schedule = ?, luxury_villa = ?
                WHERE id = ?
            `;
            
            const params = [
                name, category, description || null, address || null,
                phone || null, email || null, website || null, hours || null,
                latitude || null, longitude || null, image_url || null,
                featured ? 1 : 0, surf_report ? 1 : 0, yoga_schedule ? 1 : 0, luxury_villa ? 1 : 0,
                businessId
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
                db.get('SELECT * FROM businesses WHERE id = ?', [businessId], (err, row) => {
                    if (err) {
                        console.error('Error fetching updated business:', err.message);
                        return res.status(500).json({ error: 'Business updated but failed to fetch' });
                    }
                    res.status(200).json(row);
                });
            });
        } else if (method === 'DELETE' && businessId && !isNaN(businessId)) {
            // Delete business
            const query = 'DELETE FROM businesses WHERE id = ?';
            
            db.run(query, [businessId], function(err) {
                if (err) {
                    console.error('Error deleting business:', err.message);
                    return res.status(500).json({ error: 'Failed to delete business' });
                }
                
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Business not found' });
                }
                
                res.status(200).json({ message: 'Business deleted successfully' });
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};