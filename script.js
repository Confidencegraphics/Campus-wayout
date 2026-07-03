// ==========================================
// 1. DATA: CAMPUS LOCATIONS
// ==========================================
const campusLocations = [
  { id: 'registrar', name: "Registrar's Office", cat: 'Offices & Services', lat: 6.6742, lng: -1.5714, dist: 437, desc: 'Central administrative department for university governance and records.' },
  { id: 'gcb', name: 'GCB Bank, Campus Branch', cat: 'Offices & Services', lat: 6.6749, lng: -1.5682, dist: 510, desc: 'On-campus financial branch providing banking services to students.' },
  { id: 'greathall', name: 'Great Hall', cat: 'Landmarks', lat: 6.6740, lng: -1.5675, dist: 518, desc: 'The iconic monumental auditorium for university assemblies and events.' },
  { id: 'international', name: 'International Programmes Office', cat: 'Offices & Services', lat: 6.6755, lng: -1.5695, dist: 536, desc: 'Hub for international student relations and academic exchange programs.' },
  { id: 'students', name: 'Students Affairs Office', cat: 'Offices & Services', lat: 6.6755, lng: -1.5695, dist: 536, desc: 'Welfare and advisory service headquarters for the student body.' },
  { id: 'hospital', name: 'KNUST Hospital', cat: 'Offices & Services', lat: 6.6720, lng: -1.5740, dist: 536, desc: 'Primary healthcare center providing medical services to the campus community.' },
  { id: 'bookshop', name: 'University Bookshop', cat: 'Offices & Services', lat: 6.6755, lng: -1.5695, dist: 536, desc: 'Official campus store for text materials, stationery, and research items.' },
  { id: 'unity', name: 'Unity Hall', cat: 'Hostels', lat: 6.6811, lng: -1.5725, dist: 552, desc: 'Largest all-male residential tower hall on campus, famously known as Conti.' },
  { id: 'prempeh', name: 'Prempeh II Library', cat: 'Library', lat: 6.6765, lng: -1.5688, dist: 561, desc: 'The main academic research library vault situated at the campus center.' },
  { id: 'conference', name: 'Conference Centre', cat: 'Landmarks', lat: 6.6710, lng: -1.5710, dist: 575, desc: 'Modern multipurpose venue designed for academic symposiums and summits.' }
];

const categoryColors = {
  'Offices & Services': '#3B6E71',
  'Landmarks': '#B33A3A',
  'Hostels': '#D4A017',
  'Library': '#5B4B8A'
};

// ==========================================
// 2. INITIALIZE SIDEBAR LOCATION LIST
// ==========================================
let currentCategoryFilter = 'All';
const listContainer = document.getElementById('list');
const chipsContainer = document.getElementById('chips');

function renderChips() {
  const categories = ['All', 'Hostels', 'Library', 'Offices & Services', 'Landmarks'];
  chipsContainer.innerHTML = '';
  
  categories.forEach(cat => {
    const isActive = currentCategoryFilter === cat;
    const button = document.createElement('button');
    button.className = `chip ${isActive ? 'active' : ''}`;
    
    let dotHtml = '';
    if (categoryColors[cat]) {
      dotHtml = `<span class="dot" style="background:${categoryColors[cat]}"></span>`;
    }
    
    button.innerHTML = `${dotHtml}${cat}`;
    button.addEventListener('click', () => {
      currentCategoryFilter = cat;
      renderChips();
      renderLocations();
    });
    chipsContainer.appendChild(button);
  });
}

function renderLocations(filterText = '') {
  listContainer.innerHTML = '';
  
  const filtered = campusLocations.filter(loc => {
    const matchesCategory = currentCategoryFilter === 'All' || loc.cat === currentCategoryFilter;
    const matchesSearch = loc.name.toLowerCase().includes(filterText.toLowerCase()) || 
                          loc.cat.toLowerCase().includes(filterText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  document.getElementById('listCount').textContent = `${filtered.length} locations`;

  if (filtered.length === 0) {
    listContainer.innerHTML = '<div class="empty-msg">No campus locations match your criteria.</div>';
    return;
  }

  filtered.forEach(loc => {
    const color = categoryColors[loc.cat] || '#8a8471';
    const card = document.createElement('button');
    card.className = 'place-card';
    card.innerHTML = `
      <span class="swatch" style="background:${color}"></span>
      <div class="info">
        <div class="name">${loc.name}</div>
        <div class="cat">${loc.cat}</div>
      </div>
      <div class="dist">${loc.dist}m</div>
    `;
    card.addEventListener('click', () => showDetailPanel(loc));
    listContainer.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderLocations(e.target.value);
});

// ==========================================
// 3. INTERACTIVE SHIFT VIEW MANAGER (Tabs)
// ==========================================
const tabSchematic = document.getElementById('tabSchematic');
const tabLive = document.getElementById('tabLive');
const mapCard = document.getElementById('mapCard');
const liveMapCard = document.getElementById('liveMapCard');
const mapHint = document.getElementById('mapHint');

let leafletMap = null;

function switchViewTab(targetView) {
  if (targetView === 'live') {
    tabSchematic.classList.remove('active');
    tabLive.classList.add('active');
    mapCard.style.display = 'none';
    liveMapCard.style.display = 'block';
    mapHint.textContent = 'real-time map · uses your device location';
    
    if (!leafletMap) {
      initMap();
    } else {
      setTimeout(() => { leafletMap.invalidateSize(); }, 200);
    }
    startUserTracking();
  } else {
    tabLive.classList.remove('active');
    tabSchematic.classList.add('active');
    liveMapCard.style.display = 'none';
    mapCard.style.display = 'block';
    mapHint.textContent = 'illustrative map · not to scale';
  }
}

tabSchematic.addEventListener('click', () => switchViewTab('schematic'));
tabLive.addEventListener('click', () => switchViewTab('live'));

// ==========================================
// 4. LEAFLET ENGINE BASELINE FACTORY
// ==========================================
function initMap() {
  leafletMap = L.map('liveMap', { zoomControl: false }).setView([6.6745, -1.5716], 15);
  L.control.zoom({ position: 'bottomleft' }).addTo(leafletMap);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(leafletMap);

  campusLocations.forEach(loc => {
    const customPopup = `
      <div class="knust-popup">
        <div class="popup-name">${loc.name}</div>
        <div class="popup-cat">${loc.cat}</div>
        <button class="popup-btn" onclick="startNavigationTo('${loc.id}')">Navigate Here</button>
      </div>
    `;
    L.marker([loc.lat, loc.lng]).addTo(leafletMap).bindPopup(customPopup);
  });
}

// ==========================================
// 5. GPS GEOLOCATION & GEOPOSITION TRACKING
// ==========================================
let trackingWatchId = null;
let liveLocationMarker = null;
let liveAccuracyCircle = null;
let activeTargetDestination = null;

function startUserTracking() {
  const noticeBox = document.getElementById('locNotice');

  if (!navigator.geolocation) {
    noticeBox.textContent = "Your hardware or web browser lacks live tracking capability.";
    noticeBox.classList.add('show');
    return;
  }

  if (trackingWatchId !== null) return;

  trackingWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const currentLatitude = pos.coords.latitude;
      const currentLongitude = pos.coords.longitude;
      const positionalAccuracy = pos.coords.accuracy;

      noticeBox.classList.remove('show');

      // FIXED: Swapped out L.divIcon completely for native circle shapes to prevent property stripping
      if (liveLocationMarker) {
        liveLocationMarker.setLatLng([currentLatitude, currentLongitude]);
        liveAccuracyCircle.setLatLng([currentLatitude, currentLongitude]).setRadius(positionalAccuracy);
      } else {
        liveLocationMarker = L.circleMarker([currentLatitude, currentLongitude], {
          radius: 9,
          fillColor: '#2E7DFF',
          color: '#FFFFFF',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(leafletMap);

        liveAccuracyCircle = L.circle([currentLatitude, currentLongitude], { 
          radius: positionalAccuracy, 
          color: '#2E7DFF', 
          weight: 1, 
          fillOpacity: 0.08 
        }).addTo(leafletMap);

        leafletMap.setView([currentLatitude, currentLongitude], 16);
      }

      if (activeTargetDestination) {
        computeNavigationHUD(currentLatitude, currentLongitude);
      }
    },
    (err) => {
      console.warn("GPS tracking access denied: ", err.message);
      noticeBox.classList.add('show');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

// ==========================================
// 6. REAL-TIME NAVIGATION HUD CONTROLLER
// ==========================================
const detailPanel = document.getElementById('detailPanel');

function showDetailPanel(location) {
  document.getElementById('dpCat').textContent = location.cat;
  document.getElementById('dpCat').style.background = categoryColors[location.cat] || '#8a8471';
  document.getElementById('dpName').textContent = location.name;
  document.getElementById('dpDesc').textContent = location.desc;
  document.getElementById('dpDist').textContent = location.dist;
  document.getElementById('dpTime').textContent = Math.ceil(location.dist / 80);

  detailPanel.classList.add('show');

  const routeBtn = document.getElementById('dpRoute');
  const freshBtn = routeBtn.cloneNode(true);
  routeBtn.parentNode.replaceChild(freshBtn, routeBtn);
  
  freshBtn.addEventListener('click', () => {
    startNavigationTo(location.id);
    detailPanel.classList.remove('show');
  });
}

document.getElementById('dpClose').addEventListener('click', () => {
  detailPanel.classList.remove('show');
});

window.startNavigationTo = function(locId) {
  activeTargetDestination = campusLocations.find(l => l.id === locId);
