const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, '..', 'police-data.json');
const upload = multer({ dest: '/tmp' }); // Vercel writable folder

// helper read/write
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try { return JSON.parse(raw); } catch { return []; }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// list/search via nama
app.get('/api/policeosint', (req, res) => {
  const { nama = '', limit = 100, offset = 0 } = req.query;
  const q = String(nama).trim().toLowerCase();
  const all = readData();
  let results = all;
  if (q) {
    results = all.filter(item => (item.NAMA || '').toLowerCase().includes(q));
  }
  const start = parseInt(offset) || 0;
  const lim = Math.min(parseInt(limit) || 100, 1000);
  res.json({ total: results.length, count: results.slice(start, start + lim).length, data: results.slice(start, start + lim) });
});

// get by exact NAMA
app.get('/api/policeosint/:nama', (req, res) => {
  const nama = req.params.nama.toLowerCase();
  const item = readData().find(x => (x.NAMA || '').toLowerCase() === nama);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// create new record
app.post('/api/policeosint', (req, res) => {
  const { PANGKAT, NAMA, TUGAS, HP, EMAIL } = req.body;
  if (!NAMA) return res.status(400).json({ error: 'NAMA required' });
  const all = readData();
  all.unshift({ PANGKAT, NAMA, TUGAS, HP, EMAIL });
  writeData(all);
  res.status(201).json({ PANGKAT, NAMA, TUGAS, HP, EMAIL });
});

// delete by exact NAMA
app.delete('/api/policeosint/:nama', (req, res) => {
  const nama = req.params.nama.toLowerCase();
  let all = readData();
  const before = all.length;
  all = all.filter(x => (x.NAMA || '').toLowerCase() !== nama);
  if (all.length === before) return res.status(404).json({ error: 'Not found' });
  writeData(all);
  res.json({ ok: true });
});

// upload CSV
app.post('/api/policeosint/upload-csv', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const all = readData();
      const normalized = results.map(r => ({
        PANGKAT: (r.PANGKAT || r.pangkat || '').trim(),
        NAMA: (r.NAMA || r.nama || '').trim(),
        TUGAS: (r.TUGAS || r.tugas || '').trim(),
        HP: (r.HP || r.hp || r.phone || '').trim(),
        EMAIL: (r.EMAIL || r.email || '').trim()
      }));
      writeData([...normalized, ...all]);
      fs.unlinkSync(req.file.path);
      res.json({ imported: normalized.length });
    });
});

// default root
app.get('/api', (req, res) => res.json({ ok: true, service: 'policeosint-api' }));

module.exports = app;
