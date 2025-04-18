// Initialisiere die Karte und setze die Koordinaten sowie den Zoom-Level
var map = L.map('map', {
  center: [21.16481, -90.03910], // Koordinaten von der Geo-URL
  zoom: 16, // Start Zoom-Level
  minZoom: 16, // Verhindert Herauszoomen über Zoom-Level 16 hinaus
  maxZoom: 22 // Verhindert weiteres Hineinzoomen
});

// Füge den OpenStreetMap-Layer hinzu
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Um den Bereich von allen Seiten etwas kleiner zu machen, verschieben wir die Koordinaten:
var smallerBounds = [
  [21.105, -90.105],  // Verschiebung nach oben und rechts
  [21.195, -89.95]    // Verschiebung nach unten und links
];

// Setze den neuen Bereich als Maximalbereich der Karte
map.setMaxBounds(smallerBounds);

// Verhindere das Ziehen außerhalb des Bounds
map.on('drag', function () {
  if (map.getBounds().equals(smallerBounds)) {
    map.dragging.disable(); // Deaktiviert das Ziehen außerhalb des Bounds
  }
});

// Füge die Leaflet-Draw-Optionen für das Hinzufügen von Markern (Bildern) hinzu
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
    marker: {
      icon: new L.Icon({
        iconUrl: 'path-to-your-default-icon.png', // Standard-Icon (Bild) für Marker
        iconSize: [30, 30], // Größe des Markers
        iconAnchor: [15, 15], // Position des Markers
        popupAnchor: [0, -15] // Popup-Position
      })
    },
    polygon: false, // Verhindert das Zeichnen von Polygonen
    polyline: false, // Verhindert das Zeichnen von Linien
    circle: false, // Verhindert das Zeichnen von Kreisen
    rectangle: false // Verhindert das Zeichnen von Rechtecken
  },
  edit: {
    featureGroup: drawnItems,
    remove: true // Erlaubt das Entfernen von Markern
  }
});
map.addControl(drawControl);

// Ereignis-Listener für Marker hinzufügen
map.on('draw:created', function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);

  // Öffne das Formular für das Hochladen eines Fotos und die Kastrationsfrage
  var form = document.getElementById('uploadForm');
  form.style.display = 'block'; // Zeige das Formular an

  // Formular-Ereignis: Wenn das Formular abgeschickt wird
  form.onsubmit = function (event) {
    event.preventDefault();

    var formData = new FormData(form);
    var image = formData.get('image');
    var description = formData.get('description');
    var isNeutered = formData.get('neutered') === 'yes'; // Überprüfe, ob der Hund kastriert ist

    // Verarbeite das Bild und setze es als Icon für den Marker
    var reader = new FileReader();
    reader.onloadend = function () {
      var imgElement = new Image();
      imgElement.src = reader.result;

      // Wenn der Hund kastriert ist, füge einen grünen Rand hinzu
      if (isNeutered) {
        imgElement.style.border = '5px solid green'; // Grüner Rand für kastrierte Hunde
      }

      // Binde das Bild und die Beschreibung als Popup an den Marker
      layer.setIcon(new L.Icon({
        iconUrl: reader.result, // Setze das hochgeladene Bild als Marker-Icon
        iconSize: [40, 40], // Größe des Icons
        iconAnchor: [20, 40], // Position des Icons
        popupAnchor: [0, -40] // Popup-Position
      }));

      layer.bindPopup(`<h3>Hund</h3><p>${description}</p><img src="${reader.result}" alt="Hund" style="width: 100px; height: auto;" />`).openPopup();
    };
    reader.readAsDataURL(image);

    // Blende das Formular nach dem Hochladen aus
    form.style.display = 'none';

    // Leere das Formular nach dem Absenden
    form.reset();
  };
});
