const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Muat data CSV ke dalam memori
const policeData = [];
const csvFilePath = path.join(__dirname, '..', 'idnpolice.csv'); // naik 1 folder ke root

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    policeData.push(row);
  })
  .on('end', () => {
    console.log(`✅ Data polisi dimuat: ${policeData.length} baris`);
  });

// Endpoint utama untuk tes
app.get('/', (req, res) => {
  res.json({
    message: '👮 Police OSINT API siap digunakan!',
    usage: '/search?name=nama'
  });
});

// Endpoint pencarian nama
app.get('/search', (req, res) => {
  const name = (req.query.name || '').toLowerCase().trim();
  if (!name) {
    return res.status(400).json({ error: 'Parameter ?name= wajib diisi' });
  }

  const results = policeData.filter((row) =>
    row.NAMA && row.NAMA.toLowerCase().includes(name)
  );

  res.json(results);
});

// Jalankan server lokal (untuk testing di PC/Termux)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server lokal jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
