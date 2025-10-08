import express from "express";
import fs from "fs";

const app = express();

// Load JSON ke memori saat server start
let policeData = [];
try {
  const raw = fs.readFileSync("police-data.json", "utf8");
  policeData = JSON.parse(raw);
  console.log(`✅ Loaded ${policeData.length} police records.`);
} catch (err) {
  console.error("❌ Gagal load police-data.json:", err);
}

// Endpoint root untuk test
app.get("/", (req, res) => {
  res.json({
    message: "👮 Police OSINT API aktif",
    total_records: policeData.length,
    usage: "/search?name=Nama Polisi",
  });
});

// Endpoint pencarian data polisi
app.get("/search", (req, res) => {
  const q = (req.query.name || "").toLowerCase().trim();
  if (!q) {
    return res.status(400).json({ error: "Parameter ?name= wajib diisi" });
  }

  const results = policeData.filter(
    (p) => p.NAMA && p.NAMA.toLowerCase().includes(q)
  );

  res.json({
    total: results.length,
    results,
  });
});

export default app;
