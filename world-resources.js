// ═══════════════════════════════════════════════════════════════════
// WORLD-RESOURCES.JS — Lacs, zones énergétiques, ressources minérales
// Données pour les calques "Lacs", "Énergie", "Ressources"
// ═══════════════════════════════════════════════════════════════════

// ═════════ LACS MAJEURS ═════════
const LACS = [
  { nom: "Lac Baïkal", lat: 53.5, lon: 108.0, pays: "Russie", superficie: "31 722 km²", profondeur: "1 642 m", note: "Plus profond du monde · 20 % eau douce mondiale · biodiversité endémique." },
  { nom: "Lac Supérieur", lat: 47.7, lon: -87.5, pays: "Canada / États-Unis", superficie: "82 100 km²", profondeur: "406 m", note: "Plus grand lac d'eau douce par superficie · Grands Lacs." },
  { nom: "Lac Victoria", lat: -1.0, lon: 33.0, pays: "Tanzanie / Ouganda / Kenya", superficie: "68 800 km²", profondeur: "84 m", note: "Source du Nil Blanc · pêche · 30 millions de riverains." },
  { nom: "Mer Caspienne", lat: 41.5, lon: 50.5, pays: "Russie / Kazakhstan / Iran / Azerbaïdjan / Turkménistan", superficie: "371 000 km²", profondeur: "1 025 m", note: "Plus grand lac/mer du monde · pétrole · esturgeon (caviar)." },
  { nom: "Lac Tanganyika", lat: -6.5, lon: 29.5, pays: "RDC / Tanzanie / Burundi / Zambie", superficie: "32 900 km²", profondeur: "1 470 m", note: "Deuxième plus profond · Grand Rift africain." },
  { nom: "Lac Malawi (Nyassa)", lat: -12.0, lon: 34.5, pays: "Malawi / Mozambique / Tanzanie", superficie: "29 500 km²", profondeur: "706 m", note: "Cichlidés endémiques · litige frontalier MWI-TZA." },
  { nom: "Grand Lac de l'Ours", lat: 66.0, lon: -120.0, pays: "Canada", superficie: "31 153 km²", profondeur: "446 m", note: "Arctique canadien · uranium historique (Port Radium)." },
  { nom: "Lac Tchad", lat: 13.0, lon: 14.0, pays: "Tchad / Niger / Nigeria / Cameroun", superficie: "1 350 km² (90 % perdu depuis 1960)", profondeur: "11 m", note: "Catastrophe écologique · 30 M de riverains · Boko Haram." },
  { nom: "Lac Aral", lat: 45.0, lon: 60.0, pays: "Kazakhstan / Ouzbékistan", superficie: "≈ 8 000 km² (90 % asséché)", profondeur: "résiduel", note: "Désastre écologique soviétique · coton irrigué." },
  { nom: "Mer Morte", lat: 31.5, lon: 35.5, pays: "Israël / Jordanie / Palestine", superficie: "605 km²", profondeur: "−434 m (point le plus bas terrestre)", note: "Salinité extrême (34 %) · niveau baisse 1 m/an · potasse." },
  { nom: "Lac Titicaca", lat: -15.8, lon: -69.5, pays: "Pérou / Bolivie", superficie: "8 372 km²", profondeur: "284 m", note: "Plus haut lac navigable (3 812 m) · civilisation Tiwanaku." },
  { nom: "Lac Léman", lat: 46.45, lon: 6.55, pays: "Suisse / France", superficie: "580 km²", profondeur: "310 m", note: "Hub diplomatique (ONU Genève · OMS · OIT)." },
  { nom: "Lac Nasser (Assouan)", lat: 22.7, lon: 31.8, pays: "Égypte / Soudan", superficie: "5 250 km²", profondeur: "180 m", note: "Réservoir artificiel barrage Assouan · contrôle Nil." },
  { nom: "Lac Volta", lat: 7.5, lon: 0.0, pays: "Ghana", superficie: "8 502 km²", profondeur: "75 m", note: "Plus grand lac artificiel par superficie · barrage Akosombo." },
  { nom: "Lac Eyre", lat: -28.5, lon: 137.4, pays: "Australie", superficie: "9 500 km² (intermittent)", profondeur: "−15 m", note: "Plus bas point d'Australie · sec la majorité du temps." },
  { nom: "Lac Rodolphe (Turkana)", lat: 3.6, lon: 36.1, pays: "Kenya / Éthiopie", superficie: "6 405 km²", profondeur: "109 m", note: "Plus grand lac désertique permanent · barrages éthiopiens menacent." },
  { nom: "Lac Kivu", lat: -2.0, lon: 29.3, pays: "RDC / Rwanda", superficie: "2 700 km²", profondeur: "480 m", note: "Méthane et CO₂ dissous (risque éruption limnique) · gaz exploitable." },
  { nom: "Lac Issyk-Koul", lat: 42.5, lon: 77.3, pays: "Kirghizistan", superficie: "6 236 km²", profondeur: "668 m", note: "Lac salé en montagne · base sous-marine soviétique historique." },
  { nom: "Grand Lac Salé", lat: 41.0, lon: -112.5, pays: "États-Unis (Utah)", superficie: "4 400 km²", profondeur: "10 m", note: "Salé · niveau historiquement bas (sécheresse Ouest US)." },
  { nom: "Lac Onega", lat: 61.7, lon: 35.5, pays: "Russie", superficie: "9 700 km²", profondeur: "127 m", note: "Carélie · canal mer Blanche-Baltique." },
  { nom: "Lac Ladoga", lat: 60.85, lon: 31.5, pays: "Russie", superficie: "17 700 km²", profondeur: "230 m", note: "Plus grand lac d'Europe · siège Léningrad." },
  { nom: "Lac Balkhach", lat: 46.0, lon: 75.0, pays: "Kazakhstan", superficie: "16 400 km²", profondeur: "26 m", note: "Mi-douce mi-salé · menacé par captages chinois Ili." },
];

// ═════════ ZONES ÉNERGÉTIQUES ═════════
// Types : petrole, gaz, charbon, nucleaire, hydro, hub, raffinerie
const ZONES_ENERGIE = [
  // ─── Pétrole — gisements majeurs ───
  { nom: "Champ de Ghawar", lat: 25.4, lon: 49.6, pays: "Arabie saoudite", type: "petrole", capacite: "≈ 4 Mb/j", reserves: "75 Md barils", note: "Plus grand gisement conventionnel mondial · cœur d'Aramco." },
  { nom: "Champ de Burgan", lat: 28.95, lon: 47.95, pays: "Koweït", type: "petrole", capacite: "1.7 Mb/j", reserves: "55 Md barils", note: "Deuxième plus grand au monde · invasion irakienne 1990." },
  { nom: "Bassin permien", lat: 31.8, lon: -102.5, pays: "États-Unis (Texas/NM)", type: "petrole", capacite: "6 Mb/j", reserves: "schistes", note: "Pétrole de schiste · pivot de l'autonomie énergétique US." },
  { nom: "Sables bitumineux Athabasca", lat: 57.0, lon: -111.5, pays: "Canada (Alberta)", type: "petrole", capacite: "3 Mb/j", reserves: "165 Md barils", note: "Troisièmes réserves mondiales · forte empreinte CO₂." },
  { nom: "Bassin de Cantarell / KMZ", lat: 19.4, lon: -92.1, pays: "Mexique (golfe)", type: "petrole", capacite: "1.6 Mb/j", note: "Offshore · production en déclin · enjeu Pemex." },
  { nom: "Champs sibériens (Samotlor / Priobskoye)", lat: 60.5, lon: 76.5, pays: "Russie (Sibérie occ.)", type: "petrole", capacite: "5 Mb/j (région)", note: "Cœur de Rosneft / Gazprom Neft · sanctions UE/US." },
  { nom: "Pré-sel de Santos", lat: -25.0, lon: -42.5, pays: "Brésil (offshore)", type: "petrole", capacite: "3 Mb/j", note: "Découverte 2007 · Petrobras · Lula campaign field." },
  { nom: "Delta du Niger", lat: 5.5, lon: 6.0, pays: "Nigeria", type: "petrole", capacite: "1.4 Mb/j", note: "Vol de brut · pollution · MEND · enjeu sécuritaire." },
  { nom: "Bloc 17 — Angola offshore", lat: -7.5, lon: 11.0, pays: "Angola", type: "petrole", capacite: "0.7 Mb/j", note: "TotalEnergies opérateur · production en eaux profondes." },
  { nom: "Champ de Tengiz", lat: 46.1, lon: 53.5, pays: "Kazakhstan", type: "petrole", capacite: "0.6 Mb/j", note: "Chevron · oléoduc CPC vers Novorossiisk." },
  { nom: "Champs de Kirkouk", lat: 35.5, lon: 44.4, pays: "Irak", type: "petrole", capacite: "1 Mb/j", note: "Litige Bagdad-Erbil · Kurdes · oléoduc Ceyhan." },
  { nom: "Champ d'Azadegan", lat: 31.5, lon: 48.0, pays: "Iran", type: "petrole", capacite: "0.5 Mb/j", note: "Frontière Irak · sanctions occidentales · investissements chinois." },
  { nom: "Vaca Muerta", lat: -38.5, lon: -69.5, pays: "Argentine (Neuquén)", type: "petrole", capacite: "0.4 Mb/j (en hausse)", note: "Schistes · espoir export · YPF." },

  // ─── Gaz naturel ───
  { nom: "Champ South Pars / North Dome", lat: 26.5, lon: 52.0, pays: "Iran / Qatar", type: "gaz", capacite: "≈ 1 800 G m³ rés.", note: "Plus grand gisement gazier mondial · cœur richesse Qatar." },
  { nom: "Champ d'Urengoy", lat: 66.0, lon: 78.5, pays: "Russie (Sibérie)", type: "gaz", capacite: "16 000 G m³", note: "Gazprom · alimente l'Europe historiquement · Yamal." },
  { nom: "Bassin de Marcellus", lat: 41.0, lon: -78.0, pays: "États-Unis (Appalaches)", type: "gaz", capacite: "schistes", note: "Plus grand champ de gaz de schiste US · LNG export." },
  { nom: "Champ de Hassi R'Mel", lat: 32.9, lon: 3.3, pays: "Algérie", type: "gaz", capacite: "2 800 G m³", note: "Sonatrach · gazoducs Transmed (Italie) et Medgaz (Espagne)." },
  { nom: "Champ de Groningue", lat: 53.4, lon: 6.8, pays: "Pays-Bas", type: "gaz", capacite: "fermeture 2024", note: "Mégagisement européen · arrêt à cause des séismes." },
  { nom: "Champ de Yolotan / Galkynysh", lat: 38.0, lon: 64.5, pays: "Turkménistan", type: "gaz", capacite: "21 000 G m³", note: "Deuxième plus gros gisement mondial · gazoducs vers Chine." },
  { nom: "Bassin Karoo / Mozambique LNG", lat: -10.5, lon: 40.5, pays: "Mozambique", type: "gaz", capacite: "5 000 G m³", note: "TotalEnergies · suspension force majeure (jihadisme Cabo Delgado)." },
  { nom: "Champ Leviathan / Tamar", lat: 33.0, lon: 33.7, pays: "Israël (offshore)", type: "gaz", capacite: "600 G m³", note: "Indépendance gazière israélienne · export Égypte/Jordanie." },

  // ─── Nucléaire — sites stratégiques ───
  { nom: "Centrale de Zaporijia", lat: 47.5, lon: 34.6, pays: "Ukraine (occ. russe)", type: "nucleaire", capacite: "5.7 GW (6 réacteurs)", note: "Plus grande centrale d'Europe · occupation russe 2022 · risque AIEA." },
  { nom: "Centrale de Bushehr", lat: 28.83, lon: 50.9, pays: "Iran", type: "nucleaire", capacite: "1 GW", note: "Seule centrale civile iranienne · technologie russe." },
  { nom: "Site nucléaire de Natanz", lat: 33.7, lon: 51.7, pays: "Iran", type: "nucleaire", capacite: "enrichissement uranium", note: "Cible Stuxnet 2010 · frappes israéliennes ponctuelles." },
  { nom: "Centrale de Fukushima Daiichi", lat: 37.42, lon: 141.03, pays: "Japon", type: "nucleaire", capacite: "démantèlement", note: "Catastrophe 2011 · rejet d'eau traitée 2023 · tensions Chine/Corée." },
  { nom: "Centrale de Tchernobyl", lat: 51.39, lon: 30.1, pays: "Ukraine", type: "nucleaire", capacite: "fermée 2000", note: "Catastrophe 1986 · zone d'exclusion · prise russe février 2022." },
  { nom: "Site de Yongbyon", lat: 39.8, lon: 125.75, pays: "Corée du Nord", type: "nucleaire", capacite: "plutonium militaire", note: "Cœur du programme nucléaire militaire nord-coréen." },

  // ─── Hubs énergétiques (LNG / oléoducs / raffineries) ───
  { nom: "Terminal LNG de Sabine Pass", lat: 29.73, lon: -93.87, pays: "États-Unis (Louisiane)", type: "hub", capacite: "30 Mtpa LNG", note: "Plus grand exportateur LNG mondial post-2022." },
  { nom: "Hub gazier de Yamal LNG", lat: 71.3, lon: 73.0, pays: "Russie (Arctique)", type: "hub", capacite: "16.5 Mtpa LNG", note: "Novatek · partiellement sanctionné · Route arctique." },
  { nom: "Terminal gazier de Ras Laffan", lat: 25.9, lon: 51.55, pays: "Qatar", type: "hub", capacite: "77 Mtpa LNG", note: "Plus grand site LNG mondial · QatarEnergy." },
  { nom: "Raffinerie de Jamnagar", lat: 22.35, lon: 69.85, pays: "Inde (Gujarat)", type: "raffinerie", capacite: "1.4 Mb/j", note: "Plus grand complexe de raffinage mondial · Reliance." },
  { nom: "Hub de Rotterdam (Europoort)", lat: 51.95, lon: 4.0, pays: "Pays-Bas", type: "hub", capacite: "7 raffineries / LNG", note: "Plus grand port pétrolier européen · prix de référence." },
  { nom: "Détroit d'Ormuz (passage stratégique)", lat: 26.55, lon: 56.25, pays: "Iran / Oman / EAU", type: "hub", capacite: "≈ 20 Mb/j transit", note: "Goulet pétrolier mondial · 30 % du brut maritime." },

  // ─── Hydroélectricité — mégabarrages ───
  { nom: "Barrage des Trois-Gorges", lat: 30.82, lon: 111.0, pays: "Chine", type: "hydro", capacite: "22.5 GW", note: "Plus grande hydro mondiale · Yangtsé · 1 300 villes déplacées." },
  { nom: "Barrage Itaipu", lat: -25.4, lon: -54.6, pays: "Brésil / Paraguay", type: "hydro", capacite: "14 GW", note: "Gestion binationale · 90 % de l'électricité paraguayenne." },
  { nom: "Barrage de la Renaissance (GERD)", lat: 11.2, lon: 35.1, pays: "Éthiopie", type: "hydro", capacite: "6.45 GW", note: "Crise diplomatique avec Égypte/Soudan · contrôle Nil bleu." },
  { nom: "Barrage d'Assouan", lat: 23.97, lon: 32.88, pays: "Égypte", type: "hydro", capacite: "2.1 GW", note: "Régulation Nil · enjeu existentiel face au GERD." },
  { nom: "Barrage de Kariba", lat: -16.5, lon: 28.7, pays: "Zambie / Zimbabwe", type: "hydro", capacite: "1.6 GW", note: "Sécheresse récurrente · sous-production critique." },
  { nom: "Barrage Inga (1 et 2, futur Inga III)", lat: -5.5, lon: 13.6, pays: "RDC", type: "hydro", capacite: "1.8 GW (potentiel 40 GW)", note: "Plus grand potentiel hydro mondial · projet Inga III." },

  // ─── Charbon — bassins majeurs ───
  { nom: "Bassin du Powder River", lat: 44.5, lon: -106.0, pays: "États-Unis (Wyoming)", type: "charbon", capacite: "40 % charbon US", note: "Plus grande extraction US · déclin face au gaz." },
  { nom: "Bassin du Shanxi", lat: 37.5, lon: 112.5, pays: "Chine", type: "charbon", capacite: "1 Gt/an", note: "Premier producteur mondial · pollution massive Pékin." },
  { nom: "Bassin du Kuznetsk (Kuzbass)", lat: 54.5, lon: 87.5, pays: "Russie", type: "charbon", capacite: "250 Mt/an", note: "Grand bassin charbonnier russe · export Asie." },
];

// ═════════ RESSOURCES MINÉRALES STRATÉGIQUES ═════════
// Types : lithium, cobalt, cuivre, or, fer, bauxite, uranium, terres_rares, diamant, phosphate, nickel, etain, argent, manganese, charbon
const RESSOURCES_MIN = [
  // ─── Lithium (le pétrole du XXIᵉ s.) ───
  { nom: "Salar d'Uyuni", lat: -20.13, lon: -67.5, pays: "Bolivie", type: "lithium", reserves: "21 M tonnes", note: "Plus grandes réserves mondiales · YLB · partenariats CN/RU." },
  { nom: "Salar d'Atacama", lat: -23.5, lon: -68.25, pays: "Chili", type: "lithium", reserves: "9.2 M tonnes", note: "Premier producteur mondial · SQM, Albemarle." },
  { nom: "Salar du Hombre Muerto", lat: -25.5, lon: -67.0, pays: "Argentine", type: "lithium", reserves: "3.6 M tonnes (triangle)", note: "Triangle du lithium ABC · projets Livent, Allkem." },
  { nom: "Mine de Greenbushes", lat: -33.9, lon: 116.05, pays: "Australie (WA)", type: "lithium", reserves: "spodumène", note: "Plus grand spodumène mondial · Tianqi/Albemarle." },
  { nom: "Mine de Bikita", lat: -20.07, lon: 31.4, pays: "Zimbabwe", type: "lithium", reserves: "11 Mt minerai", note: "Sinomine (chinois) · leader africain du lithium." },
  { nom: "Goulamina (mine de lithium)", lat: 11.4, lon: -8.1, pays: "Mali", type: "lithium", reserves: "100 Mt", note: "Premier projet lithium mali · contrôle militaire." },

  // ─── Cobalt ───
  { nom: "Ceinture du cuivre — Kolwezi", lat: -10.7, lon: 25.5, pays: "RDC", type: "cobalt", reserves: "70 % cobalt mondial", note: "Cœur du cobalt mondial · mines artisanales · enfants · Glencore, CMOC." },
  { nom: "Mine de Mutanda", lat: -10.65, lon: 25.5, pays: "RDC", type: "cobalt", reserves: "Glencore", note: "Plus grande mine cobalt mondiale (réouverte)." },
  { nom: "Mine de Murrin Murrin", lat: -28.7, lon: 121.85, pays: "Australie", type: "cobalt", reserves: "co-prod nickel", note: "Glencore · alternative non-RDC." },

  // ─── Cuivre ───
  { nom: "Mine de Chuquicamata", lat: -22.3, lon: -68.9, pays: "Chili", type: "cuivre", reserves: "Codelco", note: "Plus grande mine de cuivre à ciel ouvert au monde." },
  { nom: "Mine d'Escondida", lat: -24.3, lon: -69.07, pays: "Chili", type: "cuivre", reserves: "1.2 Mt/an", note: "Première mine de cuivre par production · BHP." },
  { nom: "Mine de Grasberg", lat: -4.05, lon: 137.1, pays: "Indonésie (Papouasie)", type: "cuivre", reserves: "co-prod or géant", note: "Freeport · enjeu Papouasie occidentale · or." },
  { nom: "Mine d'Oyu Tolgoï", lat: 43.0, lon: 106.85, pays: "Mongolie", type: "cuivre", reserves: "31 Mt cuivre + or", note: "Rio Tinto · stratégique face à dépendance Chine." },
  { nom: "Ceinture cuprifère zambienne", lat: -12.6, lon: 28.3, pays: "Zambie", type: "cuivre", reserves: "First Quantum, Vedanta", note: "Cuivre + cobalt · Konkola, Mopani." },

  // ─── Or ───
  { nom: "Mine de Muruntau", lat: 41.5, lon: 64.6, pays: "Ouzbékistan", type: "or", reserves: "1ʳᵉ mondiale", note: "Plus grande mine d'or à ciel ouvert au monde." },
  { nom: "Mine de Carlin Trend", lat: 40.9, lon: -116.3, pays: "États-Unis (Nevada)", type: "or", reserves: "2ᵉ mondiale", note: "Newmont, Barrick · or microscopique." },
  { nom: "Région du Witwatersrand", lat: -26.2, lon: 27.9, pays: "Afrique du Sud", type: "or", reserves: "40 % or mondial extrait", note: "Berceau de l'or moderne · mines de plus de 4 km de profondeur." },
  { nom: "Mine de Loulo-Gounkoto", lat: 13.3, lon: -11.5, pays: "Mali", type: "or", reserves: "Barrick", note: "Or stratégique mali · taxes révisées par junte 2024." },
  { nom: "Mine d'Essakane", lat: 14.45, lon: -1.45, pays: "Burkina Faso", type: "or", reserves: "IamGold", note: "Or burkinabè · enjeu sécuritaire (jihadisme Sahel)." },

  // ─── Fer ───
  { nom: "Mine de Carajás", lat: -6.1, lon: -50.0, pays: "Brésil (Pará)", type: "fer", reserves: "18 Md tonnes", note: "Plus grand gisement de fer mondial · Vale · Amazonie." },
  { nom: "Mine de Pilbara", lat: -22.6, lon: 117.7, pays: "Australie (WA)", type: "fer", reserves: "BHP, Rio Tinto", note: "Approvisionne 80 % du fer chinois · port de Port Hedland." },
  { nom: "Simandou", lat: 8.5, lon: -8.85, pays: "Guinée", type: "fer", reserves: "2.4 Md t haute teneur", note: "Plus grand gisement inexploité · Rio Tinto + chinois · controverses." },
  { nom: "Mine de Kryvyï Rih", lat: 47.9, lon: 33.4, pays: "Ukraine", type: "fer", reserves: "industrie sidérurgique", note: "Cœur de l'acier ukrainien · proche front russe." },

  // ─── Bauxite (aluminium) ───
  { nom: "Mines de Boké", lat: 11.0, lon: -14.3, pays: "Guinée", type: "bauxite", reserves: "1ʳᵉ mondiale réserves", note: "Premier exportateur mondial vers la Chine · enjeu post-coup d'État." },
  { nom: "Mine de Weipa", lat: -12.6, lon: 141.9, pays: "Australie (Qld)", type: "bauxite", reserves: "Rio Tinto", note: "Premier producteur australien · alimente raffineries Asie." },
  { nom: "Mines de Trombetas", lat: -1.55, lon: -56.4, pays: "Brésil", type: "bauxite", reserves: "Mineração Rio do Norte", note: "Bauxite amazonienne · port en eau profonde Trombetas." },

  // ─── Uranium ───
  { nom: "Mine de Cigar Lake", lat: 58.05, lon: -104.5, pays: "Canada (Saskatchewan)", type: "uranium", reserves: "Cameco", note: "Plus haute teneur uranium au monde (20 %)." },
  { nom: "Mine d'Olympic Dam", lat: -30.45, lon: 136.9, pays: "Australie (SA)", type: "uranium", reserves: "BHP — co-prod cuivre/or", note: "Plus grand gisement d'uranium connu." },
  { nom: "Région d'Arlit / Imouraren", lat: 18.8, lon: 7.4, pays: "Niger", type: "uranium", reserves: "Orano · 20 % import France", note: "Crise post-coup d'État 2023 · départ français." },
  { nom: "Mines de Rössing / Husab", lat: -22.5, lon: 15.0, pays: "Namibie", type: "uranium", reserves: "Rio Tinto, CGN", note: "Forte présence chinoise · uranium namibien." },

  // ─── Terres rares ───
  { nom: "Mine de Bayan Obo", lat: 41.78, lon: 109.97, pays: "Chine (Mongolie int.)", type: "terres_rares", reserves: "37 % réserves mondiales", note: "Pivot du monopole chinois · pollutions massives Baotou." },
  { nom: "Mine de Mountain Pass", lat: 35.5, lon: -115.5, pays: "États-Unis (Californie)", type: "terres_rares", reserves: "MP Materials", note: "Seule mine US · stratégie d'autonomie face à Chine." },
  { nom: "Mine de Mount Weld", lat: -28.85, lon: 122.55, pays: "Australie (WA)", type: "terres_rares", reserves: "Lynas", note: "Hors-Chine · raffinage Malaisie." },

  // ─── Phosphate ───
  { nom: "Mine de Khouribga", lat: 32.9, lon: -6.95, pays: "Maroc", type: "phosphate", reserves: "70 % réserves mondiales", note: "OCP · pivot agricole mondial · phosphates Sahara occ." },
  { nom: "Bou Craa (phosphate)", lat: 26.3, lon: -12.85, pays: "Sahara occidental (RASD/Maroc)", type: "phosphate", reserves: "OCP", note: "Au cœur du conflit du Sahara occidental · convoyeur 100 km." },

  // ─── Diamants ───
  { nom: "Mine de Mir / Aikhal", lat: 62.5, lon: 113.95, pays: "Russie (Iakoutie)", type: "diamant", reserves: "Alrosa", note: "Premier producteur mondial · sanctions G7 2024." },
  { nom: "Mine de Jwaneng", lat: -24.5, lon: 24.7, pays: "Botswana", type: "diamant", reserves: "Debswana (De Beers)", note: "Plus haute valeur diamantifère mondiale par carat." },

  // ─── Nickel ───
  { nom: "Mines de Sulawesi (Morowali)", lat: -2.7, lon: 122.05, pays: "Indonésie", type: "nickel", reserves: "1ᵉʳ mondial", note: "Hub nickel chinois · interdiction d'export brut · batteries EV." },
  { nom: "Mine de Goro", lat: -22.3, lon: 166.95, pays: "Nouvelle-Calédonie (France)", type: "nickel", reserves: "Prony Resources", note: "Crise sociale 2024 · enjeu indépendantiste." },

  // ─── Étain / coltan / autres critiques ───
  { nom: "Mines du Kivu (coltan)", lat: -2.0, lon: 28.85, pays: "RDC", type: "etain", reserves: "60 % coltan mondial", note: "Tantale · smartphones · groupes armés (M23, FARDC)." },
  { nom: "Mine de Tin Mountain (Cornouailles renaiss.)", lat: 50.2, lon: -5.1, pays: "Royaume-Uni", type: "etain", reserves: "réouverture", note: "Souveraineté UE/UK sur l'étain stratégique." },

  // ─── Argent ───
  { nom: "Mine de Fresnillo", lat: 23.18, lon: -102.87, pays: "Mexique", type: "argent", reserves: "1ʳᵉ mondiale", note: "Cœur argentifère mondial · Fresnillo plc." },

  // ─── Charbon stratégique ───
  { nom: "Bassin de Bowen", lat: -22.0, lon: 148.0, pays: "Australie (Qld)", type: "charbon", reserves: "charbon métallurgique", note: "Premier exportateur mondial de charbon à coke · acier asiatique." },
];

// ═════════ EXPOSITION GLOBALE ═════════
window.GEO = window.GEO || {};
window.GEO.LACS = LACS;
window.GEO.ZONES_ENERGIE = ZONES_ENERGIE;
window.GEO.RESSOURCES_MIN = RESSOURCES_MIN;
