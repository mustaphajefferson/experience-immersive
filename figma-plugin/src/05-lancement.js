// ───────────────────────── Liens avec le fichier et lancement

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
function findComp(name) {
  return figma.currentPage.findOne(function (n) { return n.type === "COMPONENT" && n.name === name; });
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
    let y = 0, x = x0;

    // Réutilise les composants de fond s'ils existent déjà dans la page
    BG.grid = findComp("Fond / Grille");
    BG.points = findComp(WALLS.points.name);
    BG.beton = findComp(WALLS.beton.name);
    BG.liege = findComp(WALLS.liege.name);
    BG.noir = findComp(WALLS.noir.name);

    const wantDS = cmd === "all" || cmd === "ds";
    if (!BG.grid && (wantDS || cmd === "screens")) {
      const r = buildSection09(x, 0);
      BG.grid = r.grid; made.push(r.frame); x += r.frame.width + 200;
    }
    if (!BG.points && (wantDS || cmd === "screens")) {
      const r = buildSection10(x, 0);
      BG.points = r.walls.points; BG.beton = r.walls.beton; BG.liege = r.walls.liege; BG.noir = r.walls.noir;
      made.push(r.frame);
    }
    if (made.length) y = Math.max.apply(null, made.map(function (m) { return m.height; })) + 300;

    if (cmd === "all" || cmd === "screens") made.push(buildScreens(x0, y));

    await applyTextStyles();
    figma.currentPage.selection = made;
    if (made.length) figma.viewport.scrollAndZoomIntoView(made);
    const note = made.length ? "" : " Rien à créer : les sections 09 et 10 existent déjà.";
    figma.closePlugin("Terminé · " + linkedVars + "/10 couleurs et " + Object.keys(TSTYLES).length + "/8 styles de texte liés au design system." + note);
  } catch (e) {
    figma.closePlugin("Erreur : " + (e && e.message ? e.message : e));
  }
})();
