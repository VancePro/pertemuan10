const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '103.147.92.134', 
    port: 3306,             
    user: 'mahasiswa',
    password: 'akucintafik',
    database: 'ArkhandikaBudiW_2410511022',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;