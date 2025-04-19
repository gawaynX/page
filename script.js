let userMarkers = [];

const map = L.map('map', {
  center: [21.16481, -90.03910],
  zoom: 16,
  minZoom: 16,
  maxZoom: 20,
  maxBounds: [
    [21.158, -90.047],
    [21.172, -90.031]
  ]
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function askKastriert(callback) {
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <p>Wurde der Hund kastriert?</p>
    <button id="yesBtn">Ja</button>
    <button id="noBtn">Nein</button>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#yesBtn').onclick = () => {
    document.body.removeChild(modal);
    callback(true);
  };

  modal.querySelector('#noBtn').onclick = () => {
    document.body.removeChild(modal);
    callback(false);
  };
}

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
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';

      fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
          askKastriert(function (kastriert) {
            const newIcon = L.icon({
              iconUrl: event.target.result,
              iconSize: [50, 50],
              className: kastriert ? 'green-border' : ''
            });
            marker.setIcon(newIcon);
          });
        };
        reader.readAsDataURL(file);
      };

      fileInput.click();
    } else if (action === '2') {
      map.removeLayer(marker);
      userMarkers = userMarkers.filter(m => m !== marker);
    }
  });

  return marker;
}

map.on('click', function (e) {
  const wantsImage = confirm('Möchtest du ein Bild an dieser Stelle hochladen?');
  if (wantsImage) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = function () {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        askKastriert(function (kastriert) {
          createMarker(e.latlng, event.target.result, kastriert);
        });
      };
      reader.readAsDataURL(file);
    };

    fileInput.click();
  } else {
    const emojiUrl = 'https://twemoji.maxcdn.com/v/latest/72x72/1f436.png';
    askKastriert(function (kastriert) {
      createMarker(e.latlng, emojiUrl, kastriert);
    });
  }
});
