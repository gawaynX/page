// Initialisiere die Karte und setze die Koordinaten sowie den Zoom-Level
var map = L.map('map', {
  center: [21.16481, -90.03910], // Koordinaten von der Geo-URL
  zoom: 16, // Start Zoom-Level
  minZoom: 16, // Verhindert Herauszoomen über Zoom-Level 16 hinaus
  maxZoom: 16 // Verhindert weiteres Hineinzoomen
});

// Füge den OpenStreetMap-Layer hinzu
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Setze die maximalen Bounds für den Bereich (optional)
var bounds = [[21.10, -90.10], [21.20, -90.00]]; // Beispielhafte Begrenzung für Sisal
map.setMaxBounds(bounds);

// Verhindere das Ziehen außerhalb des Bounds
map.on('drag', function () {
  if (map.getBounds().equals(bounds)) {
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

  // Wenn ein Marker hinzugefügt wird, öffne ein Formular zur Bild- und Beschreibungsanzeige
  var form = document.getElementById('uploadForm');
  form.onsubmit = function (event) {
    event.preventDefault();

    var formData = new FormData(form);
    var image = formData.get('image');
    var description = formData.get('description');
    
    // Zeige die Datei als Bild im Marker-Popup an
    var reader = new FileReader();
    reader.onloadend = function () {
      var imgElement = new Image();
      imgElement.src = reader.result;

      // Füge das Bild und die Beschreibung als Popup zum Marker hinzu
      layer.bindPopup(`<h3>Hund</h3><p>${description}</p><img src="${reader.result}" alt="Hund" style="width: 100px; height: auto;" />`).openPopup();
    };
    reader.readAsDataURL(image);
    
    // Leere das Formular nach dem Absenden
    form.reset();
  };
});

