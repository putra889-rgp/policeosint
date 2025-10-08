import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "police-data.json");
  let data = [];

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(fileContent);
  } catch (err) {
    return res.status(500).json({ error: "Gagal load police-data.json", message: err.message });
  }

  const { nama, pangkat, tugas } = req.query;
  let result = data;

  if (nama) {
    const q = nama.toLowerCase();
    result = result.filter(item => item.NAMA.toLowerCase().includes(q));
  }
  if (pangkat) {
    const q = pangkat.toLowerCase();
    result = result.filter(item => item.PANGKAT.toLowerCase().includes(q));
  }
  if (tugas) {
    const q = tugas.toLowerCase();
    result = result.filter(item => item.TUGAS.toLowerCase().includes(q));
  }

  res.status(200).json(result);
}
