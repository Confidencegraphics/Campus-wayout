:root{
  --green:#0B3D2E;
  --green-light:#155843;
  --gold:#D4A017;
  --clay:#B33A3A;
  --indigo:#5B4B8A;
  --slate:#3B6E71;
  --cream:#F3EBDA;
  --cream-dim:#E7DEC8;
  --charcoal:#1C1C1C;
  --ink:#20241f;
  --line: rgba(28,28,28,0.12);
  --radius: 14px;
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  font-family:'Inter', sans-serif;
  background:var(--cream);
  color:var(--charcoal);
  -webkit-font-smoothing:antialiased;
}

@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.01ms !important; transition-duration:0.01ms !important;}
}

h1,h2,h3, .display{
  font-family:'Space Grotesk', sans-serif;
}

.mono{ font-family:'JetBrains Mono', monospace; letter-spacing:0.02em; }

/* ---------- App shell ---------- */
#app{
  display:grid;
  grid-template-columns: 380px 1fr;
  min-height:100vh;
}
@media (max-width: 880px){
  #app{ grid-template-columns: 1fr; }
}

/* ---------- Sidebar ---------- */
#sidebar{
  background:var(--green);
  color:var(--cream);
  display:flex;
  flex-direction:column;
  padding: 22px 20px 12px;
  min-height:100vh;
  position:relative;
  z-index:5;
}
@media (max-width: 880px){
  #sidebar{ min-height:auto; padding-bottom:8px; }
}

.brand{
  display:flex;
  align-items:baseline;
  gap:10px;
  margin-bottom:4px;
}
.brand .mark{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;height:34px;
  border:2px solid var(--gold);
  border-radius:6px;
  color:var(--gold);
  font-family:'Space Grotesk';
  font-weight:700;
  font-size:15px;
  flex:none;
}
.brand h1{
  font-size: 21px;
  font-weight:700;
  margin:0;
  color:var(--cream);
  line-height:1.15;
}
.brand .sub{
  font-size:11.5px;
  color:var(--gold);
  text-transform:uppercase;
  letter-spacing:0.12em;
  margin:2px 0 18px;
  font-family:'JetBrains Mono', monospace;
}

.search-wrap{
  position:relative;
  margin-bottom:14px;
}
#searchInput{
  width:100%;
  padding:12px 14px 12px 38px;
  border-radius:10px;
  border:1px solid rgba(243,235,218,0.25);
  background:rgba(0,0,0,0.18);
  color:var(--cream);
  font-family:'Inter';
  font-size:14.5px;
  outline:none;
  transition:border-color .15s, background .15s;
}
#searchInput::placeholder{ color:rgba(243,235,218,0.5); }
#searchInput:focus{
  border-color: var(--gold);
  background:rgba(0,0,0,0.28);
}
#searchInput:focus-visible{
  outline:2px solid var(--gold);
  outline-offset:1px;
}
.search-wrap svg{
  position:absolute;
  left:12px; top:50%;
  transform:translateY(-50%);
  opacity:0.6;
  pointer-events:none;
}

.chips{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
  margin-bottom:16px;
}
.chip{
  border:1px solid rgba(243,235,218,0.28);
  background:transparent;
  color:var(--cream);
  padding:6px 12px;
  border-radius:999px;
  font-size:12.5px;
  font-family:'Inter';
  font-weight:600;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:6px;
  transition: all .15s;
}
.chip .dot{ width:7px; height:7px; border-radius:50%; flex:none; }
.chip:hover{ border-color: var(--gold); }
.chip:focus-visible{ outline:2px solid var(--gold); outline-offset:2px; }
.chip.active{
  background: var(--gold);
  border-color: var(--gold);
  color: var(--green);
}

.list-label{
  font-family:'JetBrains Mono', monospace;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:0.1em;
  color:rgba(243,235,218,0.55);
  margin: 4px 0 8px;
  display:flex;
  justify-content:space-between;
}

#list{
  overflow-y:auto;
  flex:1;
  margin: 0 -20px;
  padding: 0 20px;
  min-height:180px;
}
#list::-webkit-scrollbar{ width:6px; }
#list::-webkit-scrollbar-thumb{ background:rgba(243,235,218,0.25); border-radius:4px; }

.place-card{
  width:100%;
  text-align:left;
  background: rgba(243,235,218,0.05);
  border:1px solid rgba(243,235,218,0.12);
  border-radius:10px;
  padding:11px 12px;
  margin-bottom:8px;
  cursor:pointer;
  color:var(--cream);
  font-family:'Inter';
  display:flex;
  align-items:flex-start;
  gap:10px;
  transition: background .15s, border-color .15s, transform .1s;
}
.place-card:hover{ background: rgba(243,235,218,0.11); }
.place-card:focus-visible{ outline:2px solid var(--gold); outline-offset:1px; }
.place-card.selected{
  background: rgba(212,160,23,0.16);
  border-color: var(--gold);
}
.place-card .swatch{
  width:9px; height:9px; border-radius:50%;
  margin-top:5px; flex:none;
}
.place-card .info{ flex:1; min-width:0; }
.place-card .name{ font-weight:600; font-size:14px; }
.place-card .cat{
  font-size:11px; color:rgba(243,235,218,0.6);
  font-family:'JetBrains Mono', monospace;
  margin-top:1px;
}
.place-card .dist{
  font-size:11px;
  color: var(--gold);
  font-family:'JetBrains Mono', monospace;
  white-space:nowrap;
  margin-left:auto;
  flex:none;
  align-self:center;
}

.empty-msg{
  color:rgba(243,235,218,0.5);
  font-size:13px;
  padding:20px 4px;
  text-align:center;
}

#sidebarFoot{
  font-size:11px;
  color:rgba(243,235,218,0.4);
  padding-top:10px;
  border-top:1px solid rgba(243,235,218,0.12);
  font-family:'JetBrains Mono', monospace;
}

/* ---------- Main / Map area ---------- */
#main{
  position:relative;
  display:flex;
  flex-direction:column;
  background:
    radial-gradient(circle at 15% 10%, rgba(11,61,46,0.05), transparent 45%),
    var(--cream);
}

#mapToolbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 16px 24px 6px;
  gap:12px;
  flex-wrap:wrap;
}
#mapToolbar h2{
  font-size:16px;
  margin:0;
  color:var(--green);
}
#mapToolbar .hint{
  font-size:11.5px;
  color:#6b6659;
  font-family:'JetBrains Mono', monospace;
}

.view-toggle{
  display:flex;
  background:#EAE1C8;
  border-radius:10px;
  padding:3px;
  gap:2px;
}
.view-toggle button{
  border:none;
  background:transparent;
  padding:7px 14px;
  border-radius:8px;
  font-family:'Inter';
  font-weight:600;
  font-size:12.5px;
  color:#6b6659;
  cursor:pointer;
  transition: all .15s;
}
.view-toggle button.active{
  background: var(--green);
  color: var(--cream);
}
.view-toggle button:focus-visible{ outline:2px solid var(--green); outline-offset:2px; }

#mapWrap{
  flex:1;
  padding: 6px 24px 24px;
  display:flex;
  position:relative;
}
#mapCard{
  flex:1;
  background:#FBF8F1;
  border:1px solid var(--line);
  border-radius: var(--radius);
  position:relative;
  overflow:hidden;
  box-shadow: 0 1px 0 rgba(28,28,28,0.03);
}
svg#campusMap{
  width:100%;
  height:100%;
  display:block;
  min-height:420px;
}

#liveMapCard{
  flex:1;
  background:#FBF8F1;
  border:1px solid var(--line);
  border-radius: var(--radius);
  position:relative;
  overflow:hidden;
  display:none;
}
#liveMap{ width:100%; height:100%; min-height:420px; }

.road{
  fill:none;
  stroke:#D9D0B8;
  stroke-width:10;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.road-center{
  fill:none;
  stroke:#F3EBDA;
  stroke-width:1.5;
  stroke-dasharray:6 7;
  stroke-linecap:round;
}

.route-path{
  fill:none;
  stroke: var(--gold);
  stroke-width:4.5;
  stroke-linecap:round;
  stroke-linejoin:round;
  stroke-dasharray: 10 9;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.15));
}

.zone-label{
  font-family:'JetBrains Mono', monospace;
  font-size:10.5px;
  fill:#9b9481;
  letter-spacing:0.08em;
  text-transform:uppercase;
}

.pin{ cursor:pointer; }
.pin .signpost{
  transition: transform .15s ease;
  transform-origin: center bottom;
}
.pin:hover .signpost, .pin.active .signpost{
  transform: translateY(-3px);
}
.pin .signpost-bg{ transition: fill .15s; }
.pin text{
  font-family:'Inter';
  font-weight:600;
  fill:#fff;
  pointer-events:none;
}
.pin .plabel{
  font-family:'Space Grotesk';
  font-weight:600;
  font-size:11px;
  fill: var(--charcoal);
  pointer-events:none;
}

.start-marker circle{
  fill: var(--green);
  stroke:#fff;
  stroke-width:2.5;
}
.start-pulse{
  fill:none;
  stroke: var(--green);
  stroke-width:2;
  opacity:0.5;
  animation: pulse 2.2s ease-out infinite;
  transform-origin: center;
}
@keyframes pulse{
  0%{ transform:scale(0.6); opacity:0.55; }
  100%{ transform:scale(2.6); opacity:0; }
}

/* ---------- Detail panel (shared) ---------- */
#detailPanel{
  position:absolute;
  right:20px; bottom:20px;
  width: 300px;
  max-width: calc(100% - 40px);
  background: var(--green);
  color:var(--cream);
  border-radius: var(--radius);
  padding:18px;
  box-shadow: 0 10px 30px rgba(11,61,46,0.35);
  transform: translateY(12px);
  opacity:0;
  pointer-events:none;
  transition: transform .22s ease, opacity .22s ease;
  z-index:20;
}
#detailPanel.show{
  transform: translateY(0);
  opacity:1;
  pointer-events:auto;
}
#detailPanel .catTag{
  display:inline-block;
  font-family:'JetBrains Mono', monospace;
  font-size:10.5px;
  text-transform:uppercase;
  letter-spacing:0.08em;
  padding:3px 8px;
  border-radius:5px;
  margin-bottom:8px;
}
#detailPanel h3{
  margin:0 0 6px;
  font-size:18px;
}
#detailPanel p{
  margin:0 0 12px;
  font-size:13px;
  line-height:1.5;
  color:rgba(243,235,218,0.85);
}
#detailPanel .stats{
  display:flex;
  gap:14px;
  margin-bottom:14px;
}
#detailPanel .stat .num{
  font-family:'Space Grotesk';
  font-weight:700;
  font-size:18px;
  color:var(--gold);
  line-height:1;
}
#detailPanel .stat .lab{
  font-size:10px;
  font-family:'JetBrains Mono', monospace;
  color:rgba(243,235,218,0.55);
  text-transform:uppercase;
  margin-top:3px;
}
#detailPanel .actions{ display:flex; gap:8px; flex-wrap:wrap; }
#detailPanel button{
  font-family:'Inter'; font-weight:600; font-size:12.5px;
  border-radius:8px; border:none; padding:9px 12px; cursor:pointer;
}
#detailPanel .btn-primary{ background:var(--gold); color:var(--green); flex:1; min-width:120px; }
#detailPanel .btn-close{ background:rgba(243,235,218,0.12); color:var(--cream); }
#detailPanel button:focus-visible{ outline:2px solid var(--gold); outline-offset:2px;}

#compass{
  position:absolute; left:20px; bottom:20px;
  font-family:'JetBrains Mono', monospace;
  font-size:11px;
  color:#8a8471;
  display:flex; align-items:center; gap:6px;
  z-index:5;
}

/* ---------- Live navigation HUD ---------- */
#hudStack{
  position:absolute;
  top:16px; left:16px; right:16px;
  z-index:30;
  display:flex;
  flex-direction:column;
  gap:10px;
  pointer-events:none;
}
#hudStack > *{ pointer-events:auto; }
#navHud{
  background: rgba(11,61,46,0.94);
  color:var(--cream);
  border-radius: 12px;
  padding:14px 16px;
  display:none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}
#navHud.show{ display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
#navHud .navInfo{ flex:1; min-width:160px; }
#navHud .navTitle{ font-family:'Space Grotesk'; font-weight:700; font-size:14.5px; }
#navHud .navSub{ font-family:'JetBrains Mono', monospace; font-size:11px; color:rgba(243,235,218,0.65); margin-top:2px; }
#navHud .navStats{ display:flex; gap:16px; }
#navHud .navStats .n{ font-family:'Space Grotesk'; font-weight:700; font-size:17px; color:var(--gold); }
#navHud .navStats .l{ font-size:9.5px; font-family:'JetBrains Mono', monospace; color:rgba(243,235,218,0.55); text-transform:uppercase; }
#navHud .navBar{
  width:100%;
  height:6px;
  background:rgba(243,235,218,0.15);
  border-radius:4px;
  overflow:hidden;
  margin-top:10px;
  order:9;
}
#navHud .navBarFill{
  height:100%;
  width:0%;
  background: var(--gold);
  transition: width .4s ease;
}
#navHud .navStop{
  background:rgba(243,235,218,0.14);
  color:var(--cream);
  border:none;
  border-radius:7px;
  padding:7px 10px;
  font-family:'Inter'; font-weight:600; font-size:12px;
  cursor:pointer;
}
#navHud.arrived{ background: rgba(212,160,23,0.96); color:var(--green); }
#navHud.arrived .navSub, #navHud.arrived .navStats .l{ color: rgba(11,61,46,0.65); }
#navHud.arrived .navStats .n{ color: var(--green); }

#locNotice{
  background: #fff8e6;
  border:1px solid #e8d18f;
  color:#6b5a1c;
  font-size:12.5px;
  padding:10px 14px;
  border-radius:10px;
  display:none;
  line-height:1.4;
}
#locNotice.show{ display:block; }
#locNotice button{
  background:none; border:none; color:var(--green); font-weight:700;
  cursor:pointer; text-decoration:underline; font-size:12.5px; padding:0; margin-left:4px;
}

.leaflet-container{ font-family:'Inter', sans-serif; background:#EFEADA; }
.knust-popup .leaflet-popup-content-wrapper{
  background: var(--green); color:var(--cream); border-radius:10px;
}
.knust-popup .leaflet-popup-tip{ background: var(--green); }
.popup-name{ font-family:'Space Grotesk'; font-weight:700; font-size:14px; margin-bottom:2px; }
.popup-cat{ font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--gold); margin-bottom:8px; }
.popup-btn{
  background: var(--gold); color:var(--green); border:none; border-radius:6px;
  padding:6px 10px; font-family:'Inter'; font-weight:700; font-size:11.5px; cursor:pointer;
}
.you-are-here-dot{
  width:16px; height:16px; border-radius:50%;
  background:#2E7DFF; border:3px solid #fff;
  box-shadow: 0 0 0 4px rgba(46,125,255,0.25);
}
.you-are-here-wrap{ position:relative; }
.you-are-here-pulse{
  position:absolute; inset:-14px;
  border-radius:50%;
  background: rgba(46,125,255,0.35);
  animation: youpulse 1.8s ease-out infinite;
}
@keyframes youpulse{
  0%{ transform:scale(0.4); opacity:0.6; }
  100%{ transform:scale(1.6); opacity:0; }
}
.walker-dot{
  width:18px; height:18px; border-radius:50%;
  background: var(--gold); border:3px solid var(--green);
  box-shadow: 0 2px 6px rgba(0,0,0,0.35);
}

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
  const categories = ['All', 'Lecture Halls', 'Hostels', 'Library', 'Offices & Services', 'Landmarks'];
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
  // Coordinates targeted directly over KNUST Campus
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

      const customLiveIcon = L.divIcon({
        className: 'you-are-here-wrap',
        html: '<div class="you-are-here-pulse"></div><div class="you-are-here-dot"></div>',
        iconSize:,
        iconAnchor: [8, 8]
      });

      if (liveLocationMarker) {
        liveLocationMarker.setLatLng([currentLatitude, currentLongitude]);
        liveAccuracyCircle.setLatLng([currentLatitude, currentLongitude]).setRadius(positionalAccuracy);
      } else {
        liveLocationMarker = L.marker([currentLatitude, currentLongitude], { icon: customLiveIcon }).addTo(leafletMap);
        liveAccuracyCircle = L.circle([currentLatitude, currentLongitude], { radius: positionalAccuracy, color: '#2E7DFF', weight: 1, fillOpacity: 0.08 }).addTo(leafletMap);
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

  // Clone route button to ensure event listeners do not stack up
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
