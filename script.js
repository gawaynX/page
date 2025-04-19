// Karte initialisieren
const map = L.map('map', {
  center: [21.16481, -90.03910],
  zoom: 16,
  minZoom: 16,
  maxZoom: 20
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap-Mitwirkende'
}).addTo(map);

let userMarkers = [];
let markerSetMode = false; // Marker-Modus: aktiv oder nicht?

// Eigener Marker-Button
const markerButton = L.control({ position: 'topleft' });

markerButton.onAdd = function () {
  const btn = L.DomUtil.create('button', 'leaflet-bar');
  btn.innerHTML = '🐶';
  btn.title = 'Marker setzen';

  btn.style.backgroundColor = 'white';
  btn.style.width = '34px';
  btn.style.height = '34px';
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.fontSize = '20px';

  L.DomEvent.on(btn, 'click', function (e) {
    L.DomEvent.stopPropagation(e);
    markerSetMode = true;
    alert('Klicke auf die Karte, um einen Marker zu setzen');
  });

  return btn;
};

markerButton.addTo(map);

// Bild als Icon
function createImageIcon(imgUrl, isNeutered) {
  const img = document.createElement('img');
  img.src = imgUrl;
  img.className = 'marker-image';
  if (isNeutered) img.classList.add('neutered');

  const div = document.createElement('div');
  div.appendChild(img);

  return L.divIcon({
    html: div.innerHTML,
    className: '',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
}

// Marker hinzufügen
function addMarker(latlng, imgUrl, isNeutered) {
  const marker = L.marker(latlng, {
    icon: createImageIcon(imgUrl, isNeutered)
  }).addTo(map);

  marker.on('click', () => {
    if (confirm('Möchtest du diesen Marker entfernen?')) {
      map.removeLayer(marker);
      userMarkers = userMarkers.filter(m => m !== marker);
    }
  });

  userMarkers.push(marker);
}

// Klick auf Karte → Marker setzen (wenn aktiviert)
map.on('click', (e) => {
  if (!markerSetMode) return;
  markerSetMode = false;

  const latlng = e.latlng;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result;
      const isNeutered = confirm('Ist der Hund kastriert?');
      addMarker(latlng, imgUrl, isNeutered);
    };
    reader.readAsDataURL(file);
  };

  fileInput.click();
});
