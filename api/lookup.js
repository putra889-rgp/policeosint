import siakData from '../siak_clean_sample_1k.json';

export default function handler(req, res) {
  const nik = (req.query.nik || '').trim();

  if (!nik) {
    return res.status(400).json({ error: 'NIK is required' });
  }

  // Cari data berdasarkan properti "NIK" (huruf besar)
  const result = siakData.find(item => item.NIK === nik);

  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ error: 'NIK not found' });
  }
}
