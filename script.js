let markerSetMode = false;
let userMarkers = [];

const map = L.map('map', {
  center: [21.16481, -90.03910],
  zoom: 16,
  minZoom: 16,
  maxBounds: [
    [21.158, -90.047], // Südwestliche Ecke
    [21.172, -90.031]  // Nordöstliche Ecke
  ]
});

// OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap-Mitwirkende'
}).addTo(map);

// 🐶 Button zum Marker setzen
const markerButton = L.control({ position: 'topleft' });

markerButton.onAdd = function () {
  const btn = L.DomUtil.create('button', 'leaflet-bar');
  btn.innerHTML = '🐶';
  btn.title = 'Hundemarkierung setzen';

  // Styling
  btn.style.backgroundColor = 'white';
  btn.style.width = '34px';
  btn.style.height = '34px';
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.fontSize = '20px';
  btn.style.padding = '0';

  // Klick-Aktion
  L.DomEvent.on(btn, 'click', function (e) {
    L.DomEvent.stopPropagation(e);
    markerSetMode = true;
    alert('Klicke auf die Karte, um einen Marker zu setzen');
  });

  return btn;
};

markerButton.addTo(map);

// Marker setzen nach Klick
map.on('click', function (e) {
  if (!markerSetMode) return;
  markerSetMode = false;

  // Nach Kastration fragen
  const kastriert = confirm('Wurde dieser Hund kastriert?');

  // Datei-Upload
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.onchange = function () {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const imgUrl = event.target.result;

      // Icon mit optionalem grünem Rand
      const icon = L.icon({
        iconUrl: imgUrl,
        iconSize: [50, 50],
        className: kastriert ? 'green-border' : ''
      });

      const marker = L.marker(e.latlng, { icon: icon, draggable: false }).addTo(map);
      userMarkers.push(marker);

      // Rechtsklick zum Löschen
      marker.on('contextmenu', function () {
        map.removeLayer(marker);
        userMarkers = userMarkers.filter(m => m !== marker);
      });
    };
    reader.readAsDataURL(file);
  };

  fileInput.click();
});
