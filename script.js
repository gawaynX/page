// Karte initialisieren
const map = L.map('map', {
  center: [21.16481, -90.03910], // Zentrum auf Sisal
  zoom: 16,
  minZoom: 16, // Kein Herauszoomen unter Zoom-Stufe 16 erlaubt
  maxZoom: 20
});

// Karten-Layer von OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap-Mitwirkende'
}).addTo(map);

// Marker-Liste für den Benutzer (lokal im Browser gespeichert)
let userMarkers = [];

// Funktion um Bild als Icon zu erstellen
function createImageIcon(imgUrl, isNeutered) {
  const img = document.createElement('img');
  img.src = imgUrl;
  img.className = 'marker-image';
  if (isNeutered) {
    img.classList.add('neutered');
  }

  const div = document.createElement('div');
  div.appendChild(img);

  return L.divIcon({
    html: div.innerHTML,
    className: '', // Entfernt Standard-Leaflet-Stil
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
}

// Marker auf der Karte setzen
function addMarker(latlng, imgUrl, isNeutered) {
  const marker = L.marker(latlng, {
    icon: createImageIcon(imgUrl, isNeutered)
  }).addTo(map);

  // Zum Entfernen des eigenen Markers
  marker.on('click', () => {
    if (confirm('Möchtest du diesen Marker wieder entfernen?')) {
      map.removeLayer(marker);
      userMarkers = userMarkers.filter(m => m !== marker);
    }
  });

  userMarkers.push(marker);
}

// Beim Klick auf die Karte → Marker setzen und Bild+Infos abfragen
map.on('click', (e) => {
  const latlng = e.latlng;

  // Bild-Datei abfragen
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result;

      // Kastration abfragen
      const isNeutered = confirm('Ist der Hund kastriert?');

      addMarker(latlng, imgUrl, isNeutered);
    };
    reader.readAsDataURL(file);
  };

  // Klick auslösen (öffnet Dateidialog)
  fileInput.click();
});
