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

app.listen(PORT, () => {
    console.log(`Night Garden is running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
