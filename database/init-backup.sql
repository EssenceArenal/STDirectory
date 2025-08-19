-- Santa Teresa Directory Database Schema

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT OR IGNORE INTO categories (name, icon) VALUES 
    ('Restaurants', '🍽️'),
    ('Hotels & Lodging', '🏨'),
    ('Surf Shops', '🏄'),
    ('Tours & Activities', '🌴'),
    ('Beach Bars', '🍹'),
    ('Cafes', '☕'),
    ('Transportation', '🚗'),
    ('Health & Wellness', '💆'),
    ('Shopping', '🛍️'),
    ('Services', '🔧');

-- Insert sample businesses
INSERT OR IGNORE INTO businesses (name, category, description, address, phone, email, website, hours, latitude, longitude, image_url, featured) VALUES 
    (
        'Ylang Ylang Restaurant',
        'Restaurants',
        'Beachfront fine dining with international cuisine and stunning sunset views. Known for fresh seafood and romantic atmosphere.',
        'Playa Santa Teresa, Puntarenas',
        '+506 2640-0636',
        'info@ylangylangbeachresort.com',
        'https://ylangylangbeachresort.com',
        'Daily: 7:00 AM - 10:00 PM',
        9.6485,
        -85.1705,
        '/images/ylang-ylang.jpg',
        1
    ),
    (
        'The Bakery',
        'Cafes',
        'Artisan bakery and cafe serving fresh pastries, coffee, and healthy breakfast options. Popular morning spot for locals and tourists.',
        'Main Road, Santa Teresa',
        '+506 2640-0560',
        'hello@thebakery-santateresa.com',
        'https://thebakery-santateresa.com',
        'Daily: 6:30 AM - 3:00 PM',
        9.6502,
        -85.1698,
        '/images/bakery.jpg',
        1
    ),
    (
        'Playa Carmen Surf Shop',
        'Surf Shops',
        'Full-service surf shop with board rentals, lessons, and gear. Experienced instructors for all skill levels.',
        'Playa Carmen, Santa Teresa',
        '+506 8829-5678',
        'info@playacarmensurf.com',
        'https://playacarmensurf.com',
        'Daily: 7:00 AM - 6:00 PM',
        9.6456,
        -85.1712,
        '/images/playa-carmen-surf.jpg',
        1
    ),
    (
        'Casa Corcovado Jungle Lodge',
        'Hotels & Lodging',
        'Eco-luxury jungle lodge with stunning ocean views, yoga classes, and sustainable practices.',
        'Santa Teresa, Puntarenas',
        '+506 2640-0911',
        'reservations@casacorcovado.com',
        'https://casacorcovado.com',
        '24/7 Reception',
        9.6478,
        -85.1689,
        '/images/casa-corcovado.jpg',
        1
    ),
    (
        'Latitude 10 Resort',
        'Hotels & Lodging',
        'Beachfront resort with modern amenities, spa services, and direct beach access.',
        'Playa Santa Teresa',
        '+506 2640-0396',
        'info@latitude10resort.com',
        'https://latitude10resort.com',
        '24/7 Reception',
        9.6491,
        -85.1701,
        '/images/latitude10.jpg',
        0
    ),
    (
        'Santa Teresa Adventure Tours',
        'Tours & Activities',
        'Zip-lining, horseback riding, ATV tours, and wildlife watching adventures throughout the peninsula.',
        'Centro Santa Teresa',
        '+506 8456-7890',
        'adventures@santateresatours.com',
        'https://santateresatours.com',
        'Daily: 7:00 AM - 5:00 PM',
        9.6495,
        -85.1695,
        '/images/adventure-tours.jpg',
        0
    ),
    (
        'Kika Beach Bar',
        'Beach Bars',
        'Laid-back beach bar with cold drinks, live music, and the best sunset views in town.',
        'Playa Santa Teresa',
        '+506 2640-0408',
        'info@kikabeach.com',
        null,
        'Daily: 11:00 AM - 12:00 AM',
        9.6488,
        -85.1708,
        '/images/kika-beach.jpg',
        0
    ),
    (
        'Nautilus Boutique Hotel',
        'Hotels & Lodging',
        'Intimate boutique hotel with personalized service and beautiful gardens.',
        'Santa Teresa Beach',
        '+506 2640-0968',
        'info@nautilus-costarica.com',
        'https://nautilus-costarica.com',
        '24/7 Reception',
        9.6483,
        -85.1703,
        '/images/nautilus.jpg',
        0
    ),
    (
        'Witch''s Rock Surf Camp',
        'Surf Shops',
        'Surf school and camp with accommodation, board rentals, and professional instruction.',
        'Main Road, Santa Teresa',
        '+506 2640-0564',
        'info@witchsrock.com',
        'https://witchsrock.com',
        'Daily: 6:00 AM - 7:00 PM',
        9.6499,
        -85.1692,
        '/images/witchs-rock.jpg',
        0
    ),
    (
        'Soda Típica Tica',
        'Restaurants',
        'Authentic Costa Rican cuisine at local prices. Famous for casados and fresh fruit smoothies.',
        'Centro Santa Teresa',
        '+506 8765-4321',
        null,
        null,
        'Daily: 6:00 AM - 9:00 PM',
        9.6497,
        -85.1696,
        '/images/soda-tipica.jpg',
        0
    );