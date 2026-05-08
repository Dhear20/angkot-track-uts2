const express = require('express');
const mysql = require('mysql2');
const AWS = require('aws-sdk');
const app = express();
const port = 80; // Sesuaikan dengan EXPOSE di Dockerfile

app.use(express.json());

// --- KONFIGURASI DATABASE (Nanti diisi endpoint RDS) ---
const db = mysql.createConnection({
    host: 'database-1.cih0qiu6cd3p.us-east-1.rds.amazonaws.com', // Endpoint AWS kamu
    user: 'admin',
    password: 'Dhederoh20', // Password yang baru kamu ganti
    database: 'db_angkot' // Pastikan kamu sudah buat database ini di HeidiSQL tadi
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke AWS RDS:', err);
        return;
    }
    console.log('BERHASIL! Terhubung ke database MySQL di AWS RDS!');
});

// --- KONFIGURASI S3 (Untuk fitur upload) ---
const s3 = new AWS.S3({
    accessKeyId: 'AKIA...', 
    secretAccessKey: 'SECRET...'
});

// --- FITUR 1: Monitoring Rute (Ambil data dari RDS) ---
app.get('/routes', (req, res) => {
    db.query('SELECT * FROM rute_angkot', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({
            message: "Daftar Rute Angkot Bandung",
            data: results
        });
    });
});

// --- FITUR 2: Info Jadwal (Statis/Semi Real-time) ---
app.get('/schedule', (req, res) => {
    res.json({
        message: "Jadwal Angkot Feeder MJT",
        schedule: [
            { trayek: "Antapani-Ciroyom", status: "Beroperasi", eta: "5 Menit" },
            { trayek: "Kalapa-Ledeng", status: "Macet", eta: "15 Menit" }
        ]
    });
});

// --- FITUR 3: Upload Laporan Kendala (Ke Amazon S3) ---
// Ini hanya simulasi alur, di tugas asli kamu perlu menambahkan middleware upload
app.post('/report', (req, res) => {
    const params = {
        Bucket: 'nama-bucket-s3-kamu',
        Key: `laporan-${Date.now()}.jpg`,
        Body: 'data_gambar_disini'
    };

    s3.upload(params, (err, data) => {
        if (err) return res.status(500).send(err);
        res.json({
            message: "Laporan berhasil diunggah ke S3 via CloudFront",
            url: data.Location
        });
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang di AngkotTrack Bandung</h1><p>Aplikasi Cloud Computing Ready!</p>');
});

app.listen(port, () => {
    console.log(`Aplikasi AngkotTrack berjalan di port ${port}`);
});