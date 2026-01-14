const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// บันทึกข้อมูลสวน
app.post('/api/save', (req, res) => {
    const { sessionId, plants, plantCount } = req.body;
    gardens[sessionId] = { plants, plantCount, savedAt: new Date() };
    res.json({ success: true });
});

// โหลดข้อมูลสวน
app.get('/api/load/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const garden = gardens[sessionId];
    if (garden) {
        res.json({ success: true, data: garden });
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Night Garden is running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
