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
// En-tête : retour, titre centré, icône / lien / méta à droite
function headerNav(s, title, right, o) {
  o = o || {};
  R(s, 0, 54, W, 56, "fond/principal", { name: "En-tête" });
  icon(s, o.close ? "fermer" : "retour", M, 70);
  TC(s, title, 0, 54, W, 56, "Titre/M", "texte/principal");
  if (right && ICONS[right]) icon(s, right, W - M - 24, 70);
  else if (right && o.meta) TR(s, right, W - M, 75, "Texte/Méta", "texte/secondaire");
  else if (right) TR(s, right, W - M, 72, "Texte/Label", "texte/principal", { underline: true });
  filet(s, 0, 110, W);
}
// Grand titre d'écran
function headerBig(s, title, meta, link) {
  T(s, title, M, 66, "Titre/XL", "texte/principal");
  if (link) TR(s, link, W - M, 78, "Texte/Label", "texte/principal", { underline: true });
  if (meta) T(s, meta, M, 114, "Texte/Méta", "texte/secondaire");
}
// Onglets : actif = texte noir + filet de 2 px
function tabs(s, active) {
  R(s, 0, TABS_Y, W, H - TABS_Y, "fond/principal", { name: "Onglets" });
  filet(s, 0, TABS_Y, W);
  const items = ["Carte", "Scrapbook", "Collection"];
  const cw = W / 3;
  items.forEach(function (it, i) {
    const on = i === active;
    if (on) R(s, i * cw + M, TABS_Y, cw - 2 * M, 2, "trait/fort", { name: "Onglet actif" });
    TC(s, it, i * cw, TABS_Y, cw, 56, "Texte/Label", on ? "texte/principal" : "texte/secondaire");
  });
  homeBar(s);
}
// Bouton : principal (noir), secondaire (contour), capture (accent + icône scan)
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
function linkC(p, label, y) { return TC(p, label, 0, y, W, 24, "Texte/Label", "texte/principal", { underline: true }); }
// Puce : active = noir
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
// Étiquette : catégorie en contour, numéro de scrap en accent
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
function toggle(p, x, y, on) {
  R(p, x, y, 44, 24, on ? "fond/inverse" : "fond/principal", { stroke: on ? null : "trait/fort", name: on ? "Interrupteur activé" : "Interrupteur" });
  R(p, on ? x + 24 : x + 4, y + 4, 16, 16, on ? "fond/principal" : "fond/inverse", { name: "Curseur" });
}
function selection(p, x, y, w, h) {
  R(p, x - 4, y - 4, w + 8, h + 8, null, { stroke: "trait/fort", name: "Sélection" });
  [[x - 4, y - 4], [x + w + 4, y - 4], [x - 4, y + h + 4], [x + w + 4, y + h + 4]].forEach(function (c) {
    R(p, c[0] - 4, c[1] - 4, 8, 8, "fond/inverse", { name: "Poignée" });
  });
}
function notification(p, y, text, link) {
  R(p, M, y, FULL, 48, "fond/inverse", { name: "Notification" });
  icon(p, "valider", M + 12, y + 12, "texte/inverse");
  T(p, text, M + 44, y + 14, "Texte/Petit", "texte/inverse");
  if (link) TR(p, link, W - M - 12, y + 13, "Texte/Label", "texte/inverse", { underline: true });
}
// Badge : carré à contour, icône au trait ; choisi = noir ; verrouillé = filet gris + progression
function badge(p, x, y, ic, label, o) {
  o = o || {};
  const s = o.size || 64;
  R(p, x, y, s, s, o.on ? "fond/inverse" : "fond/principal", { stroke: o.on ? null : (o.locked ? "trait/defaut" : "trait/fort"), name: "Badge " + label });
  const is = s >= 100 ? 48 : 24;
  icon(p, ic, x + (s - is) / 2, y + (s - is) / 2, o.on ? "texte/inverse" : (o.locked ? "texte/secondaire" : "trait/fort"), is);
  if (o.noLabel) return;
  const lb = T(p, label, x, y + s + 8, "Texte/Méta", o.locked ? "texte/secondaire" : "texte/principal", { w: COLW });
  if (o.progress) T(p, o.progress, x, lb.y + lb.height + 2, "Texte/Méta", "texte/secondaire");
}
function slider(p, y, label, value, ratio) {
  T(p, label, M, y, "Texte/Petit", "texte/principal");
  TR(p, value, W - M, y, "Texte/Petit", "texte/secondaire");
  filet(p, M, y + 34, FULL);
  R(p, M, y + 33, FULL * ratio, 2, "trait/fort", { name: "Valeur" });
  R(p, M + FULL * ratio - 8, y + 26, 16, 16, "fond/inverse", { name: "Curseur" });
}
// Ligne de liste (réglages, menus)
function row(p, y, label, o) {
  o = o || {};
  R(p, 0, y, W, 56, "fond/principal", { name: "Ligne " + label });
  let lx = M;
  if (o.icon) { icon(p, o.icon, M, y + 16); lx = M + 40; }
  T(p, label, lx, y + 18, "Texte/Label", o.color || "texte/principal", { underline: o.underline });
  if (o.toggle !== undefined) toggle(p, W - M - 44, y + 16, o.toggle);
  else {
    if (!o.noChevron) icon(p, "chevron", W - M - 24, y + 16, "texte/secondaire");
    if (o.value) TR(p, o.value, W - M - (o.noChevron ? 0 : 32), y + 19, "Texte/Petit", "texte/secondaire");
  }
  filet(p, M, y + 56, FULL);
  return y + 56;
}
// Champ de formulaire : filet sous le texte, pas de boîte
function field(p, y, label, value, o) {
  o = o || {};
  T(p, label, M, y, "Texte/Méta", "texte/secondaire");
  T(p, value, M, y + 22, "Texte/Corps", o.placeholder ? "texte/secondaire" : "texte/principal");
  if (o.icon) icon(p, o.icon, W - M - 24, y + 20, "texte/secondaire");
  R(p, M, y + 51, FULL, o.active ? 2 : 1, o.active ? "trait/fort" : "trait/defaut", { name: "Filet du champ" });
  if (o.hint) T(p, o.hint, M, y + 60, "Texte/Méta", "texte/secondaire");
  return y + (o.hint ? 84 : 68);
}
function sectionLabel(p, y, text) { return T(p, text, M, y, "Texte/Méta", "texte/secondaire"); }
// Feuille du bas
function sheet(p, y, title, link) {
  R(p, 0, y, W, H - y, "fond/principal", { name: "Feuille" });
  filet(p, 0, y, W, "trait/fort");
  R(p, (W - 36) / 2, y + 8, 36, 4, "trait/defaut", { name: "Poignée de la feuille" });
  T(p, title, M, y + 24, "Titre/M", "texte/principal");
  if (link) TR(p, link, W - M, y + 26, "Texte/Label", "texte/principal", { underline: true });
  return y + 64;
}
// Grande icône dans un carré (autorisations, états)
function bigIcon(p, name, y) {
  R(p, (W - 88) / 2, y, 88, 88, "fond/principal", { stroke: "trait/fort", name: "Pictogramme" });
  icon(p, name, (W - 40) / 2, y + 24, "trait/fort", 40);
}
function separatorOu(p, y) {
  filet(p, M, y + 10, 160);
  TC(p, "ou", M + 160, y, FULL - 320, 20, "Texte/Méta", "texte/secondaire");
  filet(p, W - M - 160, y + 10, 160);
}

// ───────────────────────── Tampon (élément « Scrap »)
// Contour = scrap capturé · plein = collection complète. Toujours à droite de la légende, incliné de −6°.
function tampon(p, x, y, l1, l2, o) {
  o = o || {};
  const big = o.big;
  const w = big ? 172 : 78, h = big ? 50 : 36;
  const plein = o.plein;
  const f = FR(p, "Tampon" + (plein ? " — plein" : ""), x, y, w, h, plein ? "fond/inverse" : null);
  f.clipsContent = false;
  f.strokes = paint(plein ? "fond/inverse" : "trait/fort");
  f.strokeWeight = 1.5;
  f.strokeAlign = "INSIDE";
  R(f, 3, 3, w - 6, h - 6, null, { stroke: plein ? "texte/inverse" : "trait/fort", name: "Filet intérieur" });
  const c = plein ? "texte/inverse" : "texte/principal";
  if (big) { TC(f, l1, 0, 9, w, 14, "Texte/Méta", c); TC(f, l2, 0, 27, w, 14, "Texte/Méta", c); }
  else { TC(f, l1, 0, 4, w, 14, "Texte/Méta", c); TC(f, l2, 0, 18, w, 14, "Texte/Méta", c); }
  f.rotation = o.rot === undefined ? 6 : o.rot;   // 6° dans le sens Figma = penché vers la droite
  return f;
}

// Légende sous un scrap : numéro (accent), lieu ; tampon à droite (date, arrondissement)
function caption(p, key, x, y, w) {
  const d = SCRAPS[key];
  const n = T(p, "Scrap N° " + d.num, x, y, "Texte/Méta", "accent/capture");
  if (d.holo) T(p, "· Holo", x + n.width + 6, y, "Texte/Méta", "texte/secondaire");
  T(p, d.lieu, x, y + 18, "Texte/Petit", "texte/principal", { w: w - 86 });
  tampon(p, x + w - 80, y + 14, d.date, d.arr, { plein: d.complet });
  return 58;
}
function card(p, key, x, y, w) {
  const h = ph(key, w);
  poster(p, key, x, y, w);
  return h + 8 + caption(p, key, x, y + h + 8, w);
}

// ───────────────────────── Scotch (scrapbook et vitrine uniquement)
const TAPES = {
  transparent: ["#FFFFFF", 0.55, "#DCDCD8"],
  kraft: ["#D6BE96", 0.92, null],
  papier: ["#F1F1EE", 0.92, "#DCDCD8"],
  noir: ["#111111", 0.88, null]
};
function scotch(p, x, y, ang, kind, len) {
  const t = TAPES[kind || "transparent"];
  const r = figma.createRectangle();
  r.resize(len || 52, 16);
  r.fills = paint(t[0], t[1]);
  if (t[2]) { r.strokes = paint(t[2], 0.9); r.strokeWeight = 1; r.strokeAlign = "INSIDE"; }
  r.name = "Scotch " + (kind || "transparent");
  p.appendChild(r);
  r.x = x; r.y = y;
  if (ang) r.rotation = ang;
  return r;
}
// Scrap scotché : deux bouts aux coins du haut
function taped(p, key, x, y, w, o) {
  o = o || {};
  const n = poster(p, key, x, y, w, { rot: o.rot });
  const k = o.tape || "transparent";
  scotch(p, x - 18, y + 4, 38, k);
  scotch(p, x + w - 30, y - 26, -38, k);
  return n;
}

// ───────────────────────── Logo
function logo(p, cx, cy, size) {
  const t = T(p, "SCRAP", 0, 0, "Titre/XL", "texte/principal", { name: "Logo SCRAP" });
  STYLE_QUEUE.pop();
  t.fontSize = size;
  t.lineHeight = { value: size, unit: "PIXELS" };
  t.letterSpacing = { value: -5, unit: "PERCENT" };
  const pw = Math.round(size * 0.16);
  t.x = cx - (t.width + pw + 4) / 2;
  t.y = cy - size / 2;
  R(p, t.x + t.width + 4, t.y + size * 0.62, pw, pw, "accent/capture", { name: "Logo — point de capture" });
  return t;
}

// ───────────────────────── Fonds (composants)
const GRID_MAJ_X = [M, M + COLW + G / 2, M + 2 * COLW + G * 1.5, M + 3 * COLW + G * 2.5, W - M];
// 09 — Grille de fond des écrans clairs
function makeGrid() {
  const c = figma.createComponent();
  c.name = "Fond / Grille";
  c.resize(W, H);
  c.fills = paint("fond/principal");
  c.clipsContent = true;
  c.description = "Grille de fond discrète. Premier calque de chaque écran clair. Trait noir 5 %, lignes marquées 9 %, repères gris texte 50 %. Calée sur les 4 colonnes et la base 4 (24 / 96 px).";
  for (let b = 0; b < 4; b++) {
    const a = GRID_MAJ_X[b], z = GRID_MAJ_X[b + 1];
    for (let k = 0; k < 4; k++) {
      const x = a + (z - a) * k / 4;
      R(c, x - 0.5, 0, 1, H, "texte/principal", { op: k === 0 ? 0.09 : 0.05, name: k === 0 ? "Verticale marquée" : "Verticale" });
    }
  }
  R(c, W - M - 0.5, 0, 1, H, "texte/principal", { op: 0.09, name: "Verticale marquée" });
  for (let y = 24; y < H; y += 24) {
    R(c, 0, y - 0.5, W, 1, "texte/principal", { op: y % 96 === 0 ? 0.09 : 0.05, name: y % 96 === 0 ? "Horizontale marquée" : "Horizontale" });
  }
  GRID_MAJ_X.forEach(function (x) {
    for (let y = 96; y < H; y += 96) {
      R(c, x - 4.5, y - 0.5, 9, 1, "texte/secondaire", { op: 0.5, name: "Repère" });
      R(c, x - 0.5, y - 4.5, 1, 9, "texte/secondaire", { op: 0.5, name: "Repère" });
    }
  });
  return c;
}
// 10 — Fonds du scrapbook : trame de points (24 px) + repères (96 px)
const WALLS = {
  points: { name: "Fond / Scrapbook — Papier", bg: "fond/secondaire", ink: "#111111", op: 0.22, label: "Papier", info: "Défaut · papier + trame de points" },
  beton: { name: "Fond / Scrapbook — Béton", bg: "#CBCBC6", ink: "#111111", op: 0.16, label: "Béton", info: "Gris béton + trame de points" },
  liege: { name: "Fond / Scrapbook — Liège", bg: "#C9A77A", ink: "#4A3620", op: 0.3, label: "Liège", info: "Liège + trame de points" },
  noir: { name: "Fond / Scrapbook — Noir", bg: "#111111", ink: "#FFFFFF", op: 0.22, label: "Noir", info: "Noir + trame de points blancs" }
};
function makeWall(k) {
  const d = WALLS[k];
  const c = figma.createComponent();
  c.name = d.name;
  c.resize(W, H);
  c.fills = paint(d.bg);
  c.clipsContent = true;
  c.description = "Fond du scrapbook (" + d.label + "). Trame de points 2 px tous les 24 px, repères « + » tous les 96 px. Choisi par l'utilisateur dans Personnaliser › Fond.";
  for (let x = 24; x < W; x += 24)
    for (let y = 24; y < H; y += 24)
      if (x % 96 !== 0 || y % 96 !== 0) R(c, x - 1, y - 1, 2, 2, d.ink, { op: d.op, name: "Point" });
  for (let x = 96; x < W; x += 96)
    for (let y = 96; y < H; y += 96) {
      R(c, x - 4.5, y - 0.5, 9, 1, d.ink, { op: d.op * 2, name: "Repère" });
      R(c, x - 0.5, y - 4.5, 1, 9, d.ink, { op: d.op * 2, name: "Repère" });
    }
  return c;
}

// ───────────────────────── Écran
const BG = {};   // composants de fond : grid, points, beton, liege, noir
function screen(p, name, x, y, bg) {
  const dark = bg === "dark";
  const s = FR(p, name, x, y, W, H, dark ? "#111111" : "fond/principal");
  s.layoutGrids = [{
    pattern: "COLUMNS", alignment: "STRETCH", gutterSize: G, count: 4, offset: M,
    visible: false, color: { r: 0.94, g: 0.94, b: 0.93, a: 0.6 }
  }];
  if (BG[bg]) {
    const inst = BG[bg].createInstance();
    s.appendChild(inst);
    inst.x = 0; inst.y = 0;
    inst.name = BG[bg].name;
    inst.locked = true;
  }
  return s;
}
