require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const SERVER_PORT = process.env.GATEWAY_PORT;
const BACKEND_PORT = process.env.BACKEND_PORT;
const LOGIN_PORT = process.env.LOGIN_PORT;
const TASKS_PORT = process.env.TASKS_PORT;

const app = express();

app.use('/data', createProxyMiddleware({ target: `http://localhost:${BACKEND_PORT}`, changeOrigin: true}));
app.use('/login', createProxyMiddleware({ target: `http://localhost:${LOGIN_PORT}`, changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: http://localhost:${LOGIN_PORT}${req.url}`);
    },
    onError: (err, req, res) => {
        console.error(`Error proxying request: ${err.message}`);
        res.status(500).send('Proxy error'); 
    }}));
app.use('/tasks', createProxyMiddleware({ target: `http://localhost:${TASKS_PORT}`, changeOrigin: true }));

app.listen(SERVER_PORT, () => {
    console.log(`API Gateway listening on http://localhost:${SERVER_PORT}`);
});