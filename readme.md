# Sistem Pemesanan Kopi Bahagia - Pertemuan 10

Platform backend berbasis Microservices untuk mengelola sistem pemesanan di kedai Kopi Bahagia.

## Arsitektur Sistem
- **API Gateway (Port 3000):** 
- **Auth Service (Port 3001):** 
- **Order Service (Port 3002):** 
- **Barista Consumer (RabbitMQ)**

## Menjalankan Service di Server
```bash
pm2 start gateway.js --name "kopi-gateway"
pm2 start auth-service.js --name "kopi-auth"
pm2 start order-service.js --name "kopi-order"
pm2 start consumer.js --name "kopi-barista"