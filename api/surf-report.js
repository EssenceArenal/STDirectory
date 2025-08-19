// Vercel serverless function for Santa Teresa surf reports
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Mock surf report data for Santa Teresa 2025-2026
        // In production, you'd integrate with actual surf forecast APIs
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
                    },
                    forecast: [
                        {
                            date: new Date().toISOString().split('T')[0],
                            waveHeight: '3-5 ft',
                            rating: 7.5,
                            conditions: 'Clean waves, light offshore winds'
                        },
                        {
                            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                            waveHeight: '4-6 ft',
                            rating: 8.0,
                            conditions: 'Excellent conditions, glassy surface'
                        },
                        {
                            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                            waveHeight: '2-4 ft',
                            rating: 6.5,
                            conditions: 'Smaller waves, good for beginners'
                        }
                    ]
                },
                {
                    name: 'Playa Carmen',
                    coordinates: { lat: 9.6456, lng: -85.1712 },
                    currentConditions: {
                        waveHeight: '2-4 ft',
                        windSpeed: '6 mph',
                        windDirection: 'NE',
                        tide: 'Rising',
                        nextTide: '2:30 PM - High',
                        surfQuality: 'Fair to Good',
                        rating: 6.5,
                        bestTime: 'Morning sessions (7-10 AM)'
                    },
                    forecast: [
                        {
                            date: new Date().toISOString().split('T')[0],
                            waveHeight: '2-4 ft',
                            rating: 6.5,
                            conditions: 'Good for longboards and beginners'
                        },
                        {
                            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                            waveHeight: '3-5 ft',
                            rating: 7.0,
                            conditions: 'Improving conditions, clean lines'
                        },
                        {
                            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                            waveHeight: '2-3 ft',
                            rating: 6.0,
                            conditions: 'Smaller surf, perfect for learning'
                        }
                    ]
                },
                {
                    name: 'Playa Hermosa (South)',
                    coordinates: { lat: 9.6420, lng: -85.1720 },
                    currentConditions: {
                        waveHeight: '4-7 ft',
                        windSpeed: '10 mph',
                        windDirection: 'NE',
                        tide: 'Rising',
                        nextTide: '2:30 PM - High',
                        surfQuality: 'Very Good',
                        rating: 8.0,
                        bestTime: 'Early morning (6-8 AM)'
                    },
                    forecast: [
                        {
                            date: new Date().toISOString().split('T')[0],
                            waveHeight: '4-7 ft',
                            rating: 8.0,
                            conditions: 'Powerful waves, experienced surfers only'
                        },
                        {
                            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                            waveHeight: '5-8 ft',
                            rating: 8.5,
                            conditions: 'Epic conditions, barreling waves'
                        },
                        {
                            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                            waveHeight: '3-6 ft',
                            rating: 7.5,
                            conditions: 'Still good size, manageable for intermediates'
                        }
                    ]
                }
            ],
            weather: {
                temperature: '82°F (28°C)',
                humidity: '75%',
                sunrise: '5:45 AM',
                sunset: '5:30 PM',
                uvIndex: 9,
                description: 'Partly cloudy with light trade winds'
            },
            tips: [
                'Best surf is typically early morning (6-9 AM) with offshore winds',
                'Dry season (December-April) offers most consistent conditions',
                'Always check with local surf schools for current conditions',
                'Respect local surf etiquette and give way to locals',
                'Bring reef-safe sunscreen to protect marine life'
            ],
            warnings: [
                'Strong currents at Playa Hermosa - experienced surfers only',
                'Watch for rocks at low tide, especially at Santa Teresa main beach',
                'Rip currents can be strong - know how to escape them'
            ]
        };

        res.status(200).json(surfReport);
    } catch (error) {
        console.error('Error generating surf report:', error);
        res.status(500).json({ error: 'Failed to fetch surf report' });
    }
};