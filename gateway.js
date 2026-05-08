const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined')); // Logging request

// Routing ke Auth Service (3001)
app.use('/api/auth', createProxyMiddleware({ 
    target: 'http://localhost:3001', 
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' }
}));

// Routing ke Order Service (3002)
app.use('/api/orders', createProxyMiddleware({ 
    target: 'http://localhost:3002', 
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '' }
}));

app.listen(3000, () => {
    console.log('API Gateway Kopi Bahagia berjalan di port 3000.');
});