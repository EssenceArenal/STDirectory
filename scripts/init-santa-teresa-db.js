const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/santa-teresa.db');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Delete existing database to start fresh
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database');
}

// Create and initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Santa Teresa specific schema and data
const initSQL = `
-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table with Santa Teresa specific fields
CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    hours TEXT,
    latitude REAL,
    longitude REAL,
    image_url TEXT,
    featured BOOLEAN DEFAULT 0,
    surf_report BOOLEAN DEFAULT 0,
    yoga_schedule BOOLEAN DEFAULT 0,
    luxury_villa BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert Santa Teresa specific categories
INSERT OR IGNORE INTO categories (name, icon) VALUES 
    ('Surf & Water Sports', '🏄‍♂️'),
    ('Accommodation', '🏨'),
    ('Food & Drink', '🍽️'),
    ('Transportation', '🚗'),
    ('Activities & Tours', '🎯'),
    ('Wellness & Yoga', '🧘‍♀️'),
    ('Shopping & Services', '🛍️'),
    ('Beach Spots & Surf', '🌊');

-- Insert Santa Teresa businesses with 2025-2026 focus
INSERT OR IGNORE INTO businesses (name, category, description, address, phone, email, website, hours, latitude, longitude, image_url, featured, surf_report, yoga_schedule, luxury_villa) VALUES 
    (
        'Nahele Lodge',
        'Accommodation',
        'Boutique eco-lodge with daily yoga classes, sustainable practices, and stunning ocean views. Perfect for wellness retreats and digital nomads.',
        'Santa Teresa Beach, Puntarenas',
        '+506 2640-1001',
        'info@nahelelodge.com',
        'https://nahelelodge.com',
        '24/7 Reception | Yoga: 7:00 AM & 5:30 PM daily',
        9.6485,
        -85.1705,
        '/images/nahele-lodge.jpg',
        1,
        0,
        1,
        0
    ),
    (
        'Santa Teresa Surf Lessons',
        'Surf & Water Sports',
        'Professional surf instruction for all levels. ISA certified instructors, equipment included, and live surf reports for 2025-2026 season.',
        'Playa Santa Teresa',
        '+506 8829-SURF',
        'info@santateresasurflessons.com',
        'https://santateresasurflessons.com',
        'Daily: 6:00 AM - 6:00 PM | Surf Reports Updated Hourly',
        9.6456,
        -85.1712,
        '/images/surf-lessons.jpg',
        1,
        1,
        0,
        0
    ),
    (
        'Koji''s Restaurant',
        'Food & Drink',
        'Authentic Japanese cuisine with fresh sashimi and creative fusion dishes. Intimate atmosphere with ocean views. Reservations recommended.',
        'Main Road, Santa Teresa',
        '+506 2640-0815',
        'reservations@kojis.cr',
        'https://kojis.cr',
        'Wed-Mon: 5:30 PM - 10:00 PM (Closed Tuesdays)',
        9.6502,
        -85.1698,
        '/images/kojis.jpg',
        1,
        0,
        0,
        0
    ),
    (
        'Casa Tropical Villa',
        'Accommodation',
        'Luxury beachfront villa with private pool, full kitchen, and stunning sunset views. Perfect for families and groups seeking premium comfort.',
        'Playa Carmen, Santa Teresa',
        '+506 8888-1234',
        'booking@casatropical.com',
        'https://casatropical.com',
        'Check-in: 3:00 PM | Check-out: 11:00 AM',
        9.6478,
        -85.1689,
        '/images/casa-tropical.jpg',
        1,
        0,
        0,
        1
    ),
    (
        'Muze Restaurant',
        'Food & Drink',
        'Upscale dining with international cuisine, craft cocktails, and live music. Romantic beachfront setting with exceptional service.',
        'Playa Santa Teresa',
        '+506 2640-0408',
        'info@muzerestaurant.com',
        'https://muzerestaurant.com',
        'Daily: 12:00 PM - 11:00 PM | Live Music: Thu-Sat 8 PM',
        9.6491,
        -85.1701,
        '/images/muze.jpg',
        1,
        0,
        0,
        0
    ),
    (
        'Villa Punto de Vista',
        'Accommodation',
        'Luxury hillside villa with panoramic ocean views, infinity pool, and concierge services. Ultimate luxury experience in Santa Teresa.',
        'Hills above Santa Teresa',
        '+506 8888-5678',
        'concierge@villapuntodevista.com',
        'https://villapuntodevista.com',
        'Check-in: 4:00 PM | Check-out: 11:00 AM | Concierge 24/7',
        9.6499,
        -85.1692,
        '/images/punto-vista.jpg',
        1,
        0,
        0,
        1
    ),
    (
        'Casa Amalfi Villa',
        'Accommodation',
        'Mediterranean-style luxury villa with private beach access, chef service, and world-class amenities for discerning travelers.',
        'Private Beach, Santa Teresa',
        '+506 8888-9999',
        'reservations@casaamalfi.com',
        'https://casaamalfi.com',
        'Check-in: 4:00 PM | Check-out: 12:00 PM | Chef Service Available',
        9.6505,
        -85.1688,
        '/images/casa-amalfi.jpg',
        1,
        0,
        0,
        1
    ),
    (
        'Santa Teresa Surf Report 2025-2026',
        'Surf & Water Sports',
        'Live surf conditions, forecasts, and wave analysis for Santa Teresa beaches. Updated hourly with webcam feeds and detailed reports.',
        'Online Service - All Beaches',
        '+506 8888-SURF',
        'info@santateresasurf.report',
        'https://santateresasurf.report',
        '24/7 Live Updates | Forecasts for 2025-2026 Season',
        9.6485,
        -85.1705,
        '/images/surf-report.jpg',
        1,
        1,
        0,
        0
    ),
    (
        'Beach Break Apartments',
        'Accommodation',
        'Modern beachfront apartments with full kitchens, AC, and direct beach access. Weekly and monthly rates for digital nomads.',
        'Playa Santa Teresa',
        '+506 8456-7890',
        'info@beachbreakapts.com',
        'https://beachbreakapts.com',
        '24/7 Self Check-in | Weekly/Monthly Rates Available',
        9.6495,
        -85.1695,
        '/images/beach-break.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'Itauna Restaurant',
        'Food & Drink',
        'Beachfront dining with fresh seafood, tropical cocktails, and stunning sunset views. Live music on weekends and special events.',
        'Playa Santa Teresa',
        '+506 2640-0123',
        'info@itauna.cr',
        'https://itauna.cr',
        'Daily: 11:00 AM - 11:00 PM | Happy Hour: 4-6 PM',
        9.6488,
        -85.1708,
        '/images/itauna.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'Nanipa Restaurant',
        'Food & Drink',
        'Traditional Costa Rican cuisine with modern twists. Farm-to-table ingredients, vegetarian options, and authentic Tico flavors.',
        'Centro Santa Teresa',
        '+506 8765-4321',
        'info@nanipa.cr',
        'https://nanipa.cr',
        'Daily: 7:00 AM - 9:00 PM | Breakfast Special until 11 AM',
        9.6497,
        -85.1696,
        '/images/nanipa.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'The Bakery Santa Teresa',
        'Food & Drink',
        'Artisan bakery and cafe serving fresh pastries, specialty coffee, and healthy breakfast options. Popular morning spot for locals and visitors.',
        'Main Road, Santa Teresa',
        '+506 2640-0560',
        'hello@thebakery-santateresa.com',
        'https://thebakery-santateresa.com',
        'Daily: 6:30 AM - 3:00 PM | Fresh Bread Daily at 7 AM',
        9.6502,
        -85.1698,
        '/images/bakery.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'Playa Carmen Beach',
        'Beach Spots & Surf',
        'Northern end of Santa Teresa with consistent surf breaks, parking, and beach access. Great for beginners and longboarders.',
        'Playa Carmen, Santa Teresa',
        null,
        null,
        null,
        '24/7 Beach Access | Best Surf: Early Morning',
        9.6456,
        -85.1712,
        '/images/playa-carmen.jpg',
        1,
        1,
        0,
        0
    ),
    (
        'Playa Hermosa South',
        'Beach Spots & Surf',
        'Southern beach with powerful waves and stunning scenery. More advanced surf spot with fewer crowds.',
        'South of Santa Teresa',
        null,
        null,
        null,
        '24/7 Beach Access | Best Surf: Mid-tide',
        9.6420,
        -85.1720,
        '/images/playa-hermosa.jpg',
        0,
        1,
        0,
        0
    ),
    (
        'Yoga Shala Santa Teresa',
        'Wellness & Yoga',
        'Community yoga studio with daily classes, workshops, and teacher training. All levels welcome in our bamboo shala.',
        'Jungle Road, Santa Teresa',
        '+506 8888-YOGA',
        'classes@yogashala.st',
        'https://yogashala.st',
        'Daily Classes: 7 AM, 9 AM, 5:30 PM | Workshops Weekends',
        9.6487,
        -85.1693,
        '/images/yoga-shala.jpg',
        0,
        0,
        1,
        0
    ),
    (
        'Witch''s Rock Surf Camp',
        'Surf & Water Sports',
        'Legendary surf school and camp with accommodation, board rentals, and professional instruction. Multi-day packages available.',
        'Main Road, Santa Teresa',
        '+506 2640-0564',
        'info@witchsrock.com',
        'https://witchsrock.com',
        'Daily: 6:00 AM - 7:00 PM | Surf Lessons: 7 AM, 10 AM, 2 PM',
        9.6499,
        -85.1692,
        '/images/witchs-rock.jpg',
        0,
        1,
        0,
        0
    ),
    (
        'Mini Super Santa Teresa',
        'Shopping & Services',
        'Local grocery store with fresh produce, essentials, and tourist supplies. ATM and basic pharmacy items available.',
        'Centro Santa Teresa',
        '+506 2640-0777',
        null,
        null,
        'Daily: 6:00 AM - 10:00 PM',
        9.6494,
        -85.1697,
        '/images/mini-super.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'ATV Rentals Santa Teresa',
        'Transportation',
        'ATV and quad bike rentals for exploring the peninsula. Guided tours and self-guided options available.',
        'Main Road, Santa Teresa',
        '+506 8888-ATV1',
        'rentals@atvstantateresa.com',
        'https://atvstantateresa.com',
        'Daily: 7:00 AM - 6:00 PM | Half/Full Day Rentals',
        9.6490,
        -85.1699,
        '/images/atv-rentals.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'Horseback Riding Adventures',
        'Activities & Tours',
        'Scenic horseback rides through jungle trails, beaches, and waterfalls. Suitable for all experience levels.',
        'Santa Teresa Hills',
        '+506 8888-HORSE',
        'rides@horsebackst.com',
        'https://horsebackst.com',
        'Daily: 8:00 AM - 5:00 PM | Sunset Rides Available',
        9.6480,
        -85.1685,
        '/images/horseback.jpg',
        0,
        0,
        0,
        0
    ),
    (
        'Canopy del Pacifico',
        'Activities & Tours',
        'Zip-lining adventure through the rainforest canopy with breathtaking ocean views and wildlife spotting. Eco-certified tours.',
        'Montezuma Road, Santa Teresa',
        '+506 2640-0968',
        'tours@canopypacifico.com',
        'https://canopypacifico.com',
        'Daily: 8:00 AM - 4:00 PM | Tours: 9 AM, 11 AM, 2 PM',
        9.6483,
        -85.1703,
        '/images/canopy.jpg',
        0,
        0,
        0,
        0
    );
`;

// Execute the initialization script
db.exec(initSQL, (err) => {
    if (err) {
        console.error('Error initializing database:', err.message);
        return;
    }
    console.log('Santa Teresa Directory database initialized successfully!');
    console.log('✅ Categories: Surf & Water Sports, Accommodation, Food & Drink, etc.');
    console.log('✅ Featured businesses: Nahele Lodge, Koji\'s, Casa Tropical Villa, etc.');
    console.log('✅ Surf reports: Live conditions for 2025-2026 season');
    console.log('✅ Yoga schedules: Nahele Lodge and Yoga Shala classes');
    console.log('✅ Luxury villas: Casa Tropical, Villa Punto de Vista, Casa Amalfi');
    
    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
            return;
        }
        console.log('Database connection closed.');
    });
});