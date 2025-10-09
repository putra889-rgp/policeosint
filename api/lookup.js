import siakData from '../siak_clean_sample_1k.json';

export default async function handler(req, res) {
  const nik = req.query.nik;
  if (!nik) {
    return res.status(400).json({ error: 'NIK is required' });
  }
  const result = siakData.find(item => item.nik === nik);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ error: 'NIK not found' });
  }
}
