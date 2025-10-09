import siakData from '../siak_clean_sample_1k.json';

export default async function handler(req, res) {
  const nik = req.query.nik;

  // Validasi input
  if (!nik) {
    return res.status(400).json({ error: 'NIK is required' });
  }

  // Cari data NIK persis sama
  const result = siakData.find(item => item.nik === nik);

  // Jika ditemukan, kirim data
  if (result) {
    return res.status(200).json(result);
  }

  // Jika tidak ditemukan, kirim error 404
  return res.status(404).json({ error: 'NIK not found' });
}
