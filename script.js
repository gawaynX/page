let markerSetMode = false;
let userMarkers = [];

const map = L.map('map', {
  center: [21.16481, -90.03910],
  zoom: 16,
  minZoom: 16,
  maxBounds: [
    [21.158, -90.047],
    [21.172, -90.031]
  ]
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Hundekopf-Button zum Setzen von Markern
const markerButton = L.control({ position: 'topleft' });

markerButton.onAdd = function () {
  const btn = L.DomUtil.create('button', 'leaflet-bar');
  btn.innerHTML = '🐶';
  btn.title = 'Hundemarkierung setzen';
  Object.assign(btn.style, {
    backgroundColor: 'white',
    width: '34px',
    height: '34px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    padding: '0'
  });

  L.DomEvent.on(btn, 'click', function (e) {
    L.DomEvent.stopPropagation(e);
    markerSetMode = true;
    alert('Klicke auf die Karte, um einen Marker zu setzen');
  });

  return btn;
};

markerButton.addTo(map);

// Funktion zur Erstellung eines Markers
function createMarker(latlng, iconUrl, kastriert) {
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    className: kastriert ? 'green-border' : ''
  });

  const marker = L.marker(latlng, { icon: icon }).addTo(map);
  userMarkers.push(marker);

  marker.on('click', function () {
    const action = prompt("Was möchtest du tun?\n1 = Bearbeiten\n2 = Löschen\n3 = Abbrechen");

    if (action === '1') {
      // Bearbeiten: neues Bild + Kastrationsstatus
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';

      fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
          const kastriert = confirm('Wurde der Hund kastriert?');
          const newIcon = L.icon({
            iconUrl: event.target.result,
            iconSize: [50, 50],
            className: kastriert ? 'green-border' : ''
          });
          marker.setIcon(newIcon);
        };
        reader.readAsDataURL(file);
      };

      fileInput.click();
    } else if (action === '2') {
      map.removeLayer(marker);
      userMarkers = userMarkers.filter(m => m !== marker);
    } else {
      // Abbrechen: nichts tun
    }
  });

  return marker;
}

// Marker per Klick auf Karte setzen
map.on('click', function (e) {
  if (!markerSetMode) return;
  markerSetMode = false;

  const wantsImage = confirm('Möchtest du ein Bild an dieser Stelle hochladen?');
  const askKastriert = () => confirm('Wurde der Hund kastriert?');

  if (wantsImage) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = function () {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const kastriert = askKastriert();
        createMarker(e.latlng, event.target.result, kastriert);
      };
      reader.readAsDataURL(file);
    };

    fileInput.click();
  } else {
    const emojiUrl = 'https://twemoji.maxcdn.com/v/latest/72x72/1f436.png';
    const kastriert = askKastriert();
    createMarker(e.latlng, emojiUrl, kastriert);
  }
});
