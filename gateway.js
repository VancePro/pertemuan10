const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined')); 

// Routing ke Auth Service (3923)
app.use('/api/auth', createProxyMiddleware({ 
    target: 'http://localhost:3923', 
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' }
}));

// Routing ke Order Service (3924)
app.use('/api/orders', createProxyMiddleware({ 
    target: 'http://localhost:3924', 
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '' }
}));

app.listen(3022, () => {
    console.log('API Gateway Kopi Bahagia berjalan di port 3022.');
});