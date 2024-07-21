require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();

const SERVER_PORT = process.env.TASKS_PORT;

app.get('/api/tasks', (req, res) => {
    res.json({ tasks: ['Task 1', 'Task 2'] });
});

app.listen(SERVER_PORT, () => {
    console.log(`Tasks service listening on http://localhost:${SERVER_PORT}`);
});