const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Upload-Zielordner
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());

// Marker-Daten holen
app.get('/api/markers', (req, res) => {
  const data = fs.readFileSync('./markers.json', 'utf8');
  res.json(JSON.parse(data));
});

// Marker speichern
app.post('/api/upload', upload.single('image'), (req, res) => {
  const { lat, lng, description } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  const newMarker = { lat, lng, description, imageUrl };

  const data = fs.readFileSync('./markers.json', 'utf8');
  const markers = JSON.parse(data);
  markers.push(newMarker);
  fs.writeFileSync('./markers.json', JSON.stringify(markers, null, 2));

  res.json({ success: true, marker: newMarker });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});