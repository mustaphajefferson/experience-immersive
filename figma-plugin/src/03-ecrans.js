// ───────────────────────── Écrans
// Chaque écran reçoit sa frame (fond déjà posé) et dessine son contenu.

const MARKERS = [[136, 220, true], [300, 360, false], [200, 520, true], [64, 560, false], [330, 196, false], [150, 300, false]];
function mapView(s, o) {
  o = o || {};
  const bottom = o.full ? H : TABS_Y;
  R(s, 0, 0, W, bottom, "fond/secondaire", { name: "Carte" });
  R(s, 40, 330, 130, 100, "trait/defaut", { op: 0.6, name: "Parc" });
  R(s, 250, 470, 120, 130, "trait/defaut", { op: 0.6, name: "Parc" });
  [[0, 180, W, 10, 0], [0, 450, W, 14, 0], [104, 0, 10, bottom, 0], [276, 0, 12, bottom, 0],
   [-60, 280, 540, 8, -16], [-60, 600, 540, 8, 18]].forEach(function (r) {
    R(s, r[0], r[1], r[2], r[3], "fond/principal", { rot: r[4], name: "Rue" });
  });
  T(s, "Rue de Belleville", 150, 436, "Texte/Méta", "texte/secondaire");
  if (!o.empty) MARKERS.forEach(function (m) {
    R(s, m[0], m[1], 14, 20, "fond/principal", { stroke: "trait/fort", name: "Marqueur scrap" });
    if (m[2]) pastille(s, m[0] + 10, m[1] - 4);
  });
  E(s, 210, 384, 16, "accent/capture", { stroke: "fond/principal", sw: 3, name: "Ma position" });
}
function selectedMarker(s, x, y) {
  R(s, x - 3, y - 4, 20, 28, "fond/inverse", { stroke: "fond/principal", sw: 2, name: "Marqueur sélectionné" });
}
function onboard(s, step, title, text, btn) {
  statusBar(s);
  T(s, step + " / 3", M, 72, "Texte/Méta", "texte/secondaire");
  TR(s, "Passer", W - M, 68, "Texte/Label", "texte/principal", { underline: true });
  const t = T(s, title, M, 548, "Titre/XL", "texte/principal", { w: FULL });
  T(s, text, M, 548 + 96, "Texte/Corps", "texte/secondaire", { w: FULL });
  for (let i = 0; i < 3; i++) R(s, M + i * 40, 742, 32, 2, i === step - 1 ? "trait/fort" : "trait/defaut", { name: "Progression" });
  button(s, M, BTN_Y, FULL, btn, "principal");
  homeBar(s);
  return t;
}
function permission(s, ic, title, text, points, btn) {
  statusBar(s);
  bigIcon(s, ic, 190);
  TW(s, title, 306, "Titre/L", "texte/principal");
  TW(s, text, 352, "Texte/Corps", "texte/secondaire");
  points.forEach(function (pt, i) {
    const y = 500 + i * 52;
    filet(s, M, y, FULL);
    icon(s, "valider", M, y + 14);
    T(s, pt, M + 40, y + 16, "Texte/Petit", "texte/principal", { w: FULL - 40 });
  });
  filet(s, M, 500 + points.length * 52, FULL);
  button(s, M, 712, FULL, btn, "principal");
  linkC(s, "Plus tard", 790);
  homeBar(s);
}
function emptyState(s, ic, title, text, btn, o) {
  o = o || {};
  bigIcon(s, ic, 260);
  TW(s, title, 376, "Titre/L", "texte/principal");
  TW(s, text, 420, "Texte/Corps", "texte/secondaire");
  const by = o.tabs ? BTN_TABS_Y : (o.link ? 712 : BTN_Y);
  button(s, M, by, FULL, btn, "principal");
  if (o.link) linkC(s, o.link, 790);
  if (o.tabs) tabs(s, o.tabs - 1); else homeBar(s);
}
function wallHeader(s, title, meta, link) {
  R(s, 0, 54, W, 56, "fond/principal", { name: "En-tête" });
  T(s, title, M, 62, "Titre/M", "texte/principal");
  T(s, meta, M, 88, "Texte/Méta", "texte/secondaire");
  if (link) TR(s, link, W - M, 72, "Texte/Label", "texte/principal", { underline: true });
  filet(s, 0, 110, W);
}
// Composition du scrapbook (réutilisée par plusieurs écrans)
function wallContent(s, o) {
  o = o || {};
  taped(s, "alta", 28, 150, 120, { tape: "transparent" });
  taped(s, "seb", 176, 140, 96, { tape: "kraft" });
  taped(s, "presence", 296, 160, 82, { tape: "noir" });
  if (o.short) return;
  torn(s, "ozkan", M + 8, 360, 96);
  scotch(s, M - 6, 362, 30, "papier");
  const sx = 128, sy = 340, sw = 150;
  poster(s, "sanbimu", sx, sy, sw);
  scotch(s, sx + 50, sy - 8, 0, "kraft");
  if (o.select !== false) selection(s, sx, sy, sw, ph("sanbimu", sw));
  taped(s, "skeleton", COLX[3], 372, COLW, { tape: "transparent" });
  taped(s, "habitat", 40, 548, 88, { tape: "kraft" });
  taped(s, "white", 300, 560, 80, { tape: "papier" });
}
function personnaliser(s, y, active, link) {
  const cy = sheet(s, y, "Personnaliser", link || "OK");
  puces(s, M, cy, ["Fond", "Scotch", "Déchirer"], active);
  return cy + 52;
}
const CARD_A = ["seb", "sanbimu", "habitat"];
const CARD_B = ["ozkan", "skeleton", "white"];
function grid2(s, sel) {
  [[CARD_A, M], [CARD_B, COLX[2]]].forEach(function (col) {
    let cy = 188;
    col[0].forEach(function (k) {
      const used = card(s, k, col[1], cy, COL2);
      if (sel) checkbox(s, col[1] + COL2 - 32, cy + 8, sel.indexOf(k) !== -1);
      cy += used + 24;
    });
  });
}

// ─── A. Lancement et inscription ───────────────────────────
function e01a(s) {
  statusBar(s);
  const a = torn(s, "seb", -70, 70, 210); a.rotation = 14;
  const b = torn(s, "ozkan", 280, 470, 190); b.rotation = -12;
  const c = torn(s, "skeleton", 30, 650, 150); c.rotation = 8;
  TC(s, "0,0 s · les scraps arrivent", 0, 830, W, 20, "Texte/Méta", "texte/secondaire");
}
function e01b(s) {
  statusBar(s);
  const a = torn(s, "seb", 56, 230, 140); a.rotation = 8;
  const b = torn(s, "ozkan", 206, 286, 140); b.rotation = -9;
  const c = torn(s, "skeleton", 128, 432, 120); c.rotation = 3;
  scotch(s, 92, 222, 20, "kraft");
  scotch(s, 250, 270, -24, "transparent");
  scotch(s, 160, 420, 8, "papier");
  TC(s, "0,8 s · ils se scotchent", 0, 830, W, 20, "Texte/Méta", "texte/secondaire");
}
function e01c(s) {
  statusBar(s);
  const a = torn(s, "seb", 56, 200, 96); a.rotation = 10;
  const b = torn(s, "ozkan", 252, 196, 96); b.rotation = -8;
  const c = torn(s, "skeleton", 164, 540, 76); c.rotation = 4;
  scotch(s, 76, 194, 20, "kraft", 40);
  scotch(s, 270, 190, -22, "transparent", 40);
  logo(s, W / 2, 420, 88);
  TC(s, "Ta ville en morceaux.", 0, 474, W, 24, "Texte/Corps", "texte/secondaire");
  tampon(s, 222, 650, "SCRAP N° 001", "PARIS · 17.11.26", { big: true, rot: 6 });
  TC(s, "2,4 s · logo posé, passe seul à l'écran 02", 0, 830, W, 20, "Texte/Méta", "texte/secondaire");
}
function e02(s) {
  statusBar(s);
  taped(s, "alta", 40, 156, 100, { tape: "kraft", rot: -6 });
  taped(s, "seb", 152, 120, 100, { tape: "transparent", rot: 3 });
  taped(s, "white", 262, 166, 100, { tape: "papier", rot: -4 });
  logo(s, W / 2, 420, 72);
  TC(s, "Ta ville en morceaux.", 0, 466, W, 24, "Texte/Corps", "texte/secondaire");
  button(s, M, 712, FULL, "Commencer", "principal");
  linkC(s, "J'ai déjà un compte", 790);
  homeBar(s);
}
function e03(s) {
  const f = FR(s, "Illustration — carte", M, 110, FULL, 400, "fond/secondaire");
  R(f, 0, 120, FULL, 10, "fond/principal"); R(f, 0, 280, FULL, 12, "fond/principal");
  R(f, 96, 0, 10, 400, "fond/principal"); R(f, 250, 0, 12, 400, "fond/principal");
  R(f, -40, 200, 480, 8, "fond/principal", { rot: -14 });
  [[60, 70, true], [180, 160, false], [300, 90, true], [150, 320, false], [310, 300, false]].forEach(function (m) {
    R(f, m[0], m[1], 14, 20, "fond/principal", { stroke: "trait/fort" });
    if (m[2]) pastille(f, m[0] + 10, m[1] - 4);
  });
  E(f, 196, 226, 16, "accent/capture", { stroke: "fond/principal", sw: 3, name: "Ma position" });
  onboard(s, 1, "Sors. Les scraps sont dehors.", "La carte montre les affiches collées autour de toi. Chaque affiche est un scrap à capturer.", "Suivant");
}
function e04(s) {
  poster(s, "seb", 91, 136, 220);
  const bx = 79, by = 124, bw = 244, bh = ph("seb", 220) + 24, L = 24, th = 3;
  [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(function (c) {
    R(s, c[2] > 0 ? c[0] : c[0] - L, c[3] > 0 ? c[1] : c[1] - th, L, th, "accent/capture", { name: "Cadre du scanner" });
    R(s, c[2] > 0 ? c[0] : c[0] - th, c[3] > 0 ? c[1] : c[1] - L, th, L, "accent/capture", { name: "Cadre du scanner" });
  });
  etiquette(s, 91, 486, "Scrap N° 003", "num");
  onboard(s, 2, "Capture-les.", "Chaque scrap porte ton numéro : 3e à l'avoir capturé, 128e… Les premiers sont les plus rares.", "Suivant");
}
function e05(s) {
  const f = FR(s, "Illustration — scrapbook", M, 110, FULL, 400, "fond/secondaire");
  for (let x = 24; x < FULL; x += 24) for (let y = 24; y < 400; y += 24) R(f, x - 1, y - 1, 2, 2, "#111111", { op: 0.2, name: "Point" });
  taped(f, "alta", 28, 50, 110, { tape: "kraft", rot: -4 });
  taped(f, "sanbimu", 168, 40, 120, { tape: "transparent", rot: 3 });
  torn(f, "skeleton", 70, 220, 90);
  scotch(f, 60, 214, 24, "noir");
  taped(f, "white", 230, 230, 96, { tape: "papier" });
  onboard(s, 3, "Colle-les.", "Compose ton scrapbook : scotch, déchirures, fond. Il te ressemble, il reste privé tant que tu veux.", "C'est parti");
}
function e06(s) {
  permission(s, "camera", "Accès à la caméra", "Pour capturer un scrap. La photo sert seulement à reconnaître l'affiche.",
    ["Rien n'est pris sans ton geste.", "Aucune personne n'est photographiée ni enregistrée.", "Tu peux couper l'accès à tout moment."], "Autoriser la caméra");
}
function e07(s) {
  permission(s, "position", "Accès à ta position", "Pour afficher les scraps autour de toi et t'y guider à pied.",
    ["Ta position n'est jamais partagée.", "Seulement pendant que l'app est ouverte.", "Rayon et historique réglables dans les réglages."], "Autoriser pendant l'utilisation");
}
function e08(s) {
  statusBar(s);
  headerNav(s, "Créer un compte");
  let y = field(s, 134, "E-mail", "ines@exemple.fr");
  y = field(s, y, "Mot de passe", "••••••••••", { active: true, hint: "8 caractères minimum" });
  checkbox(s, M, y + 4, true);
  T(s, "J'accepte les conditions d'utilisation et la politique de vie privée.", M + 36, y + 6, "Texte/Petit", "texte/principal", { w: FULL - 36 });
  button(s, M, y + 64, FULL, "Créer mon compte", "principal");
  separatorOu(s, y + 140);
  button(s, M, y + 176, FULL, "Continuer avec Apple", "secondaire");
  button(s, M, y + 244, FULL, "Continuer avec Google", "secondaire");
  linkC(s, "J'ai déjà un compte", 790);
  homeBar(s);
}
function e09(s) {
  statusBar(s);
  headerNav(s, "Se connecter");
  T(s, "Content de te revoir.", M, 134, "Titre/L", "texte/principal");
  let y = field(s, 192, "E-mail", "ines@exemple.fr");
  y = field(s, y, "Mot de passe", "••••••••••", { active: true });
  TR(s, "Mot de passe oublié ?", W - M, y, "Texte/Petit", "texte/principal", { underline: true });
  button(s, M, y + 40, FULL, "Se connecter", "principal");
  separatorOu(s, y + 116);
  button(s, M, y + 152, FULL, "Continuer avec Apple", "secondaire");
  button(s, M, y + 220, FULL, "Continuer avec Google", "secondaire");
  linkC(s, "Créer un compte", 790);
  homeBar(s);
}
function e10(s) {
  statusBar(s);
  headerNav(s, "Mot de passe oublié");
  notification(s, 126, "Lien envoyé à ines@exemple.fr");
  T(s, "Pas de panique.", M, 206, "Titre/L", "texte/principal");
  T(s, "Entre ton e-mail : on t'envoie un lien pour choisir un nouveau mot de passe.", M, 246, "Texte/Corps", "texte/secondaire", { w: FULL });
  field(s, 316, "E-mail", "ines@exemple.fr", { active: true });
  button(s, M, 412, FULL, "Renvoyer le lien", "principal");
  homeBar(s);
}
function e11(s) {
  statusBar(s);
  headerNav(s, "Ton profil", "1 / 2", { meta: true });
  R(s, (W - 120) / 2, 134, 120, 120, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", (W - 120) / 2, 134, 120, 120, "Titre/XL", "texte/principal");
  linkC(s, "Choisir une photo", 266);
  field(s, 316, "Pseudo", "@ines.colle", { active: true, hint: "Disponible" });
  field(s, 408, "Quartier", "Belleville, Paris 20e", { icon: "position" });
  T(s, "Ton quartier sert à te proposer des collections proches. Tu peux le cacher sur ton profil.", M, 492, "Texte/Petit", "texte/secondaire", { w: FULL });
  button(s, M, BTN_Y, FULL, "Continuer", "principal");
  homeBar(s);
}
function e12(s) {
  statusBar(s);
  headerNav(s, "Tes collections", "2 / 2", { meta: true });
  T(s, "Par quoi tu commences ?", M, 134, "Titre/L", "texte/principal");
  T(s, "Trois au maximum, pour qu'elles restent faisables à pied.", M, 172, "Texte/Petit", "texte/secondaire", { w: FULL });
  const list = [["Concerts", "5 scraps · à moins de 1 km", true], ["Culture et musique", "8 scraps · à moins de 2 km", true],
    ["Messages politiques", "10 scraps · Belleville", false], ["Restaurants", "6 scraps · à moins de 1 km", false],
    ["Street art 20e", "12 scraps · 20e", false], ["Expos de l'hiver", "6 scraps · tout Paris", false]];
  list.forEach(function (c, i) {
    const y = 212 + i * 72;
    R(s, 0, y, W, 72, "fond/principal", { name: "Choix " + c[0] });
    filet(s, M, y, FULL);
    checkbox(s, M, y + 24, c[2]);
    T(s, c[0], M + 40, y + 16, "Texte/Label", "texte/principal");
    T(s, c[1], M + 40, y + 40, "Texte/Méta", "texte/secondaire");
  });
  filet(s, M, 212 + list.length * 72, FULL);
  button(s, M, BTN_Y, FULL, "Commencer · 2 collections", "principal");
  homeBar(s);
}

// ─── B. Carte et capture ───────────────────────────────────
function e13(s) {
  mapView(s);
  statusBar(s);
  R(s, M, 62, 306, 48, "fond/principal", { name: "Champ de recherche" });
  icon(s, "recherche", M + 12, 74, "texte/secondaire");
  T(s, "Rechercher un scrap, un lieu", M + 44, 76, "Texte/Petit", "texte/secondaire");
  filet(s, M + 12, 101, 282, "trait/fort");
  R(s, W - M - 48, 62, 48, 48, "fond/principal", { stroke: "trait/fort", name: "Profil" });
  icon(s, "profil", W - M - 36, 74);
  R(s, W - M - 48, 118, 48, 48, "fond/principal", { stroke: "trait/fort", name: "Filtres" });
  icon(s, "filtre", W - M - 36, 130);
  R(s, M, 616, FULL, 80, "fond/principal", { stroke: "trait/defaut", name: "Scrap repéré" });
  thumb(s, "alta", M + 8, 624, 48, 64);
  pastille(s, M + 68, 632);
  T(s, "Nouveau · à 120 m", M + 82, 629, "Texte/Méta", "texte/secondaire");
  T(s, "Alta Fidelidad", M + 68, 648, "Titre/M", "texte/principal");
  T(s, "Rue de Belleville", M + 68, 672, "Texte/Petit", "texte/secondaire");
  icon(s, "chevron", W - M - 36, 644, "texte/secondaire");
  button(s, M, BTN_TABS_Y, FULL, "Capturer un scrap", "capture");
  tabs(s, 0);
}
function e14(s) {
  mapView(s, { full: true });
  statusBar(s);
  let y = sheet(s, 300, "Filtres", "Réinitialiser");
  slider(s, y, "Rayon", "500 m", 0.35);
  sectionLabel(s, y + 64, "Collections");
  puces(s, M, y + 86, ["Toutes", "Concerts", "Culture"], 0);
  puces(s, M, y + 126, ["Politique", "Restaurants", "Street art"], -1);
  sectionLabel(s, y + 178, "État");
  puces(s, M, y + 200, ["Tous", "Nouveaux", "Holo", "Rares"], 0);
  row(s, y + 248, "Seulement ce qui me manque", { toggle: true });
  button(s, M, BTN_Y, FULL, "Afficher 12 scraps", "principal");
  homeBar(s);
}
function resultRow(s, y, key, title, meta) {
  R(s, 0, y, W, 72, "fond/principal", { name: "Résultat " + title });
  thumb(s, key, M, y + 9, 40, 54);
  T(s, title, M + 56, y + 16, "Texte/Label", "texte/principal");
  T(s, meta, M + 56, y + 40, "Texte/Méta", "texte/secondaire");
  icon(s, "chevron", W - M - 24, y + 24, "texte/secondaire");
  filet(s, M, y + 72, FULL);
}
function e15(s) {
  statusBar(s);
  R(s, 0, 54, W, 56, "fond/principal", { name: "En-tête de recherche" });
  icon(s, "retour", M, 70);
  const t = T(s, "Alta", 56, 70, "Texte/Corps", "texte/principal");
  R(s, 56 + t.width + 2, 70, 1.5, 22, "trait/fort", { name: "Curseur de saisie" });
  R(s, 56, 99, 250, 2, "trait/fort", { name: "Filet du champ" });
  TR(s, "Annuler", W - M, 72, "Texte/Label", "texte/principal", { underline: true });
  filet(s, 0, 110, W);
  sectionLabel(s, 128, "Scraps");
  resultRow(s, 148, "alta", "Alta Fidelidad", "Rue de Belleville · 120 m · Concerts");
  resultRow(s, 220, "seb", "Alta Fidelidad — affiche 2", "Rue de Belleville · 180 m · déjà capturé");
  sectionLabel(s, 312, "Lieux");
  row(s, 332, "Studio Belleville", { icon: "position", value: "350 m" });
  row(s, 388, "Rue de Belleville", { icon: "position", value: "12 scraps" });
  sectionLabel(s, 464, "Artistes");
  row(s, 484, "Alta Fidelidad Sound Rooms", { icon: "note", value: "3 scraps" });
  homeBar(s);
}
function infoRow(s, x, y, w, label, value) {
  filet(s, x, y, w);
  T(s, label, x, y + 10, "Texte/Méta", "texte/secondaire");
  T(s, value, x, y + 28, "Texte/Petit", "texte/principal", { w: w });
}
function e16(s) {
  mapView(s, { full: true });
  selectedMarker(s, 300, 360);
  statusBar(s);
  icon(s, "retour", M, 70);
  sheet(s, 430, "Affiche de concert");
  T(s, "Scrap repéré · à 120 m · 2 min à pied", M, 486, "Texte/Méta", "texte/secondaire");
  R(s, M, 514, 120, 168, "fond/secondaire", { name: "Scrap à capturer" });
  icon(s, "scan", M + 48, 572, "texte/secondaire");
  TC(s, "À capturer", M, 604, 120, 20, "Texte/Méta", "texte/secondaire");
  TC(s, "sur place", M, 620, 120, 20, "Texte/Méta", "texte/secondaire");
  infoRow(s, 152, 514, 234, "Lieu", "28 rue de Belleville, 20e");
  infoRow(s, 152, 570, 234, "Collection", "Concerts · il te manque celui-ci");
  infoRow(s, 152, 626, 234, "Déjà capturé", "127 personnes · tu serais le 128e");
  button(s, M, BTN_Y, COL2, "Y aller", "principal");
  button(s, COLX[2], BTN_Y, COL2, "Partager", "secondaire");
  homeBar(s);
}
function e17(s) {
  mapView(s);
  path(s, [[218, 392], [218, 457], [282, 457], [282, 300], [306, 300], [306, 356]], "trait/fort", { sw: 4, name: "Itinéraire" });
  selectedMarker(s, 300, 360);
  statusBar(s);
  R(s, M, 62, FULL, 72, "fond/principal", { stroke: "trait/defaut", name: "Itinéraire — en-tête" });
  T(s, "Vers Affiche de concert", M + 16, 74, "Titre/M", "texte/principal");
  T(s, "350 m · 4 min à pied", M + 16, 104, "Texte/Méta", "texte/secondaire");
  TR(s, "Arrêter", W - M - 16, 84, "Texte/Label", "texte/principal", { underline: true });
  R(s, M, 616, FULL, 80, "fond/principal", { stroke: "trait/defaut", name: "Prochaine étape" });
  icon(s, "position", M + 16, 644);
  T(s, "Continue tout droit sur 120 m", M + 56, 632, "Texte/Label", "texte/principal");
  T(s, "Puis à gauche, rue de Belleville", M + 56, 658, "Texte/Méta", "texte/secondaire");
  button(s, M, BTN_TABS_Y, FULL, "Capturer un scrap", "capture");
  tabs(s, 0);
}
function e18(s) {
  mapView(s, { empty: true });
  statusBar(s);
  R(s, M, 62, 306, 48, "fond/principal", { name: "Champ de recherche" });
  icon(s, "recherche", M + 12, 74, "texte/secondaire");
  T(s, "Rechercher un scrap, un lieu", M + 44, 76, "Texte/Petit", "texte/secondaire");
  filet(s, M + 12, 101, 282, "trait/fort");
  R(s, W - M - 48, 62, 48, 48, "fond/principal", { stroke: "trait/fort", name: "Profil" });
  icon(s, "profil", W - M - 36, 74);
  R(s, M, 580, FULL, 116, "fond/principal", { stroke: "trait/defaut", name: "Aucun scrap" });
  T(s, "Aucun scrap à moins de 500 m", M + 16, 596, "Titre/M", "texte/principal");
  T(s, "Élargis le rayon ou change de quartier.", M + 16, 626, "Texte/Petit", "texte/secondaire");
  T(s, "Élargir à 2 km", M + 16, 658, "Texte/Label", "texte/principal", { underline: true });
  button(s, M, BTN_TABS_Y, FULL, "Capturer un scrap", "capture");
  tabs(s, 0);
}
function cameraBg(s, key) {
  R(s, 0, 0, W, H, "#2B2B29", { name: "Caméra" });
  R(s, 0, 640, W, H - 640, "#1C1C1B", { name: "Caméra — sol" });
  poster(s, key, 96, 236, 214, { rot: -3 });
}
function e19(s) {
  cameraBg(s, "white");
  statusBar(s, true);
  icon(s, "fermer", M, 70, "#FFFFFF");
  TC(s, "Cadre l'affiche", 0, 54, W, 56, "Texte/Méta", "#FFFFFF");
  const bx = 66, by = 190, bw = 270, bh = 390, L = 28, th = 3;
  [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(function (c) {
    R(s, c[2] > 0 ? c[0] : c[0] - L, c[3] > 0 ? c[1] : c[1] - th, L, th, "accent/capture", { name: "Cadre du scanner" });
    R(s, c[2] > 0 ? c[0] : c[0] - th, c[3] > 0 ? c[1] : c[1] - L, th, L, "accent/capture", { name: "Cadre du scanner" });
  });
  T(s, "L'affiche entière dans le cadre, téléphone bien droit.", 66, 604, "Texte/Petit", "#9A9A96", { w: 270, align: "CENTER" });
  E(s, W / 2 - 38, 724, 76, null, { stroke: "#FFFFFF", sw: 2, name: "Déclencheur — anneau" });
  E(s, W / 2 - 30, 732, 60, "accent/capture", { name: "Déclencheur" });
  homeBar(s, true);
}
function e20(s) {
  cameraBg(s, "different");
  statusBar(s, true);
  icon(s, "fermer", M, 70, "#FFFFFF");
  const y = sheet(s, 500, "Pas de scrap ici");
  T(s, "L'affiche est abîmée, cachée, ou pas encore sur la carte. Tu peux la signaler pour qu'elle rejoigne la collection de tout le monde.", M, y, "Texte/Corps", "texte/secondaire", { w: FULL });
  button(s, M, 700, FULL, "Signaler l'affiche", "secondaire");
  button(s, M, 768, FULL, "Réessayer", "principal", 56);
  homeBar(s);
}
function e21(s) {
  statusBar(s);
  headerNav(s, "Scrap capturé", "partager");
  poster(s, "alta", M, 126, FULL);
  const ty = 126 + ph("alta", FULL) + 14;
  const w1 = etiquette(s, M, ty, "Scrap N° 003", "num");
  T(s, "3e à l'avoir capturé", M + w1 + 8, ty + 3, "Texte/Méta", "texte/secondaire");
  T(s, "Alta Fidelidad", M, ty + 28, "Titre/L", "texte/principal");
  T(s, "Rue de Belleville", M, ty + 62, "Texte/Petit", "texte/secondaire");
  etiquette(s, M, ty + 88, "Holo", "cat");
  tampon(s, W - M - 172, ty + 36, "SCRAP N° 003", "PARIS 20E · 12.11.26", { big: true });
  TC(s, "← Glisser pour retourner", 0, 750, W, 20, "Texte/Méta", "texte/secondaire");
  button(s, M, BTN_Y, FULL, "Coller sur mon scrapbook", "principal");
  homeBar(s);
}
function e22(s) {
  statusBar(s);
  headerNav(s, "Scrap capturé", "partager");
  R(s, M, 126, FULL - COLW - G, 92, "fond/principal", { name: "Fond numéro" });
  T(s, "003", M, 130, "Chiffre/Capture", "accent/capture");
  T(s, "Ton numéro de scrap", M, 194, "Texte/Méta", "texte/secondaire");
  poster(s, "alta", COLX[3], 126, COLW);
  T(s, "Alta Fidelidad", M, 264, "Titre/L", "texte/principal");
  const rows = [["Artiste", "Alta Fidelidad Sound Rooms"], ["Lieu", "Rue de Belleville, 20e"], ["Capturé le", "12.11.2026 · 21:04"],
    ["Thème", "Concert · Musique"], ["État", "Holo"], ["Collection", "Concerts · 4 / 5"]];
  R(s, 0, 310, W, rows.length * 44, "fond/principal", { name: "Tableau" });
  rows.forEach(function (r, i) {
    const ry = 310 + i * 44;
    filet(s, M, ry, FULL);
    T(s, r[0], M, ry + 15, "Texte/Méta", "texte/secondaire");
    T(s, r[1], COLX[1], ry + 12, "Texte/Petit", "texte/principal");
  });
  filet(s, M, 310 + rows.length * 44, FULL);
  R(s, M, 590, FULL, 48, "fond/principal", { name: "Fond texte" });
  T(s, "Capturé par 128 personnes. Collé sur 12 scrapbooks dans le 20e.", M, 594, "Texte/Corps", "texte/principal", { w: FULL });
  T(s, "Voir l'événement", M, 660, "Texte/Label", "texte/principal", { underline: true });
  TC(s, "Glisser pour revenir au scrap →", 0, 750, W, 20, "Texte/Méta", "texte/secondaire");
  button(s, M, BTN_Y, FULL, "Coller sur mon scrapbook", "principal");
  homeBar(s);
}
function e23(s) {
  statusBar(s);
  headerNav(s, "Événement", "partager");
  poster(s, "alta", M, 126, COLW);
  T(s, "Alta Fidelidad — Sound Rooms", COLX[1], 126, "Titre/L", "texte/principal", { w: FULL - COLW - G });
  etiquette(s, COLX[1], 200, "Concert", "cat");
  const rows = [["Date", "Ven. 12.12 · 21:00"], ["Lieu", "Studio Belleville, 20e"], ["Prix", "12 € · gratuit avant 22 h"], ["Accès", "Métro Belleville (2, 11)"]];
  rows.forEach(function (r, i) {
    const ry = 264 + i * 44;
    filet(s, M, ry, FULL);
    T(s, r[0], M, ry + 15, "Texte/Méta", "texte/secondaire");
    T(s, r[1], COLX[1], ry + 12, "Texte/Petit", "texte/principal");
  });
  filet(s, M, 264 + rows.length * 44, FULL);
  R(s, M, 452, FULL, 120, "fond/principal", { name: "Fond texte" });
  T(s, "Trois salles, trois ambiances : une nuit d'écoute en haute fidélité, du jazz au club. Le scrap de cette affiche fait partie de la collection Concerts.", M, 456, "Texte/Corps", "texte/principal", { w: FULL });
  button(s, M, 712, FULL, "Voir l'événement", "principal");
  button(s, M, 780, FULL, "Itinéraire", "secondaire", 56);
  homeBar(s);
}

// ─── C. Scrapbook ──────────────────────────────────────────
function e24(s) {
  statusBar(s);
  wallHeader(s, "Mon scrapbook", "Belleville · 8 scraps", "Valider");
  wallContent(s);
  T(s, "Fond papier · glisser pour déplacer", M, 682, "Texte/Méta", "texte/secondaire");
  puces(s, M, BTN_TABS_Y + 4, ["Déplacer", "Scotch", "Déchirer", "Fond"], 0);
  tabs(s, 1);
}
function swatch(p, x, y, k, on) {
  const d = WALLS[k] || { bg: "fond/principal", ink: "#111111", op: 0.12, label: "Quadrillé" };
  const f = FR(p, "Fond " + d.label, x, y, 64, 64, d.bg);
  if (k === "grille") { for (let i = 8; i < 64; i += 8) { R(f, i, 0, 1, 64, "#111111", { op: 0.08 }); R(f, 0, i, 64, 1, "#111111", { op: 0.08 }); } }
  else for (let i = 8; i < 64; i += 12) for (let j = 8; j < 64; j += 12) R(f, i, j, 2, 2, d.ink, { op: d.op * 1.5 });
  f.strokes = paint(on ? "trait/fort" : "trait/defaut");
  f.strokeWeight = on ? 2 : 1;
  f.strokeAlign = "OUTSIDE";
  T(p, d.label, x, y + 72, "Texte/Méta", on ? "texte/principal" : "texte/secondaire");
}
function e25(s) {
  statusBar(s);
  wallHeader(s, "Mon scrapbook", "Aperçu · fond liège", null);
  wallContent(s, { short: true, select: false });
  torn(s, "ozkan", M + 8, 360, 96);
  let y = personnaliser(s, 440, 0);
  ["points", "grille", "beton", "liege", "noir"].forEach(function (k, i) { swatch(s, M + i * 76, y + 4, k, k === "liege"); });
  row(s, y + 104, "Afficher les repères « + »", { toggle: true });
  T(s, "Le fond ne change que ton scrapbook. Les scraps, eux, restent intacts.", M, y + 178, "Texte/Petit", "texte/secondaire", { w: FULL });
  button(s, M, BTN_Y, FULL, "Appliquer le fond", "principal");
  homeBar(s);
}
function e26(s) {
  statusBar(s);
  wallHeader(s, "Mon scrapbook", "Scotch · touche un coin", null);
  const sx = 120, sy = 150, sw = 162;
  poster(s, "sanbimu", sx, sy, sw);
  selection(s, sx, sy, sw, ph("sanbimu", sw));
  scotch(s, sx - 22, sy + 6, 38, "kraft");
  const t = scotch(s, sx + sw - 30, sy - 26, -38, "kraft");
  R(s, sx + sw - 38, sy - 34, 72, 44, null, { stroke: "trait/fort", dash: [4, 4], name: "Scotch en cours de placement" });
  let y = personnaliser(s, 470, 1);
  [["transparent", "Transparent"], ["kraft", "Kraft"], ["papier", "Papier"], ["noir", "Noir"]].forEach(function (k, i) {
    const x = COLX[i];
    R(s, x, y + 4, COLW, 56, "fond/principal", { stroke: k[0] === "kraft" ? "trait/fort" : "trait/defaut", sw: k[0] === "kraft" ? 2 : 1, name: "Choix " + k[1] });
    R(s, x + 12, y + 18, COLW - 24, 28, "fond/secondaire", { name: "Support" });
    scotch(s, x + 17, y + 24, 0, k[0], COLW - 34);
    T(s, k[1], x, y + 68, "Texte/Méta", k[0] === "kraft" ? "texte/principal" : "texte/secondaire");
  });
  T(s, "Touche un coin du scrap pour y poser un bout de scotch, glisse pour l'orienter. Deux bouts au maximum par scrap.", M, y + 104, "Texte/Petit", "texte/secondaire", { w: FULL });
  button(s, M, BTN_Y, FULL, "Terminer", "principal");
  homeBar(s);
}
function e27(s) {
  statusBar(s);
  wallHeader(s, "Mon scrapbook", "Déchirer · glisse ton doigt", null);
  const x = 96, y = 140, w = 210, h = ph("sanbimu", 210);
  torn(s, "sanbimu", x, y, w);
  scotch(s, x - 20, y + 4, 36, "kraft");
  tornPiece(s, "sanbimu", x, y, w, 26, 48, -14);
  const pts = tearPts(w, h).map(function (q) { return [x + q[0], y + q[1]]; });
  path(s, pts, "trait/fort", { sw: 1.5, dash: [5, 5], name: "Geste de déchirure" });
  R(s, x + w * 0.55 - 14, y + h - 14, 28, 28, null, { stroke: "trait/fort", sw: 2, name: "Doigt" });
  let yy = personnaliser(s, 560, 2);
  T(s, "Glisse ton doigt sur le scrap pour le déchirer. Le morceau arraché reste dans ta collection : tu ne perds jamais un scrap.", M, yy, "Texte/Petit", "texte/secondaire", { w: FULL });
  button(s, M, 708, FULL, "Annuler la déchirure", "secondaire");
  button(s, M, BTN_Y, FULL, "Garder", "principal");
  homeBar(s);
}

// ─── D. Collections ────────────────────────────────────────
function e28(s) {
  statusBar(s);
  headerBig(s, "Ma collection", "48 scraps · 6 quartiers", "Sélectionner");
  puces(s, M, 140, ["Derniers", "Plus rares", "Favoris", "Lieu", "État", "Thème"], 0);
  grid2(s);
  tabs(s, 2);
}
function e29(s) {
  statusBar(s);
  headerBig(s, "Sélection", "3 sélectionnés · le dernier : N° 064", "Annuler");
  puces(s, M, 140, ["Derniers", "Plus rares", "Favoris", "Lieu", "État", "Thème"], 0);
  grid2(s, ["seb", "skeleton", "white"]);
  R(s, 0, 696, W, 88, "fond/principal", { name: "Barre d'action" });
  filet(s, 0, 696, W);
  button(s, M, BTN_TABS_Y, FULL, "Ajouter le dernier au profil", "principal");
  tabs(s, 2);
}
function e30(s) {
  statusBar(s);
  headerBig(s, "Mes collections", "4 collections · 1 complète · 19 / 29 scraps");
  const data = [
    ["Concerts", 4, 5, ["seb", "alta", "presence", "different"]],
    ["Culture et musique", 8, 8, ["sanbimu", "ozkan", "white", "habitat", "skeleton", "different"]],
    ["Messages politiques", 2, 10, ["different", "white"]],
    ["Restaurants", 0, 6, []]
  ];
  data.forEach(function (c, k) {
    const by = 146 + k * 156;
    R(s, 0, by, W, 156, "fond/principal", { name: "Ligne de collection — " + c[0] });
    filet(s, M, by, FULL);
    T(s, c[0], M, by + 16, "Titre/M", "texte/principal");
    const done = c[1] === c[2];
    if (done) tampon(s, W - M - 84, by + 6, "COMPLÈTE", c[1] + " / " + c[2], { plein: true });
    else TR(s, c[1] + " / " + c[2], W - M, by + 16, "Titre/M", "texte/principal");
    const miss = c[2] - c[1];
    T(s, c[1] === 0 ? "Pas commencée" : (done ? "Scrap exclusif débloqué" : (miss === 1 ? "Il manque 1 scrap" : "Il manque " + miss + " scraps")), M, by + 44, "Texte/Méta", "texte/secondaire");
    if (miss > 0) TR(s, "Voir sur la carte", W - M, by + 41, "Texte/Petit", "texte/principal", { underline: true });
    filet(s, M, by + 68, FULL);
    R(s, M, by + 67, FULL * c[1] / c[2], 2, "trait/fort", { name: "Progression" });
    const slots = Math.min(c[2], 6);
    const filled = Math.min(c[3].length, c[1] < c[2] ? slots - 1 : slots);
    const sw = (FULL - 5 * G) / 6;
    for (let i = 0; i < slots; i++) {
      const sx = M + i * (sw + G), sy = by + 84;
      if (i < filled) thumb(s, c[3][i], sx, sy, sw, 60);
      else {
        R(s, sx, sy, sw, 60, null, { stroke: "trait/defaut", name: "Scrap manquant" });
        icon(s, "plus", sx + (sw - 24) / 2, sy + 18, "trait/defaut");
      }
    }
  });
  filet(s, M, 146 + 4 * 156, FULL);
  tabs(s, 2);
}
function e31(s) {
  statusBar(s);
  headerNav(s, "Concerts", "partager");
  T(s, "Collection · Belleville", M, 128, "Texte/Méta", "texte/secondaire");
  T(s, "4 / 5", M, 148, "Titre/XL", "texte/principal");
  filet(s, M, 202, FULL);
  R(s, M, 201, FULL * 0.8, 2, "trait/fort", { name: "Progression" });
  T(s, "Il te manque 1 scrap. Le plus proche est à 400 m.", M, 214, "Texte/Petit", "texte/secondaire");
  const keys = ["seb", "alta", "presence", "different"];
  const w = COLW, pos = [[COLX[0], 252], [COLX[1], 252], [COLX[2], 252], [COLX[3], 252]];
  keys.forEach(function (k, i) {
    thumb(s, k, pos[i][0], pos[i][1], w, 122);
    T(s, "N° " + SCRAPS[k].num, pos[i][0], 382, "Texte/Méta", "accent/capture");
  });
  R(s, M, 412, COL2, 150, null, { stroke: "trait/defaut", name: "Scrap manquant" });
  icon(s, "plus", M + (COL2 - 24) / 2, 452, "trait/defaut");
  TC(s, "Affiche de concert", M, 488, COL2, 20, "Texte/Méta", "texte/secondaire");
  TC(s, "à 400 m", M, 506, COL2, 20, "Texte/Méta", "texte/secondaire");
  sectionLabel(s, 412, "À la clé").x = COLX[2];
  badge(s, COLX[2], 436, "note", "Badge Concerts", { size: 64 });
  T(s, "+ un scrap exclusif, réservé à ceux qui finissent la collection.", COLX[2], 528, "Texte/Petit", "texte/secondaire", { w: COL2 });
  button(s, M, BTN_Y, FULL, "Voir le dernier sur la carte", "principal");
  homeBar(s);
}
function e32(s) {
  statusBar(s);
  icon(s, "fermer", M, 70);
  T(s, "Collection complète", M, 128, "Texte/Méta", "texte/secondaire");
  T(s, "Culture et musique", M, 148, "Titre/XL", "texte/principal", { w: FULL });
  const x = 101, y = 236, h = ph("different", 200);
  poster(s, "different", x, y, 200);
  scotch(s, x - 18, y + 6, 36, "noir");
  scotch(s, x + 170, y - 24, -36, "noir");
  const ty = y + h + 24;
  etiquette(s, M, ty, "Scrap exclusif", "cat");
  T(s, "Réservé aux 64 personnes qui ont fini la collection.", M, ty + 30, "Texte/Petit", "texte/secondaire", { w: 180 });
  tampon(s, W - M - 172, ty - 4, "COMPLÈTE · 8 / 8", "17.11.26 · PARIS", { big: true, plein: true });
  button(s, M, 712, FULL, "Coller sur mon scrapbook", "principal");
  linkC(s, "Voir mes badges", 790);
  homeBar(s);
}
function e33(s) {
  statusBar(s);
  icon(s, "fermer", M, 70);
  badge(s, (W - 120) / 2, 220, "note", "Concerts", { size: 120, on: true, noLabel: true });
  TC(s, "Badge débloqué", 0, 368, W, 20, "Texte/Méta", "texte/secondaire");
  TW(s, "Concerts", 392, "Titre/L", "texte/principal");
  TW(s, "Tu as capturé les 5 scraps de concert de Belleville.", 436, "Texte/Corps", "texte/secondaire");
  tampon(s, (W - 172) / 2, 520, "BADGE · CONCERTS", "BELLEVILLE · 17.11.26", { big: true, plein: true, rot: 0 });
  button(s, M, 712, FULL, "Afficher sur mon profil", "principal");
  linkC(s, "Plus tard", 790);
  homeBar(s);
}

// ─── E. Profil et partage ──────────────────────────────────
function e34(s) {
  statusBar(s);
  headerNav(s, "Ma vitrine", "Annuler");
  R(s, M, 126, 48, 48, "fond/secondaire", { name: "Avatar" });
  icon(s, "profil", M + 12, 138);
  T(s, "Inès", M + 64, 128, "Titre/M", "texte/principal");
  T(s, "Belleville · rang 12", M + 64, 156, "Texte/Méta", "texte/secondaire");
  sectionLabel(s, 196, "Vitrine · glisse le scrap pour le placer");
  const z = FR(s, "Zone vitrine", M, 216, FULL, 340, "fond/secondaire");
  for (let x = 24; x < FULL; x += 24) for (let y = 24; y < 340; y += 24) R(z, x - 1, y - 1, 2, 2, "#111111", { op: 0.2, name: "Point" });
  taped(z, "alta", 16, 30, 110, { tape: "kraft" });
  taped(z, "presence", 254, 40, 100, { tape: "transparent" });
  const px = 142, py = 80, pw = 112;
  poster(z, "white", px, py, pw, { rot: -4 });
  scotch(z, px + 30, py - 12, 0, "papier");
  selection(z, px, py - 4, pw + 12, ph("white", pw) + 8);
  R(s, 0, 572, W, 140, "fond/principal", { name: "Réglages" });
  filet(s, 0, 572, W);
  T(s, "Scrap sélectionné · N° 064", M, 588, "Texte/Méta", "texte/secondaire");
  slider(s, 614, "Taille", "120 %", 0.6);
  slider(s, 664, "Rotation", "−4°", 0.45);
  button(s, M, BTN_Y, FULL, "Valider", "principal");
  homeBar(s);
}
function e35(s) {
  statusBar(s);
  headerNav(s, "Profil", "partager");
  R(s, M, 126, 88, 88, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", M, 126, 88, 88, "Titre/L", "texte/principal");
  T(s, "Inès", 120, 132, "Titre/L", "texte/principal");
  T(s, "Belleville · rang 12", 120, 170, "Texte/Méta", "texte/secondaire");
  etiquette(s, 120, 190, "Concerts", "cat");
  R(s, 0, 230, W, 72, "fond/principal", { name: "Compteurs" });
  filet(s, 0, 230, W); filet(s, 0, 302, W);
  [["48", "Scraps"], ["6", "Quartiers"], ["4", "Badges"]].forEach(function (v, i) {
    if (i > 0) vfilet(s, i * W / 3, 230, 72);
    T(s, v[0], i * W / 3 + M, 240, "Titre/L", "texte/principal");
    T(s, v[1], i * W / 3 + M, 274, "Texte/Méta", "texte/secondaire");
  });
  sectionLabel(s, 322, "Scrap mis en avant");
  poster(s, "seb", M, 344, COL2);
  T(s, "Vitrine", COLX[2], 322, "Texte/Méta", "texte/secondaire");
  const z = FR(s, "Vitrine", COLX[2], 344, COL2, 256, "fond/secondaire");
  taped(z, "alta", 10, 22, 74, { tape: "kraft" });
  taped(z, "presence", 96, 30, 70, { tape: "transparent" });
  taped(z, "ozkan", 46, 140, 80, { tape: "noir" });
  sectionLabel(s, 628, "Badges");
  [["note", "Concerts", true], ["scan", "1er scrap"], ["etoile", "Holo"], ["position", "Belleville"]].forEach(function (b, i) {
    badge(s, COLX[i], 648, b[0], b[1], { on: b[2] });
  });
  button(s, M, BTN_Y, COL2, "Suivre", "principal");
  button(s, COLX[2], BTN_Y, COL2, "Partager", "secondaire");
  homeBar(s);
}
function e36(s) {
  statusBar(s);
  headerNav(s, "Badges");
  notification(s, 126, "Badge débloqué : Concerts", "Voir");
  sectionLabel(s, 198, "Choisis le badge affiché sur ton profil");
  const list = [["note", "Concerts", { on: true }], ["scan", "1er scrap", {}], ["position", "Belleville", {}], ["etoile", "Holo", {}],
    ["megaphone", "Messages politiques", { locked: true, progress: "2 / 10" }], ["collection", "Culture et musique", {}],
    ["couvert", "Restaurants", { locked: true, progress: "0 / 6" }], ["mur", "50 scraps", { locked: true, progress: "48 / 50" }]];
  list.forEach(function (b, i) { badge(s, COLX[i % 4], 222 + Math.floor(i / 4) * 136, b[0], b[1], b[2]); });
  sectionLabel(s, 500, "Aperçu sur mon profil");
  R(s, M, 522, FULL, 112, "fond/principal", { stroke: "trait/defaut", name: "Aperçu" });
  R(s, M + 16, 538, 80, 80, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", M + 16, 538, 80, 80, "Titre/L", "texte/principal");
  T(s, "Inès", M + 112, 544, "Titre/L", "texte/principal");
  T(s, "Belleville · rang 12", M + 112, 580, "Texte/Méta", "texte/secondaire");
  R(s, W - M - 56, 552, 40, 40, "fond/inverse", { name: "Badge choisi" });
  icon(s, "note", W - M - 48, 560, "texte/inverse");
  button(s, M, BTN_Y, FULL, "Enregistrer", "principal");
  homeBar(s);
}
function e37(s) {
  statusBar(s);
  headerNav(s, "Modifier le profil", "Enregistrer");
  R(s, M, 126, 88, 88, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", M, 126, 88, 88, "Titre/L", "texte/principal");
  T(s, "Changer la photo", 120, 160, "Texte/Label", "texte/principal", { underline: true });
  let y = field(s, 238, "Pseudo", "@ines.colle");
  y = field(s, y, "Bio", "Je colle, je décolle, je collectionne.", { active: true, hint: "37 / 80" });
  y = field(s, y, "Quartier", "Belleville, Paris 20e", { icon: "position" });
  y = row(s, y + 4, "Ma vitrine", { value: "3 scraps" });
  row(s, y, "Badge affiché", { value: "Concerts" });
  homeBar(s);
}
function e38(s) {
  statusBar(s);
  headerNav(s, "@ines.colle");
  puces(s, M, 126, ["Abonnés · 24", "Abonnements · 31"], 0);
  R(s, M, 174, FULL, 44, "fond/principal", { name: "Champ de recherche" });
  icon(s, "recherche", M, 184, "texte/secondaire");
  T(s, "Rechercher", M + 32, 186, "Texte/Petit", "texte/secondaire");
  filet(s, M, 217, FULL, "trait/fort");
  const people = [["MA", "@marius.b", "62 scraps · Ménilmontant", true], ["LS", "@lsa.colle", "18 scraps · Belleville", false],
    ["TO", "@tom_affiches", "104 scraps · 11e", true], ["NK", "@nk.paris", "9 scraps · 19e", false], ["JU", "@juju.scrap", "33 scraps · 20e", true],
    ["AB", "@ab.collage", "51 scraps · 10e", false], ["RE", "@rem.r", "27 scraps · 20e", false]];
  people.forEach(function (pp, i) {
    const y = 234 + i * 72;
    R(s, 0, y, W, 72, "fond/principal", { name: "Personne " + pp[1] });
    R(s, M, y + 14, 44, 44, "fond/secondaire", { name: "Avatar" });
    TC(s, pp[0], M, y + 14, 44, 44, "Texte/Label", "texte/principal");
    T(s, pp[1], M + 60, y + 16, "Texte/Label", "texte/principal");
    T(s, pp[2], M + 60, y + 40, "Texte/Méta", "texte/secondaire");
    const lab = pp[3] ? "Suivi" : "Suivre";
    const t = T(s, lab, 0, 0, "Texte/Label", pp[3] ? "texte/principal" : "texte/inverse");
    const bw = t.width + 28;
    R(s, W - M - bw, y + 20, bw, 32, pp[3] ? "fond/principal" : "fond/inverse", { stroke: pp[3] ? "trait/fort" : null, name: "Bouton " + lab });
    s.appendChild(t); t.x = W - M - bw + 14; t.y = y + 20 + (32 - t.height) / 2;
    filet(s, M, y + 72, FULL);
  });
  homeBar(s);
}
function e39(s) {
  statusBar(s);
  headerNav(s, "Scrap capturé", "partager");
  poster(s, "alta", M, 126, FULL);
  let y = sheet(s, 360, "Partager", "Annuler");
  R(s, M, y, FULL, 132, "fond/principal", { stroke: "trait/defaut", name: "Aperçu du partage" });
  thumb(s, "alta", M + 12, y + 12, 80, 108);
  T(s, "Scrap N° 003", M + 108, y + 16, "Texte/Méta", "accent/capture");
  T(s, "Alta Fidelidad", M + 108, y + 34, "Titre/M", "texte/principal");
  T(s, "@ines.colle", M + 108, y + 62, "Texte/Petit", "texte/secondaire");
  tampon(s, W - M - 92, y + 84, "12.11.26", "PARIS 20E");
  T(s, "Seuls ce scrap et ton pseudo seront visibles. Ta position, jamais.", M, y + 148, "Texte/Petit", "texte/secondaire", { w: FULL });
  row(s, y + 184, "Afficher mon quartier", { toggle: false });
  [["lien", "Lien"], ["message", "Message"], ["partager", "Autres"]].forEach(function (a, i) {
    const x = COLX[i];
    R(s, x, y + 260, COLW, 64, "fond/principal", { stroke: "trait/fort", name: "Partager — " + a[1] });
    icon(s, a[0], x + (COLW - 24) / 2, y + 280);
    TC(s, a[1], x, y + 330, COLW, 16, "Texte/Méta", "texte/principal");
  });
  button(s, M, BTN_Y, FULL, "Copier le lien", "principal");
  homeBar(s);
}
function e40(s) {
  statusBar(s);
  headerNav(s, "Lieu", "partager");
  const f = FR(s, "Visuel du lieu", M, 126, FULL, 160, "fond/secondaire");
  thumb(f, "habitat", 0, 0, FULL, 160);
  T(s, "Studio Belleville", M, 302, "Titre/L", "texte/principal");
  T(s, "Partenaire · salle de concert · 20e", M, 338, "Texte/Méta", "texte/secondaire");
  const rows = [["Adresse", "28 rue de Belleville, 75020"], ["Horaires", "Jeu.–sam. · 19 h – 2 h"], ["À 350 m", "4 min à pied"]];
  rows.forEach(function (r, i) {
    const ry = 368 + i * 44;
    filet(s, M, ry, FULL);
    T(s, r[0], M, ry + 15, "Texte/Méta", "texte/secondaire");
    T(s, r[1], COLX[1], ry + 12, "Texte/Petit", "texte/principal");
  });
  filet(s, M, 368 + 3 * 44, FULL);
  sectionLabel(s, 516, "Scraps de ce lieu · 2 / 5");
  ["alta", "seb"].forEach(function (k, i) { thumb(s, k, COLX[i], 538, COLW, 116); });
  [2, 3].forEach(function (i) {
    R(s, COLX[i], 538, COLW, 116, null, { stroke: "trait/defaut", name: "Scrap manquant" });
    icon(s, "plus", COLX[i] + (COLW - 24) / 2, 584, "trait/defaut");
  });
  T(s, "Capture les 5 scraps du lieu : une entrée offerte.", M, 668, "Texte/Petit", "texte/secondaire", { w: FULL });
  button(s, M, 712, COL2, "Y aller", "principal");
  button(s, COLX[2], 712, COL2, "Site du lieu", "secondaire");
  homeBar(s);
}

// ─── F. Réglages ───────────────────────────────────────────
function e41(s) {
  statusBar(s);
  headerNav(s, "Réglages");
  R(s, 0, 110, W, 88, "fond/principal", { name: "Mon profil" });
  R(s, M, 126, 56, 56, "fond/secondaire", { name: "Avatar" });
  TC(s, "IN", M, 126, 56, 56, "Titre/M", "texte/principal");
  T(s, "@ines.colle", M + 72, 134, "Texte/Label", "texte/principal");
  T(s, "Modifier le profil", M + 72, 158, "Texte/Petit", "texte/secondaire");
  icon(s, "chevron", W - M - 24, 142, "texte/secondaire");
  filet(s, M, 198, FULL);
  sectionLabel(s, 218, "Mon compte");
  let y = row(s, 238, "Confidentialité", { icon: "cadenas" });
  y = row(s, y, "Notifications", { icon: "cloche" });
  y = row(s, y, "Position", { icon: "position" });
  y = row(s, y, "Compte", { icon: "profil" });
  sectionLabel(s, y + 20, "Infos");
  y = row(s, y + 40, "Aide et mentions", { icon: "aide" });
  y = row(s, y, "Vie privée", { icon: "cadenas" });
  TC(s, "SCRAP · version 1.0", 0, 800, W, 20, "Texte/Méta", "texte/secondaire");
  homeBar(s);
}
function note(s, y, text) { return T(s, text, M, y, "Texte/Petit", "texte/secondaire", { w: FULL }); }
function e42(s) {
  statusBar(s);
  headerNav(s, "Confidentialité");
  note(s, 126, "Par défaut, ton scrapbook est privé. Tu choisis ce que les autres voient.");
  let y = row(s, 170, "Scrapbook public", { toggle: false });
  y = row(s, y, "Profil visible dans la recherche", { toggle: true });
  y = row(s, y, "Afficher mon quartier", { toggle: false });
  y = row(s, y, "Afficher mon rang", { toggle: true });
  y = row(s, y, "Qui peut me suivre", { value: "Tout le monde" });
  row(s, y, "Comptes bloqués", { value: "0" });
  homeBar(s);
}
function e43(s) {
  statusBar(s);
  headerNav(s, "Notifications");
  note(s, 126, "Jamais plus d'une par jour. Aucun rappel si tu ne sors pas.");
  let y = row(s, 170, "Un rappel par semaine", { toggle: true });
  y = row(s, y, "Jour du rappel", { value: "Samedi" });
  y = row(s, y, "Scrap rare à proximité", { toggle: false });
  y = row(s, y, "Collection presque complète", { toggle: true });
  y = row(s, y, "Nouvel abonné", { toggle: true });
  row(s, y, "Silence la nuit (22 h – 9 h)", { toggle: true });
  homeBar(s);
}
function e44(s) {
  statusBar(s);
  headerNav(s, "Position");
  note(s, 126, "Ta position sert à afficher les scraps autour de toi. Elle n'est jamais partagée.");
  let y = row(s, 170, "Localisation", { value: "Pendant l'utilisation" });
  y = row(s, y, "Position précise", { toggle: false });
  slider(s, y + 20, "Rayon de la carte", "500 m", 0.35);
  y = row(s, y + 84, "Historique des lieux", { value: "30 jours" });
  T(s, "Effacer l'historique", M, y + 20, "Texte/Label", "texte/principal", { underline: true });
  homeBar(s);
}
function e45(s) {
  statusBar(s);
  headerNav(s, "Compte");
  let y = row(s, 126, "E-mail", { value: "ines@exemple.fr" });
  y = row(s, y, "Mot de passe", { value: "Modifier" });
  y = row(s, y, "Comptes liés", { value: "Apple" });
  y = row(s, y, "Exporter mes données");
  sectionLabel(s, y + 24, "Zone sensible");
  y = row(s, y + 44, "Se déconnecter", { noChevron: true });
  row(s, y, "Supprimer mon compte", { noChevron: true, underline: true });
  note(s, y + 76, "La suppression efface ton profil, ton scrapbook et tes scraps sous 30 jours.");
  homeBar(s);
}
function e46(s) {
  statusBar(s);
  headerNav(s, "Aide et mentions");
  sectionLabel(s, 126, "Aide");
  let y = row(s, 146, "Comment capturer un scrap");
  y = row(s, y, "Signaler une affiche");
  y = row(s, y, "Nous écrire");
  sectionLabel(s, y + 24, "Mentions");
  y = row(s, y + 44, "Conditions d'utilisation");
  y = row(s, y, "Mentions légales");
  y = row(s, y, "Crédits des affiches");
  TC(s, "Projet étudiant · LISAA · 2026", 0, 800, W, 20, "Texte/Méta", "texte/secondaire");
  homeBar(s);
}
function e47(s) {
  statusBar(s);
  headerNav(s, "Vie privée");
  T(s, "Ta vie privée", M, 130, "Titre/L", "texte/principal");
  const blocks = [
    ["Ce qu'on garde", "Ton e-mail, ton pseudo, tes scraps et ton scrapbook. La photo d'une affiche sert à la reconnaître, puis elle est effacée."],
    ["Ce qu'on ne fait jamais", "Partager ta position, vendre tes données, photographier des personnes, te relancer quand tu restes chez toi."],
    ["Tes droits", "Consulter, exporter ou effacer tes données à tout moment, depuis Réglages › Compte."]
  ];
  let y = 182;
  blocks.forEach(function (b) {
    filet(s, M, y, FULL);
    T(s, b[0], M, y + 16, "Titre/M", "texte/principal");
    const t = T(s, b[1], M, y + 48, "Texte/Corps", "texte/secondaire", { w: FULL });
    y += 48 + t.height + 24;
  });
  button(s, M, BTN_Y, FULL, "Exporter mes données", "secondaire");
  homeBar(s);
}

// ─── G. États d'erreur ─────────────────────────────────────
function e48(s) {
  statusBar(s);
  emptyState(s, "horsligne", "Pas de connexion", "Tes scraps et ton scrapbook restent disponibles. La carte et la capture reviennent avec le réseau.", "Réessayer", { tabs: 1 });
}
function e49(s) {
  statusBar(s);
  emptyState(s, "camera", "La caméra est coupée", "Sans elle, impossible de capturer un scrap. Tu peux l'activer dans les réglages du téléphone.", "Ouvrir les réglages", { link: "Plus tard" });
}
function e50(s) {
  statusBar(s);
  emptyState(s, "attention", "Quelque chose a coincé", "Le chargement n'a pas abouti. Réessaie dans un instant.", "Réessayer", { link: "Revenir à la carte" });
}

// ───────────────────────── Ordre du parcours
const SECTIONS = [
  ["A", "Lancement et inscription"], ["B", "Carte et capture"], ["C", "Scrapbook"],
  ["D", "Collections"], ["E", "Profil et partage"], ["F", "Réglages"], ["G", "États d'erreur"]
];
const SCREENS = [
  ["A", "01.1", "Lancement animé — début", "grid", e01a],
  ["A", "01.2", "Lancement animé — milieu", "grid", e01b],
  ["A", "01.3", "Lancement animé — fin (logo)", "grid", e01c],
  ["A", "02", "Bienvenue", "grid", e02],
  ["A", "03", "Découverte 1 — Sors", "grid", e03],
  ["A", "04", "Découverte 2 — Capture", "grid", e04],
  ["A", "05", "Découverte 3 — Colle", "grid", e05],
  ["A", "06", "Accès à la caméra", "grid", e06],
  ["A", "07", "Accès à la position", "grid", e07],
  ["A", "08", "Créer un compte", "grid", e08],
  ["A", "09", "Se connecter", "grid", e09],
  ["A", "10", "Mot de passe oublié", "grid", e10],
  ["A", "11", "Pseudo et avatar", "grid", e11],
  ["A", "12", "Collections de départ", "grid", e12],
  ["B", "13", "Carte d'accueil", "none", e13],
  ["B", "14", "Filtres de la carte", "none", e14],
  ["B", "15", "Recherche", "grid", e15],
  ["B", "16", "Scrap repéré (avant capture)", "none", e16],
  ["B", "17", "Itinéraire à pied", "none", e17],
  ["B", "18", "Carte vide", "none", e18],
  ["B", "19", "Scanner", "dark", e19],
  ["B", "20", "Capture échouée", "dark", e20],
  ["B", "21", "Scrap capturé — recto", "grid", e21],
  ["B", "22", "Scrap capturé — verso", "grid", e22],
  ["B", "23", "Détail de l'événement", "grid", e23],
  ["C", "24", "Mon scrapbook", "points", e24],
  ["C", "25", "Personnaliser — fond", "liege", e25],
  ["C", "26", "Personnaliser — scotch", "points", e26],
  ["C", "27", "Personnaliser — déchirer", "points", e27],
  ["D", "28", "Ma collection", "grid", e28],
  ["D", "29", "Sélection", "grid", e29],
  ["D", "30", "Mes collections", "grid", e30],
  ["D", "31", "Fiche d'une collection", "grid", e31],
  ["D", "32", "Collection complète — scrap exclusif", "grid", e32],
  ["D", "33", "Badge débloqué", "grid", e33],
  ["E", "34", "Placer sur ma vitrine", "grid", e34],
  ["E", "35", "Profil vu par les autres", "grid", e35],
  ["E", "36", "Choisir un badge", "grid", e36],
  ["E", "37", "Modifier le profil", "grid", e37],
  ["E", "38", "Abonnés et abonnements", "grid", e38],
  ["E", "39", "Partager un scrap", "grid", e39],
  ["E", "40", "Lieu partenaire", "grid", e40],
  ["F", "41", "Réglages", "grid", e41],
  ["F", "42", "Confidentialité", "grid", e42],
  ["F", "43", "Notifications", "grid", e43],
  ["F", "44", "Position", "grid", e44],
  ["F", "45", "Compte", "grid", e45],
  ["F", "46", "Aide et mentions", "grid", e46],
  ["F", "47", "Vie privée", "grid", e47],
  ["G", "48", "Pas de connexion", "grid", e48],
  ["G", "49", "Caméra coupée", "grid", e49],
  ["G", "50", "Erreur de chargement", "grid", e50]
];

function buildScreens(x0, y0) {
  const PAD = 80, GAP = 80, PER = 7;
  const WW = PAD * 2 + PER * W + (PER - 1) * GAP;
  const wrap = FR(figma.currentPage, "SCRAP — maquettes v4 (écrans 01 à 50)", x0, y0, WW, 1000, "fond/principal");
  T(wrap, "SCRAP — maquettes", PAD, 80, "Titre/XL", "texte/principal");
  T(wrap, "v4 · 50 écrans dans l'ordre du parcours · design system v1.0 + 09 grille de fond + 10 scrap · iPhone 17, 402 × 874", PAD, 136, "Texte/Méta", "texte/secondaire");
  let y = 220;
  SECTIONS.forEach(function (sec) {
    const list = SCREENS.filter(function (e) { return e[0] === sec[0]; });
    R(wrap, PAD, y, WW - 2 * PAD, 2, "trait/fort", { name: "Filet de section" });
    T(wrap, sec[0], PAD, y + 24, "Texte/Méta", "accent/capture");
    T(wrap, sec[1], PAD + 32, y + 16, "Titre/L", "texte/principal");
    y += 120;
    list.forEach(function (e, i) {
      const col = i % PER;
      if (i > 0 && col === 0) y += H + 120;
      const sx = PAD + col * (W + GAP);
      T(wrap, e[1], sx, y - 52, "Texte/Méta", "accent/capture");
      T(wrap, e[2], sx, y - 34, "Titre/M", "texte/principal");
      const s = screen(wrap, e[1] + " — " + e[2], sx, y, e[3]);
      e[4](s);
    });
    y += H + 160;
  });
  wrap.resize(WW, y);
  return wrap;
}
