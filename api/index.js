import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { nama } = req.query;

  if (!nama) {
    return res.status(400).json({ error: "Query 'nama' dibutuhkan" });
  }

  const filePath = path.resolve('./police-data.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const hasil = data.filter(p =>
    p.NAMA.toLowerCase().includes(nama.toLowerCase())
  );

  res.status(200).json({
    total: data.length,
    count: hasil.length,
    data: hasil
  });
}
