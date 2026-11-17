// ───────────────────────── Design system : sections ajoutées

function sectionHead(f, num, title, desc) {
  R(f, 120, 80, f.width - 240, 2, "trait/fort", { name: "Filet de section" });
  T(f, num, 120, 136, "Texte/Méta", "texte/principal");
  const t = T(f, title, 120, 166, "Titre/XL", "texte/principal");
  t.fontSize = 56; t.lineHeight = { value: 56, unit: "PIXELS" };
  STYLE_QUEUE.pop();
  T(f, desc, 120, 246, "Texte/Corps", "texte/secondaire", { w: 440 });
}
function bigNumber(f, n, x, y, accent) {
  const t = T(f, String(n), x, y, "Chiffre/Capture", accent ? "accent/capture" : "texte/principal");
  t.fontSize = 56; STYLE_QUEUE.pop();
  return t;
}
function ruleBlock(f, rules, x0, y0, colW, rowH, perRow) {
  rules.forEach(function (r, i) {
    const cx = x0 + (i % perRow) * (colW + 80), cy = y0 + Math.floor(i / perRow) * rowH;
    bigNumber(f, i + 1, cx, cy, i === 0);
    T(f, r[0], cx, cy + 72, "Titre/M", "texte/principal");
    T(f, r[1], cx, cy + 108, "Texte/Petit", "texte/principal", { w: colW });
  });
}
function tokenTable(f, x, y, rows, cols) {
  rows.forEach(function (r, i) {
    const ry = y + i * 36;
    const head = i === 0;
    r.forEach(function (c, j) { T(f, c, x + cols[j], ry, head ? "Texte/Méta" : "Texte/Petit", head ? "texte/secondaire" : (j === 0 ? "texte/principal" : "texte/secondaire")); });
    filet(f, x, ry + 28, cols[cols.length - 1] + 420);
  });
}

// 09 — Grille de fond
function buildSection09(x0, y0) {
  const f = FR(figma.currentPage, "DESIGN SYSTEM — 09 Grille de fond", x0, y0, 2560, 2240, "fond/principal");
  sectionHead(f, "09", "Grille de fond", "Le fond n'est jamais tout à fait vide : une grille très légère rappelle le mur de travail sur lequel on épingle ses scraps. Elle structure sans se voir.");
  ruleBlock(f, [
    ["Toujours derrière", "Premier calque de chaque écran clair (composant « Fond / Grille »). Scraps, boutons, barres et champs ont un fond plein : elle ne passe jamais devant."],
    ["Calée sur les 4 colonnes", "Lignes verticales sur les marges (16) et au milieu des gouttières. Chaque colonne est divisée en 4."],
    ["Rythmée par la base 4", "Une ligne horizontale tous les 24 px, une ligne marquée tous les 96 px."],
    ["Presque invisible", "Trait texte/principal à 5 %, lignes marquées à 9 %, repère « + » de 9 px en texte/secondaire à 50 % aux croisements."],
    ["Le scrapbook a la sienne", "Sur le scrapbook et la vitrine, la grille laisse place à une trame de points (section 10)."],
    ["Pas partout", "Jamais sous la carte, jamais sur le scanner (mode sombre) : ces écrans ont déjà leur propre fond."]
  ], 680, 136, 520, 230, 3);
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
  const d2 = FR(f, "Exemple — scrap posé", 1640, vy, W, H, null);
  const i2 = grid.createInstance(); d2.appendChild(i2); i2.x = 0; i2.y = 0;
  T(d2, "Ma collection", M, 66, "Titre/XL", "texte/principal");
  card(d2, "seb", M, 140, COL2);
  card(d2, "ozkan", COLX[2], 140, COL2);
  T(f, "En application", 1640, vy + H + 16, "Texte/Méta", "texte/principal");
  T(f, "Le scrap reste posé sur du blanc, la grille autour", 1640, vy + H + 36, "Texte/Petit", "texte/secondaire");
  const ty = vy + H + 120;
  T(f, "Tokens de la grille", 680, ty, "Texte/Méta", "texte/principal");
  tokenTable(f, 680, ty + 32, [["Token", "Valeur", "Usage"],
    ["grille/trait", "texte/principal · 5 %", "Lignes fines (24 px, quarts de colonne)"],
    ["grille/trait-marqué", "texte/principal · 9 %", "Marges, gouttières, lignes tous les 96 px"],
    ["grille/repère", "texte/secondaire · 50 %", "Croix « + » de 9 px aux croisements"],
    ["grille/module", "24 px · 96 px", "Base 4 × 6, ligne marquée toutes les 4"]], [0, 320, 640]);
  return { frame: f, grid: grid };
}

// 10 — Scrap : vocabulaire, logo, tampon, scrapbook, scotch, déchirure
function buildSection10(x0, y0) {
  const f = FR(figma.currentPage, "DESIGN SYSTEM — 10 Scrap", x0, y0, 2560, 2760, "fond/principal");
  sectionHead(f, "10", "Scrap", "On va dans la rue pour capturer des scraps. Cette section fixe le vocabulaire, le logo, le tampon et tout ce qui rend le scrapbook personnel : fonds, scotch, déchirure.");

  // Vocabulaire
  T(f, "Vocabulaire", 680, 136, "Titre/M", "texte/principal");
  tokenTable(f, 680, 176, [["Avant", "Maintenant", "Exemple dans l'interface"],
    ["Une affiche scannée", "Un scrap", "« 48 scraps »"],
    ["Scanner une affiche", "Capturer un scrap", "Bouton « Capturer un scrap »"],
    ["Mur virtuel", "Scrapbook", "Onglet « Scrapbook »"],
    ["N° 003 · 3e personne", "Scrap N° 003 · 3e à l'avoir capturé", "Étiquette en accent"],
    ["Ajouter au mur", "Coller sur mon scrapbook", "Bouton principal"],
    ["Profil · mur public", "Vitrine", "Écran 34"]], [0, 300, 700]);

  // Logo
  T(f, "Logo", 1880, 136, "Titre/M", "texte/principal");
  logo(f, 2120, 250, 88);
  TC(f, "Ta ville en morceaux.", 1880, 304, 480, 24, "Texte/Corps", "texte/secondaire");
  T(f, "Le carré rouge est le seul accent du logo : c'est le point de capture. Accroche à valider.", 1880, 352, "Texte/Petit", "texte/secondaire", { w: 480 });

  // Tampon
  const yT = 520;
  T(f, "Tampon", 680, yT, "Titre/M", "texte/principal");
  tampon(f, 680, yT + 60, "12.11.26", "PARIS 20E");
  T(f, "Petit · scrap capturé", 680, yT + 120, "Texte/Méta", "texte/secondaire");
  tampon(f, 860, yT + 60, "12.11.26", "PARIS 20E", { plein: true });
  T(f, "Petit · collection complète", 860, yT + 120, "Texte/Méta", "texte/secondaire");
  tampon(f, 1080, yT + 52, "SCRAP N° 003", "PARIS 20E · 12.11.26", { big: true });
  T(f, "Grand · plein écran", 1080, yT + 120, "Texte/Méta", "texte/secondaire");
  tampon(f, 1320, yT + 52, "COMPLÈTE · 8 / 8", "17.11.26 · PARIS", { big: true, plein: true });
  T(f, "Grand · plein", 1320, yT + 120, "Texte/Méta", "texte/secondaire");
  const ex = FR(f, "Exemple — légende", 1720, yT + 40, W, 360, null);
  card(ex, "seb", M, 0, COL2);
  card(ex, "skeleton", COLX[2], 0, COL2);
  ruleBlock(f, [
    ["Un par scrap", "Posé à droite de la légende, jamais sur l'image. Il porte la date de capture et l'arrondissement."],
    ["Contour ou plein", "Contour : scrap capturé. Plein (fond/inverse) : la collection du scrap est complète."],
    ["Un vrai coup de tampon", "Incliné de 6°, double filet (1,5 px et 1 px), Texte/Méta en capitales. Jamais en accent."]
  ], 680, yT + 200, 260, 220, 3);

  // Fonds du scrapbook
  const yF = 1000;
  T(f, "Fonds du scrapbook", 680, yF, "Titre/M", "texte/principal");
  T(f, "Trame de points 2 px tous les 24 px, repères « + » tous les 96 px. L'utilisateur choisit son fond ; la grille de fond (09) est aussi proposée sous le nom « Quadrillé ».", 680, yF + 36, "Texte/Petit", "texte/secondaire", { w: 900 });
  const walls = {};
  ["points", "beton", "liege", "noir"].forEach(function (k, i) {
    const c = makeWall(k);
    f.appendChild(c);
    c.x = 680 + i * 460; c.y = yF + 100;
    walls[k] = c;
    T(f, WALLS[k].name, c.x, yF + 100 + H + 16, "Texte/Méta", "texte/principal");
    T(f, WALLS[k].info, c.x, yF + 100 + H + 36, "Texte/Petit", "texte/secondaire");
  });

  // Scotch
  const yS = 2120;
  T(f, "Scotch", 680, yS, "Titre/M", "texte/principal");
  [["transparent", "Transparent", "#FFFFFF · 55 % · filet trait/defaut"], ["kraft", "Kraft", "#D6BE96 · 92 %"],
   ["papier", "Papier", "#F1F1EE · 92 % · filet trait/defaut"], ["noir", "Noir", "#111111 · 88 %"]].forEach(function (k, i) {
    const x = 680 + i * 220;
    R(f, x, yS + 50, 180, 90, "fond/secondaire", { name: "Support" });
    scotch(f, x + 40, yS + 86, -8, k[0], 100);
    T(f, k[1], x, yS + 156, "Texte/Méta", "texte/principal");
    T(f, k[2], x, yS + 176, "Texte/Petit", "texte/secondaire");
  });
  ruleBlock(f, [
    ["Seulement pour coller", "Scotch sur le scrapbook et la vitrine uniquement. Jamais dans la collection, ni en plein écran."],
    ["Deux bouts maximum", "52 × 16 px, posés sur les coins, orientés librement. Rayon 0, aucune ombre."]
  ], 680, yS + 240, 300, 220, 2);

  // Déchirure
  T(f, "Déchirure", 1640, yS, "Titre/M", "texte/principal");
  const dx = 1640, dy = yS + 60;
  R(f, dx, dy - 10, 520, 380, "fond/secondaire", { name: "Support" });
  torn(f, "sanbimu", dx + 60, dy + 20, 220);
  tornPiece(f, "sanbimu", dx + 60, dy + 20, 220, 120, 40, -14);
  T(f, "Le morceau arraché reste dans la collection : on ne perd jamais un scrap. La déchirure ne vit que sur le scrapbook ; dans la collection, le scrap reste entier.", dx, dy + 400, "Texte/Petit", "texte/secondaire", { w: 520 });

  return { frame: f, walls: walls };
}
