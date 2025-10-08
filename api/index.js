import fs from 'fs'
import path from 'path'

let cacheData = null

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'police-data.json')

  // Load hanya sekali
  if (!cacheData) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    cacheData = JSON.parse(fileContent)
  }

  const { name } = req.query

  if (!name) {
    return res.status(200).json({
      message: '👮 Police OSINT JSON API aktif',
      total_records: cacheData.length,
      usage: '/api?name=Nama Polisi'
    })
  }

  const keyword = name.toLowerCase().trim()
  const results = cacheData.filter(p =>
    p.NAMA && p.NAMA.toLowerCase().includes(keyword)
  )

  return res.status(200).json({
    query: name,
    total_found: results.length,
    results
  })
}
