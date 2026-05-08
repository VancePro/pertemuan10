const amqp = require('amqplib');

async function startBaristaConsumer() {
    try {
        const conn = await amqp.connect('amqp://localhost');
        const channel = await conn.createChannel();
        const queue = 'barista_orders';

        await channel.assertQueue(queue, { durable: true });
        console.log(`[*] Barista standby. Menunggu pesanan di queue: ${queue}`);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(`[x] Tiket Baru Masuk! Pelanggan: ${order.customer} | Pesanan: ${order.quantity}x ${order.coffee_name}`);
                console.log(`[x] Barista sedang meracik pesanan #${order.orderId}...`);
                
                // Konfirmasi pesan telah diterima dan diproses
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Consumer error:", error);
    }
}

startBaristaConsumer();