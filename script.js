// Karte erstellen und auf Sisal fokussieren
var map = L.map('map').setView([20.9333, -90.2833], 15); // Koordinaten für Sisal, Yucatán

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap-Mitwirkende'
}).addTo(map);

// Marker-Daten vom Backend laden
fetch('/api/markers')
  .then(response => response.json())
  .then(markers => {
    markers.forEach(marker => {
      const customIcon = L.icon({
        iconUrl: marker.imageUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
      });

      L.marker([marker.lat, marker.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${marker.description}</b>`);
    });
  })
  .catch(error => console.error('Fehler beim Laden der Marker:', error));

// Upload-Formular
document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData();
  const imageFile = document.querySelector('input[name="image"]').files[0];
  const description = document.querySelector('textarea[name="description"]').value;

  formData.append('image', imageFile);
  formData.append('description', description);

  const lat = 20.9333;  // Feste Koordinaten für Sisal (oder dynamisch nach Klick)
  const lng = -90.2833;

  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert('Hund erfolgreich eingetragen!');
    location.reload(); // Seite neu laden, um den neuen Marker anzuzeigen
  })
  .catch(error => {
    alert('Fehler beim Eintragen des Hundes.');
    console.error('Fehler:', error);
  });
});
