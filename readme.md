# Sistem Pemesanan Kopi Bahagia - Pertemuan 10

Platform backend berbasis Microservices untuk mengelola sistem pemesanan di kedai Kopi Bahagia.

## Arsitektur Sistem
- **API Gateway (Port 3022):** 
- **Auth Service (Port 3923):** 
- **Order Service (Port 3924):** 
- **Barista Consumer (RabbitMQ)**

## Install Kebutuhan
npm install express mysql2 jsonwebtoken bcryptjs amqplib http-proxy-middleware morgan dotenv

## Menjalankan Service di Server
```bash
npx pm2 start gateway.js --name "kopi-gateway"
npx pm2 start auth-service.js --name "kopi-auth"
npx pm2 start order-service.js --name "kopi-order"
npx pm2 start consumer.js --name "kopi-message"

## Melihat log dari background worker (Message Broker)
npx pm2 logs kopi-barista