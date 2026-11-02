// Home page map: satellite view of the heritage sites. Pick a site, "Fly in" zooms the map down onto it
// and then opens its aerial view in the tour, where the arrows lead into the ground-level 360° places.
// Load after images.js (thumbnails) and assets/vendor/leaflet/leaflet.js.
(function () {
  const el = document.getElementById('heritage-map');
  if (!el || !window.L) return;

  // [lat, lng] from OpenStreetMap where available, otherwise read off the satellite map; scene = the tour scene to open
  const PLACES = [
    { name: 'Badshahi Mosque', at: [31.5881, 74.3094], scene: 'node64', note: 'Mughal mosque of 1673' },
    { name: "Allama Iqbal's Tomb", at: [31.5879, 74.3113], scene: 'node64', note: 'Beside the mosque steps' },
    { name: 'Hazuri Bagh', at: [31.5884, 74.3118], scene: 'node57', note: 'Garden with the marble Baradari' },
    { name: 'Lahore Fort', at: [31.5876, 74.3152], scene: 'node65', note: 'Shahi Qila and Deewan-e-Aam' },
    { name: 'Deewan-e-Khas', at: [31.5891, 74.3143], scene: 'node60', note: 'Private audience hall in the fort' },
    { name: 'Minar-e-Pakistan', at: [31.5926, 74.3095], scene: 'node63', note: 'National monument, 1968' },
    { name: 'Greater Iqbal Park', at: [31.5935, 74.3130], scene: 'node61', note: 'The park around the Minar' },
    { name: 'Azadi Chowk', at: [31.5891, 74.3065], scene: 'node66', note: 'The roundabout west of the mosque' },
  ].filter(p => TOUR.scenes[p.scene]);

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.25, attributionControl: true });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20, maxNativeZoom: 19,
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
  }).addTo(map);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20, maxNativeZoom: 19, opacity: 0.9,
  }).addTo(map);
  // only zoom with the wheel after the map is clicked, so the page still scrolls normally
  map.on('click focus', () => map.scrollWheelZoom.enable());
  el.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

  const bounds = L.latLngBounds(PLACES.map(p => p.at));
  map.fitBounds(bounds, { padding: [40, 40] });

  function flyIn(p) {
    const go = () => {
      el.classList.add('map--leaving');
      setTimeout(() => { location.href = `tour.html#${p.scene}`; }, reduceMotion ? 0 : 450);
    };
    map.closePopup();
    if (reduceMotion) return go();
    map.once('moveend', go);
    map.flyTo(p.at, 18.5, { duration: 2.2 });
  }

  for (const p of PLACES) {
    const s = TOUR.scenes[p.scene];
    const icon = L.divIcon({
      className: 'map-pin',
      html: `<img src="${s.thumb}" alt=""><span></span>`,
      iconSize: [46, 46], iconAnchor: [23, 23], popupAnchor: [0, -26],
    });
    const card = document.createElement('div');
    card.className = 'map-card';
    card.innerHTML = `<img alt=""><b></b><small></small><button class="btn btn--primary btn--sm" type="button">Fly in ↘</button>`;
    card.querySelector('img').src = s.thumb;
    card.querySelector('b').textContent = p.name;
    card.querySelector('small').textContent = p.note;
    card.querySelector('button').onclick = () => flyIn(p);
    L.marker(p.at, { icon, title: p.name, keyboard: true }).addTo(map).bindPopup(card, { closeButton: false, minWidth: 220 });
  }

  // reset button: back to the view of all sites
  const reset = document.getElementById('map-reset');
  if (reset) reset.onclick = () => map.flyToBounds(bounds, { padding: [40, 40], duration: reduceMotion ? 0 : 1.2 });
})();
