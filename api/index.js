// api/index.js
import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'police-data.json')

  // Cek apakah file JSON tersedia
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: 'File police-data.json tidak ditemukan' })
  }

  // Baca data JSON (gunakan cache sederhana supaya tidak berat)
  const jsonData = fs.readFileSync(filePath, 'utf-8')
  let data = []
  try {
    data = JSON.parse(jsonData)
  } catch (err) {
    return res.status(500).json({ error: 'Format JSON tidak valid' })
  }

  const { name } = req.query

  if (!name) {
    return res.status(200).json({
      message: '👮 Police OSINT API aktif',
      total_records: data.length,
      usage: '/api?name=Nama Polisi'
    })
  }

  // Pencarian tidak case-sensitive dan support spasi
  const keyword = name.toLowerCase().trim()
  const results = data.filter(entry =>
    entry.NAMA && entry.NAMA.toLowerCase().includes(keyword)
  )

  return res.status(200).json({
    query: name,
    total_found: results.length,
    results
  })
                              }
