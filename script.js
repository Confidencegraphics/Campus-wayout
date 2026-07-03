(function(){

  /* ---------------- DATA ---------------- */

  const CATEGORIES = [
    { id:'lecture',  label:'Lecture Halls', color:'#D4A017' },
    { id:'hostel',   label:'Hostels',       color:'#B33A3A' },
    { id:'library',  label:'Library',       color:'#5B4B8A' },
    { id:'office',   label:'Offices & Services', color:'#3B6E71' },
    { id:'landmark', label:'Landmarks',     color:'#0B3D2E' },
  ];
  const catMap = Object.fromEntries(CATEGORIES.map(c=>[c.id,c]));

  // Junctions used to build believable walking routes from the Main Gate (schematic grid, 0-1000 x 0-640)
  const GATE = [500, 600];
  const J1 = [500, 470];
  const J2 = [500, 330];
  const J3 = [500, 180];
  const JW1 = [250, 470];
  const JW2 = [250, 330];
  const JE1 = [750, 470];
  const JE2 = [750, 330];

  const LOCATIONS = [
    { id:'unity',    name:'Unity Hall',            cat:'hostel', x:150, y:470, desc:'Traditional hall of residence on the western side of campus, a short walk from the main lecture areas.', route:[GATE,J1,JW1,[150,470]] },
    { id:'africa',   name:'Africa Hall',            cat:'hostel', x:150, y:400, desc:'Mixed hall known for its strong cultural night and inter-hall sports teams.', route:[GATE,J1,JW1,[150,400]] },
    { id:'indep',    name:'Independence Hall',      cat:'hostel', x:150, y:540, desc:'One of the older halls, popular for its central common room and courtyard.', route:[GATE,J1,JW1,[150,540]] },
    { id:'queens',   name:'Queens Hall',            cat:'hostel', x:100, y:400, desc:"Hall of residence for female students, with its own dining hall and clinic annex.", route:[GATE,J1,JW1,[100,400]] },
    { id:'katanga',  name:'University Hall (Katanga)', cat:'hostel', x:100, y:540, desc:'Known on campus simply as "Katanga" — famous for spirited hall week celebrations.', route:[GATE,J1,JW1,[100,540]] },
    { id:'republic', name:'Republic Hall',          cat:'hostel', x:100, y:470, desc:'Quiet residential hall with easy footpath access to the sports stadium.', route:[GATE,J1,JW1,[100,470]] },

    { id:'eng',   name:'College of Engineering',        cat:'lecture', x:200, y:260, desc:'Lecture theatres and labs for all engineering departments — look for Auditorium 1 and 2.', route:[GATE,J1,J2,JW2,[200,260]] },
    { id:'sci',   name:'College of Science',             cat:'lecture', x:200, y:330, desc:'Home to Physics, Chemistry and Biological Sciences lecture halls and labs.', route:[GATE,J1,J2,JW2,[200,330]] },
    { id:'ksb',   name:'KNUST School of Business (KSB)', cat:'lecture', x:800, y:330, desc:'Business lecture theatres, seminar rooms, and the KSB computer lab.', route:[GATE,J1,J2,JE2,[800,330]] },
    { id:'cabe',  name:'College of Art & Built Environment', cat:'lecture', x:800, y:260, desc:'Studios and lecture rooms for Architecture, Planning and Fine Art students.', route:[GATE,J1,J2,JE2,[800,260]] },

    { id:'library', name:'Prempeh II Library', cat:'library', x:650, y:430, desc:'The central university library — main reading rooms, e-library, and postgraduate study area.', route:[GATE,J1,JE1,[650,430]] },

    { id:'registrar', name:"Registrar's Office", cat:'office', x:750, y:470, desc:'Handles admissions letters, transcripts, and official student records.', route:[GATE,J1,JE1,[750,470]] },
    { id:'ipo',        name:'International Programmes Office', cat:'office', x:800, y:540, desc:'First stop for international students — visas, orientation and exchange programmes.', route:[GATE,J1,JE1,[800,540]] },
    { id:'saf',        name:'Students Affairs Office', cat:'office', x:700, y:540, desc:'Support for accommodation issues, welfare, and student ID matters.', route:[GATE,J1,JE1,[700,540]] },
    { id:'bank',       name:'GCB Bank, Campus Branch', cat:'office', x:750, y:400, desc:'On-campus banking hall with ATMs, used for fees and everyday transactions.', route:[GATE,J1,JE1,[750,400]] },
    { id:'clinic',     name:'KNUST Hospital', cat:'office', x:800, y:400, desc:'University hospital providing outpatient care for students and staff.', route:[GATE,J1,JE1,[800,400]] },
    { id:'bookshop',   name:'University Bookshop', cat:'office', x:700, y:400, desc:'Textbooks, stationery and branded KNUST merchandise.', route:[GATE,J1,JE1,[700,400]] },

    { id:'greathall', name:'Great Hall', cat:'landmark', x:500, y:150, desc:'The iconic domed hall used for congregations, matriculation and graduation ceremonies.', route:[GATE,J1,J2,J3,[500,150]] },
    { id:'conf',       name:'Conference Centre', cat:'landmark', x:420, y:180, desc:'Hosts university conferences, large seminars and public lectures.', route:[GATE,J1,J2,J3,[420,180]] },
  ];

  const METERS_PER_UNIT = 1.15;
  const WALK_M_PER_MIN = 80;

  function pathLength(pts){
    let d=0;
    for(let i=1;i<pts.length;i++){
      const dx=pts[i][0]-pts[i-1][0], dy=pts[i][1]-pts[i-1][1];
      d += Math.sqrt(dx*dx+dy*dy);
    }
    return d;
  }
  LOCATIONS.forEach(l=>{
    l.units = pathLength(l.route);
    l.meters = Math.round(l.units*METERS_PER_UNIT);
    l.mins = Math.max(1, Math.round(l.meters/WALK_M_PER_MIN));
  });
  LOCATIONS.sort((a,b)=>a.meters-b.meters);

  /* ---------------- Real-world coordinates ---------------------------------
     KNUST's verified campus coordinate is 6.673175, -1.565423 (Accra Road,
     Kumasi). Individual buildings don't have public per-building GPS data,
     so each location's lat/lng is derived by offsetting from a real anchor
     point (the Main Gate, placed just south of that verified centroid) using
     the same relative layout as the schematic map. Positions are therefore
     realistic and roughly-scaled, but approximate — good for a working demo,
     not survey-grade. --------------------------------------------------- */
  const GATE_LATLNG = { lat: 6.6738, lng: -1.5676 };
  const EARTH_LAT_M = 111320;
  const EARTH_LNG_M = 111320 * Math.cos(GATE_LATLNG.lat * Math.PI/180);

  function xyToLatLng(x,y){
    const dxM = (x - GATE[0]) * METERS_PER_UNIT;
    const dyM = (y - GATE[1]) * METERS_PER_UNIT; // +y is south in our grid
    return {
      lat: GATE_LATLNG.lat - (dyM / EARTH_LAT_M),
      lng: GATE_LATLNG.lng + (dxM / EARTH_LNG_M)
    };
  }
  function latLngDistance(a,b){
    const dLat = (b.lat-a.lat) * EARTH_LAT_M;
    const dLng = (b.lng-a.lng) * EARTH_LNG_M;
    return Math.sqrt(dLat*dLat + dLng*dLng);
  }

  LOCATIONS.forEach(l=>{ l.latlng = xyToLatLng(l.x, l.y); });
  LOCATIONS.forEach(l=>{ l.routeLatLng = l.route.map(p=>xyToLatLng(p[0],p[1])); });

  /* ---------------- STATE ---------------- */
  let activeCats = new Set(CATEGORIES.map(c=>c.id));
  let query = '';
  let selectedId = null;
  let routeShownId = null;
  let currentView = 'schematic'; // 'schematic' | 'live'

  /* ---------------- DOM refs ---------------- */
  const chipsEl = document.getElementById('chips');
  const listEl = document.getElementById('list');
  const listCountEl = document.getElementById('listCount');
  const svg = document.getElementById('campusMap');
  const searchInput = document.getElementById('searchInput');
  const detailPanel = document.getElementById('detailPanel');
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  const mapCard = document.getElementById('mapCard');
  const liveMapCard = document.getElementById('liveMapCard');
  const tabSchematic = document.getElementById('tabSchematic');
  const tabLive = document.getElementById('tabLive');
  const mapHint = document.getElementById('mapHint');

  /* ---------------- Build category chips ---------------- */
  function renderChips(){
    chipsEl.innerHTML = '';
    const allChip = document.createElement('button');
    allChip.className = 'chip' + (activeCats.size===CATEGORIES.length ? ' active':'');
    allChip.textContent = 'All';
    allChip.addEventListener('click', ()=>{
      activeCats = new Set(CATEGORIES.map(c=>c.id));
      renderChips(); renderList(); renderMap(); updateLiveMarkersVisibility();
    });
    chipsEl.appendChild(allChip);

    CATEGORIES.forEach(cat=>{
      const chip = document.createElement('button');
      chip.className = 'chip' + (activeCats.has(cat.id) && activeCats.size<CATEGORIES.length ? ' active':'');
      chip.innerHTML = `<span class="dot" style="background:${cat.color}"></span>${cat.label}`;
      chip.addEventListener('click', ()=>{
        if(activeCats.size===CATEGORIES.length){
          activeCats = new Set([cat.id]);
        } else if(activeCats.has(cat.id)){
          activeCats.delete(cat.id);
          if(activeCats.size===0) activeCats = new Set(CATEGORIES.map(c=>c.id));
        } else {
          activeCats.add(cat.id);
        }
        renderChips(); renderList(); renderMap(); updateLiveMarkersVisibility();
      });
      chipsEl.appendChild(chip);
    });
  }

  /* ---------------- Filtering ---------------- */
  function filtered(){
    const q = query.trim().toLowerCase();
    return LOCATIONS.filter(l=>{
      if(!activeCats.has(l.cat)) return false;
      if(q && !l.name.toLowerCase().includes(q) && !catMap[l.cat].label.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  /* ---------------- Sidebar list ---------------- */
  function renderList(){
    const items = filtered();
    listCountEl.textContent = items.length + (items.length===1 ? ' location' : ' locations');
    listEl.innerHTML = '';
    if(items.length===0){
      const p = document.createElement('div');
      p.className='empty-msg';
      p.textContent = 'No places match your search.';
      listEl.appendChild(p);
      return;
    }
    items.forEach(l=>{
      const card = document.createElement('button');
      card.className = 'place-card' + (l.id===selectedId ? ' selected':'');
      card.innerHTML = `
        <span class="swatch" style="background:${catMap[l.cat].color}"></span>
        <span class="info">
          <span class="name">${l.name}</span>
          <span class="cat">${catMap[l.cat].label}</span>
        </span>
        <span class="dist">${l.meters}m</span>
      `;
      card.addEventListener('click', ()=> selectLocation(l.id, true));
      listEl.appendChild(card);
    });
  }

  /* ---------------- Schematic map rendering ---------------- */
  function buildRoadNetwork(){
    return `
      <path class="road" d="M500,600 L500,150" />
      <path class="road" d="M500,470 L100,470" />
      <path class="road" d="M500,330 L200,330 L200,260" />
      <path class="road" d="M500,470 L100,470 L100,540" />
      <path class="road" d="M100,470 L100,400" />
      <path class="road" d="M500,470 L800,470" />
      <path class="road" d="M500,330 L800,330 L800,260" />
      <path class="road" d="M700,470 L700,540" />
      <path class="road" d="M700,470 L800,470 L800,540" />
      <path class="road" d="M700,470 L700,400 L800,400" />
      <path class="road" d="M500,180 L420,180" />
      <path class="road-center" d="M500,600 L500,150" />
    `;
  }
  function zoneLabels(){
    return `
      <text class="zone-label" x="60" y="620">MAIN GATE</text>
      <text class="zone-label" x="40" y="360">HALLS OF RESIDENCE</text>
      <text class="zone-label" x="140" y="230">ACADEMIC WEST</text>
      <text class="zone-label" x="740" y="230">ACADEMIC EAST</text>
      <text class="zone-label" x="640" y="360">SERVICES</text>
      <text class="zone-label" x="420" y="120">CENTRAL</text>
    `;
  }
  function signpostSVG(l, isActive){
    const color = catMap[l.cat].color;
    const initials = l.name.split(' ').filter(w=>/^[A-Z(]/.test(w)).slice(0,2).map(w=>w.replace(/[^A-Za-z]/g,'')[0]).join('') || l.name[0];
    return `
      <g class="pin ${isActive?'active':''}" data-id="${l.id}" tabindex="0" role="button" aria-label="${l.name}, ${catMap[l.cat].label}">
        <g class="signpost">
          <path class="signpost-bg" d="M-16,-38 h32 a4,4 0 0 1 4,4 v20 a4,4 0 0 1 -4,4 h-12 l-4,10 l-4,-10 h-12 a4,4 0 0 1 -4,-4 v-20 a4,4 0 0 1 4,-4 z"
                fill="${color}" stroke="#fff" stroke-width="1.5"/>
          <text x="0" y="-20" font-size="12" text-anchor="middle">${initials}</text>
        </g>
        <text class="plabel" x="0" y="16" text-anchor="middle">${l.name.length>16 ? l.name.slice(0,15)+'…' : l.name}</text>
      </g>
    `;
  }
  function startMarkerSVG(){
    return `
      <g class="start-marker" transform="translate(${GATE[0]},${GATE[1]})">
        <circle class="start-pulse" r="10"/>
        <circle r="9"/>
        <text x="0" y="4" text-anchor="middle" font-size="10" fill="#fff" font-family="Space Grotesk" font-weight="700">G</text>
        <text x="0" y="26" text-anchor="middle" font-size="11" fill="#5b5646" font-family="Space Grotesk" font-weight="600">Main Gate</text>
      </g>
    `;
  }
  function routeSVG(loc){
    if(!loc) return '';
    const d = loc.route.map((p,i)=> (i===0?'M':'L') + p[0] + ',' + p[1]).join(' ');
    return `<path class="route-path" id="routeLine" d="${d}"/>`;
  }
  function renderMap(){
    const items = filtered();
    const visibleIds = new Set(items.map(l=>l.id));

    let html = buildRoadNetwork() + zoneLabels();
    html += routeSVG(routeShownId ? LOCATIONS.find(l=>l.id===routeShownId) : null);
    html += startMarkerSVG();

    LOCATIONS.forEach(l=>{
      if(!visibleIds.has(l.id)) return;
      html += `<g transform="translate(${l.x},${l.y})">${signpostSVG(l, l.id===selectedId)}</g>`;
    });

    svg.innerHTML = html;

    const routeLine = document.getElementById('routeLine');
    if(routeLine){
      const len = routeLine.getTotalLength();
      routeLine.style.strokeDasharray = len;
      routeLine.style.strokeDashoffset = len;
      routeLine.getBoundingClientRect();
      routeLine.style.transition = 'stroke-dashoffset 0.9s ease';
      requestAnimationFrame(()=>{ routeLine.style.strokeDashoffset = 0; });
    }

    svg.querySelectorAll('.pin').forEach(pin=>{
      pin.addEventListener('click', ()=> selectLocation(pin.dataset.id, true));
      pin.addEventListener('keydown', (e)=>{
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); selectLocation(pin.dataset.id, true); }
      });
    });
  }

  /* ================= LIVE GPS MAP (Leaflet) ================= */
  let leafletMap = null;
  let placeMarkers = {};
  let youAreHereMarker = null;
  let accuracyCircle = null;
  let liveRouteLine = null;
  let liveRouteRemaining = null;
  let watchId = null;
  let navTargetId = null;
  let simTimer = null;
  let lastKnownPos = null; // {lat,lng} real or simulated

  function initLeaflet(){
    if(leafletMap) return;
    leafletMap = L.map('liveMap', { zoomControl:true, attributionControl:true })
      .setView([GATE_LATLNG.lat, GATE_LATLNG.lng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Main Gate marker
    const gateIcon = L.divIcon({
      className:'', html:'<div style="background:#0B3D2E;color:#F3EBDA;font:700 11px Space Grotesk,sans-serif;padding:4px 8px;border-radius:6px;border:2px solid #D4A017;white-space:nowrap;">Main Gate</div>',
      iconSize:null
    });
    L.marker([GATE_LATLNG.lat, GATE_LATLNG.lng], { icon: gateIcon }).addTo(leafletMap);

    LOCATIONS.forEach(l=>{
      const color = catMap[l.cat].color;
      const icon = L.divIcon({
        className:'',
        html:`<div style="width:14px;height:14px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>`,
        iconSize:[14,14], iconAnchor:[7,14]
      });
      const marker = L.marker([l.latlng.lat, l.latlng.lng], { icon }).addTo(leafletMap);
      marker.bindPopup(
        `<div class="popup-name">${l.name}</div><div class="popup-cat">${catMap[l.cat].label} · ${l.meters}m from gate</div><button class="popup-btn" data-id="${l.id}">Navigate here</button>`,
        { className:'knust-popup' }
      );
      marker.on('popupopen', (e)=>{
        const btn = e.popup._contentNode.querySelector('.popup-btn');
        if(btn) btn.addEventListener('click', ()=> {
          selectLocation(l.id, false);
          startNavigation(l.id);
        });
      });
      marker.on('click', ()=> selectLocation(l.id, false));
      placeMarkers[l.id] = marker;
    });
  }

  function updateLiveMarkersVisibility(){
    if(!leafletMap) return;
    const ids = new Set(filtered().map(l=>l.id));
    Object.entries(placeMarkers).forEach(([id, marker])=>{
      const should = ids.has(id);
      const has = leafletMap.hasLayer(marker);
      if(should && !has) marker.addTo(leafletMap);
      if(!should && has) leafletMap.removeLayer(marker);
    });
  }

  function ensureYouAreHere(latlng){
    if(!youAreHereMarker){
      const icon = L.divIcon({
        className:'',
        html:'<div class="you-are-here-wrap"><div class="you-are-here-pulse"></div><div class="you-are-here-dot"></div></div>',
        iconSize:[16,16], iconAnchor:[8,8]
      });
      youAreHereMarker = L.marker([latlng.lat, latlng.lng], { icon, zIndexOffset:1000 }).addTo(leafletMap);
    } else {
      youAreHereMarker.setLatLng([latlng.lat, latlng.lng]);
    }
  }

  function setAccuracyCircle(latlng, radiusM){
    if(accuracyCircle) leafletMap.removeLayer(accuracyCircle);
    accuracyCircle = L.circle([latlng.lat, latlng.lng], { radius:radiusM, color:'#2E7DFF', weight:1, fillOpacity:0.08 }).addTo(leafletMap);
  }

  function clearLiveRoute(){
    if(liveRouteLine){ leafletMap.removeLayer(liveRouteLine); liveRouteLine=null; }
    if(liveRouteRemaining){ leafletMap.removeLayer(liveRouteRemaining); liveRouteRemaining=null; }
  }

  function drawLiveRoute(fromLatLng, toLoc){
    clearLiveRoute();
    // straight-line "as the crow flies" guidance from current position, plus the
    // known footpath from the Main Gate for context.
    liveRouteRemaining = L.polyline(
      toLoc.routeLatLng.map(p=>[p.lat,p.lng]),
      { color:'#D4A017', weight:3, opacity:0.35, dashArray:'6 8' }
    ).addTo(leafletMap);
    liveRouteLine = L.polyline(
      [[fromLatLng.lat, fromLatLng.lng],[toLoc.latlng.lat, toLoc.latlng.lng]],
      { color:'#0B3D2E', weight:4, opacity:0.9, dashArray:'2 10', lineCap:'round' }
    ).addTo(leafletMap);
  }

  const navHud = document.getElementById('navHud');
  const navTitle = document.getElementById('navTitle');
  const navSub = document.getElementById('navSub');
  const navDist = document.getElementById('navDist');
  const navEta = document.getElementById('navEta');
  const navBarFill = document.getElementById('navBarFill');
  const locNotice = document.getElementById('locNotice');

  function startNavigation(id){
    const loc = LOCATIONS.find(l=>l.id===id);
    if(!loc) return;
    navTargetId = id;
    navStartRemainM = null;
    navHud.classList.remove('arrived');
    navHud.classList.add('show');
    navTitle.textContent = 'Navigating to ' + loc.name;
    navSub.textContent = 'Waiting for your position…';
    navDist.textContent = '—';
    navEta.textContent = '—';
    navBarFill.style.width = '0%';

    if(currentView!=='live') switchView('live');
    if(!leafletMap) initLeaflet();

    const startPos = lastKnownPos || GATE_LATLNG;
    drawLiveRoute(startPos, loc);
    leafletMap.fitBounds(L.latLngBounds([[startPos.lat,startPos.lng],[loc.latlng.lat,loc.latlng.lng]]), { padding:[60,60] });

    beginTracking();
  }

  let navStartRemainM = null; // distance-to-destination at the moment navigation began, used as the 100% baseline

  function stopNavigation(){
    navTargetId = null;
    navStartRemainM = null;
    navHud.classList.remove('show','arrived');
    clearLiveRoute();
    if(simTimer){ clearInterval(simTimer); simTimer=null; }
    if(watchId!==null){ navigator.geolocation.clearWatch(watchId); watchId=null; }
  }
  document.getElementById('navStopBtn').addEventListener('click', stopNavigation);

  function updateNavProgress(pos){
    if(!navTargetId) return;
    const loc = LOCATIONS.find(l=>l.id===navTargetId);
    if(!loc) return;
    const remainM = Math.round(latLngDistance(pos, loc.latlng));
    if(navStartRemainM === null) navStartRemainM = Math.max(remainM, 1);

    const progressPct = Math.max(0, Math.min(100, Math.round(100 * (1 - remainM / navStartRemainM))));

    navDist.textContent = remainM;
    navEta.textContent = Math.max(0, Math.round(remainM / WALK_M_PER_MIN));
    navBarFill.style.width = progressPct + '%';
    navSub.textContent = 'Live position updating…';

    drawLiveRoute(pos, loc);
    ensureYouAreHere(pos);

    if(remainM <= 25){
      navHud.classList.add('arrived');
      navTitle.textContent = '🎉 You have arrived at ' + loc.name;
      navSub.textContent = 'Destination reached';
      navBarFill.style.width = '100%';
      if(simTimer){ clearInterval(simTimer); simTimer=null; }
      if(watchId!==null){ navigator.geolocation.clearWatch(watchId); watchId=null; }
    }
  }

  function beginTracking(){
    if(!('geolocation' in navigator)){
      locNotice.classList.add('show');
      return;
    }
    locNotice.classList.remove('show');
    if(watchId!==null) navigator.geolocation.clearWatch(watchId);
    watchId = navigator.geolocation.watchPosition(
      (posEvt)=>{
        const pos = { lat: posEvt.coords.latitude, lng: posEvt.coords.longitude };
        lastKnownPos = pos;
        setAccuracyCircle(pos, posEvt.coords.accuracy || 20);
        updateNavProgress(pos);
      },
      (err)=>{
        locNotice.classList.add('show');
        navSub.textContent = 'Location unavailable — try simulating instead';
      },
      { enableHighAccuracy:true, maximumAge:4000, timeout:10000 }
    );
  }

  document.getElementById('tryLocBtn').addEventListener('click', beginTracking);
  document.getElementById('simFromNotice').addEventListener('click', ()=>{
    if(navTargetId) simulateWalk(navTargetId);
  });

  function simulateWalk(id){
    const loc = LOCATIONS.find(l=>l.id===id);
    if(!loc) return;
    if(!leafletMap) initLeaflet();
    if(currentView!=='live') switchView('live');
    locNotice.classList.remove('show');

    navTargetId = id;
    navStartRemainM = null;
    navHud.classList.remove('arrived');
    navHud.classList.add('show');
    navTitle.textContent = 'Simulating walk to ' + loc.name;

    if(simTimer) clearInterval(simTimer);
    if(watchId!==null){ navigator.geolocation.clearWatch(watchId); watchId=null; }

    const pts = loc.routeLatLng;
    const totalSteps = 220;
    // build cumulative distance along route for smooth stepping
    const segLens = [];
    let totalLen = 0;
    for(let i=1;i<pts.length;i++){
      const d = latLngDistance(pts[i-1], pts[i]);
      segLens.push(d); totalLen += d;
    }
    let step = 0;
    leafletMap.fitBounds(L.polyline(pts.map(p=>[p.lat,p.lng])).getBounds(), { padding:[60,60] });

    simTimer = setInterval(()=>{
      step++;
      const frac = Math.min(1, step/totalSteps);
      let distTarget = frac*totalLen;
      let acc = 0, pos = pts[0];
      for(let i=0;i<segLens.length;i++){
        if(acc+segLens[i] >= distTarget){
          const segFrac = segLens[i]===0 ? 0 : (distTarget-acc)/segLens[i];
          pos = {
            lat: pts[i].lat + (pts[i+1].lat-pts[i].lat)*segFrac,
            lng: pts[i].lng + (pts[i+1].lng-pts[i].lng)*segFrac
          };
          break;
        }
        acc += segLens[i];
        pos = pts[i+1];
      }
      lastKnownPos = pos;
      ensureYouAreHere(pos);
      updateNavProgress(pos);

      if(frac>=1){
        clearInterval(simTimer); simTimer=null;
      }
    }, 55);
  }

  /* ---------------- Detail panel (shared by both views) ---------------- */
  function selectLocation(id, showRoute){
    selectedId = id;
    const l = LOCATIONS.find(x=>x.id===id);
    if(!l) return;

    document.getElementById('dpCat').textContent = catMap[l.cat].label;
    document.getElementById('dpCat').style.background = catMap[l.cat].color;
    document.getElementById('dpCat').style.color = '#fff';
    document.getElementById('dpName').textContent = l.name;
    document.getElementById('dpDesc').textContent = l.desc;
    document.getElementById('dpDist').textContent = l.meters;
    document.getElementById('dpTime').textContent = l.mins;
    detailPanel.classList.add('show');

    if(showRoute){
      routeShownId = id;
      if(currentView==='schematic') renderMap();
    }
    renderList();
    if(currentView==='schematic') renderMap();

    if(currentView==='live' && placeMarkers[id]){
      leafletMap.panTo(placeMarkers[id].getLatLng());
      placeMarkers[id].openPopup();
    }
  }

  const dpRouteBtn = document.getElementById('dpRoute');
  function updateDpRouteBtn(){
    dpRouteBtn.textContent = currentView==='live' ? 'Navigate with live GPS' : 'Show walking route';
  }
  dpRouteBtn.addEventListener('click', ()=>{
    if(!selectedId) return;
    if(currentView==='schematic'){
      routeShownId = selectedId;
      renderMap();
    } else {
      startNavigation(selectedId);
    }
  });
  document.getElementById('dpClose').addEventListener('click', ()=>{
    detailPanel.classList.remove('show');
    selectedId = null;
    routeShownId = null;
    renderList();
    if(currentView==='schematic') renderMap();
  });

  /* ---------------- View switching ---------------- */
  function switchView(view){
    currentView = view;
    if(view==='schematic'){
      mapCard.style.display = '';
      liveMapCard.style.display = 'none';
      tabSchematic.classList.add('active');
      tabLive.classList.remove('active');
      mapHint.textContent = 'illustrative map · not to scale';
      document.getElementById('mapHeading').textContent = 'Campus Map';
    } else {
      mapCard.style.display = 'none';
      liveMapCard.style.display = '';
      tabSchematic.classList.remove('active');
      tabLive.classList.add('active');
      mapHint.textContent = 'real map · uses your device location';
      document.getElementById('mapHeading').textContent = 'Live Map';
      initLeaflet();
      updateLiveMarkersVisibility();
      setTimeout(()=> leafletMap && leafletMap.invalidateSize(), 60);
    }
    updateDpRouteBtn();
  }
  tabSchematic.addEventListener('click', ()=> switchView('schematic'));
  tabLive.addEventListener('click', ()=> switchView('live'));

  /* ---------------- Search ---------------- */
  searchInput.addEventListener('input', (e)=>{
    query = e.target.value;
    renderList();
    if(currentView==='schematic') renderMap();
    updateLiveMarkersVisibility();
  });

  /* ---------------- Mobile toggle ---------------- */
  mobileToggle.addEventListener('click', ()=>{
    const expanded = sidebar.classList.toggle('expanded');
    mobileToggle.setAttribute('aria-expanded', expanded);
    mobileToggle.querySelector('span').textContent = expanded ? '✕ Hide list' : '🔍 Search & browse places';
  });

  /* ---------------- Init ---------------- */
  renderChips();
  renderList();
  renderMap();
  updateDpRouteBtn();

})();