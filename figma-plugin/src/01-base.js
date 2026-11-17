// ─────────────────────────────────────────────────────────────
// SCRAP — plugin Figma v4
// Maquettes complètes (50 écrans numérotés) appliquées au design
// system de l'équipe (DESIGN SYSTEM — Affiches, v1.0)
// + sections 09 « Grille de fond » et 10 « Scrap ».
// Les couleurs et styles de texte se lient aux variables et styles
// du fichier quand ils sont trouvés par leur nom.
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
const BTN_Y = 776;                                // bouton bas sans onglets
const BTN_TABS_Y = 712;                           // bouton bas au-dessus des onglets

const VARS = {};
const TSTYLES = {};
const STYLE_QUEUE = [];
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
    if (o.dash) r.dashPattern = o.dash;
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
  if (o.stroke) { e.strokes = paint(o.stroke); e.strokeWeight = o.sw || 1; e.strokeAlign = "INSIDE"; }
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
// Texte centré sur toute la largeur de l'écran, avec retour à la ligne
function TW(p, str, y, style, color, w) {
  w = w || 330;
  return T(p, str, (W - w) / 2, y, style, color, { w: w, align: "CENTER" });
}
function filet(p, x, y, w, tok) { return R(p, x, y, w, 1, tok || "trait/defaut", { name: "Filet" }); }
function vfilet(p, x, y, h, tok) { return R(p, x, y, 1, h, tok || "trait/defaut", { name: "Filet" }); }

// Vecteur ouvert (itinéraire, geste) — coordonnées absolues dans le parent
function path(p, pts, tok, o) {
  o = o || {};
  let mx = Infinity, my = Infinity;
  pts.forEach(function (q) { mx = Math.min(mx, q[0]); my = Math.min(my, q[1]); });
  const v = figma.createVector();
  v.vectorPaths = [{ windingRule: "NONE", data: "M " + pts.map(function (q) { return (q[0] - mx) + " " + (q[1] - my); }).join(" L ") }];
  v.fills = [];
  v.strokes = paint(tok || "trait/fort");
  v.strokeWeight = o.sw || 3;
  v.strokeCap = "SQUARE";
  if (o.dash) v.dashPattern = o.dash;
  v.name = o.name || "Tracé";
  p.appendChild(v);
  v.x = mx; v.y = my;
  return v;
}

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
  chevron: "M9 6l6 6-6 6",
  camera: "M3 7h4l2-3h6l2 3h4v13H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  cloche: "M6 17v-6a6 6 0 1 1 12 0v6l2 2H4zM10 21h4",
  cadenas: "M6 11h12v10H6zM8 11V7a4 4 0 1 1 8 0v4",
  horsligne: "M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M2 9.5a15 15 0 0 1 4.5-2.8M19 13a10 10 0 0 0-2.4-1.7M11 20h2",
  filtre: "M4 6h16M7 12h10M10 18h4",
  scotch: "M3 9l14-5 4 9-14 5zM8 7.2l3.6 9.5",
  dechirer: "M4 4h16v7l-3 2 2 3-3 2v2H4z",
  fond: "M4 4h16v16H4zM4 12h16M12 4v16",
  aide: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M11 17h2",
  lien: "M10 14l4-4M8 11l-2 2a3.5 3.5 0 0 0 5 5l2-2M16 13l2-2a3.5 3.5 0 0 0-5-5l-2 2",
  message: "M4 5h16v11H9l-5 4z",
  attention: "M12 3l10 18H2zM12 10v5M11 18h2"
};
function icon(p, name, x, y, tok, size) {
  size = size || 24;
  const col = hexOf(tok || "trait/fort");
  const svg = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' +
    ICONS[name] + '" stroke="' + col + '" stroke-width="' + (1.5 * 24 / size).toFixed(2) + '" stroke-linecap="square"/></svg>';
  const n = figma.createNodeFromSvg(svg);
  n.name = "Icône/" + name;
  p.appendChild(n);
  n.x = x; n.y = y;
  return n;
}

// ───────────────────────── Scraps (affiches capturées)
const SCRAPS = {
  seb: { num: "019", lieu: "Rue de Belleville", date: "12.11.26", arr: "Paris 20e", holo: true },
  ozkan: { num: "017", lieu: "Ménilmontant", date: "11.11.26", arr: "Paris 20e", complet: true },
  sanbimu: { num: "041", lieu: "Canal St-Martin", date: "09.11.26", arr: "Paris 10e", complet: true },
  skeleton: { num: "002", lieu: "Place des Fêtes", date: "08.11.26", arr: "Paris 19e", holo: true, complet: true },
  habitat: { num: "058", lieu: "Rue des Pyrénées", date: "06.11.26", arr: "Paris 20e", complet: true },
  white: { num: "064", lieu: "Jourdain", date: "05.11.26", arr: "Paris 19e", complet: true },
  alta: { num: "003", lieu: "Rue de Belleville", date: "12.11.26", arr: "Paris 20e", holo: true },
  presence: { num: "112", lieu: "Belleville", date: "03.11.26", arr: "Paris 20e" },
  different: { num: "089", lieu: "Couronnes", date: "02.11.26", arr: "Paris 20e", complet: true }
};
function imgHash(key) {
  if (!IMGHASH[key]) IMGHASH[key] = figma.createImage(figma.base64Decode(IMG[key].b64)).hash;
  return IMGHASH[key];
}
function imgFill(key, mode) { return [{ type: "IMAGE", scaleMode: mode || "FILL", imageHash: imgHash(key) }]; }
function ph(key, w) { return Math.round(w / IMG[key].r); }

// Le scrap, à son format, sans cadre ni ombre.
function poster(p, key, x, y, w, o) {
  o = o || {};
  const h = ph(key, w);
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = imgFill(key);
  r.name = "Scrap — " + key;
  p.appendChild(r);
  r.x = x; r.y = y;
  if (o.rot) r.rotation = o.rot;
  return r;
}
// Vignette d'un scrap dans un emplacement fixe (format conservé)
function thumb(p, key, x, y, w, h) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = imgFill(key, "FIT");
  r.name = "Scrap — " + key;
  p.appendChild(r);
  r.x = x; r.y = y;
  return r;
}

// Bord déchiré : contour de la partie gardée et du morceau arraché
function tearPts(w, h) {
  return [[w, h * 0.55], [w * 0.82, h * 0.62], [w * 0.9, h * 0.7], [w * 0.68, h * 0.78], [w * 0.76, h * 0.86], [w * 0.55, h]];
}
function maskGroup(p, key, x, y, w, pts, name) {
  const h = ph(key, w);
  let mx = Infinity, my = Infinity;
  pts.forEach(function (q) { mx = Math.min(mx, q[0]); my = Math.min(my, q[1]); });
  const mask = figma.createVector();
  mask.vectorPaths = [{ windingRule: "NONZERO", data: "M " + pts.map(function (q) { return (q[0] - mx) + " " + (q[1] - my); }).join(" L ") + " Z" }];
  mask.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  mask.isMask = true;
  p.appendChild(mask);
  mask.x = x + mx; mask.y = y + my;
  const img = poster(p, key, x, y, w);
  const grp = figma.group([mask, img], p);
  grp.name = name;
  return grp;
}
// Scrap déchiré (partie gardée)
function torn(p, key, x, y, w) {
  const h = ph(key, w);
  const pts = [[0, 0], [w, 0]].concat(tearPts(w, h)).concat([[0, h]]);
  return maskGroup(p, key, x, y, w, pts, "Scrap déchiré — " + key);
}
// Morceau arraché (déplacé de dx, dy)
function tornPiece(p, key, x, y, w, dx, dy, rot) {
  const h = ph(key, w);
  const pts = tearPts(w, h).concat([[w, h]]);
  const g = maskGroup(p, key, x, y, w, pts, "Morceau arraché — " + key);
  g.x += dx; g.y += dy;
  if (rot) g.rotation = rot;
  return g;
}
