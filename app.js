// ═══════════════════════════════════════════════════════════════════
// APP.JS — Carte d'intelligence géopolitique
// Calques Leaflet, filtres, recherche, fiches pays
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const { MERS, FLEUVES, DETROITS, MONTAGNES, VILLES, PAYS_DATA, PAYS_LABELS,
          CAPITALES_MONDE, GRANDES_VILLES, CONFLITS_SUP } = window.GEO;
  // Fusion conflits : TERRITOIRES (depuis geo-data.js) + CONFLITS_SUP (world-conflicts.js)
  const TERRITOIRES = [...window.GEO.TERRITOIRES, ...(CONFLITS_SUP || [])];
  // Fusion villes : VILLES stratégiques + capitales monde + grandes villes (sans doublons par nom+pays)
  const _seen = new Set(VILLES.map(v => v.nom + '|' + v.pays));
  const VILLES_ALL = [
    ...VILLES,
    ...(CAPITALES_MONDE || []).filter(c => !_seen.has(c.nom + '|' + c.pays)).map(c => ({ ...c, cat: 'world_capital', note: c.note || `Capitale — ${c.pays}` })),
    ...(GRANDES_VILLES || []).filter(c => !_seen.has(c.nom + '|' + c.pays)).map(c => ({ ...c, cat: 'world_city', note: c.note || `Grande ville — ${c.pays}` })),
  ];

  // ── INIT MAP ───────────────────────────────────────────────
  const map = L.map('map', {
    center: [20, 15],
    zoom: 3,
    minZoom: 2,
    maxZoom: 9,
    worldCopyJump: true,
    zoomControl: true,
    attributionControl: true,
  });

  // Fond carto Voyager (clair, frontières bien visibles, mers bleu pâle) sans labels
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO — GeoIntel',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // ── LAYER GROUPS ───────────────────────────────────────────
  const layers = {
    pays: L.layerGroup(),       // labels pays (par tier, gérés selon zoom)
    mers: L.layerGroup(),
    fleuves: L.layerGroup(),
    detroits: L.layerGroup(),
    montagnes: L.layerGroup(),
    territoires: L.layerGroup(),
    villes: L.layerGroup(),
  };
  Object.values(layers).forEach(l => l.addTo(map));

  // ── HELPERS ─────────────────────────────────────────────────
  const norm = s => (s || '').toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  const escapeHtml = s => String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const riskClass = r => norm(r).replace(/[^a-z]/g, '');

  function makeIcon(category, subcat) {
    const cls = `gi-marker ${category}${subcat ? ' ' + subcat : ''}`;
    return L.divIcon({
      className: cls,
      html: '<div class="gi-dot"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }

  function popupTitle(icon, name) {
    return `<div class="popup-title"><i class="fa-solid ${icon}"></i>${escapeHtml(name)}</div>`;
  }

  // ── 0. LABELS PAYS (français, par tier de zoom) ────────────
  const paysMarkers = []; // { marker, tier }
  function renderPaysLabels() {
    layers.pays.clearLayers();
    paysMarkers.length = 0;
    PAYS_LABELS.forEach(p => {
      const m = L.marker([p.lat, p.lon], {
        icon: L.divIcon({
          className: `country-label country-tier-${p.tier}`,
          html: escapeHtml(p.nom),
          iconSize: [180, 14],
          iconAnchor: [90, 7],
        }),
        interactive: false,
        keyboard: false,
      });
      paysMarkers.push({ marker: m, tier: p.tier });
    });
    applyZoomVisibility();
  }
  function applyZoomVisibility() {
    const z = map.getZoom();
    paysMarkers.forEach(({ marker, tier }) => {
      // tier 1 ≥ 2 ; tier 2 ≥ 3 ; tier 3 ≥ 4
      const minZ = tier === 1 ? 2 : tier === 2 ? 3 : 4;
      const shouldShow = z >= minZ;
      const isOn = layers.pays.hasLayer(marker);
      if (shouldShow && !isOn) layers.pays.addLayer(marker);
      else if (!shouldShow && isOn) layers.pays.removeLayer(marker);
    });
    // Mers : à zoom 2 → océans seulement, zoom 3+ → toutes
    layers.mers.eachLayer(lbl => {
      const cls = lbl.options.icon.options.className || '';
      const isOcean = cls.includes('ocean');
      const isLac = cls.includes('lac');
      lbl.getElement()?.style?.setProperty('display',
        (z < 3 && !isOcean) ? 'none' : (z < 4 && isLac) ? 'none' : '', 'important');
    });
    // Villes : seuils par catégorie
    //   stratégiques capital/megacity : zoom 3
    //   stratégiques hub/strategic/conflict : zoom 5
    //   capitales monde (world_capital) : zoom 4
    //   grandes villes monde (world_city) : zoom 6
    layers.villes.eachLayer(m => {
      const tt = m.getTooltip();
      if (!tt) return;
      const c = m.options._cat;
      let showAt;
      if (c === 'capital' || c === 'megacity') showAt = 3;
      else if (c === 'world_capital')          showAt = 4;
      else if (c === 'world_city')             showAt = 6;
      else                                     showAt = 5;
      if (z >= showAt) tt.setOpacity(1);
      else tt.setOpacity(0);
    });
  }
  map.on('zoomend', applyZoomVisibility);

  // ── 1. MERS ET OCÉANS (labels uniquement) ──────────────────
  function renderMers() {
    layers.mers.clearLayers();
    MERS.forEach(m => {
      const cls = m.type === 'ocean' ? 'sea-label ocean'
                : m.type === 'lac' || m.type === 'lac_sale' ? 'sea-label lac'
                : 'sea-label';
      const lbl = L.marker([m.lat, m.lon], {
        icon: L.divIcon({
          className: cls,
          html: escapeHtml(m.nom),
          iconSize: [200, 20],
          iconAnchor: [100, 10],
        }),
        interactive: true,
        keyboard: false,
      });
      lbl.bindPopup(`
        ${popupTitle('fa-water', m.nom)}
        <div class="popup-meta">${escapeHtml(m.type)}</div>
        <div class="popup-row"><b>Superficie:</b> ${escapeHtml(m.superficie)}</div>
      `);
      layers.mers.addLayer(lbl);
    });
  }

  // ── 2. FLEUVES (polylines) ─────────────────────────────────
  function renderFleuves() {
    layers.fleuves.clearLayers();
    FLEUVES.forEach(f => {
      const latlngs = f.pts.map(p => [p[1], p[0]]); // pts = [lon, lat] → leaflet [lat, lon]
      const line = L.polyline(latlngs, {
        color: '#3b82f6',
        weight: 2,
        opacity: 0.75,
        smoothFactor: 1.2,
      });
      line.bindPopup(`
        ${popupTitle('fa-water', f.nom)}
        <div class="popup-meta">Fleuve · ${escapeHtml(f.long)}</div>
        <div class="popup-row">${escapeHtml(f.note)}</div>
      `);
      line.bindTooltip(f.nom, { sticky: true, direction: 'top', className: 'sea-label' });
      layers.fleuves.addLayer(line);
    });
  }

  // ── 3. DÉTROITS / CANAUX ───────────────────────────────────
  function renderDetroits(filter) {
    layers.detroits.clearLayers();
    let count = 0;
    DETROITS.forEach(d => {
      if (filter && filter !== 'all' && d.risque !== filter) return;
      count++;
      const subcat = d.type === 'canal' ? 'canal'
                   : d.type === 'passage' ? 'passage'
                   : 'detroit ' + riskClass(d.risque);
      const m = L.marker([d.lat, d.lon], { icon: makeIcon('', subcat) });
      const icon = d.type === 'canal' ? 'fa-grip-lines-vertical'
                 : d.type === 'passage' ? 'fa-route'
                 : 'fa-bezier-curve';
      m.bindPopup(`
        ${popupTitle(icon, d.nom)}
        <div class="popup-meta">${escapeHtml(d.type)} · <span class="popup-tag ${riskClass(d.risque)}">${escapeHtml(d.risque)}</span></div>
        <div class="popup-row"><b>Largeur:</b> ${escapeHtml(d.largeur)}</div>
        <div class="popup-row"><b>Trafic:</b> ${escapeHtml(d.trafic)}</div>
        <div class="popup-row"><b>Contrôle:</b> ${escapeHtml(d.ctrl)}</div>
        <div class="popup-row" style="margin-top:6px;color:#cbd5e1">${escapeHtml(d.enjeu)}</div>
      `, { maxWidth: 340 });
      layers.detroits.addLayer(m);
    });
    return count;
  }

  // ── 4. MONTAGNES ───────────────────────────────────────────
  function renderMontagnes() {
    layers.montagnes.clearLayers();
    MONTAGNES.forEach(mt => {
      const m = L.marker([mt.lat, mt.lon], { icon: makeIcon('mountain') });
      m.bindPopup(`
        ${popupTitle('fa-mountain', mt.nom)}
        <div class="popup-meta">Massif · alt. ${escapeHtml(mt.alt)}</div>
        <div class="popup-row">${escapeHtml(mt.note)}</div>
      `, { maxWidth: 340 });
      // label visible
      m.bindTooltip(mt.nom, {
        permanent: false,
        direction: 'top',
        className: 'mountain-label',
        offset: [0, -8],
      });
      layers.montagnes.addLayer(m);
    });
  }

  // ── 5. TERRITOIRES CONTESTÉS ───────────────────────────────
  function renderTerritoires(filter) {
    layers.territoires.clearLayers();
    let count = 0;
    TERRITOIRES.forEach(t => {
      if (filter && filter !== 'all' && t.type !== filter) return;
      count++;
      const m = L.marker([t.lat, t.lon], { icon: makeIcon('territoire', t.type) });
      const partiesHtml = (t.parties || []).map(p => `<span class="popup-tag" style="background:#0a0f1c;color:#cbd5e1;border:1px solid #1a2340;margin-right:3px">${escapeHtml(p)}</span>`).join('');
      m.bindPopup(`
        ${popupTitle('fa-flag', t.nom)}
        <div class="popup-meta">${escapeHtml(t.type.replace(/_/g, ' '))}</div>
        <div class="popup-row"><b>Statut:</b> ${escapeHtml(t.statut)}</div>
        <div class="popup-row" style="margin-top:6px;color:#cbd5e1">${escapeHtml(t.note)}</div>
        <div class="popup-row" style="margin-top:8px"><b>Acteurs:</b><br>${partiesHtml}</div>
      `, { maxWidth: 380 });
      layers.territoires.addLayer(m);
    });
    return count;
  }

  // ── 6. VILLES STRATÉGIQUES ─────────────────────────────────
  function renderVilles(filter) {
    layers.villes.clearLayers();
    let count = 0;
    VILLES_ALL.forEach(v => {
      if (filter && filter !== 'all' && v.cat !== filter) return;
      count++;
      const m = L.marker([v.lat, v.lon], { icon: makeIcon('city', v.cat), _cat: v.cat });
      const ficheBtn = v.iso && PAYS_DATA[v.iso]
        ? `<button class="popup-fiche-btn" data-iso="${v.iso}"><i class="fa-solid fa-folder-open"></i>Fiche pays complète</button>`
        : '';
      m.bindPopup(`
        ${popupTitle('fa-location-dot', v.nom)}
        <div class="popup-meta">${escapeHtml(v.pays)} · ${escapeHtml(v.cat)} · ${escapeHtml(v.pop)}</div>
        <div class="popup-row">${escapeHtml(v.note)}</div>
        ${ficheBtn}
      `, { maxWidth: 320 });
      // Label permanent (visible selon zoom)
      m.bindTooltip(v.nom, {
        permanent: true,
        direction: 'right',
        offset: [10, 0],
        className: 'city-label',
        opacity: 0,
      });
      m.on('popupopen', () => {
        setTimeout(() => {
          document.querySelectorAll('.popup-fiche-btn').forEach(btn => {
            btn.onclick = () => openPanel(btn.dataset.iso);
          });
        }, 50);
      });
      layers.villes.addLayer(m);
    });
    return count;
  }

  // ── PANEL FICHE PAYS ────────────────────────────────────────
  const panel = document.getElementById('panel');
  const panelBody = document.getElementById('panel-body');
  const panelTitle = document.getElementById('panel-title');
  const panelCap = document.getElementById('panel-cap');

  function openPanel(iso) {
    const p = PAYS_DATA[iso];
    if (!p) return;
    panelTitle.textContent = p.nom;
    panelCap.textContent = `${p.capitale} · ${p.pop} · ${p.superficie}`;

    const ressourcesHtml = (p.ressources || [])
      .map(r => `<span class="tg">${escapeHtml(r)}</span>`).join('');
    const voisinsHtml = Object.entries(p.voisins || {})
      .map(([nom, desc]) => `
        <div class="voisin-item">
          <span class="vn">${escapeHtml(nom)}</span>
          <span class="vd">${escapeHtml(desc)}</span>
        </div>`).join('');

    panelBody.innerHTML = `
      <div class="panel-section">
        <h3><i class="fa-solid fa-id-card"></i>Identité</h3>
        <div class="kv">
          <span class="k">Régime</span><span class="v">${escapeHtml(p.regime)}</span>
          <span class="k">Langue</span><span class="v">${escapeHtml(p.langue)}</span>
          <span class="k">Religion</span><span class="v">${escapeHtml(p.religion)}</span>
        </div>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-mountain-sun"></i>Géographie</h3>
        <p class="pdesc">${escapeHtml(p.geo)}</p>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-gem"></i>Ressources</h3>
        <div class="tag-list">${ressourcesHtml}</div>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-bolt"></i>Énergie</h3>
        <p class="pdesc">${escapeHtml(p.energie)}</p>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-chart-line"></i>Économie</h3>
        <p class="pdesc">${escapeHtml(p.economie)}</p>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-clock-rotate-left"></i>Histoire</h3>
        <p class="pdesc">${escapeHtml(p.histoire)}</p>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-landmark"></i>Politique</h3>
        <p class="pdesc">${escapeHtml(p.politique)}</p>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-fire"></i>Conflits</h3>
        <p class="pdesc">${escapeHtml(p.conflits)}</p>
      </div>

      <div class="panel-section">
        <h3><i class="fa-solid fa-handshake"></i>Voisinage</h3>
        <div class="voisins-list">${voisinsHtml}</div>
      </div>
    `;
    panel.classList.add('open');
    map.closePopup();
  }

  document.getElementById('panel-close').onclick = () => panel.classList.remove('open');

  // ── LEGEND TOGGLE ──────────────────────────────────────────
  const legendEl = document.getElementById('legend');
  document.getElementById('legend-toggle').addEventListener('click', () => {
    legendEl.classList.toggle('collapsed');
  });

  // ── LAYER TOGGLES ───────────────────────────────────────────
  document.querySelectorAll('.layer-row input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const k = cb.dataset.layer;
      if (cb.checked) {
        layers[k].addTo(map);
        applyZoomVisibility();
      } else {
        map.removeLayer(layers[k]);
      }
    });
  });

  // ── FILTRES ────────────────────────────────────────────────
  document.getElementById('filter-detroits').addEventListener('change', e => {
    renderDetroits(e.target.value);
    updateStats();
  });
  document.getElementById('filter-territoires').addEventListener('change', e => {
    renderTerritoires(e.target.value);
    updateStats();
  });
  document.getElementById('filter-villes').addEventListener('change', e => {
    renderVilles(e.target.value);
    applyZoomVisibility();   // ré-appliquer l'opacity des tooltips après recréation
    updateStats();
  });

  // Quick zoom buttons
  document.querySelectorAll('.zone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const z = btn.dataset.zone;
      const zones = {
        monde:    { c: [20, 15], z: 3 },
        sahel:    { c: [13, 5], z: 5 },
        moyenor:  { c: [30, 45], z: 4 },
        europe:   { c: [50, 15], z: 4 },
        asiepac:  { c: [25, 110], z: 3 },
        afrique:  { c: [0, 20], z: 3 },
      };
      const zo = zones[z];
      if (zo) {
        map.flyTo(zo.c, zo.z, { duration: 1.0 });
        document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // ── RECHERCHE ──────────────────────────────────────────────
  const searchInput = document.getElementById('search');
  const searchResults = document.getElementById('search-results');

  function buildIndex() {
    const idx = [];
    VILLES_ALL.forEach(v => idx.push({ type: 'Ville', icon: 'fa-location-dot', nom: v.nom, sub: v.pays, lat: v.lat, lon: v.lon, ref: v }));
    DETROITS.forEach(d => idx.push({ type: 'Détroit/Canal', icon: 'fa-bezier-curve', nom: d.nom, sub: d.ctrl, lat: d.lat, lon: d.lon, ref: d }));
    TERRITOIRES.forEach(t => idx.push({ type: 'Territoire', icon: 'fa-flag', nom: t.nom, sub: t.type.replace(/_/g, ' '), lat: t.lat, lon: t.lon, ref: t }));
    MONTAGNES.forEach(m => idx.push({ type: 'Montagne', icon: 'fa-mountain', nom: m.nom, sub: m.alt, lat: m.lat, lon: m.lon, ref: m }));
    MERS.forEach(s => idx.push({ type: 'Mer/Océan', icon: 'fa-water', nom: s.nom, sub: s.type, lat: s.lat, lon: s.lon, ref: s }));
    FLEUVES.forEach(f => idx.push({ type: 'Fleuve', icon: 'fa-water', nom: f.nom, sub: f.long, lat: f.pts[0][1], lon: f.pts[0][0], ref: f }));
    Object.entries(PAYS_DATA).forEach(([iso, p]) =>
      idx.push({ type: 'Pays', icon: 'fa-earth-americas', nom: p.nom, sub: p.capitale, iso, ref: p })
    );
    return idx;
  }
  const SEARCH_INDEX = buildIndex();

  searchInput.addEventListener('input', () => {
    const q = norm(searchInput.value.trim());
    if (q.length < 2) { searchResults.classList.remove('open'); return; }
    const matches = SEARCH_INDEX.filter(x => norm(x.nom).includes(q) || norm(x.sub).includes(q)).slice(0, 12);
    if (!matches.length) {
      searchResults.innerHTML = '<div class="sr-item" style="cursor:default;color:#64748b">Aucun résultat</div>';
    } else {
      searchResults.innerHTML = matches.map((m, i) => `
        <div class="sr-item" data-idx="${i}">
          <i class="fa-solid ${m.icon}" style="color:#60a5fa"></i>
          <div class="sr-name">${escapeHtml(m.nom)}<br><span class="sr-type">${escapeHtml(m.sub)}</span></div>
          <div class="sr-type">${escapeHtml(m.type)}</div>
        </div>
      `).join('');
      searchResults.querySelectorAll('.sr-item').forEach((el, i) => {
        el.onclick = () => {
          const item = matches[i];
          if (item.iso) {
            openPanel(item.iso);
          } else if (item.lat != null && item.lon != null) {
            map.flyTo([item.lat, item.lon], 6, { duration: 1.0 });
          }
          searchResults.classList.remove('open');
          searchInput.value = item.nom;
        };
      });
    }
    searchResults.classList.add('open');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#search-wrap')) searchResults.classList.remove('open');
  });

  // ── STATS ──────────────────────────────────────────────────
  function updateStats() {
    document.getElementById('stat-villes').textContent = layers.villes.getLayers().length;
    document.getElementById('stat-detroits').textContent = layers.detroits.getLayers().length;
    document.getElementById('stat-territoires').textContent = layers.territoires.getLayers().length;
    const crit = TERRITOIRES.filter(t => t.type === 'conflit_actif').length
               + DETROITS.filter(d => d.risque === 'critique').length;
    document.getElementById('stat-crit').textContent = crit;
  }

  // ── COUNT BADGES (sidebar) ─────────────────────────────────
  function updateCounts() {
    document.querySelector('[data-count="pays"]').textContent       = PAYS_LABELS.length;
    document.querySelector('[data-count="mers"]').textContent       = MERS.length;
    document.querySelector('[data-count="fleuves"]').textContent    = FLEUVES.length;
    document.querySelector('[data-count="detroits"]').textContent   = DETROITS.length;
    document.querySelector('[data-count="montagnes"]').textContent  = MONTAGNES.length;
    document.querySelector('[data-count="territoires"]').textContent= TERRITOIRES.length;
    document.querySelector('[data-count="villes"]').textContent     = VILLES_ALL.length;
  }

  // ── INITIAL RENDER ─────────────────────────────────────────
  renderMers();
  renderPaysLabels();
  renderFleuves();
  renderDetroits('all');
  renderMontagnes();
  renderTerritoires('all');
  renderVilles('all');
  applyZoomVisibility();
  updateCounts();
  updateStats();

  // Expose pour debug
  window.__GI = { map, layers, openPanel, PAYS_DATA };
})();
