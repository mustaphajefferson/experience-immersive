// ─────────────────────────────────────────────────────────────
// Expérience immersive — plugin v3
// Maquettes du parcours d'Inès, appliquées au design system de l'équipe
// (DESIGN SYSTEM — Affiches, v1.0) + règle « 09 — Grille de fond ».
// Les couleurs et les styles de texte se lient aux variables et styles
// déjà présents dans le fichier quand ils sont trouvés par leur nom.
// ─────────────────────────────────────────────────────────────

const FONTS = {
  reg: { family: "Inter", style: "Regular" },
  med: { family: "Inter", style: "Medium" },
  sb: { family: "Inter", style: "Semi Bold" }
};

// Tokens sémantiques (valeurs claires, reprises de l'export)
const TOK = {
  "fond/principal": "#FFFFFF",
  "fond/secondaire": "#F1F1EE",
  "fond/inverse": "#111111",
  "texte/principal": "#111111",
  "texte/secondaire": "#6B6B67",
  "texte/inverse": "#FFFFFF",
  "trait/defaut": "#DCDCD8",
  "trait/fort": "#111111",
  "accent/capture": "#FF0000",
  "accent/sur-accent": "#FFFFFF"
};

// Styles de texte : [police, taille, interligne, interlettrage %, capitales]
const STY = {
  "Titre/XL": ["sb", 40, 40, -3],
  "Titre/L": ["sb", 28, 30, -2],
  "Titre/M": ["sb", 20, 24, -1],
  "Texte/Corps": ["reg", 16, 22, -0.5],
  "Texte/Petit": ["reg", 14, 19, 0],
  "Texte/Label": ["med", 15, 20, -0.5],
  "Texte/Méta": ["med", 11, 14, 4, true],
  "Chiffre/Capture": ["sb", 64, 56, -5]
};

// Écran et grille (iPhone 17)
const W = 402, H = 874, M = 16, G = 8;
const COLW = (W - 2 * M - 3 * G) / 4;           // 86.5
const COLX = [0, 1, 2, 3].map(function (i) { return M + i * (COLW + G); });
const COL2 = COLW * 2 + G;                        // 181
const FULL = W - 2 * M;                           // 370
const TABS_Y = 784;

const VARS = {};          // token -> variable
const TSTYLES = {};       // nom -> id de style
const STYLE_QUEUE = [];   // [noeud, nom de style]
const IMGHASH = {};
let linkedVars = 0, linkedStyles = 0;

// ───────────────────────── Bas niveau
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
function paint(tok, op) {
  const hex = TOK[tok] || tok;
  let p = { type: "SOLID", color: rgb(hex), opacity: op === undefined ? 1 : op };
  const v = VARS[tok];
  if (v) {
    try { p = figma.variables.setBoundVariableForPaint(p, "color", v); } catch (e) { /* valeur brute */ }
  }
  return [p];
}
function hexOf(tok) { return TOK[tok] || tok; }

function FR(p, name, x, y, w, h, fill) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = fill ? paint(fill) : [];
  f.clipsContent = true;
  p.appendChild(f);
  f.x = x; f.y = y;
  return f;
}
function R(p, x, y, w, h, fill, o) {
  o = o || {};
  const r = figma.createRectangle();
  r.resize(Math.max(w, 0.01), Math.max(h, 0.01));
  r.fills = fill ? paint(fill, o.op) : [];
  if (o.stroke) {
    r.strokes = paint(o.stroke, o.sop);
    r.strokeWeight = o.sw || 1;
    r.strokeAlign = "INSIDE";
  }
  if (o.radius) r.cornerRadius = o.radius;
  r.name = o.name || "Rectangle";
  p.appendChild(r);
  r.x = x; r.y = y;
  if (o.rot) r.rotation = o.rot;
  return r;
}
function E(p, x, y, d, fill, o) {
  o = o || {};
  const e = figma.createEllipse();
  e.resize(d, d);
  e.fills = fill ? paint(fill) : [];
  if (o.stroke) { e.strokes = paint(o.stroke); e.strokeWeight = o.sw || 1; e.strokeAlign = o.align || "INSIDE"; }
  e.name = o.name || "Cercle";
  p.appendChild(e);
  e.x = x; e.y = y;
  return e;
}
function T(p, str, x, y, style, color, o) {
  o = o || {};
  const s = STY[style];
  const t = figma.createText();
  t.fontName = FONTS[s[0]];
  t.fontSize = s[1];
  t.lineHeight = { value: s[2], unit: "PIXELS" };
  t.letterSpacing = { value: s[3], unit: "PERCENT" };
  if (s[4]) t.textCase = "UPPER";
  t.characters = str;
  t.fills = paint(color || "texte/principal");
  if (o.w) { t.resize(o.w, t.height); t.textAutoResize = "HEIGHT"; }
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.underline) t.textDecoration = "UNDERLINE";
  t.name = o.name || str.slice(0, 40);
  p.appendChild(t);
  t.x = x; t.y = y;
  STYLE_QUEUE.push([t, style]);
  return t;
}
function TC(p, str, bx, by, bw, bh, style, color, o) {
  const t = T(p, str, 0, 0, style, color, o);
  t.x = bx + (bw - t.width) / 2; t.y = by + (bh - t.height) / 2;
  return t;
}
function TR(p, str, rx, y, style, color, o) {
  const t = T(p, str, 0, y, style, color, o);
  t.x = rx - t.width;
  return t;
}
function filet(p, x, y, w, tok) { return R(p, x, y, w, 1, tok || "trait/defaut", { name: "Filet" }); }
function vfilet(p, x, y, h, tok) { return R(p, x, y, 1, h, tok || "trait/defaut", { name: "Filet" }); }

// ───────────────────────── Icônes (24 px, trait 1,5, extrémités carrées)
const ICONS = {
  scan: "M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5",
  carte: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14",
  mur: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  collection: "M5 9h14v11H5zM7 6h10M9 3h6",
  profil: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6",
  recherche: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20",
  position: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 2v5M12 17v5M2 12h5M17 12h5",
  fermer: "M6 6l12 12M18 6L6 18",
  retour: "M20 12H5M11 6l-6 6 6 6",
  plus: "M12 5v14M5 12h14",
  valider: "M5 12l5 5 9-10",
  partager: "M12 3v12M7 8l5-5 5 5M5 13v8h14v-8",
  note: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  megaphone: "M3 10v4h4l8 5V5l-8 5zM18 9a4 4 0 0 1 0 6",
  couvert: "M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2 2-3 4-3 8h3",
  etoile: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
  zoom: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20M10.5 8v5M8 10.5h5"
};
function icon(p, name, x, y, tok) {
  const col = hexOf(tok || "trait/fort");
  const svg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' +
    ICONS[name] + '" stroke="' + col + '" stroke-width="1.5" stroke-linecap="square"/></svg>';
  const n = figma.createNodeFromSvg(svg);
  n.name = "Icône/" + name;
  p.appendChild(n);
  n.x = x; n.y = y;
  return n;
}

// ───────────────────────── Affiches
const POSTERS = {
  seb: { num: "003", lieu: "Rue de Belleville", date: "12.11.2026 · 21:04", holo: true },
  ozkan: { num: "017", lieu: "Ménilmontant", date: "11.11.2026 · 08:12" },
  sanbimu: { num: "041", lieu: "Canal Saint-Martin", date: "09.11.2026 · 18:40" },
  skeleton: { num: "002", lieu: "Place des Fêtes", date: "08.11.2026 · 23:15", holo: true },
  habitat: { num: "058", lieu: "Rue des Pyrénées", date: "06.11.2026 · 14:02" },
  white: { num: "064", lieu: "Jourdain", date: "05.11.2026 · 10:47" },
  alta: { num: "003", lieu: "Rue de Belleville", date: "12.11.2026", holo: true },
  presence: { num: "112", lieu: "Belleville", date: "03.11.2026 · 19:30" },
  different: { num: "089", lieu: "Couronnes", date: "02.11.2026 · 12:20" }
};
function imgHash(key) {
  if (!IMGHASH[key]) IMGHASH[key] = figma.createImage(figma.base64Decode(IMG[key].b64)).hash;
  return IMGHASH[key];
}
function imgFill(key, mode) { return [{ type: "IMAGE", scaleMode: mode || "FILL", imageHash: imgHash(key) }]; }
function ph(key, w) { return Math.round(w / IMG[key].r); }

// L'affiche, à son format, sans cadre ni ombre.
function poster(p, key, x, y, w, o) {
  o = o || {};
  const h = ph(key, w);
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = imgFill(key);
  r.name = "Affiche — " + key;
  p.appendChild(r);
  r.x = x; r.y = y;
  if (o.rot) r.rotation = o.rot;
  return r;
}
// Légende sous l'affiche : N° (bleu capture), lieu, date
function caption(p, key, x, y) {
  const d = POSTERS[key];
  const n = T(p, "N° " + d.num, x, y, "Texte/Méta", "accent/capture");
  if (d.holo) T(p, "· Holo", x + n.width + 6, y, "Texte/Méta", "texte/secondaire");
  T(p, d.lieu, x, y + 18, "Texte/Petit", "texte/principal");
  T(p, d.date, x, y + 41, "Texte/Méta", "texte/secondaire");
  return 55;
}
function card(p, key, x, y, w) {
  const h = ph(key, w);
  poster(p, key, x, y, w);
  return h + 8 + caption(p, key, x, y + h + 8);
}

// ───────────────────────── Composants
function statusBar(s, dark) {
  const c = dark ? "#FFFFFF" : "texte/principal";
  T(s, "9:41", 32, 18, "Texte/Label", c, { name: "Heure" });
  R(s, W - 56, 21, 25, 12, null, { stroke: c, name: "Batterie" });
  R(s, W - 54, 23, 18, 8, c, { name: "Batterie niveau" });
}
function homeBar(s, dark) {
  R(s, (W - 134) / 2, H - 13, 134, 5, dark ? "#FFFFFF" : "texte/principal", { radius: 2.5, name: "Indicateur d'accueil" });
}
// En-tête : titre à gauche, action à droite
function headerTitle(s, title, link) {
  R(s, 0, 54, W, 56, "fond/principal", { name: "En-tête" });
  T(s, title, M, 70, "Titre/M", "texte/principal");
  if (link) TR(s, link, W - M, 72, "Texte/Label", "texte/principal", { underline: true });
  filet(s, 0, 110, W);
}
// En-tête : retour, titre centré, icône ou lien à droite
function headerNav(s, title, right) {
  R(s, 0, 54, W, 56, "fond/principal", { name: "En-tête" });
  icon(s, "retour", M, 70);
  TC(s, title, 0, 54, W, 56, "Titre/M", "texte/principal");
  if (right && ICONS[right]) icon(s, right, W - M - 24, 70);
  else if (right) TR(s, right, W - M, 72, "Texte/Label", "texte/principal", { underline: true });
  filet(s, 0, 110, W);
}
// Grand titre d'écran
function headerBig(s, title, meta, link) {
  T(s, title, M, 66, "Titre/XL", "texte/principal");
  if (link) TR(s, link, W - M, 78, "Texte/Label", "texte/principal", { underline: true });
  T(s, meta, M, 114, "Texte/Méta", "texte/secondaire");
}
// Onglets : actif = texte noir + filet de 2 px
function tabs(s, active) {
  R(s, 0, TABS_Y, W, H - TABS_Y, "fond/principal", { name: "Onglets" });
  filet(s, 0, TABS_Y, W);
  const items = ["Carte", "Mur", "Collection"];
  const cw = W / 3;
  items.forEach(function (it, i) {
    const on = i === active;
    if (on) R(s, i * cw + M, TABS_Y, cw - 2 * M, 2, "trait/fort", { name: "Onglet actif" });
    TC(s, it, i * cw, TABS_Y, cw, 56, "Texte/Label", on ? "texte/principal" : "texte/secondaire");
  });
  homeBar(s);
}
// Bouton : principal (noir), secondaire (contour), capture (bleu capture + icône scan)
function button(p, x, y, w, label, kind, h) {
  h = h || 56;
  kind = kind || "principal";
  const fill = kind === "principal" ? "fond/inverse" : kind === "capture" ? "accent/capture" : "fond/principal";
  const txt = kind === "principal" ? "texte/inverse" : kind === "capture" ? "accent/sur-accent" : "texte/principal";
  R(p, x, y, w, h, fill, { stroke: kind === "secondaire" ? "trait/fort" : null, name: "Bouton " + label });
  const t = T(p, label, 0, 0, "Texte/Label", txt);
  let total = t.width;
  if (kind === "capture") total += 32;
  const sx = x + (w - total) / 2;
  if (kind === "capture") { icon(p, "scan", sx, y + (h - 24) / 2, "accent/sur-accent"); p.appendChild(t); t.x = sx + 32; }
  else { p.appendChild(t); t.x = sx; }
  t.y = y + (h - t.height) / 2;
}
// Puce : actif = noir
function puce(p, x, y, label, active) {
  const t = T(p, label, 0, 0, "Texte/Label", active ? "texte/inverse" : "texte/principal");
  const w = t.width + 24;
  R(p, x, y, w, 32, active ? "fond/inverse" : "fond/principal", { stroke: active ? null : "trait/fort", name: "Puce " + label });
  p.appendChild(t);
  t.x = x + 12; t.y = y + (32 - t.height) / 2;
  return w;
}
function puces(p, x, y, list, active) {
  let cx = x;
  list.forEach(function (l, i) { cx += puce(p, cx, y, l, i === active) + 8; });
}
// Étiquette : catégorie en contour, numéro de scan en bleu capture
function etiquette(p, x, y, label, kind) {
  const num = kind === "num";
  const t = T(p, label, 0, 0, "Texte/Méta", num ? "accent/sur-accent" : "texte/principal");
  const w = t.width + 12;
  R(p, x, y, w, 20, num ? "accent/capture" : "fond/principal", { stroke: num ? null : "trait/fort", name: "Étiquette " + label });
  p.appendChild(t);
  t.x = x + 6; t.y = y + (20 - t.height) / 2;
  return w;
}
function pastille(p, x, y) { return R(p, x, y, 8, 8, "accent/capture", { name: "Pastille nouveau" }); }
function checkbox(p, x, y, on) {
  R(p, x, y, 24, 24, on ? "fond/inverse" : "fond/principal", { stroke: on ? null : "trait/fort", name: on ? "Coche active" : "Coche" });
  if (on) icon(p, "valider", x, y, "texte/inverse");
}
function selection(p, x, y, w, h) {
  R(p, x - 4, y - 4, w + 8, h + 8, null, { stroke: "trait/fort", name: "Sélection" });
  [[x - 4, y - 4], [x + w + 4, y - 4], [x - 4, y + h + 4], [x + w + 4, y + h + 4]].forEach(function (c) {
    R(p, c[0] - 4, c[1] - 4, 8, 8, "fond/inverse", { name: "Poignée" });
  });
}
// Badge (proposé) : carré à contour, icône au trait ; débloqué = noir si choisi ; verrouillé = filet gris + progression
function badge(p, x, y, ic, label, o) {
  o = o || {};
  const s = 64;
  R(p, x, y, s, s, o.on ? "fond/inverse" : "fond/principal", { stroke: o.on ? null : (o.locked ? "trait/defaut" : "trait/fort"), name: "Badge " + label });
  icon(p, ic, x + 20, y + 20, o.on ? "texte/inverse" : (o.locked ? "texte/secondaire" : "trait/fort"));
  const lb = T(p, label, x, y + s + 8, "Texte/Méta", o.locked ? "texte/secondaire" : "texte/principal", { w: COLW });
  if (o.progress) T(p, o.progress, x, lb.y + lb.height + 2, "Texte/Méta", "texte/secondaire");
}
// Curseur (placer sur le profil)
function slider(p, y, label, value, ratio) {
  T(p, label, M, y, "Texte/Petit", "texte/principal");
  TR(p, value, W - M, y, "Texte/Petit", "texte/secondaire");
  filet(p, M, y + 34, FULL);
  R(p, M, y + 33, FULL * ratio, 2, "trait/fort", { name: "Valeur" });
  R(p, M + FULL * ratio - 8, y + 26, 16, 16, "fond/inverse", { name: "Curseur" });
}

// ───────────────────────── Fond / Grille
const GRID_MAJ_X = [M, M + COLW + G / 2, M + 2 * COLW + G * 1.5, M + 3 * COLW + G * 2.5, W - M];
function makeGrid() {
  const c = figma.createComponent();
  c.name = "Fond / Grille";
  c.resize(W, H);
  c.fills = paint("fond/principal");
  c.clipsContent = true;
  c.description = "Grille de fond discrète. Premier calque de chaque écran clair. Trait noir 5 %, lignes marquées 9 %, repères gris texte 50 %. Calée sur les 4 colonnes et la base 4 (24 / 96 px).";
  // verticales : marges + milieux de gouttières (marquées), chaque bande divisée en 4
  for (let b = 0; b < 4; b++) {
    const a = GRID_MAJ_X[b], z = GRID_MAJ_X[b + 1];
    for (let k = 0; k < 4; k++) {
      const x = a + (z - a) * k / 4;
      R(c, x - 0.5, 0, 1, H, "texte/principal", { op: k === 0 ? 0.09 : 0.05, name: k === 0 ? "Verticale marquée" : "Verticale" });
    }
  }
  R(c, W - M - 0.5, 0, 1, H, "texte/principal", { op: 0.09, name: "Verticale marquée" });
  // horizontales : tous les 24 px, marquées tous les 96 px
  for (let y = 24; y < H; y += 24) {
    R(c, 0, y - 0.5, W, 1, "texte/principal", { op: y % 96 === 0 ? 0.09 : 0.05, name: y % 96 === 0 ? "Horizontale marquée" : "Horizontale" });
  }
  // repères « + »
  GRID_MAJ_X.forEach(function (x) {
    for (let y = 96; y < H; y += 96) {
      R(c, x - 4.5, y - 0.5, 9, 1, "texte/secondaire", { op: 0.5, name: "Repère" });
      R(c, x - 0.5, y - 4.5, 1, 9, "texte/secondaire", { op: 0.5, name: "Repère" });
    }
  });
  return c;
}

function screen(p, name, x, y, o) {
  o = o || {};
  const s = FR(p, name, x, y, W, H, o.dark ? "#111111" : "fond/principal");
  s.layoutGrids = [{
    pattern: "COLUMNS", alignment: "STRETCH", gutterSize: G, count: 4, offset: M,
    visible: false, color: { r: 0.94, g: 0.94, b: 0.93, a: 0.6 }
  }];
  if (o.grid) {
    const inst = o.grid.createInstance();
    s.appendChild(inst);
    inst.x = 0; inst.y = 0;
    inst.name = "Fond / Grille";
    inst.locked = true;
  }
  return s;
}

// ───────────────────────── Écrans
function mapView(s) {
  R(s, 0, 0, W, TABS_Y, "fond/secondaire", { name: "Carte" });
  R(s, 40, 330, 130, 100, "trait/defaut", { op: 0.6, name: "Parc" });
  R(s, 250, 470, 120, 130, "trait/defaut", { op: 0.6, name: "Parc" });
  [[0, 180, W, 10, 0], [0, 450, W, 14, 0], [104, 0, 10, TABS_Y, 0], [276, 0, 12, TABS_Y, 0],
   [-60, 280, 540, 8, -16], [-60, 600, 540, 8, 18]].forEach(function (r) {
    R(s, r[0], r[1], r[2], r[3], "fond/principal", { rot: r[4], name: "Rue" });
  });
  const t = T(s, "Rue de Belleville", 0, 0, "Texte/Méta", "texte/secondaire");
  t.x = 150; t.y = 436;
  // marqueurs d'affiche (pastille si nouvelle)
  [[136, 220, true], [300, 360, false], [200, 520, true], [64, 560, false], [330, 196, false], [150, 300, false]].forEach(function (m) {
    R(s, m[0], m[1], 14, 20, "fond/principal", { stroke: "trait/fort", name: "Marqueur affiche" });
    if (m[2]) pastille(s, m[0] + 10, m[1] - 4);
  });
  // ma position (cercle, exception)
  E(s, 210, 384, 16, "accent/capture", { stroke: "fond/principal", sw: 3, name: "Ma position" });
}

function s1(p, x, y) {
  const s = screen(p, "Étape 1 — Carte d'accueil", x, y);
  mapView(s);
  statusBar(s);
  // champ de recherche (filet sous le texte)
  R(s, M, 62, 306, 48, "fond/principal", { name: "Champ de recherche" });
  icon(s, "recherche", M + 12, 74, "texte/secondaire");
  T(s, "Rechercher une affiche, un lieu", M + 44, 76, "Texte/Petit", "texte/secondaire");
  filet(s, M + 12, 101, 282, "trait/fort");
  R(s, W - M - 48, 62, 48, 48, "fond/principal", { stroke: "trait/fort", name: "Profil" });
  icon(s, "profil", W - M - 36, 74);
  // aperçu de l'affiche la plus proche
  R(s, M, 616, FULL, 80, "fond/principal", { stroke: "trait/defaut", name: "Affiche proche" });
  const r = figma.createRectangle(); r.resize(48, 64); r.fills = imgFill("alta"); r.name = "Affiche — alta"; s.appendChild(r); r.x = M + 8; r.y = 624;
  pastille(s, M + 68, 632);
  T(s, "Nouveau · à 120 m", M + 82, 629, "Texte/Méta", "texte/secondaire");
  T(s, "Alta Fidelidad", M + 68, 648, "Titre/M", "texte/principal");
  T(s, "Rue de Belleville", M + 68, 672, "Texte/Petit", "texte/secondaire");
  icon(s, "position", W - M - 36, 644, "trait/fort");
  button(s, M, 712, FULL, "Scanner une affiche", "capture");
  tabs(s, 0);
}

function s2(p, x, y) {
  const s = screen(p, "Étape 2 — Scanner (mode sombre)", x, y, { dark: true });
  R(s, 0, 0, W, H, "#2B2B29", { name: "Caméra" });
  R(s, 0, 640, W, H - 640, "#1C1C1B", { name: "Caméra — sol" });
  poster(s, "white", 96, 236, 214, { rot: -3 });
  statusBar(s, true);
  icon(s, "fermer", M, 70, "#FFFFFF");
  TC(s, "Cadre l'affiche", 0, 54, W, 56, "Texte/Méta", "#FFFFFF");
  // cadre du scanner (bleu capture)
  const bx = 66, by = 190, bw = 270, bh = 390, L = 28, th = 3;
  [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(function (c) {
    R(s, c[2] > 0 ? c[0] : c[0] - L, c[3] > 0 ? c[1] : c[1] - th, L, th, "accent/capture", { name: "Cadre du scanner" });
    R(s, c[2] > 0 ? c[0] : c[0] - th, c[3] > 0 ? c[1] : c[1] - L, th, L, "accent/capture", { name: "Cadre du scanner" });
  });
  T(s, "L'affiche entière dans le cadre, téléphone bien droit.", 66, 604, "Texte/Petit", "#9A9A96", { w: 270, align: "CENTER" });
  // déclencheur
  E(s, W / 2 - 38, 724, 76, null, { stroke: "#FFFFFF", sw: 2, name: "Déclencheur — anneau" });
  E(s, W / 2 - 30, 732, 60, "accent/capture", { name: "Déclencheur" });
  homeBar(s, true);
}

function s3(p, x, y, g) {
  const s = screen(p, "Étape 3 — Affiche scannée (recto)", x, y, { grid: g });
  statusBar(s);
  headerNav(s, "Affiche", "partager");
  poster(s, "alta", M, 126, FULL);
  const ty = 126 + ph("alta", FULL) + 16;
  const w1 = etiquette(s, M, ty, "N° 003", "num");
  T(s, "3e personne à la scanner", M + w1 + 8, ty + 3, "Texte/Méta", "texte/secondaire");
  const wh = etiquette(s, 0, ty, "État · Holo", "cat");
  s.children.slice(-2).forEach(function (n) { n.x += W - M - wh; }); // étiquette d'état calée à droite
  T(s, "Alta Fidelidad", M, ty + 30, "Titre/L", "texte/principal");
  T(s, "Rue de Belleville · 12.11.2026", M, ty + 66, "Texte/Méta", "texte/secondaire");
  TC(s, "← Glisser pour retourner", 0, 740, W, 20, "Texte/Méta", "texte/secondaire");
  button(s, M, 776, FULL, "Ajouter au mur", "principal");
  homeBar(s);
}

function s4(p, x, y, g) {
  const s = screen(p, "Étape 4 — Verso (infos, par swipe)", x, y, { grid: g });
  statusBar(s);
  headerNav(s, "Affiche", "partager");
  R(s, M, 126, FULL - COLW - G, 92, "fond/principal", { name: "Fond numéro" });
  T(s, "003", M, 130, "Chiffre/Capture", "accent/capture");
  T(s, "Ton numéro de scan", M, 194, "Texte/Méta", "texte/secondaire");
  poster(s, "alta", COLX[3], 126, COLW);
  T(s, "Alta Fidelidad", M, 264, "Titre/L", "texte/principal");
  const rows = [["Artiste", "Alta Fidelidad Sound Rooms"], ["Lieu", "Rue de Belleville, 20e"], ["Date", "12.11.2026 · 21:04"],
    ["Thème", "Concert · Musique"], ["État", "Holographique"], ["Collection", "Concerts · 4 / 5"]];
  R(s, 0, 310, W, rows.length * 44, "fond/principal", { name: "Tableau" });
  rows.forEach(function (r, i) {
    const ry = 310 + i * 44;
    filet(s, M, ry, FULL);
    T(s, r[0], M, ry + 15, "Texte/Méta", "texte/secondaire");
    T(s, r[1], COLX[1], ry + 12, "Texte/Petit", "texte/principal");
  });
  filet(s, M, 310 + rows.length * 44, FULL);
  R(s, M, 590, FULL, 48, "fond/principal", { name: "Fond texte" });
  T(s, "Scannée par 128 personnes. Placée sur 12 murs dans le 20e arrondissement.", M, 594, "Texte/Corps", "texte/principal", { w: FULL });
  TC(s, "Glisser pour revenir à l'affiche →", 0, 740, W, 20, "Texte/Méta", "texte/secondaire");
  button(s, M, 776, FULL, "Ajouter au mur", "principal");
  homeBar(s);
}

function torn(p, key, x, y, w) {
  const h = ph(key, w);
  const mask = figma.createVector();
  mask.vectorPaths = [{
    windingRule: "NONZERO",
    data: "M 0 0 L " + w + " 0 L " + w + " " + (h * 0.55) + " L " + (w * 0.82) + " " + (h * 0.62) + " L " + (w * 0.9) + " " + (h * 0.7) +
      " L " + (w * 0.68) + " " + (h * 0.78) + " L " + (w * 0.76) + " " + (h * 0.86) + " L " + (w * 0.55) + " " + h + " L 0 " + h + " Z"
  }];
  mask.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  mask.isMask = true;
  p.appendChild(mask);
  mask.x = x; mask.y = y;
  const img = poster(p, key, x, y, w);
  const grp = figma.group([mask, img], p);
  grp.name = "Affiche déchirée — " + key;
  return grp;
}

function s5(p, x, y, g) {
  const s = screen(p, "Étape 5 — Mur virtuel (plein écran)", x, y, { grid: g });
  statusBar(s);
  R(s, 0, 54, W, 56, "fond/principal", { name: "En-tête" });
  T(s, "Mon mur", M, 62, "Titre/M", "texte/principal");
  T(s, "Belleville · 8 affiches", M, 88, "Texte/Méta", "texte/secondaire");
  TR(s, "Valider", W - M, 72, "Texte/Label", "texte/principal", { underline: true });
  filet(s, 0, 110, W);
  poster(s, "alta", M, 134, 132);
  poster(s, "seb", 164, 126, 104);
  poster(s, "presence", 284, 142, COLW + 15.5);
  torn(s, "ozkan", M, 340, COLW);
  const sx = COLX[1], sy = 330;
  poster(s, "sanbimu", sx, sy, COL2);
  selection(s, sx, sy, COL2, ph("sanbimu", COL2));
  poster(s, "skeleton", COLX[3], 330, COLW);
  poster(s, "habitat", M, 500, COLW);
  poster(s, "white", COLX[3], 520, COLW);
  T(s, "Zoom 100 % · glisser pour déplacer", M, 682, "Texte/Méta", "texte/secondaire");
  puces(s, M, 712, ["Zoomer", "Déplacer", "Déchirer", "Tirer"], 1);
  tabs(s, 1);
}

const COLL_A = ["seb", "sanbimu", "habitat"];
const COLL_B = ["ozkan", "skeleton", "white"];
function grid2(s, sel) {
  [[COLL_A, M], [COLL_B, COLX[2]]].forEach(function (col) {
    let cy = 188;
    col[0].forEach(function (k) {
      const h = ph(k, COL2);
      const used = card(s, k, col[1], cy, COL2);
      if (sel) checkbox(s, col[1] + COL2 - 32, cy + 8, sel.indexOf(k) !== -1);
      cy += used + 24;
    });
  });
}

function s6(p, x, y, g) {
  const s = screen(p, "Étape 6 — Collection (plein écran)", x, y, { grid: g });
  statusBar(s);
  headerBig(s, "Ma collection", "48 affiches · 6 quartiers", "Sélectionner");
  puces(s, M, 140, ["Dernières", "Plus rares", "Favoris", "Lieu", "État", "Thème"], 0);
  grid2(s);
  tabs(s, 2);
}

function s7(p, x, y, g) {
  const s = screen(p, "Étape 7 — Sélection d'une affiche", x, y, { grid: g });
  statusBar(s);
  headerBig(s, "Sélection", "3 sélectionnées · la dernière : N° 064", "Annuler");
  puces(s, M, 140, ["Dernières", "Plus rares", "Favoris", "Lieu", "État", "Thème"], 0);
  grid2(s, ["seb", "skeleton", "white"]);
  R(s, 0, 696, W, 88, "fond/principal", { name: "Barre d'action" });
  filet(s, 0, 696, W);
  button(s, M, 712, FULL, "Ajouter la dernière au profil", "principal");
  tabs(s, 2);
}

function s8(p, x, y, g) {
  const s = screen(p, "Étape 8 — Placer sur le profil", x, y, { grid: g });
  statusBar(s);
  headerNav(s, "Modifier mon profil");
  R(s, M, 126, 48, 48, "fond/secondaire", { name: "Avatar" });
  icon(s, "profil", M + 12, 138);
  T(s, "Inès", M + 64, 128, "Titre/M", "texte/principal");
  T(s, "Belleville · rang 12", M + 64, 156, "Texte/Méta", "texte/secondaire");
  T(s, "Vitrine · glisse l'affiche pour la placer", M, 196, "Texte/Méta", "texte/secondaire");
  R(s, M, 216, FULL, 340, null, { stroke: "trait/defaut", name: "Zone du profil" });
  poster(s, "alta", 32, 232, 110);
  poster(s, "presence", 270, 250, 100);
  const px = 158, py = 296, pw = 112;
  poster(s, "white", px, py, pw, { rot: -4 });
  selection(s, px, py - 4, pw + 12, ph("white", pw) + 8);
  R(s, 0, 572, W, 140, "fond/principal", { name: "Réglages" });
  filet(s, 0, 572, W);
  T(s, "Affiche sélectionnée · N° 064", M, 588, "Texte/Méta", "texte/secondaire");
  slider(s, 614, "Taille", "120 %", 0.6);
  slider(s, 664, "Rotation", "−4°", 0.45);
  button(s, M, 776, FULL, "Valider", "principal");
  homeBar(s);
}

function s9(p, x, y, g) {
  const s = screen(p, "Étape 9 — Profil (vu par les autres)", x, y, { grid: g });
  statusBar(s);
  headerNav(s, "Profil", "partager");
  R(s, M, 126, 88, 88, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", M, 126, 88, 88, "Titre/L", "texte/principal");
  T(s, "Inès", 120, 132, "Titre/L", "texte/principal");
  T(s, "Belleville · rang 12", 120, 170, "Texte/Méta", "texte/secondaire");
  etiquette(s, 120, 190, "Concerts", "cat");
  R(s, 0, 230, W, 72, "fond/principal", { name: "Compteurs" });
  filet(s, 0, 230, W); filet(s, 0, 302, W);
  [["48", "Affiches"], ["6", "Quartiers"], ["4", "Badges"]].forEach(function (v, i) {
    if (i > 0) vfilet(s, i * W / 3, 230, 72);
    T(s, v[0], i * W / 3 + M, 240, "Titre/L", "texte/principal");
    T(s, v[1], i * W / 3 + M, 274, "Texte/Méta", "texte/secondaire");
  });
  T(s, "Affiche mise en avant", M, 322, "Texte/Méta", "texte/secondaire");
  poster(s, "seb", M, 344, COL2);
  T(s, "Mur public", COLX[2], 322, "Texte/Méta", "texte/secondaire");
  poster(s, "alta", COLX[2], 344, COLW);
  poster(s, "presence", COLX[3], 344, COLW);
  poster(s, "ozkan", COLX[2], 474, COLW);
  poster(s, "different", COLX[3], 474, COLW);
  T(s, "Badges", M, 628, "Texte/Méta", "texte/secondaire");
  [["note", "Concerts", true], ["scan", "1er scan"], ["etoile", "Holo"], ["position", "Belleville"]].forEach(function (b, i) {
    badge(s, COLX[i], 648, b[0], b[1], { on: b[2] });
  });
  button(s, M, 776, COL2, "Suivre", "principal");
  button(s, COLX[2], 776, COL2, "Partager", "secondaire");
  homeBar(s);
}

function s10(p, x, y, g) {
  const s = screen(p, "Étape 10 — Modifier un badge", x, y, { grid: g });
  statusBar(s);
  headerNav(s, "Badges");
  // notification
  R(s, M, 126, FULL, 48, "fond/inverse", { name: "Notification" });
  icon(s, "valider", M + 12, 138, "texte/inverse");
  T(s, "Badge débloqué : Concerts", M + 44, 140, "Texte/Petit", "texte/inverse");
  TR(s, "Voir", W - M - 12, 139, "Texte/Label", "texte/inverse", { underline: true });
  T(s, "Choisis le badge affiché sur ton profil", M, 198, "Texte/Méta", "texte/secondaire");
  const list = [["note", "Concerts", { on: true }], ["scan", "1er scan", {}], ["position", "Belleville", {}], ["etoile", "Holo", {}],
    ["megaphone", "Messages politiques", { locked: true, progress: "2 / 10" }], ["collection", "Culture et musique", { locked: true, progress: "7 / 8" }],
    ["couvert", "Restaurants", { locked: true, progress: "0 / 6" }], ["mur", "50 affiches", { locked: true, progress: "48 / 50" }]];
  list.forEach(function (b, i) {
    badge(s, COLX[i % 4], 222 + Math.floor(i / 4) * 136, b[0], b[1], b[2]);
  });
  T(s, "Aperçu sur mon profil", M, 500, "Texte/Méta", "texte/secondaire");
  R(s, M, 522, FULL, 112, "fond/principal", { stroke: "trait/defaut", name: "Aperçu" });
  R(s, M + 16, 538, 80, 80, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", M + 16, 538, 80, 80, "Titre/L", "texte/principal");
  T(s, "Inès", M + 112, 544, "Titre/L", "texte/principal");
  T(s, "Belleville · rang 12", M + 112, 580, "Texte/Méta", "texte/secondaire");
  R(s, W - M - 56, 552, 40, 40, "fond/inverse", { name: "Badge choisi" });
  icon(s, "note", W - M - 48, 560, "texte/inverse");
  button(s, M, 776, FULL, "Enregistrer", "principal");
  homeBar(s);
}

function s11(p, x, y, g) {
  const s = screen(p, "Étape 11 — Mes collections (ce qui manque)", x, y, { grid: g });
  statusBar(s);
  headerBig(s, "Mes collections", "4 collections · 13 / 29 affiches");
  const data = [
    ["Concerts", 4, 5, ["seb", "alta", "presence", "different"]],
    ["Culture et musique", 7, 8, ["sanbimu", "ozkan", "white", "habitat", "skeleton"]],
    ["Messages politiques", 2, 10, ["different", "white"]],
    ["Restaurants", 0, 6, []]
  ];
  data.forEach(function (c, k) {
    const by = 146 + k * 156;
    R(s, 0, by, W, 156, "fond/principal", { name: "Ligne de collection — " + c[0] });
    filet(s, M, by, FULL);
    T(s, c[0], M, by + 16, "Titre/M", "texte/principal");
    TR(s, c[1] + " / " + c[2], W - M, by + 16, "Titre/M", "texte/principal");
    const miss = c[2] - c[1];
    T(s, c[1] === 0 ? "Non commencée" : (miss === 1 ? "Il manque 1 affiche" : "Il manque " + miss + " affiches"), M, by + 44, "Texte/Méta", "texte/secondaire");
    if (miss > 0) TR(s, "Voir sur la carte", W - M, by + 41, "Texte/Petit", "texte/principal", { underline: true });
    filet(s, M, by + 68, FULL);
    R(s, M, by + 67, FULL * c[1] / c[2], 2, "trait/fort", { name: "Progression" });
    const slots = Math.min(c[2], 6);
    const filled = Math.min(c[3].length, c[1] < c[2] ? slots - 1 : slots);
    for (let i = 0; i < slots; i++) {
      const sw = (FULL - 5 * G) / 6, sx = M + i * (sw + G), sy = by + 84;
      if (i < filled) {
        const r = figma.createRectangle(); r.resize(sw, 60); r.fills = imgFill(c[3][i], "FIT"); r.name = "Affiche — " + c[3][i];
        s.appendChild(r); r.x = sx; r.y = sy;
      } else {
        R(s, sx, sy, sw, 60, null, { stroke: "trait/defaut", name: "Affiche manquante" });
        icon(s, "plus", sx + (sw - 24) / 2, sy + 18, "trait/defaut");
      }
    }
  });
  filet(s, M, 146 + 4 * 156, FULL);
  tabs(s, 2);
}

const SCREENS = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
const TITLES = ["Carte d'accueil", "Scanner", "Affiche scannée (recto)", "Verso (infos, par swipe)", "Mur virtuel (plein écran)",
  "Collection (plein écran)", "Sélection d'une affiche", "Placer sur le profil", "Profil (vu par les autres)", "Modifier un badge",
  "Mes collections (ce qui manque)"];

function buildScreens(x0, y0, grid) {
  const PAD = 80, GAP = 80, cols = 6;
  const WW = PAD * 2 + cols * W + (cols - 1) * GAP;
  const r1 = 240, r2 = r1 + H + 160;
  const w = FR(figma.currentPage, "Maquettes — parcours d'Inès (v1, design system appliqué)", x0, y0, WW, r2 + H + PAD, "fond/principal");
  T(w, "Maquettes — parcours d'Inès", PAD, 80, "Titre/XL", "texte/principal");
  T(w, "Design system v1.0 appliqué · grille de fond (09) · 11 étapes · iPhone 17, 402 × 874", PAD, 136, "Texte/Méta", "texte/secondaire");
  SCREENS.forEach(function (fn, i) {
    const sx = PAD + (i % cols) * (W + GAP);
    const sy = i < cols ? r1 : r2;
    T(w, "Étape " + (i + 1) + " · " + TITLES[i], sx, sy - 36, "Titre/M", "texte/principal");
    fn(w, sx, sy, grid);
  });
  return w;
}

// ───────────────────────── Design system : section 09 — Grille de fond
function buildGridSection(x0, y0) {
  const DW = 2560, DH = 2240;
  const f = FR(figma.currentPage, "DESIGN SYSTEM — 09 Grille de fond", x0, y0, DW, DH, "fond/principal");
  R(f, 120, 80, DW - 240, 2, "trait/fort", { name: "Filet de section" });
  T(f, "09", 120, 136, "Texte/Méta", "texte/principal");
  const t = T(f, "Grille de fond", 120, 166, "Titre/XL", "texte/principal");
  t.fontSize = 56; t.lineHeight = { value: 56, unit: "PIXELS" };
  STYLE_QUEUE.pop(); // taille de section du DS, pas un style d'écran
  T(f, "Le fond n'est jamais tout à fait vide : une grille très légère rappelle le mur de travail sur lequel on épingle ses affiches. Elle structure sans se voir.", 120, 246, "Texte/Corps", "texte/secondaire", { w: 440 });

  const rules = [
    ["Toujours derrière", "Premier calque de chaque écran clair (composant « Fond / Grille »). Affiches, boutons, barres et champs ont un fond plein : elle ne passe jamais devant."],
    ["Calée sur les 4 colonnes", "Lignes verticales sur les marges (16) et au milieu des gouttières. Chaque colonne est divisée en 4."],
    ["Rythmée par la base 4", "Une ligne horizontale tous les 24 px, une ligne marquée tous les 96 px."],
    ["Presque invisible", "Trait texte/principal à 5 %, lignes marquées à 9 %, repère « + » de 9 px en texte/secondaire à 50 % aux croisements."],
    ["Le mur, pas un décor", "Sur le mur virtuel et la vitrine du profil, elle sert de support pour poser et aligner les affiches."],
    ["Pas partout", "Jamais sous la carte, jamais sur le scanner (mode sombre) : ces écrans ont déjà leur propre fond."]
  ];
  rules.forEach(function (r, i) {
    const cx = 680 + (i % 3) * 600, cy = 136 + Math.floor(i / 3) * 230;
    const n = T(f, String(i + 1), cx, cy, "Chiffre/Capture", i === 0 ? "accent/capture" : "texte/principal");
    n.fontSize = 56; STYLE_QUEUE.pop();
    T(f, r[0], cx, cy + 72, "Titre/M", "texte/principal");
    T(f, r[1], cx, cy + 108, "Texte/Petit", "texte/principal", { w: 520 });
  });

  const vy = 640;
  const grid = makeGrid();
  f.appendChild(grid); grid.x = 680; grid.y = vy;
  T(f, "Composant · Fond / Grille", 680, vy + H + 16, "Texte/Méta", "texte/principal");
  T(f, "402 × 874 · verrouillé · ancré en haut à gauche", 680, vy + H + 36, "Texte/Petit", "texte/secondaire");

  const d1 = FR(f, "Schéma — colonnes", 1160, vy, W, H, null);
  const i1 = grid.createInstance(); d1.appendChild(i1); i1.x = 0; i1.y = 0;
  COLX.forEach(function (cx, k) { R(d1, cx, 0, COLW, H, "fond/secondaire", { op: 0.5, name: "Colonne " + (k + 1) }); });
  T(f, "Alignée sur la grille 4 colonnes", 1160, vy + H + 16, "Texte/Méta", "texte/principal");
  T(f, "Marges 16 · gouttières 8 · colonnes 86,5", 1160, vy + H + 36, "Texte/Petit", "texte/secondaire");

  const d2 = FR(f, "Exemple — affiche posée", 1640, vy, W, H, null);
  const i2 = grid.createInstance(); d2.appendChild(i2); i2.x = 0; i2.y = 0;
  T(d2, "Ma collection", M, 66, "Titre/XL", "texte/principal");
  card(d2, "seb", M, 140, COL2);
  card(d2, "ozkan", COLX[2], 140, COL2);
  T(f, "En application", 1640, vy + H + 16, "Texte/Méta", "texte/principal");
  T(f, "L'affiche reste posée sur du blanc, la grille autour", 1640, vy + H + 36, "Texte/Petit", "texte/secondaire");

  // tokens
  const ty = vy + H + 120;
  T(f, "Tokens de la grille", 680, ty, "Texte/Méta", "texte/principal");
  [["Token", "Valeur", "Usage"],
   ["grille/trait", "texte/principal · 5 %", "Lignes fines (24 px, quarts de colonne)"],
   ["grille/trait-marqué", "texte/principal · 9 %", "Marges, gouttières, lignes tous les 96 px"],
   ["grille/repère", "texte/secondaire · 50 %", "Croix « + » de 9 px aux croisements"],
   ["grille/module", "24 px · 96 px", "Base 4 × 6, ligne marquée toutes les 4"]].forEach(function (r, i) {
    const ry = ty + 32 + i * 36;
    const st = i === 0 ? "Texte/Méta" : "Texte/Petit";
    const col = i === 0 ? "texte/secondaire" : "texte/principal";
    T(f, r[0], 680, ry, st, col); T(f, r[1], 1000, ry, st, col); T(f, r[2], 1320, ry, st, i === 0 ? col : "texte/secondaire");
    filet(f, 680, ry + 28, 1360);
  });
  return { frame: f, grid: grid };
}

// ───────────────────────── Liens avec le fichier
async function linkTokens() {
  try {
    const vars = await figma.variables.getLocalVariablesAsync("COLOR");
    Object.keys(TOK).forEach(function (tok) {
      const v = vars.find(function (x) {
        const n = x.name.toLowerCase();
        return n === tok || n.endsWith("/" + tok);
      });
      if (v) { VARS[tok] = v; linkedVars++; }
    });
  } catch (e) { /* pas de variables */ }
  try {
    const ts = await figma.getLocalTextStylesAsync();
    Object.keys(STY).forEach(function (name) {
      const st = ts.find(function (x) { const n = x.name.toLowerCase(); return n === name.toLowerCase() || n.endsWith("/" + name.toLowerCase()); });
      if (st) TSTYLES[name] = st.id;
    });
  } catch (e) { /* pas de styles */ }
}
async function applyTextStyles() {
  for (let i = 0; i < STYLE_QUEUE.length; i++) {
    const id = TSTYLES[STYLE_QUEUE[i][1]];
    if (!id) continue;
    try { await STYLE_QUEUE[i][0].setTextStyleIdAsync(id); linkedStyles++; } catch (e) { /* garde la valeur brute */ }
  }
}

function rightEdge() {
  let m = 0;
  figma.currentPage.children.forEach(function (n) { m = Math.max(m, n.x + n.width); });
  return m;
}

(async function () {
  try {
    await figma.loadFontAsync(FONTS.reg);
    await figma.loadFontAsync(FONTS.med);
    await figma.loadFontAsync(FONTS.sb);
    await linkTokens();
    const cmd = figma.command || "all";
    const x0 = rightEdge() + 400;
    const made = [];
    let grid = figma.currentPage.findOne(function (n) { return n.type === "COMPONENT" && n.name === "Fond / Grille" && n.width === W; });
    let y = 0;
    if (cmd === "all" || cmd === "grid") {
      const r = buildGridSection(x0, 0);
      grid = r.grid;
      made.push(r.frame);
      y = r.frame.height + 300;
    }
    if (cmd === "all" || cmd === "screens") {
      if (!grid) {
        const r = buildGridSection(x0, 0);
        grid = r.grid; made.push(r.frame); y = r.frame.height + 300;
      }
      made.push(buildScreens(x0, y, grid));
    }
    await applyTextStyles();
    figma.currentPage.selection = made;
    figma.viewport.scrollAndZoomIntoView(made);
    figma.closePlugin("Terminé · " + linkedVars + "/10 couleurs et " + Object.keys(TSTYLES).length + "/8 styles de texte liés au design system du fichier.");
  } catch (e) {
    figma.closePlugin("Erreur : " + (e && e.message ? e.message : e));
  }
})();
