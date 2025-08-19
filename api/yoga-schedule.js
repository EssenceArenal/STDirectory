// Vercel serverless function for Santa Teresa yoga schedules
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
        // Mock yoga schedule data for Santa Teresa
        // In production, you'd integrate with actual booking systems
        const today = new Date();
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const yogaSchedule = {
            location: 'Santa Teresa, Costa Rica',
            lastUpdated: new Date().toISOString(),
            studios: [
                {
                    name: 'Nahele Lodge',
                    address: 'Santa Teresa Beach',
                    phone: '+506 2640-1001',
                    website: 'https://nahelelodge.com',
                    description: 'Boutique eco-lodge with oceanfront yoga platform',
                    schedule: [
                        {
                            day: 'Monday',
                            classes: [
                                {
                                    time: '7:00 AM',
                                    type: 'Vinyasa Flow',
                                    instructor: 'Maria',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$20'
                                },
                                {
                                    time: '5:30 PM',
                                    type: 'Sunset Yin',
                                    instructor: 'Carlos',
                                    duration: '60 min',
                                    level: 'Beginner',
                                    price: '$18'
                                }
                            ]
                        },
                        {
                            day: 'Tuesday',
                            classes: [
                                {
                                    time: '7:00 AM',
                                    type: 'Hatha Yoga',
                                    instructor: 'Ana',
                                    duration: '60 min',
                                    level: 'Beginner',
                                    price: '$18'
                                },
                                {
                                    time: '5:30 PM',
                                    type: 'Power Vinyasa',
                                    instructor: 'Maria',
                                    duration: '75 min',
                                    level: 'Intermediate',
                                    price: '$20'
                                }
                            ]
                        },
                        {
                            day: 'Wednesday',
                            classes: [
                                {
                                    time: '7:00 AM',
                                    type: 'Morning Flow',
                                    instructor: 'Carlos',
                                    duration: '60 min',
                                    level: 'All Levels',
                                    price: '$18'
                                },
                                {
                                    time: '5:30 PM',
                                    type: 'Restorative Yoga',
                                    instructor: 'Ana',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$20'
                                }
                            ]
                        },
                        {
                            day: 'Thursday',
                            classes: [
                                {
                                    time: '7:00 AM',
                                    type: 'Ashtanga Primary',
                                    instructor: 'Maria',
                                    duration: '90 min',
                                    level: 'Advanced',
                                    price: '$25'
                                },
                                {
                                    time: '5:30 PM',
                                    type: 'Gentle Flow',
                                    instructor: 'Carlos',
                                    duration: '60 min',
                                    level: 'Beginner',
                                    price: '$18'
                                }
                            ]
                        },
                        {
                            day: 'Friday',
                            classes: [
                                {
                                    time: '7:00 AM',
                                    type: 'Vinyasa Flow',
                                    instructor: 'Ana',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$20'
                                },
                                {
                                    time: '5:30 PM',
                                    type: 'Sunset Flow',
                                    instructor: 'Maria',
                                    duration: '60 min',
                                    level: 'All Levels',
                                    price: '$18'
                                }
                            ]
                        },
                        {
                            day: 'Saturday',
                            classes: [
                                {
                                    time: '8:00 AM',
                                    type: 'Beach Yoga',
                                    instructor: 'Carlos',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$22'
                                },
                                {
                                    time: '5:00 PM',
                                    type: 'Yin & Sound Bath',
                                    instructor: 'Ana',
                                    duration: '90 min',
                                    level: 'All Levels',
                                    price: '$25'
                                }
                            ]
                        },
                        {
                            day: 'Sunday',
                            classes: [
                                {
                                    time: '8:00 AM',
                                    type: 'Sunrise Flow',
                                    instructor: 'Maria',
                                    duration: '60 min',
                                    level: 'All Levels',
                                    price: '$18'
                                },
                                {
                                    time: '5:00 PM',
                                    type: 'Community Class',
                                    instructor: 'Various',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$15'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'Yoga Shala Santa Teresa',
                    address: 'Jungle Road, Santa Teresa',
                    phone: '+506 8888-YOGA',
                    website: 'https://yogashala.st',
                    description: 'Community yoga studio in bamboo shala',
                    schedule: [
                        {
                            day: 'Monday',
                            classes: [
                                {
                                    time: '9:00 AM',
                                    type: 'Beginner Flow',
                                    instructor: 'Laura',
                                    duration: '60 min',
                                    level: 'Beginner',
                                    price: '$15'
                                },
                                {
                                    time: '6:00 PM',
                                    type: 'Power Hour',
                                    instructor: 'Diego',
                                    duration: '60 min',
                                    level: 'Intermediate',
                                    price: '$18'
                                }
                            ]
                        },
                        {
                            day: 'Tuesday',
                            classes: [
                                {
                                    time: '9:00 AM',
                                    type: 'Yin Yoga',
                                    instructor: 'Sofia',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$18'
                                }
                            ]
                        },
                        {
                            day: 'Wednesday',
                            classes: [
                                {
                                    time: '9:00 AM',
                                    type: 'Vinyasa Flow',
                                    instructor: 'Laura',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$18'
                                },
                                {
                                    time: '6:00 PM',
                                    type: 'Candlelight Yin',
                                    instructor: 'Sofia',
                                    duration: '60 min',
                                    level: 'All Levels',
                                    price: '$20'
                                }
                            ]
                        },
                        {
                            day: 'Thursday',
                            classes: [
                                {
                                    time: '9:00 AM',
                                    type: 'Alignment Flow',
                                    instructor: 'Diego',
                                    duration: '75 min',
                                    level: 'Intermediate',
                                    price: '$18'
                                }
                            ]
                        },
                        {
                            day: 'Friday',
                            classes: [
                                {
                                    time: '9:00 AM',
                                    type: 'All Levels Flow',
                                    instructor: 'Laura',
                                    duration: '60 min',
                                    level: 'All Levels',
                                    price: '$15'
                                },
                                {
                                    time: '6:00 PM',
                                    type: 'Weekend Warrior',
                                    instructor: 'Diego',
                                    duration: '90 min',
                                    level: 'Advanced',
                                    price: '$22'
                                }
                            ]
                        },
                        {
                            day: 'Saturday',
                            classes: [
                                {
                                    time: '10:00 AM',
                                    type: 'Workshop: Arm Balances',
                                    instructor: 'Sofia',
                                    duration: '120 min',
                                    level: 'Intermediate',
                                    price: '$35'
                                }
                            ]
                        },
                        {
                            day: 'Sunday',
                            classes: [
                                {
                                    time: '9:00 AM',
                                    type: 'Slow Flow Sunday',
                                    instructor: 'Laura',
                                    duration: '75 min',
                                    level: 'All Levels',
                                    price: '$18'
                                }
                            ]
                        }
                    ]
                }
            ],
            todayHighlights: {
                day: weekDays[today.getDay()],
                date: today.toDateString(),
                recommendedClasses: [
                    {
                        studio: 'Nahele Lodge',
                        time: '7:00 AM',
                        type: 'Morning Flow',
                        reason: 'Perfect way to start your day with ocean views'
                    },
                    {
                        studio: 'Yoga Shala',
                        time: '6:00 PM',
                        type: 'Evening Class',
                        reason: 'Unwind after a day of surfing and exploring'
                    }
                ]
            },
            specialEvents: [
                {
                    name: 'Full Moon Beach Yoga',
                    date: 'Next Full Moon',
                    time: '7:00 PM',
                    location: 'Playa Santa Teresa',
                    price: '$25',
                    description: 'Monthly community gathering under the full moon'
                },
                {
                    name: 'Yoga Teacher Training',
                    date: 'February 2025',
                    duration: '200 Hour Certification',
                    location: 'Nahele Lodge',
                    price: '$2,200',
                    description: 'Intensive teacher training in paradise'
                }
            ],
            tips: [
                'Bring your own mat or rent one at the studio',
                'Arrive 10 minutes early to settle in',
                'Stay hydrated - bring water',
                'Classes fill up quickly in high season - book ahead',
                'Many studios offer package deals for multiple classes'
            ]
        };

        res.status(200).json(yogaSchedule);
    } catch (error) {
        console.error('Error generating yoga schedule:', error);
        res.status(500).json({ error: 'Failed to fetch yoga schedule' });
    }
};