# GeoIntel — Mémoire projet pour Claude Code

## 🎯 Contexte & auteur
- **Auteur :** Chercheur en sciences politiques, CNES Burkina Faso
- **Objectif :** Carte d'intelligence géopolitique mondiale — visualisation interactive de zones de tensions, détroits, fleuves, territoires contestés, fiches pays
- **Fichier principal local :** `C:\CLAUDE\geo-intel\`
- **Serveur local :** PowerShell `serve.ps1` sur port **3344**
- **Version standalone :** `geointel-standalone.html` (tout-en-un)

---

## 🏗️ Architecture technique

**Type :** Application cartographique statique — HTML/CSS/JS pur, bibliothèque Leaflet.js

### Fichiers clés
| Fichier | Rôle |
|---------|------|
| `index.html` | Structure HTML — carte + sidebar + panel fiches pays |
| `app.js` | Logique Leaflet — calques, filtres, recherche, fiches pays |
| `styles.css` | Thème dark, markers, popups, panel |
| `geo-data.js` | Données géostratégiques — mers, fleuves, détroits, montagnes, villes, pays |
| `world-conflicts.js` | Conflits mondiaux supplémentaires (`CONFLITS_SUP`) |
| `world-cities.js` | Capitales et grandes villes mondiales |
| `sw.js` | Service Worker (cache offline) |
| `geointel-standalone.html` | Version tout-en-un sans dépendances |
| `lib/leaflet/` | Leaflet.js + CSS (local, offline) |
| `lib/fontawesome/` | FontAwesome 6 (local, offline) |

---

## 🗺️ Bibliothèque cartographique

**Leaflet.js** — version locale dans `lib/leaflet/`

### Initialisation carte
```javascript
const map = L.map('map', {
  center: [20, 15],  // centré Afrique
  zoom: 3,
  minZoom: 2,
  maxZoom: 9,
  worldCopyJump: true,
});

// Fond : CartoCDN Voyager sans labels (mers bleu pâle, frontières visibles)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap, © CARTO — GeoIntel',
  subdomains: 'abcd',
}).addTo(map);
```

---

## 📦 Données (dans `geo-data.js` + `world-conflicts.js`)

Toutes les données sont exposées via l'objet global `window.GEO` :
```javascript
const { MERS, FLEUVES, DETROITS, MONTAGNES, VILLES, PAYS_DATA, PAYS_LABELS,
        CAPITALES_MONDE, GRANDES_VILLES, CONFLITS_SUP } = window.GEO;
```

### Collections disponibles

| Variable | Contenu | Champs clés |
|----------|---------|-------------|
| `MERS` | Mers, océans, lacs, golfes | `nom, lat, lon, type, superficie` |
| `FLEUVES` | Fleuves stratégiques | `nom, pts (polyline), long, note` |
| `DETROITS` | Détroits et canaux | `nom, lat, lon, type, risque, largeur, trafic, ctrl, enjeu` |
| `MONTAGNES` | Massifs montagneux | `nom, lat, lon, alt, note` |
| `VILLES` | Villes stratégiques | `nom, lat, lon, pays, iso, cat, pop, note` |
| `TERRITOIRES` | Zones contestées (geo-data.js) | `nom, lat, lon, type, statut, parties, note` |
| `CONFLITS_SUP` | Conflits mondiaux (world-conflicts.js) | même structure |
| `PAYS_DATA` | Fiches pays (dict iso→objet) | `nom, capitale, pop, superficie, regime, langue, religion, geo, ressources, energie, economie, histoire, politique, conflits, voisins` |
| `PAYS_LABELS` | Labels carte | `nom, lat, lon, tier (1-3)` |
| `CAPITALES_MONDE` | Capitales mondiales | `nom, lat, lon, pays, iso, pop, note` |
| `GRANDES_VILLES` | Grandes villes | même structure |

### Fusion des territoires
```javascript
// Dans app.js — toujours fusionner les deux sources
const TERRITOIRES = [...window.GEO.TERRITOIRES, ...(CONFLITS_SUP || [])];
```

### Fusion des villes (sans doublons)
```javascript
const _seen = new Set(VILLES.map(v => v.nom + '|' + v.pays));
const VILLES_ALL = [
  ...VILLES,
  ...(CAPITALES_MONDE || []).filter(c => !_seen.has(c.nom + '|' + c.pays)),
  ...(GRANDES_VILLES || []).filter(c => !_seen.has(c.nom + '|' + c.pays)),
];
```

---

## 🎨 Calques Leaflet

```javascript
const layers = {
  pays:        L.layerGroup(),  // labels noms de pays (par tier + zoom)
  mers:        L.layerGroup(),  // labels mers/océans
  fleuves:     L.layerGroup(),  // polylines bleues
  detroits:    L.layerGroup(),  // markers détroits/canaux
  montagnes:   L.layerGroup(),  // markers massifs
  territoires: L.layerGroup(),  // markers zones contestées + conflits
  villes:      L.layerGroup(),  // markers villes + labels
}
```

### Visibilité par zoom (`applyZoomVisibility()`)
| Élément | Zoom minimum |
|---------|-------------|
| Labels pays tier 1 | 2 |
| Labels pays tier 2 | 3 |
| Labels pays tier 3 | 4 |
| Océans (labels) | 2 |
| Mers (labels) | 3 |
| Lacs (labels) | 4 |
| Villes capital/megacity | 3 |
| Capitales monde | 4 |
| Villes hub/strategic/conflict | 5 |
| Grandes villes monde | 6 |

---

## 🖼️ Markers et icônes

```javascript
function makeIcon(category, subcat) {
  return L.divIcon({
    className: `gi-marker ${category}${subcat ? ' ' + subcat : ''}`,
    html: '<div class="gi-dot"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}
```

### Classes CSS des markers (dans `styles.css`)
- `.gi-marker.territoire` — zones contestées (orange)
- `.gi-marker.conflit_actif` — conflits actifs (rouge)
- `.gi-marker.conflit_gele` — conflits gelés (bleu)
- `.gi-marker.post_conflit` — post-conflit (gris)
- `.gi-marker.city` — villes (points blancs)
- `.gi-marker.capital` — capitales (grand point jaune)
- `.gi-marker.megacity` — mégapoles (grand point)
- `.gi-marker.detroit` — détroits (losange bleu)
- `.gi-marker.canal` — canaux (losange vert)
- `.gi-marker.mountain` — montagnes (triangle gris)

---

## 🔍 Fonctions principales (app.js)

| Fonction | Description |
|----------|-------------|
| `renderPaysLabels()` | Place les labels de pays sur la carte |
| `applyZoomVisibility()` | Gère la visibilité selon le niveau de zoom |
| `renderMers()` | Affiche labels mers/océans |
| `renderFleuves()` | Dessine les polylines de fleuves |
| `renderDetroits(filter)` | Markers détroits/canaux avec filtre risque |
| `renderMontagnes()` | Markers massifs montagneux |
| `renderTerritoires(filter)` | Markers zones contestées avec filtre type |
| `renderVilles(filter)` | Markers villes avec filtre catégorie |
| `openPanel(iso)` | Ouvre la fiche pays détaillée |
| `buildIndex()` | Construit l'index de recherche |
| `updateStats()` | Met à jour les compteurs dans le header |

---

## 🔎 Recherche

```javascript
// index global de tous les éléments
function buildIndex()  // retourne tableau d'objets { type, icon, nom, sub, lat, lon, ref }

// Input #search → dropdown #search-results
// Normalisation : accents supprimés, minuscules
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
```

---

## 🗂️ Panel fiche pays

### Ouverture
- Via bouton "Fiche pays complète" dans les popups de villes
- Via recherche → clic sur résultat de type "Pays"
- Via `openPanel(iso)` avec code ISO pays

### Sections affichées
1. **Identité** : régime, langue, religion
2. **Géographie** : description
3. **Ressources** : tags (or, pétrole, eau, etc.)
4. **Énergie** : description
5. **Économie** : description
6. **Histoire** : résumé
7. **Politique** : situation actuelle
8. **Conflits** : conflits impliquant ce pays
9. **Voisinage** : relations avec pays voisins

---

## 🧭 Navigation rapide (boutons zone)

```javascript
const zones = {
  monde:   { c: [20, 15],  z: 3 },
  sahel:   { c: [13, 5],   z: 5 },
  moyenor: { c: [30, 45],  z: 4 },
  europe:  { c: [50, 15],  z: 4 },
  asiepac: { c: [25, 110], z: 3 },
  afrique: { c: [0, 20],   z: 3 },
}
// map.flyTo(c, z, { duration: 1.0 })
```

---

## 🖥️ Lancement en local

```powershell
# Depuis C:\CLAUDE\
powershell -File geo-intel/serve.ps1
# → http://localhost:3344
```

Ou depuis `.claude/launch.json` (Claude Code) :
```json
{ "name": "geo-intel", "port": 3344 }
```

---

## 🚀 Déploiement

**Ce projet n'est pas encore sur GitHub Pages.** Il tourne en local.

Pour le mettre en ligne :
1. Créer un dépôt GitHub `geointel`
2. Uploader tous les fichiers (attention : lib/ doit inclure Leaflet + FontAwesome locaux)
3. Activer GitHub Pages sur la branche main

### Ou version standalone
- `geointel-standalone.html` contient tout en un seul fichier → peut être ouvert directement

---

## 🎨 Thème visuel
- Fond carte : CartoCDN Voyager (clair avec frontières)
- Sidebar : fond `#0a1220` dark
- Header : `#060e1a`
- Popups : fond `#0c1426`, texte `#e2e8f0`
- Palette risque : critique `#ef4444` / élevé `#f97316` / moyen `#f59e0b` / faible `#22c55e`
- Fleuves : `#3b82f6` (bleu)

---

## ⚠️ Points critiques à ne pas oublier

1. **Leaflet local** : ne pas changer vers un CDN (fonctionnement offline requis)
2. **FontAwesome local** : même raison
3. **Fusion TERRITOIRES** : toujours `[...GEO.TERRITOIRES, ...CONFLITS_SUP]`
4. **Déduplications VILLES** : utiliser le Set `nom|pays` pour éviter les doublons
5. **`pts` des fleuves** : format `[lon, lat]` (ordre GeoJSON) → Leaflet attend `[lat, lon]`
   ```javascript
   const latlngs = f.pts.map(p => [p[1], p[0]]); // ← inversion obligatoire
   ```
6. **`map.on('zoomend', applyZoomVisibility)`** : appeler après toute modification de calques
7. **Popups + bouton fiche** : le handler `.onclick` doit être réattaché dans `popupopen` event
