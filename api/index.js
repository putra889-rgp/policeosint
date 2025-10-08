import data from '../police-data.json';

export default function handler(req, res) {
  const { nama } = req.query;

  if (!nama) {
    return res.status(400).json({ error: "Query 'nama' dibutuhkan" });
  }

  const keyword = nama.trim().toLowerCase();

  const results = data.filter(item =>
    item.NAMA.trim().toLowerCase().includes(keyword)
  );

  res.status(200).json({
    total: results.length,
    count: results.length,
    data: results
  });
}
