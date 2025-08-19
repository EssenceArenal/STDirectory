const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Santa Teresa Directory - Test Server Running!');
});

app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server is working!', 
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to test`);
});