const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { nama } = req.query;

  // Baca JSON
  const filePath = path.join(__dirname, '../police-data.json');
  const rawData = fs.readFileSync(filePath);
  const policeData = JSON.parse(rawData);

  if (!nama) {
    return res.status(400).json({ error: 'Masukkan query ?nama=...' });
  }

  // Cari nama (case-insensitive)
  const filtered = policeData.filter(item =>
    item.NAMA.toLowerCase().includes(nama.toLowerCase())
  );

  res.json({
    total: policeData.length,
    count: filtered.length,
    data: filtered
  });
};
