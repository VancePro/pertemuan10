const express = require('express');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');
const db = require('./db');

const app = express();
app.use(express.json());

const SECRET_KEY = 'kopi_bahagia_secret_key';

// Middleware auth
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ error: "Token tidak disediakan" });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ error: "Token tidak valid" });
        req.user = user;
        next();
    });
};

// Publish ke RabbitMQ
async function publishOrderToBarista(orderData) {
    try {
        const conn = await amqp.connect('amqp://localhost');
        const channel = await conn.createChannel();
        const queue = 'barista_orders';
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)));
        setTimeout(() => conn.close(), 500);
    } catch (error) {
        console.error("Gagal mengirim pesanan ke message broker", error);
    }
}

// Get All Orders 
app.get('/', authenticate, async (req, res) => {
    try {
        let query = 'SELECT * FROM orders';
        let params = [];
        
        if (req.user.role === 'customer') {
            query += ' WHERE user_id = ?';
            params.push(req.user.id);
        }

        const [orders] = await db.execute(query, params);
        res.json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: "Gagal mengambil data pesanan" });
    }
});

// Create Order (Customer)
app.post('/', authenticate, async (req, res) => {
    const { coffee_name, quantity } = req.body;
    if (!coffee_name || !quantity) return res.status(400).json({ error: "Nama kopi dan jumlah wajib diisi" });

    try {
        const [result] = await db.execute(
            'INSERT INTO orders (user_id, coffee_name, quantity, status) VALUES (?, ?, ?, ?)',
            [req.user.id, coffee_name, quantity, 'pending']
        );
        
        const newOrder = { 
            orderId: result.insertId, 
            customer: req.user.username, 
            coffee_name, 
            quantity 
        };
        
        // Kirim pesanan ke broker asinkron
        await publishOrderToBarista(newOrder); 
        
        res.status(201).json({ message: "Pesanan berhasil dibuat dan sedang diteruskan ke barista", data: newOrder });
    } catch (err) {
        res.status(500).json({ error: "Gagal membuat pesanan" });
    }
});

app.listen(3924, () => console.log('Order Service berjalan di port 3924'));