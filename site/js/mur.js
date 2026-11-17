/* SCRAP — le scrapbook, la vitrine du profil et l'export.
 *
 * Le scrapbook est une grande page qu'on regarde à travers l'écran. Elle est
 * entourée de marges généreuses : on peut aller voir au-delà des affiches,
 * de tous les côtés, comme quand on fait glisser un vrai carnet sur la table.
 *
 * Modes :
 *   regarder — se promener, zoomer ; toucher un scrap l'ouvre en grand
 *   deplacer — toucher sélectionne, re-toucher ouvre en grand ; seul
 *              l'élément sélectionné se déplace, donc un glissement
 *              n'attrape jamais une affiche par surprise
 *   scotch   — toucher un coin pour poser ou enlever un bout de scotch
 *   dechirer — choisir un type de déchirure, puis toucher un scrap
 *   dessiner — tracer au doigt, par-dessus tout
 */
"use strict";

const LARGEUR_MUR = 402;
const MARGE_MUR = 200;          // le vide tout autour de la page
const ZOOM_MAX = 2.8;
const polyCss = (pts) => `polygon(${pts.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(",")})`;

/* ═════════ Ce qu'il y a sur la page */

const CADRES = [
  ["aucun", "Aucun"], ["filet", "Filet"], ["epais", "Épais"],
  ["passe", "Passe-partout"], ["polaroid", "Polaroïd"], ["noir", "Noir"],
];

function itemHtml(it, choisi) {
  const s = scrap(it.id);
  if (!s) return "";
  const decoupe = it.dechire ? `clip-path:${polyCss(it.dechire)}` : "";
  const cadre = it.cadre && it.cadre !== "aucun" ? ` cadre-${it.cadre}` : "";
  return `<div class="mur-item${choisi ? " choisi" : ""}${it.dechire ? " dechire" : ""}${cadre}" data-item="${it.id}"
    style="left:${it.x}px;top:${it.y}px;width:${it.w}px;transform:rotate(${it.rot || 0}deg)">
    ${it.dechire ? `<i class="bord-dechire" style="${decoupe}"></i>` : ""}
    <div class="mur-papier" style="${decoupe}"><img src="${imgScrap(it.id)}" alt="" draggable="false" style="aspect-ratio:${s.ratio}"></div>
    ${it.cadre === "polaroid" ? `<span class="polaroid-legende t-texte-meta">${esc(s.lieu)}</span>` : ""}
    ${(it.scotch || []).map(([coin, type]) => `<i class="scotch ${type} ${coin}"></i>`).join("")}
    ${choisi ? '<i class="poignee" data-poignee="1"></i>' : ""}
  </div>`;
}

/* Les éléments qu'on pose soi-même sur la page pour l'annoter. */
const TYPES_NOTE = [
  { type: "titre", nom: "Grand titre", exemple: "BELLEVILLE", w: 38, icone: "lettre" },
  { type: "soustitre", nom: "Sous-titre", exemple: "Printemps 2026", w: 22, icone: "lettre" },
  { type: "etiquette", nom: "Étiquette", exemple: "Mes préférées", w: 13, icone: "etiquette" },
  { type: "date", nom: "Date", exemple: "", w: 13, icone: "calendrier" },
  { type: "fleche", nom: "Flèche", exemple: "", w: 90, icone: "fleche" },
  { type: "fleche2", nom: "Flèche double", exemple: "", w: 100, icone: "fleche" },
  { type: "souligne", nom: "Soulignement", exemple: "", w: 120, icone: "texte" },
  { type: "entoure", nom: "Entourer", exemple: "", w: 130, icone: "loupe" },
  { type: "etoile", nom: "Étoile", exemple: "", w: 40, icone: "etoile" },
  { type: "ruban", nom: "Ruban", exemple: "", w: 80, icone: "ruban" },
  { type: "punaise", nom: "Punaise", exemple: "", w: 22, icone: "punaise" },
];
const estTexte = (t) => ["titre", "soustitre", "etiquette", "date"].includes(t);

/* Les annotations dessinées se tracent toutes seules quand elles arrivent :
 * le trait se déroule, comme si on venait de le faire au feutre. */
const DESSINS_NOTE = {
  fleche: ['<svg viewBox="0 0 100 34">', '<path d="M2 24c18-18 44-24 94-20"/><path d="M78 2l18 2-4 18"/>', 34],
  fleche2: ['<svg viewBox="0 0 100 40">', '<path d="M6 20h88"/><path d="M18 8 4 20l14 12"/><path d="M82 8l14 12-14 12"/>', 40],
  souligne: ['<svg viewBox="0 0 120 20">', '<path d="M3 9c26 6 62 7 114 1"/><path d="M8 15c24 4 56 5 102 0"/>', 20],
  entoure: ['<svg viewBox="0 0 130 70">', '<path d="M68 5C28 3 4 18 6 37s34 30 66 28 52-16 50-32S104 7 70 5"/>', 70],
  etoile: ['<svg viewBox="0 0 40 40">', '<path d="M20 3l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>', 40],
};

function noteHtml(n, choisi) {
  const base = `mur-note note-${n.type}${choisi ? " choisi" : ""}`;
  const pose = `left:${n.x}px;top:${n.y}px;transform:rotate(${n.rot || 0}deg)`;
  const poignee = choisi ? '<i class="poignee" data-poignee="1"></i>' : "";
  if (estTexte(n.type)) {
    return `<div class="${base}" data-note="${n.id}" style="${pose};font-size:${n.w}px">${esc(n.texte || "")}${poignee}</div>`;
  }
  const d = DESSINS_NOTE[n.type];
  if (d) {
    return `<div class="${base}" data-note="${n.id}" style="${pose};width:${n.w}px">
      ${d[0]}<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">${d[1]}</g></svg>${poignee}</div>`;
  }
  if (n.type === "ruban") {
    return `<div class="${base}" data-note="${n.id}" style="${pose};width:${n.w}px"><i class="scotch ${ETAT.mur.scotchType || "kraft"}" style="position:static;display:block;width:100%"></i>${poignee}</div>`;
  }
  return `<div class="${base}" data-note="${n.id}" style="${pose};width:${n.w}px;height:${n.w}px">
    <svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="10" r="7" fill="currentColor"/><circle cx="9.6" cy="7.6" r="2.2" fill="#fff" opacity=".55"/><path d="M12 17v5" stroke="currentColor" stroke-width="1.6"/></svg>${poignee}</div>`;
}

const notesMur = () => ETAT.mur.notes || (ETAT.mur.notes = []);
const traitsMur = () => ETAT.mur.traits || (ETAT.mur.traits = []);
const trouverElement = (id) => ETAT.mur.items.find((i) => i.id === id) || notesMur().find((n) => n.id === id);
const estNote = (o) => !!(o && o.type);

/* Les traits dessinés à la main, dans un seul calque SVG. */
function traitsHtml() {
  const t = traitsMur();
  if (!t.length) return "";
  return `<svg class="traits-mur" width="${LARGEUR_MUR}" height="${ETAT.mur.hauteur}" aria-hidden="true">
    ${t.map((tr) => `<polyline points="${tr.pts.map(([x, y]) => `${x},${y}`).join(" ")}" fill="none"
      stroke="${tr.couleur || "#111111"}" stroke-width="${tr.w || 3}" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}
  </svg>`;
}

/* Part de la page déjà couverte par des scraps — sert au petit indicateur. */
function remplissageMur() {
  const m = ETAT.mur;
  const aire = m.items.reduce((a, it) => {
    const s = scrap(it.id);
    return a + (s ? it.w * (it.w / s.ratio) : 0);
  }, 0);
  return clamp(aire / (LARGEUR_MUR * m.hauteur), 0, 1);
}

/* Fond de la page : motif, ou photo personnelle avec un voile réglable. */
function styleFond(m) {
  if (m.fond === "photo" && m.fondImage) {
    return `background-image:url(${m.fondImage});background-size:cover;background-position:center`;
  }
  return "";
}

/* ═════════ Dispositions toutes faites
 * Quatre façons de ranger la page d'un coup, parce que placer vingt affiches
 * à la main est long et qu'on veut surtout pouvoir repartir d'une base. */
function rangerMur(type) {
  const m = ETAT.mur;
  const liste = m.items.slice();
  const hauteurDe = (it, w) => { const s = scrap(it.id); return w / ((s && s.ratio) || 0.75); };
  const marge = 18;
  let y = 56;

  if (type === "grille") {
    const col = 3, w = Math.floor((LARGEUR_MUR - marge * (col + 1)) / col);
    liste.forEach((it, i) => {
      it.w = w; it.rot = 0;
      it.x = marge + (i % col) * (w + marge);
      if (i % col === 0 && i) y += Math.max(...liste.slice(i - col, i).map((p) => hauteurDe(p, w))) + marge;
      it.y = y;
    });
    m.hauteur = Math.max(900, y + 300);
  } else if (type === "colonne") {
    const w = Math.round(LARGEUR_MUR * 0.62);
    liste.forEach((it) => {
      it.w = w; it.rot = 0; it.x = Math.round((LARGEUR_MUR - w) / 2);
      it.y = y; y += hauteurDe(it, w) + marge;
    });
    m.hauteur = Math.max(900, y + 300);
  } else if (type === "mosaique") {
    // deux colonnes qui se remplissent en alternance, comme un mur de posters
    const col = 2, w = Math.floor((LARGEUR_MUR - marge * (col + 1)) / col);
    const bas = [56, 110];
    liste.forEach((it) => {
      const c = bas[0] <= bas[1] ? 0 : 1;
      it.w = w; it.rot = Math.round(Math.random() * 6 - 3);
      it.x = marge + c * (w + marge);
      it.y = bas[c];
      bas[c] += hauteurDe(it, w) + marge;
    });
    m.hauteur = Math.max(900, Math.max(...bas) + 300);
  } else {   // éparpillé
    liste.forEach((it, i) => {
      it.w = 92 + Math.round(Math.random() * 70);
      it.rot = Math.round(Math.random() * 16 - 8);
      it.x = Math.round(14 + Math.random() * (LARGEUR_MUR - it.w - 28));
      it.y = Math.round(56 + i * 108 + Math.random() * 60);
    });
    m.hauteur = Math.max(900, 56 + liste.length * 108 + 400);
  }
  sauver();
}

/* ═════════ La page */

function murMonter(racine, outil) {
  const zone = $("#mur", racine), plan = $("#plan", racine);
  if (!zone || !plan) return null;
  const m = ETAT.mur;
  const vue = ETAT.ctx.vue || (ETAT.ctx.vue = { k: 0, x: 0, y: 0 });
  const PW = LARGEUR_MUR + MARGE_MUR * 2;
  const PH = () => m.hauteur + MARGE_MUR * 2;

  /* ───────── Cadrage */
  const kLarge = () => zone.clientWidth / LARGEUR_MUR;                                  // la page remplit la largeur
  const kEnsemble = () => Math.min(zone.clientWidth / PW, zone.clientHeight / PH());    // toute la page d'un coup
  const kMin = () => kEnsemble() * 0.8;

  const contraindre = () => {
    const pw = PW * vue.k, ph = PH() * vue.k;
    vue.x = pw <= zone.clientWidth ? (zone.clientWidth - pw) / 2 : clamp(vue.x, zone.clientWidth - pw, 0);
    vue.y = ph <= zone.clientHeight ? (zone.clientHeight - ph) / 2 : clamp(vue.y, zone.clientHeight - ph, 0);
  };
  const appliquer = () => {
    contraindre();
    plan.style.transform = `translate(${vue.x.toFixed(2)}px, ${vue.y.toFixed(2)}px) scale(${vue.k.toFixed(4)})`;
    zone.classList.toggle("ensemble", vue.k <= kEnsemble() * 1.08);
    const j = $("#zoom-valeur", racine);
    if (j) j.textContent = Math.round((vue.k / kLarge()) * 100) + " %";
  };
  const cadrer = (k, cx, cy) => {
    const r = zone.getBoundingClientRect();
    const px = (cx - r.left - vue.x) / vue.k, py = (cy - r.top - vue.y) / vue.k;
    vue.k = clamp(k, kMin(), ZOOM_MAX);
    vue.x = cx - r.left - px * vue.k;
    vue.y = cy - r.top - py * vue.k;
    appliquer();
  };
  const centre = () => { const r = zone.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  // place la page en haut, centrée, à l'échelle « largeur »
  const cadrerDepart = () => { vue.k = kLarge(); vue.x = -MARGE_MUR * vue.k; vue.y = -MARGE_MUR * vue.k; };

  const choisissable = outil === "deplacer";
  let contenu = null;
  const dessiner = () => {
    plan.style.width = PW + "px";
    plan.style.height = PH() + "px";
    const sel = choisissable ? ETAT.ctx.murSel : null;
    const notes = notesMur();
    plan.innerHTML = `<div class="mur-contenu" id="contenu" style="left:${MARGE_MUR}px;top:${MARGE_MUR}px;width:${LARGEUR_MUR}px;height:${m.hauteur}px">
      ${notes.filter((n) => !n.devant).map((n) => noteHtml(n, n.id === sel)).join("")}
      ${m.items.map((it) => itemHtml(it, it.id === sel)).join("")}
      ${notes.filter((n) => n.devant).map((n) => noteHtml(n, n.id === sel)).join("")}
      ${traitsHtml()}
      <svg class="trace" id="trace" width="${LARGEUR_MUR}" height="${m.hauteur}"></svg>
    </div>`;
    contenu = $("#contenu", plan);
  };

  dessiner();
  if (!vue.k) cadrerDepart();
  // après un collage, on se place sur le scrap qui vient d'arriver
  let volCible = null;
  if (ETAT.ctx.recadrer) {
    const it = m.items.find((i) => i.id === ETAT.ctx.recadrer);
    ETAT.ctx.recadrer = null;
    if (it) {
      const s = scrap(it.id);
      vue.k = kLarge();
      vue.x = -MARGE_MUR * vue.k;
      vue.y = zone.clientHeight / 2 - (MARGE_MUR + it.y + it.w / ((s && s.ratio) || 0.75) / 2) * vue.k;
      volCible = it.id;
    }
  }
  appliquer();
  if (volCible && ETAT.ctx.vol) {
    const vol = ETAT.ctx.vol; ETAT.ctx.vol = null;
    requestAnimationFrame(() => volArriver(vol, plan.querySelector(`[data-item="${CSS.escape(volCible)}"]`),
      () => toast("Collé sur ton scrapbook")));
  }
  const ajuster = () => appliquer();
  window.addEventListener("resize", ajuster);

  /* commandes de zoom posées par l'écran */
  zone.addEventListener("click", (e) => {
    const b = e.target.closest("[data-zoom]");
    if (!b) return;
    e.stopPropagation();
    const [cx, cy] = centre();
    if (b.dataset.zoom === "ensemble") { vue.k = kEnsemble(); vue.x = 0; vue.y = 0; appliquer(); vibrer(8); }
    else cadrer(vue.k * (b.dataset.zoom === "plus" ? 1.35 : 1 / 1.35), cx, cy);
  }, true);

  const cibleDe = (n) => {
    const el = n.closest && n.closest("[data-item],[data-note]");
    if (!el) return [null, null];
    return [el, trouverElement(el.dataset.item || el.dataset.note)];
  };
  const auPremierPlan = (o) => {
    if (estNote(o)) { o.devant = true; ETAT.mur.notes = notesMur().filter((n) => n !== o).concat(o); }
    else m.items = m.items.filter((i) => i !== o).concat(o);
  };
  const hauteurDe = (o) => (estNote(o) ? 0 : o.w / scrap(o.id).ratio);
  // point de l'écran ramené dans le repère d'un scrap (0 à 1), rotation comprise
  const local = (el, it, ex, ey) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a = (-(it.rot || 0) * Math.PI) / 180;
    const dx = ex - cx, dy = ey - cy;
    const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
    const w = it.w * vue.k, h = hauteurDe(it) * vue.k;
    return [lx / w + 0.5, ly / h + 0.5];
  };
  // point de l'écran ramené dans le repère de la page (px)
  const surPage = (ex, ey) => {
    const r = contenu.getBoundingClientRect();
    return [(ex - r.left) / vue.k, (ey - r.top) / vue.k];
  };

  /* ───────── Gestes : un doigt promène la page, deux doigts pincent. */
  const doigts = new Map();
  let geste = null, pince = null, dernierTap = 0;

  const debut = (e) => {
    if (e.target.closest("[data-zoom]")) return;
    doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    zone.setPointerCapture && zone.setPointerCapture(e.pointerId);

    if (doigts.size === 2) {
      if (geste && geste.trait) traitsMur().pop();
      geste = null;
      const [a, b] = [...doigts.values()];
      pince = { d0: Math.hypot(a.x - b.x, a.y - b.y), k0: vue.k };
      plan.classList.add("sans-transition");
      return;
    }
    if (doigts.size > 2) return;

    const [el, obj] = cibleDe(e.target);
    const selectionne = obj && choisissable && ETAT.ctx.murSel === obj.id;

    if (outil === "dessiner") {
      e.preventDefault();
      const d = ETAT.mur.dessin || (ETAT.mur.dessin = { w: 4, couleur: "#111111" });
      const tr = { id: "t" + Date.now(), pts: [surPage(e.clientX, e.clientY).map(Math.round)], w: d.w, couleur: d.couleur };
      traitsMur().push(tr);
      geste = { trait: tr };
      return;
    }
    if (el && e.target.closest("[data-poignee]") && choisissable) {
      e.preventDefault();
      geste = { taille: true, obj, el, x0: e.clientX, y0: e.clientY, w0: obj.w };
      return;
    }
    if (outil === "dechirer" && (ETAT.mur.dechireType || "coin") === "mesure") {
      geste = { libre: true, x0: e.clientX, y0: e.clientY, bouge: false };
      return;
    }
    if (el && selectionne) {
      e.preventDefault();
      geste = { obj, el, x0: e.clientX, y0: e.clientY, ix: obj.x, iy: obj.y, bouge: false, deplace: true };
      el.classList.add("tire");
      return;
    }
    geste = {
      promene: true, x0: e.clientX, y0: e.clientY, vx: vue.x, vy: vue.y, bouge: false,
      sous: el ? { el, obj, depart: local(el, obj, e.clientX, e.clientY) } : null,
    };
    plan.classList.add("sans-transition");
  };

  const deplacement = (e) => {
    if (doigts.has(e.pointerId)) doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pince && doigts.size >= 2) {
      const [a, b] = [...doigts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pince.d0 > 10) cadrer((pince.k0 * d) / pince.d0, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (!geste) return;
    const dx = (e.clientX - geste.x0) / vue.k, dy = (e.clientY - geste.y0) / vue.k;
    if (Math.abs(e.clientX - geste.x0) + Math.abs(e.clientY - geste.y0) > 6) geste.bouge = true;

    if (geste.trait) {
      const p = surPage(e.clientX, e.clientY).map(Math.round);
      const der = geste.trait.pts[geste.trait.pts.length - 1];
      if (Math.hypot(p[0] - der[0], p[1] - der[1]) > 2) { geste.trait.pts.push(p); redessinerTraits(); }
      return;
    }
    if (geste.promene) {
      vue.x = geste.vx + (e.clientX - geste.x0);
      vue.y = geste.vy + (e.clientY - geste.y0);
      appliquer();
      return;
    }
    if (geste.taille) {
      const o = geste.obj;
      const d = ((e.clientX - geste.x0) + (e.clientY - geste.y0)) / 2 / vue.k;
      const bornes = estNote(o) ? (estTexte(o.type) ? [11, 76] : [24, 320]) : [56, 360];
      o.w = clamp(Math.round(geste.w0 + d), bornes[0], bornes[1]);
      if (estTexte(o.type)) geste.el.style.fontSize = o.w + "px"; else geste.el.style.width = o.w + "px";
      if (estNote(o) && o.type === "punaise") geste.el.style.height = o.w + "px";
      majCurseurs(o);
      return;
    }
    if (geste.deplace) {
      geste.obj.x = clamp(geste.ix + dx, -MARGE_MUR + 20, LARGEUR_MUR + MARGE_MUR - 40);
      geste.obj.y = clamp(geste.iy + dy, -MARGE_MUR + 20, m.hauteur + MARGE_MUR - 40);
      geste.el.style.left = geste.obj.x + "px";
      geste.el.style.top = geste.obj.y + "px";
      return;
    }
    if (geste.libre) {
      const p0 = surPage(geste.x0, geste.y0), p1 = surPage(e.clientX, e.clientY);
      const t = $("#trace", plan);
      if (t) t.innerHTML = `<path d="M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}" stroke="#111" stroke-width="${1.5 / vue.k}" stroke-dasharray="${5 / vue.k} ${5 / vue.k}" fill="none"/>`;
    }
  };

  function redessinerTraits() {
    const svg = $(".traits-mur", plan);
    if (!svg) { const bloc = document.createElement("div"); bloc.innerHTML = traitsHtml(); contenu.appendChild(bloc.firstElementChild); return; }
    svg.outerHTML = traitsHtml();
  }

  const fin = (e) => {
    doigts.delete(e.pointerId);
    if (doigts.size < 2 && pince) { pince = null; plan.classList.remove("sans-transition"); }
    if (!geste) return;
    const g = geste; geste = null;
    plan.classList.remove("sans-transition");
    $$(".tire", plan).forEach((x) => x.classList.remove("tire"));

    if (g.trait) {
      if (g.trait.pts.length < 2) traitsMur().pop();
      sauver(); redessinerTraits(); majPanneau();
      return;
    }
    if (g.deplace) { sauver(); return; }
    if (g.taille) { sauver(); vibrer(6); return; }

    if (g.libre) {
      const t = $("#trace", plan); if (t) t.innerHTML = "";
      if (!g.bouge) return;
      const mx = (g.x0 + e.clientX) / 2, my = (g.y0 + e.clientY) / 2;
      const sous = document.elementsFromPoint(mx, my).find((n) => n.closest && n.closest("[data-item]"));
      if (!sous) return;
      const [el, it] = cibleDe(sous);
      dechirer(it, local(el, it, g.x0, g.y0), local(el, it, e.clientX, e.clientY));
      return;
    }

    if (!g.promene || g.bouge) return;

    const sous = g.sous;
    if (!sous || !sous.obj) {
      const t = performance.now();
      if (t - dernierTap < 300) {
        const proche = vue.k > kEnsemble() * 1.2;
        if (proche) { vue.k = kEnsemble(); vue.x = 0; vue.y = 0; appliquer(); }
        else cadrer(kLarge() * 1.4, e.clientX, e.clientY);
        vibrer(8);
      }
      dernierTap = t;
      if (choisissable && ETAT.ctx.murSel) { ETAT.ctx.murSel = null; dessiner(); majPanneau(); }
      return;
    }

    const { obj } = sous;
    if (outil === "regarder") {
      if (estNote(obj)) return;
      ETAT.ctx.scrap = obj.id; aller("21"); return;
    }
    if (outil === "deplacer") {
      if (ETAT.ctx.murSel === obj.id) {
        if (estNote(obj)) { const c = $("#note-texte"); if (c) c.focus(); return; }
        ETAT.ctx.scrap = obj.id; aller("21"); return;
      }
      ETAT.ctx.murSel = obj.id; auPremierPlan(obj); dessiner(); majPanneau(); vibrer(6);
      return;
    }
    if (outil === "scotch") {
      if (estNote(obj)) return;
      const [lx, ly] = sous.depart;
      const coin = (ly < 0.5 ? "h" : "b") + (lx < 0.5 ? "g" : "d");
      const sc = obj.scotch || (obj.scotch = []);
      const deja = sc.findIndex(([c]) => c === coin);
      if (deja >= 0) sc.splice(deja, 1);
      else { if (sc.length >= 2) sc.shift(); sc.push([coin, m.scotchType || "kraft"]); }
      vibrer(10); sauver(); dessiner();
      return;
    }
    if (outil === "dechirer") {
      if (estNote(obj)) return;
      const [a, b] = pointsDechirure(ETAT.mur.dechireType || "coin");
      dechirer(obj, a, b);
    }
  };

  zone.addEventListener("pointerdown", debut);
  zone.addEventListener("pointermove", deplacement);
  zone.addEventListener("pointerup", fin);
  zone.addEventListener("pointercancel", fin);
  const roulette = (e) => { e.preventDefault(); cadrer(vue.k * (e.deltaY < 0 ? 1.1 : 1 / 1.1), e.clientX, e.clientY); };
  zone.addEventListener("wheel", roulette, { passive: false });

  /* Panneau du bas (mode Disposition) : l'élément choisi, ou les rangements */
  function majPanneau() {
    const p = $("#panneau-item", racine);
    if (!p) return;
    const o = trouverElement(ETAT.ctx.murSel);
    p.innerHTML = o ? panneauElement(o) : panneauRangements();
    p.classList.remove("vide");
  }
  function majCurseurs(o) {
    const a = $("#item-taille", racine), b = $("#item-taille-val", racine);
    if (a) a.value = o.w;
    if (b) b.textContent = estNote(o) && estTexte(o.type) ? o.w + " px" : Math.round((o.w / 128) * 100) + " %";
  }
  majPanneau();
  racine._murRedessiner = () => { dessiner(); majPanneau(); };
  racine._murCadrerDepart = () => { cadrerDepart(); appliquer(); };

  function dechirer(it, a, b) {
    const res = coupe(a, b, { rugosite: ETAT.mur.dechireType === "arrachee" ? 1.8 : 1 });
    if (!res) { toast("Glisse franchement d'un bord à l'autre du scrap."); return; }
    ETAT.ctx.dechireAvant = { id: it.id, avant: it.dechire || null };
    it.dechire = res.garde;
    sauver();
    vibrer([10, 30, 20]);
    const morceau = document.createElement("div");
    morceau.className = "morceau";
    morceau.style.cssText = `left:${it.x}px;top:${it.y}px;width:${it.w}px;--dx:${(Math.random() * 60 - 30).toFixed(0)}px;--dr:${(Math.random() * 50 - 25).toFixed(0)}deg`;
    morceau.innerHTML = `<div style="transform:rotate(${it.rot || 0}deg);clip-path:${polyCss(res.arrache)}"><img src="${imgScrap(it.id)}" alt="" style="width:100%"></div>`;
    contenu.appendChild(morceau);
    setTimeout(() => morceau.remove(), 1200);
    dessiner();
    toast("Déchiré. Le morceau reste dans ta collection.");
  }

  return () => { window.removeEventListener("resize", ajuster); zone.removeEventListener("wheel", roulette); };
}

/* Rangements proposés quand rien n'est sélectionné */
const RANGEMENTS = [["grille", "Grille"], ["colonne", "Colonne"], ["mosaique", "Mosaïque"], ["eparpille", "Éparpillé"]];
function panneauRangements() {
  return `<div class="panneau-item-int">
    <div class="rangee entre">
      <span class="t-texte-meta secondaire">Ranger la page d'un coup</span>
      <button class="bouton-lien t-texte-meta" data-action="modeMur" data-id="regarder">Terminé</button>
    </div>
    <div class="puces retour-ligne" style="margin-top:10px">
      ${RANGEMENTS.map(([k, nom]) => `<button class="puce" data-action="rangerMur" data-id="${k}">${nom}</button>`).join("")}
    </div>
    <p class="t-texte-petit secondaire" style="margin:8px 0 0">Ou touche un scrap pour le déplacer, l'agrandir, le tourner et l'encadrer.</p>
  </div>`;
}

/* Réglages de l'élément sélectionné */
function panneauElement(o) {
  const note = estNote(o);
  const texte = note && estTexte(o.type);
  const nom = note ? (TYPES_NOTE.find((t) => t.type === o.type) || {}).nom || "Élément" : `N° ${pad3(scrap(o.id).num)} · ${scrap(o.id).titre}`;
  const bornes = note ? (texte ? [11, 76] : [24, 320]) : [56, 360];
  return `<div class="panneau-item-int">
    <div class="rangee entre">
      <span class="t-texte-meta secondaire">${esc(nom)}</span>
      <button class="bouton-lien t-texte-meta" data-action="deselectionnerItem">Terminé</button>
    </div>
    ${texte ? `<input class="champ-note" id="note-texte" type="text" value="${esc(o.texte || "")}" data-input="noteTexte" placeholder="Ton texte" maxlength="40">` : ""}
    ${note ? "" : `<div class="cadres">${CADRES.map(([k, nom2]) =>
      `<button class="cadre-choix${(o.cadre || "aucun") === k ? " choisi" : ""}" data-action="choisirCadre" data-id="${k}" title="${nom2}">
        <span class="cadre-apercu cadre-${k}"><i></i></span><span class="t-texte-meta${(o.cadre || "aucun") === k ? "" : " secondaire"}">${nom2}</span></button>`).join("")}</div>`}
    <div class="curseur-ligne" style="margin-top:10px"><span class="t-texte-meta secondaire">Taille</span><span class="t-texte-meta secondaire" id="item-taille-val">${texte ? o.w + " px" : Math.round((o.w / 128) * 100) + " %"}</span></div>
    <input type="range" min="${bornes[0]}" max="${bornes[1]}" value="${o.w}" data-input="itemTaille" id="item-taille">
    <div class="curseur-ligne" style="margin-top:6px"><span class="t-texte-meta secondaire">Rotation</span><span class="t-texte-meta secondaire" id="item-rot-val">${o.rot || 0}°</span></div>
    <input type="range" min="-25" max="25" value="${o.rot || 0}" data-input="itemRotation">
    <div class="rangee" style="gap:8px;margin-top:10px;flex-wrap:wrap">
      <button class="puce" data-action="itemDevant">Mettre devant</button>
      <button class="puce" data-action="itemAligner">Redresser</button>
      ${note ? "" : '<button class="puce" data-action="ouvrirSelection">Observer</button>'}
      <button class="puce" data-action="itemRetirer">Retirer</button>
    </div>
  </div>`;
}

/* ═════════ Déchirures
 * Un vrai bord déchiré n'est pas un zigzag régulier : c'est une ligne qui
 * part dans tous les sens, avec de grandes ondulations et de petites dents
 * par-dessus. On construit ça par déplacement du milieu. */
function bordDechire(p1, p2, amp = 1) {
  const long = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) || 1;
  let pts = [p1, p2];
  let a = 0.052 * amp;
  for (let tour = 0; tour < 5; tour++) {
    const suivant = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const nx = -(y2 - y1) / long, ny = (x2 - x1) / long;
      const d = (Math.random() - 0.5) * 2 * a;
      const t = 0.5 + (Math.random() - 0.5) * 0.3;
      suivant.push([
        clamp(x1 + (x2 - x1) * t + nx * d, 0, 1),
        clamp(y1 + (y2 - y1) * t + ny * d, 0, 1),
      ]);
      suivant.push(pts[i + 1]);
    }
    pts = suivant;
    a *= 0.52;
  }
  return pts.slice(1, -1);
}

function pointsDechirure(type) {
  const r = (a, b) => a + Math.random() * (b - a);
  if (type === "coin") {
    const coin = Math.floor(Math.random() * 4);
    const d = r(0.28, 0.5), e = r(0.28, 0.5);
    return [[[d, 0], [0, e]], [[1 - d, 0], [1, e]], [[1, 1 - e], [1 - d, 1]], [[0, 1 - e], [d, 1]]][coin];
  }
  if (type === "bord") {
    return Math.random() < 0.5
      ? [[0, r(0.78, 0.9)], [1, r(0.78, 0.9)]]
      : [[0, r(0.1, 0.22)], [1, r(0.1, 0.22)]];
  }
  if (type === "moitie") {
    return Math.random() < 0.5 ? [[0, r(0.42, 0.58)], [1, r(0.42, 0.58)]] : [[r(0.42, 0.58), 0], [r(0.42, 0.58), 1]];
  }
  return [[r(0, 0.3), 0], [1, r(0.5, 0.9)]];
}

function coupe(a, b, o = {}) {
  const d = [b[0] - a[0], b[1] - a[1]];
  if (Math.hypot(d[0], d[1]) < 0.15) return null;
  const ts = [];
  const essai = (t) => { const p = [a[0] + t * d[0], a[1] + t * d[1]]; if (p[0] >= -1e-6 && p[0] <= 1 + 1e-6 && p[1] >= -1e-6 && p[1] <= 1 + 1e-6) ts.push([t, [clamp(p[0], 0, 1), clamp(p[1], 0, 1)]]); };
  if (d[0]) { essai((0 - a[0]) / d[0]); essai((1 - a[0]) / d[0]); }
  if (d[1]) { essai((0 - a[1]) / d[1]); essai((1 - a[1]) / d[1]); }
  if (ts.length < 2) return null;
  ts.sort((x, y) => x[0] - y[0]);
  const p1 = ts[0][1], p2 = ts[ts.length - 1][1];
  if (Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) < 0.2) return null;
  const per = ([x, y]) => (y <= 1e-6 ? x : x >= 1 - 1e-6 ? 1 + y : y >= 1 - 1e-6 ? 2 + (1 - x) : 3 + (1 - y));
  const coins = [[[0, 0], 0], [[1, 0], 1], [[1, 1], 2], [[0, 1], 3]];
  const arc = (s1, s2) => coins.filter(([, s]) => (s1 < s2 ? s > s1 && s < s2 : s > s1 || s < s2)).sort(([, x], [, y]) => ((x - s1 + 4) % 4) - ((y - s1 + 4) % 4)).map(([p]) => p);
  const dents = bordDechire(p2, p1, o.rugosite || 1);
  const s1 = per(p1), s2 = per(p2);
  const polyA = [p1, ...arc(s1, s2), p2, ...dents];
  const polyB = [p2, ...arc(s2, s1), p1, ...dents.slice().reverse()];
  const aire = (pts) => Math.abs(pts.reduce((s, [x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
  return aire(polyA) >= aire(polyB) ? { garde: polyA, arrache: polyB } : { garde: polyB, arrache: polyA };
}

/* ═════════ Export : la page entière redessinée dans une image à partager */

const MOTIFS_FOND = {
  papier: ["#F1F1EE", "rgba(17,17,17,.22)"],
  grille: ["#FFFFFF", "rgba(17,17,17,.14)"],
  millimetre: ["#EFF1EC", "rgba(17,80,60,.22)"],
  kraft: ["#C8AE86", "rgba(70,50,26,.22)"],
  beton: ["#CBCBC6", "rgba(17,17,17,.18)"],
  liege: ["#C9A77A", "rgba(74,54,32,.32)"],
  journal: ["#EDEAE3", "rgba(17,17,17,.12)"],
  noir: ["#111111", "rgba(255,255,255,.22)"],
};

function dessinerMurCanvas(o = {}) {
  const m = ETAT.mur;
  const marge = o.marge === undefined ? 28 : o.marge;
  const bas = m.items.reduce((h, it) => {
    const s = scrap(it.id); return Math.max(h, it.y + (s ? it.w / s.ratio : it.w));
  }, 320) + 24;
  const hauteur = o.hauteurPage || Math.min(m.hauteur, bas);
  const k = (o.largeur || 1080) / (LARGEUR_MUR + marge * 2);
  const c = document.createElement("canvas");
  c.width = Math.round((LARGEUR_MUR + marge * 2) * k);
  c.height = Math.round((hauteur + marge * 2 + (o.pied ? 86 : 0)) * k);
  const x = c.getContext("2d");
  x.scale(k, k);

  const [fond, point] = MOTIFS_FOND[m.fond] || MOTIFS_FOND.papier;
  const dessinerFond = () => {
    x.fillStyle = fond;
    x.fillRect(0, 0, c.width / k, c.height / k);
    x.fillStyle = point;
    for (let yy = 12; yy < c.height / k; yy += 24) for (let xx = 12; xx < c.width / k; xx += 24) x.fillRect(xx, yy, 2, 2);
  };

  const charger = (src) => new Promise((res) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });

  const fondPhoto = m.fond === "photo" && m.fondImage ? charger(m.fondImage) : Promise.resolve(null);

  return fondPhoto.then((photo) => {
    if (o.transparent) { /* on laisse le fond vide : l'appelant met une photo dessous */ }
    else if (photo) {
      const kk = Math.max((c.width / k) / photo.width, (c.height / k) / photo.height);
      x.drawImage(photo, ((c.width / k) - photo.width * kk) / 2, ((c.height / k) - photo.height * kk) / 2, photo.width * kk, photo.height * kk);
      if (m.voile) { x.fillStyle = `rgba(255,255,255,${m.voile / 100})`; x.fillRect(0, 0, c.width / k, c.height / k); }
    } else dessinerFond();

    const notes = ETAT.mur.notes || [];
    const sombre = m.fond === "noir" || o.transparent;
    const dessinerNote = (n) => {
      x.save();
      x.translate(marge + n.x, marge + n.y);
      x.rotate(((n.rot || 0) * Math.PI) / 180);
      x.fillStyle = sombre ? "#fff" : "#111";
      x.strokeStyle = x.fillStyle;
      if (n.type === "titre") { x.font = `600 ${n.w}px Inter, Arial`; x.textBaseline = "top"; x.fillText((n.texte || "").toUpperCase(), 0, 0); }
      else if (n.type === "soustitre") { x.font = `600 ${n.w}px Inter, Arial`; x.textBaseline = "top"; x.fillText(n.texte || "", 0, 0); }
      else if (n.type === "etiquette" || n.type === "date") {
        x.font = `500 ${n.w}px Inter, Arial`; x.textBaseline = "top";
        const l = x.measureText((n.texte || "").toUpperCase()).width;
        x.lineWidth = 1;
        x.strokeRect(-6, -5, l + 12, n.w + 10);
        x.fillText((n.texte || "").toUpperCase(), 0, 0);
      } else if (n.type === "ruban") {
        x.fillStyle = "rgba(200,174,134,.85)"; x.fillRect(0, 0, n.w, n.w * 0.2);
      } else if (n.type === "punaise") {
        x.beginPath(); x.arc(n.w / 2, n.w / 2.6, n.w / 2.6, 0, 7); x.fill();
      } else if (DESSINS_NOTE[n.type]) {
        // les annotations dessinées : on les retrace à la main, simplifiées
        const e = n.w / 100;
        x.lineWidth = 3 * e; x.lineCap = "round";
        x.beginPath();
        if (n.type === "fleche") { x.moveTo(2 * e, 24 * e); x.quadraticCurveTo(50 * e, 2 * e, 96 * e, 4 * e); x.moveTo(78 * e, 2 * e); x.lineTo(96 * e, 4 * e); x.lineTo(92 * e, 22 * e); }
        else if (n.type === "fleche2") { x.moveTo(6 * e, 20 * e); x.lineTo(94 * e, 20 * e); x.moveTo(18 * e, 8 * e); x.lineTo(4 * e, 20 * e); x.lineTo(18 * e, 32 * e); x.moveTo(82 * e, 8 * e); x.lineTo(96 * e, 20 * e); x.lineTo(82 * e, 32 * e); }
        else if (n.type === "souligne") { x.moveTo(3 * e, 9 * e); x.quadraticCurveTo(60 * e, 18 * e, 117 * e, 10 * e); x.moveTo(8 * e, 15 * e); x.quadraticCurveTo(60 * e, 22 * e, 110 * e, 15 * e); }
        else if (n.type === "entoure") { x.ellipse(64 * e, 35 * e, 60 * e, 32 * e, 0.06, 0, 7); }
        else if (n.type === "etoile") { const p = [[20, 3], [25, 14], [37, 15], [28, 23], [31, 35], [20, 29], [9, 35], [12, 23], [3, 15], [15, 14]]; p.forEach(([px, py], i) => (i ? x.lineTo(px * e * 2.5, py * e * 2.5) : x.moveTo(px * e * 2.5, py * e * 2.5))); x.closePath(); }
        x.stroke();
      }
      x.restore();
    };

    notes.filter((n) => !n.devant).forEach(dessinerNote);

    return Promise.all(m.items.map((it) => charger(imgScrap(it.id)).then((im) => [it, im])))
      .then((paires) => {
        paires.forEach(([it, im]) => {
          if (!im) return;
          const s = scrap(it.id);
          const w = it.w, h = w / ((s && s.ratio) || 0.75);
          x.save();
          x.translate(marge + it.x + w / 2, marge + it.y + h / 2);
          x.rotate(((it.rot || 0) * Math.PI) / 180);
          // cadre éventuel, dessiné derrière l'affiche
          const c2 = it.cadre;
          if (c2 && c2 !== "aucun") {
            const ep = c2 === "epais" ? 10 : c2 === "passe" ? 16 : c2 === "polaroid" ? 12 : c2 === "noir" ? 8 : 2;
            x.fillStyle = c2 === "noir" ? "#111" : c2 === "filet" ? "#111" : "#FBFBF8";
            x.fillRect(-w / 2 - ep, -h / 2 - ep, w + ep * 2, h + ep * 2 + (c2 === "polaroid" ? 26 : 0));
          }
          if (it.dechire) {
            x.save();
            x.beginPath();
            it.dechire.forEach(([px, py], i) => { const X = (px - 0.5) * w * 1.02, Y = (py - 0.5) * h * 1.02; i ? x.lineTo(X, Y) : x.moveTo(X, Y); });
            x.closePath(); x.fillStyle = "#FBFBF8"; x.fill(); x.restore();
            x.beginPath();
            it.dechire.forEach(([px, py], i) => { const X = (px - 0.5) * w, Y = (py - 0.5) * h; i ? x.lineTo(X, Y) : x.moveTo(X, Y); });
            x.closePath(); x.clip();
          }
          x.drawImage(im, -w / 2, -h / 2, w, h);
          x.restore();
          (it.scotch || []).forEach(([coin, type]) => {
            x.save();
            x.translate(marge + it.x + (coin[1] === "g" ? 4 : w - 56), marge + it.y + (coin[0] === "h" ? -6 : h - 10));
            x.rotate((coin[1] === "g" ? -6 : 6) * Math.PI / 180);
            x.fillStyle = { transparent: "rgba(255,255,255,.42)", kraft: "rgba(200,174,134,.9)", papier: "rgba(246,246,242,.95)", noir: "rgba(17,17,17,.92)" }[type] || "rgba(200,174,134,.9)";
            x.fillRect(0, 0, 52, 16);
            x.restore();
          });
        });

        notes.filter((n) => n.devant).forEach(dessinerNote);

        // les traits dessinés à la main, par-dessus
        (ETAT.mur.traits || []).forEach((tr) => {
          if (tr.pts.length < 2) return;
          x.save();
          x.strokeStyle = tr.couleur || "#111";
          x.lineWidth = tr.w || 3; x.lineCap = "round"; x.lineJoin = "round";
          x.beginPath();
          tr.pts.forEach(([px, py], i) => (i ? x.lineTo(marge + px, marge + py) : x.moveTo(marge + px, marge + py)));
          x.stroke();
          x.restore();
        });

        if (o.pied) {
          const y = hauteur + marge * 2 + 20;
          x.fillStyle = sombre ? "#fff" : "#111";
          x.font = "600 30px Inter, Arial";
          x.fillText("SCRAP", marge, y + 24);
          const l = x.measureText("SCRAP").width;
          x.fillStyle = "#FF0000"; x.fillRect(marge + l + 7, y + 17, 7, 7);
          x.fillStyle = sombre ? "#9A9A96" : "#6B6B67";
          x.font = "500 20px Inter, Arial";
          x.fillText(`${ETAT.utilisateur.pseudo} · ${pluriel(m.items.length, "scrap")} · ${ETAT.utilisateur.quartier}`, marge, y + 54);
        }
        return c;
      });
  });
}

/* Recadre le scrapbook dans un format de réseau social.
 * « mur » pose la page sur la photo d'un vrai mur prise avec la caméra. */
function exporterMur(format) {
  const tailles = { story: [1080, 1920], carre: [1080, 1080], mur: [1080, 1920] };
  const surMur = format === "mur" && ETAT.mur.photoMur;
  return dessinerMurCanvas({ largeur: 1080, pied: !surMur, transparent: !!surMur }).then((src) => {
    if (format === "page" || !tailles[format]) return src;
    const [W, H] = tailles[format];
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");

    if (surMur) {
      return new Promise((ok) => {
        const im = new Image();
        im.onload = () => {
          const kk = Math.max(W / im.width, H / im.height);
          x.drawImage(im, (W - im.width * kk) / 2, (H - im.height * kk) / 2, im.width * kk, im.height * kk);
          x.fillStyle = "rgba(17,17,17,.18)"; x.fillRect(0, 0, W, H);
          const k = Math.min((W - 150) / src.width, (H - 420) / src.height);
          const w = src.width * k, h = src.height * k;
          x.save();
          x.translate(W / 2, H / 2);
          x.rotate(-0.012);
          x.shadowColor = "rgba(0,0,0,.5)"; x.shadowBlur = 40; x.shadowOffsetY = 18;
          x.drawImage(src, -w / 2, -h / 2, w, h);
          x.restore();
          // signature en bas
          x.fillStyle = "#fff"; x.font = "600 46px Inter, Arial";
          x.fillText("SCRAP", 70, H - 96);
          const l = x.measureText("SCRAP").width;
          x.fillStyle = "#FF0000"; x.fillRect(70 + l + 10, H - 108, 11, 11);
          x.fillStyle = "rgba(255,255,255,.8)"; x.font = "500 28px Inter, Arial";
          x.fillText(`${ETAT.utilisateur.pseudo} · ${ETAT.utilisateur.quartier}`, 70, H - 52);
          ok(c);
        };
        im.onerror = () => ok(src);
        im.src = ETAT.mur.photoMur;
      });
    }

    x.fillStyle = (MOTIFS_FOND[ETAT.mur.fond] || MOTIFS_FOND.papier)[0];
    x.fillRect(0, 0, W, H);
    const k = Math.min((W - 80) / src.width, (H - 160) / src.height);
    x.drawImage(src, (W - src.width * k) / 2, (H - src.height * k) / 2, src.width * k, src.height * k);
    return c;
  });
}

/* ═════════ Vitrine du profil (plan 370 × 300) */
function vitrineMonter(el, editable) {
  if (!el) return null;
  const plan = $("#vplan", el);
  if (!plan) return null;
  const V = ETAT.vitrine;
  let echelle = 1;
  const dessiner = () => {
    plan.innerHTML = V.map((v) => {
      const s = scrap(v.id); if (!s) return "";
      const choisi = editable && v.id === ETAT.ctx.vitrineSel;
      return `<div class="mur-item${choisi ? " choisi" : ""}" data-v="${v.id}" style="left:${v.x}px;top:${v.y}px;width:${v.w}px;transform:rotate(${v.rot}deg)"><img src="${imgScrap(v.id)}" alt="" draggable="false"><i class="scotch kraft hg"></i></div>`;
    }).join("");
  };
  const ajuster = () => { echelle = el.clientWidth / 370; plan.style.transform = `scale(${echelle})`; };
  dessiner(); ajuster();
  if (!editable) return null;
  let g = null;
  el.addEventListener("pointerdown", (e) => {
    const it = e.target.closest("[data-v]"); if (!it) return;
    e.preventDefault();
    const v = V.find((x) => x.id === it.dataset.v);
    const change = ETAT.ctx.vitrineSel !== v.id;
    ETAT.ctx.vitrineSel = v.id;
    if (change) { rendre(courant, { garderDefilement: true }); return; }
    g = { v, el: it, x0: e.clientX, y0: e.clientY, ix: v.x, iy: v.y };
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!g) return;
    g.v.x = clamp(g.ix + (e.clientX - g.x0) / echelle, -30, 340);
    g.v.y = clamp(g.iy + (e.clientY - g.y0) / echelle, -30, 260);
    g.el.style.left = g.v.x + "px"; g.el.style.top = g.v.y + "px";
  });
  const stop = () => { if (g) { g = null; sauver(); } };
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointercancel", stop);
  return null;
}
