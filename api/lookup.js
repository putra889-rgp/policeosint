import siakData from '../siak_clean_sample_1k.json';

export default function handler(req, res) {
  const nik = (req.query.NIK || '').trim();

  console.log('Menerima NIK:', NIK);
  console.log('Data JSON pertama:', siakData[0]);

  if (!NIK) {
    return res.status(400).json({ error: 'NIK is required' });
  }
  
  const result = siakData.find(item => item.NIK === NIK);

  if (result) {
    return res.status(200).json(result);
  } else {
    console.log('NIK tidak ditemukan di data');
    return res.status(404).json({ error: 'NIK not found' });
  }
}
