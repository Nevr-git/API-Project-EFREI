require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const SERVER_PORT = process.env.BACKEND_PORT;

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from backend service' });
});

app.listen(SERVER_PORT, () => {
    console.log(`Backend service listening on http://localhost:${SERVER_PORT}`);
});