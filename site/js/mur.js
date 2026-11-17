/* SCRAP — le scrapbook et la vitrine du profil.
 *
 * Le scrapbook est une grande page qu'on regarde à travers l'écran : on la
 * promène au doigt, on pince pour zoomer, et rien ne bouge tant qu'on n'est
 * pas passé en mode Disposition. Quatre modes :
 *   regarder   — on se déplace et on zoome, les scraps restent en place
 *   deplacer   — on range : déplacer, redimensionner, tourner, mettre devant
 *   scotch     — toucher un coin d'un scrap pour y poser ou enlever du scotch
 *   dechirer   — glisser le doigt à travers un scrap pour l'arracher
 */
"use strict";

const LARGEUR_MUR = 402;
const ZOOM_MAX = 2.8;
const polyCss = (pts) => `polygon(${pts.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(",")})`;

function itemHtml(it, choisi) {
  const s = scrap(it.id);
  if (!s) return "";
  return `<div class="mur-item${choisi ? " choisi" : ""}" data-item="${it.id}"
    style="left:${it.x}px;top:${it.y}px;width:${it.w}px;transform:rotate(${it.rot || 0}deg)">
    <div class="mur-papier" style="${it.dechire ? `clip-path:${polyCss(it.dechire)}` : ""}"><img src="${imgScrap(it.id)}" alt="" draggable="false" style="aspect-ratio:${s.ratio}"></div>
    ${(it.scotch || []).map(([coin, type]) => `<i class="scotch ${type} ${coin}"></i>`).join("")}
    ${choisi ? '<i class="poignee" data-poignee="1"></i>' : ""}
  </div>`;
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

function murMonter(racine, outil) {
  const zone = $("#mur", racine), plan = $("#plan", racine);
  if (!zone || !plan) return null;
  const m = ETAT.mur;
  const vue = ETAT.ctx.vue || (ETAT.ctx.vue = { k: 0, x: 0, y: 0 });

  /* ───────── Cadrage */
  const kLarge = () => zone.clientWidth / LARGEUR_MUR;                                  // la page remplit la largeur
  const kEnsemble = () => Math.min(kLarge(), zone.clientHeight / m.hauteur) * 0.92;     // toute la page d'un coup
  const kMin = () => Math.min(kEnsemble(), kLarge()) * 0.75;

  const contraindre = () => {
    const pw = LARGEUR_MUR * vue.k, ph = m.hauteur * vue.k;
    vue.x = pw <= zone.clientWidth ? (zone.clientWidth - pw) / 2 : clamp(vue.x, zone.clientWidth - pw, 0);
    vue.y = ph <= zone.clientHeight ? (zone.clientHeight - ph) / 2 : clamp(vue.y, zone.clientHeight - ph, 0);
  };
  const appliquer = () => {
    contraindre();
    plan.style.transform = `translate(${vue.x.toFixed(2)}px, ${vue.y.toFixed(2)}px) scale(${vue.k.toFixed(4)})`;
    zone.classList.toggle("ensemble", vue.k <= kEnsemble() * 1.05);
    const j = $("#zoom-valeur", racine);
    if (j) j.textContent = Math.round((vue.k / kLarge()) * 100) + " %";
  };
  const cadrer = (k, cx, cy) => {
    // zoome autour d'un point de l'écran (cx, cy)
    const r = zone.getBoundingClientRect();
    const px = (cx - r.left - vue.x) / vue.k, py = (cy - r.top - vue.y) / vue.k;
    vue.k = clamp(k, kMin(), ZOOM_MAX);
    vue.x = cx - r.left - px * vue.k;
    vue.y = cy - r.top - py * vue.k;
    appliquer();
  };
  const centre = () => { const r = zone.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  const dessiner = () => {
    plan.style.width = LARGEUR_MUR + "px";
    plan.style.height = m.hauteur + "px";
    plan.innerHTML = m.items.map((it) => itemHtml(it, outil !== "aucun" && outil !== "regarder" && it.id === ETAT.ctx.murSel)).join("")
      + `<svg class="trace" id="trace" width="${LARGEUR_MUR}" height="${m.hauteur}"></svg>`;
  };

  dessiner();
  if (!vue.k) { vue.k = kLarge(); vue.x = 0; vue.y = 0; }
  // après un collage, on se place sur le scrap qui vient d'arriver
  if (ETAT.ctx.recadrer) {
    const it = m.items.find((i) => i.id === ETAT.ctx.recadrer);
    ETAT.ctx.recadrer = null;
    if (it) {
      const s = scrap(it.id);
      vue.k = kLarge();
      vue.y = zone.clientHeight / 2 - (it.y + it.w / ((s && s.ratio) || 0.75) / 2) * vue.k;
    }
  }
  appliquer();
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

  const itemDe = (cible) => { const el = cible.closest && cible.closest("[data-item]"); return el ? [el, m.items.find((i) => i.id === el.dataset.item)] : [null, null]; };
  const auPremierPlan = (it) => { m.items = m.items.filter((i) => i !== it).concat(it); };
  // point de l'écran ramené dans le repère d'un scrap (0 à 1), rotation comprise
  const local = (el, it, ex, ey) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a = (-(it.rot || 0) * Math.PI) / 180;
    const dx = ex - cx, dy = ey - cy;
    const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
    const w = it.w * vue.k, h = (it.w / scrap(it.id).ratio) * vue.k;
    return [lx / w + 0.5, ly / h + 0.5];
  };

  /* ───────── Gestes : un doigt = déplacer ou promener, deux doigts = pincer */
  const doigts = new Map();
  let geste = null, pince = null, dernierTap = 0;

  const debut = (e) => {
    if (e.target.closest("[data-zoom]")) return;
    doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    zone.setPointerCapture && zone.setPointerCapture(e.pointerId);

    if (doigts.size === 2) {
      geste = null;
      const [a, b] = [...doigts.values()];
      pince = { d0: Math.hypot(a.x - b.x, a.y - b.y), k0: vue.k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
      plan.classList.add("sans-transition");
      return;
    }
    if (doigts.size > 2) return;

    let [el, it] = itemDe(e.target);

    // poignée de redimensionnement d'un scrap sélectionné
    if (el && e.target.closest("[data-poignee]") && outil === "deplacer") {
      e.preventDefault();
      geste = { taille: true, it, el, x0: e.clientX, y0: e.clientY, w0: it.w };
      return;
    }
    if (!el && outil === "dechirer") {
      geste = { libre: true, x0: e.clientX, y0: e.clientY, bouge: false };
      return;
    }
    if (!el || outil === "aucun" || outil === "regarder" || outil === "scotchVide") {
      // fond : on promène la page
      if (outil === "deplacer" && ETAT.ctx.murSel) { ETAT.ctx.murSel = null; dessiner(); majPanneau(); }
      geste = { promene: true, x0: e.clientX, y0: e.clientY, vx: vue.x, vy: vue.y, bouge: false };
      plan.classList.add("sans-transition");
      return;
    }
    e.preventDefault();
    if (outil === "deplacer") {
      if (ETAT.ctx.murSel !== it.id) { ETAT.ctx.murSel = it.id; auPremierPlan(it); dessiner(); majPanneau(); el = plan.querySelector(`[data-item="${CSS.escape(it.id)}"]`); }
    }
    geste = { it, el, x0: e.clientX, y0: e.clientY, ix: it.x, iy: it.y, bouge: false, depart: local(el, it, e.clientX, e.clientY) };
    if (outil === "deplacer") el.classList.add("tire");
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
    if (Math.abs(e.clientX - geste.x0) + Math.abs(e.clientY - geste.y0) > 5) geste.bouge = true;

    if (geste.promene) {
      vue.x = geste.vx + (e.clientX - geste.x0);
      vue.y = geste.vy + (e.clientY - geste.y0);
      appliquer();
      return;
    }
    if (geste.taille) {
      const s = scrap(geste.it.id);
      const d = ((e.clientX - geste.x0) + (e.clientY - geste.y0) / (s ? 1 / s.ratio : 1)) / vue.k;
      geste.it.w = clamp(Math.round(geste.w0 + d), 56, 340);
      geste.el.style.width = geste.it.w + "px";
      majCurseurs(geste.it);
      return;
    }
    if (outil === "deplacer") {
      geste.it.x = clamp(geste.ix + dx, -40, LARGEUR_MUR - 40);
      geste.it.y = clamp(geste.iy + dy, -20, m.hauteur - 60);
      geste.el.style.left = geste.it.x + "px";
      geste.el.style.top = geste.it.y + "px";
    } else if (outil === "dechirer") {
      const pr = plan.getBoundingClientRect();
      const p0 = [(geste.x0 - pr.left) / vue.k, (geste.y0 - pr.top) / vue.k];
      const p1 = [(e.clientX - pr.left) / vue.k, (e.clientY - pr.top) / vue.k];
      const t = $("#trace", plan);
      if (t) t.innerHTML = `<path d="M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}" stroke="#111" stroke-width="${1.5 / vue.k}" stroke-dasharray="${5 / vue.k} ${5 / vue.k}" fill="none"/>`;
    }
  };

  const fin = (e) => {
    doigts.delete(e.pointerId);
    if (doigts.size < 2 && pince) { pince = null; plan.classList.remove("sans-transition"); }
    if (!geste) return;
    const g = geste; geste = null;
    plan.classList.remove("sans-transition");

    if (g.promene) {
      // double-tap sur le fond : on alterne vue d'ensemble et vue normale
      if (!g.bouge) {
        const t = performance.now();
        if (t - dernierTap < 300) {
          const proche = vue.k > kEnsemble() * 1.15;
          if (proche) { vue.k = kEnsemble(); vue.x = 0; vue.y = 0; appliquer(); }
          else cadrer(kLarge() * 1.4, e.clientX, e.clientY);
          vibrer(8);
        }
        dernierTap = t;
      }
      return;
    }
    if (g.taille) { sauver(); vibrer(6); return; }

    if (outil === "deplacer") { g.el.classList.remove("tire"); sauver(); }
    if (outil === "regarder" && !g.bouge && g.it) { ETAT.ctx.scrap = g.it.id; aller("21"); return; }
    if (outil === "scotch" && !g.bouge) {
      const [lx, ly] = g.depart;
      const coin = (ly < 0.5 ? "h" : "b") + (lx < 0.5 ? "g" : "d");
      const sc = g.it.scotch || (g.it.scotch = []);
      const deja = sc.findIndex(([c]) => c === coin);
      if (deja >= 0) sc.splice(deja, 1);
      else { if (sc.length >= 2) sc.shift(); sc.push([coin, m.scotchType || "kraft"]); }
      vibrer(10); sauver(); dessiner();
    }
    if (outil === "dechirer") {
      const t = $("#trace", plan); if (t) t.innerHTML = "";
      if (!g.bouge) return;
      let { it, el } = g;
      if (g.libre) {
        const mx = (g.x0 + e.clientX) / 2, my = (g.y0 + e.clientY) / 2;
        const sous = document.elementsFromPoint(mx, my).find((n) => n.closest && n.closest("[data-item]"));
        if (!sous) return;
        [el, it] = itemDe(sous);
        ETAT.ctx.murSel = it.id;
      }
      dechirer(it, local(el, it, g.x0, g.y0), local(el, it, e.clientX, e.clientY));
    }
  };

  zone.addEventListener("pointerdown", debut);
  zone.addEventListener("pointermove", deplacement);
  zone.addEventListener("pointerup", fin);
  zone.addEventListener("pointercancel", fin);
  const roulette = (e) => { e.preventDefault(); cadrer(vue.k * (e.deltaY < 0 ? 1.1 : 1 / 1.1), e.clientX, e.clientY); };
  zone.addEventListener("wheel", roulette, { passive: false });

  /* Panneau du scrap sélectionné (mode Disposition) */
  function majPanneau() {
    const p = $("#panneau-item", racine);
    if (!p) return;
    const it = m.items.find((i) => i.id === ETAT.ctx.murSel);
    p.innerHTML = it ? panneauItem(it) : "";
    p.classList.toggle("vide", !it);
  }
  function majCurseurs(it) {
    const a = $("#item-taille", racine), b = $("#item-taille-val", racine);
    if (a) a.value = it.w;
    if (b) b.textContent = Math.round((it.w / 128) * 100) + " %";
  }
  majPanneau();

  function dechirer(it, a, b) {
    const res = coupe(a, b);
    if (!res) { toast("Glisse franchement d'un bord à l'autre du scrap."); return; }
    ETAT.ctx.dechireAvant = { id: it.id, avant: it.dechire || null };
    it.dechire = res.garde;
    sauver();
    vibrer([10, 30, 20]);
    const el = plan.querySelector(`[data-item="${CSS.escape(it.id)}"]`);
    const morceau = document.createElement("div");
    morceau.className = "morceau";
    morceau.style.cssText = `left:${it.x}px;top:${it.y}px;width:${it.w}px;--dx:${(Math.random() * 60 - 30).toFixed(0)}px;--dr:${(Math.random() * 50 - 25).toFixed(0)}deg`;
    morceau.innerHTML = `<div style="transform:rotate(${it.rot || 0}deg);clip-path:${polyCss(res.arrache)}"><img src="${imgScrap(it.id)}" alt="" style="width:100%"></div>`;
    plan.appendChild(morceau);
    el.querySelector(".mur-papier").style.clipPath = polyCss(res.garde);
    setTimeout(() => morceau.remove(), 1200);
    toast("Déchiré. Le morceau reste dans ta collection.");
  }

  return () => { window.removeEventListener("resize", ajuster); zone.removeEventListener("wheel", roulette); };
}

/* Réglages du scrap sélectionné, affichés au-dessus de la barre d'outils */
function panneauItem(it) {
  const s = scrap(it.id);
  return `<div class="panneau-item-int">
    <div class="rangee entre">
      <span class="t-texte-meta secondaire">N° ${pad3(s.num)} · ${esc(s.titre)}</span>
      <button class="bouton-lien t-texte-meta" data-action="deselectionnerItem">Terminé</button>
    </div>
    <div class="curseur-ligne" style="margin-top:10px"><span class="t-texte-meta secondaire">Taille</span><span class="t-texte-meta secondaire" id="item-taille-val">${Math.round((it.w / 128) * 100)} %</span></div>
    <input type="range" min="56" max="340" value="${it.w}" data-input="itemTaille" id="item-taille">
    <div class="curseur-ligne" style="margin-top:6px"><span class="t-texte-meta secondaire">Rotation</span><span class="t-texte-meta secondaire" id="item-rot-val">${it.rot || 0}°</span></div>
    <input type="range" min="-25" max="25" value="${it.rot || 0}" data-input="itemRotation">
    <div class="rangee" style="gap:8px;margin-top:10px">
      <button class="puce" data-action="itemDevant">Mettre devant</button>
      <button class="puce" data-action="itemAligner">Redresser</button>
      <button class="puce" data-action="itemRetirer">Retirer</button>
    </div>
  </div>`;
}

/* Coupe le carré unité le long de AB : renvoie la plus grande partie (gardée) et l'autre (arrachée), bord dentelé. */
function coupe(a, b) {
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
  // bord dentelé de p2 vers p1
  const n = 8, nx = -(p1[1] - p2[1]), ny = p1[0] - p2[0], L = Math.hypot(nx, ny) || 1;
  const dents = [];
  for (let i = 1; i < n; i++) {
    const t = i / n, amp = (i % 2 ? 1 : -1) * (0.025 + Math.random() * 0.03);
    dents.push([clamp(p2[0] + (p1[0] - p2[0]) * t + (nx / L) * amp, 0, 1), clamp(p2[1] + (p1[1] - p2[1]) * t + (ny / L) * amp, 0, 1)]);
  }
  const s1 = per(p1), s2 = per(p2);
  const polyA = [p1, ...arc(s1, s2), p2, ...dents];
  const polyB = [p2, ...arc(s2, s1), p1, ...dents.slice().reverse()];
  const aire = (pts) => Math.abs(pts.reduce((s, [x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
  return aire(polyA) >= aire(polyB) ? { garde: polyA, arrache: polyB } : { garde: polyB, arrache: polyA };
}

/* ───────── Vitrine du profil (plan 370 × 300) */
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
