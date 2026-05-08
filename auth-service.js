const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(express.json());

const SECRET_KEY = 'kopi_bahagia_secret_key';

// Register
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username dan password wajib diisi" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'customer']
        );
        res.status(201).json({ message: "Registrasi berhasil", userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Gagal registrasi", details: err.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ error: "User tidak ditemukan" });

        const user = users[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ error: "Password salah" });

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ message: "Login sukses", token });
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan sistem internal" });
    }
});

app.listen(3001, () => console.log('Auth Service berjalan di port 3001'));