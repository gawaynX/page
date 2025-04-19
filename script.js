const map = L.map('map', {
  center: [21.16481, -90.03910],
  zoom: 16,
  minZoom: 16,
  maxZoom: 20,
  zoomControl: true,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
}).addTo(map);

let currentLatLng = null;

map.on('click', function (e) {
  currentLatLng = e.latlng;
  document.getElementById('uploadPrompt').style.display = 'block';
});

window.handleUploadChoice = function (wantsToUpload) {
  document.getElementById('uploadPrompt').style.display = 'none';

  if (wantsToUpload) {
    const input = document.getElementById('fileInput');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        askNeutered().then((isNeutered) => {
          createImageMarker(reader.result, isNeutered);
          input.value = ''; // Reset input
        });
      };
      reader.readAsDataURL(file);
    };
  } else {
    askNeutered().then((isNeutered) => {
      const dogEmoji = '🐶';
      const icon = L.divIcon({
        html: `<div class="marker-icon ${isNeutered ? 'green-border' : ''}" style="font-size: 24px;">${dogEmoji}</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker(currentLatLng, { icon }).addTo(map);
      addMarkerPopup(marker);
    });
  }
};

function createImageMarker(imageSrc, isNeutered) {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    const icon = L.divIcon({
      html: `<img src="${imageSrc}" class="marker-icon ${isNeutered ? 'green-border' : ''}" width="40" height="40"/>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    const marker = L.marker(currentLatLng, { icon }).addTo(map);
    addMarkerPopup(marker);
  };
}

function askNeutered() {
  return new Promise((resolve) => {
    const popup = document.createElement('div');
    popup.className = 'custom-popup';
    popup.innerHTML = `
      <p>Ist der Hund kastriert?</p>
      <button id="yesBtn">Ja</button>
      <button id="noBtn">Nein</button>
    `;
    document.body.appendChild(popup);

    popup.querySelector('#yesBtn').onclick = () => {
      document.body.removeChild(popup);
      resolve(true);
    };
    popup.querySelector('#noBtn').onclick = () => {
      document.body.removeChild(popup);
      resolve(false);
    };
  });
}

function addMarkerPopup(marker) {
  marker.on('click', () => {
    const popup = document.createElement('div');
    popup.className = 'custom-popup';
    popup.innerHTML = `
      <p>Was möchtest du tun?</p>
      <button id="editBtn">Bearbeiten</button>
      <button id="deleteBtn">Löschen</button>
      <button id="cancelBtn">Abbrechen</button>
    `;
    document.body.appendChild(popup);

    popup.querySelector('#editBtn').onclick = () => {
      alert("Bearbeiten ist noch nicht implementiert.");
      document.body.removeChild(popup);
    };
    popup.querySelector('#deleteBtn').onclick = () => {
      map.removeLayer(marker);
      document.body.removeChild(popup);
    };
    popup.querySelector('#cancelBtn').onclick = () => {
      document.body.removeChild(popup);
    };
  });
}
