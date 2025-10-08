// File: /api/index.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'police-data.json'); // pastikan ada di root
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    const { nama } = req.query;

    if (!nama) {
      return res.status(400).json({ error: "Masukkan query ?nama=..." });
    }

    const result = data.filter(item =>
      item.NAMA.toLowerCase().includes(nama.toLowerCase())
    );

    res.status(200).json({ total: result.length, count: result.length, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan, cek file JSON atau path-nya." });
  }
}
