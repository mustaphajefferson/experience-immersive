/* SCRAP — scrapbook (déplacer, scotcher, déchirer, fond) et vitrine du profil. */
"use strict";

const LARGEUR_MUR = 402;
const polyCss = (pts) => `polygon(${pts.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(",")})`;

function itemHtml(it, choisi) {
  const s = scrap(it.id);
  if (!s) return "";
  return `<div class="mur-item${choisi ? " choisi" : ""}" data-item="${it.id}"
    style="left:${it.x}px;top:${it.y}px;width:${it.w}px;transform:rotate(${it.rot || 0}deg)">
    <div class="mur-papier" style="${it.dechire ? `clip-path:${polyCss(it.dechire)}` : ""}"><img src="${imgScrap(it.id)}" alt="" draggable="false" style="aspect-ratio:${s.ratio}"></div>
    ${(it.scotch || []).map(([coin, type]) => `<i class="scotch ${type} ${coin}"></i>`).join("")}
  </div>`;
}

function murMonter(racine, outil) {
  const zone = $("#mur", racine), plan = $("#plan", racine);
  const m = ETAT.mur;
  let echelle = 1;
  const dessiner = () => {
    plan.innerHTML = m.items.map((it) => itemHtml(it, outil !== "aucun" && it.id === ETAT.ctx.murSel)).join("") + '<svg class="trace" id="trace" width="402" height="' + m.hauteur + '"></svg>';
  };
  const ajuster = () => {
    echelle = zone.clientWidth / LARGEUR_MUR;
    plan.style.transform = `scale(${echelle})`;
    plan.style.marginBottom = `${m.hauteur * echelle - m.hauteur}px`;
  };
  dessiner(); ajuster();
  window.addEventListener("resize", ajuster);

  const itemDe = (cible) => { const el = cible.closest("[data-item]"); return el ? [el, m.items.find((i) => i.id === el.dataset.item)] : [null, null]; };
  const auPremierPlan = (it) => { m.items = m.items.filter((i) => i !== it).concat(it); };
  // Coordonnées d'un point de l'écran dans le repère du scrap (0 à 1), rotation comprise
  const local = (el, it, ex, ey) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a = (-(it.rot || 0) * Math.PI) / 180;
    const dx = ex - cx, dy = ey - cy;
    const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
    const w = it.w * echelle, h = (it.w / scrap(it.id).ratio) * echelle;
    return [lx / w + 0.5, ly / h + 0.5];
  };

  let geste = null;
  const debut = (e) => {
    let [el, it] = itemDe(e.target);
    if (!el && outil === "dechirer") {
      geste = { libre: true, x0: e.clientX, y0: e.clientY, bouge: false };
      zone.setPointerCapture && zone.setPointerCapture(e.pointerId);
      return;
    }
    if (!el || outil === "aucun") { if (outil === "deplacer" && ETAT.ctx.murSel) { ETAT.ctx.murSel = null; dessiner(); } return; }
    e.preventDefault();
    if (ETAT.ctx.murSel !== it.id) { ETAT.ctx.murSel = it.id; }
    auPremierPlan(it);
    dessiner();
    const el2 = plan.querySelector(`[data-item="${CSS.escape(it.id)}"]`);
    geste = { it, el: el2, x0: e.clientX, y0: e.clientY, ix: it.x, iy: it.y, bouge: false, depart: local(el2, it, e.clientX, e.clientY) };
    if (outil === "deplacer") el2.classList.add("tire");
    zone.setPointerCapture && zone.setPointerCapture(e.pointerId);
  };
  const deplacement = (e) => {
    if (!geste) return;
    const dx = (e.clientX - geste.x0) / echelle, dy = (e.clientY - geste.y0) / echelle;
    if (Math.abs(dx) + Math.abs(dy) > 4) geste.bouge = true;
    if (outil === "deplacer") {
      geste.it.x = clamp(geste.ix + dx, -40, LARGEUR_MUR - 40);
      geste.it.y = clamp(geste.iy + dy, -20, m.hauteur - 60);
      geste.el.style.left = geste.it.x + "px";
      geste.el.style.top = geste.it.y + "px";
    } else if (outil === "dechirer") {
      const pr = plan.getBoundingClientRect();
      const p0 = [(geste.x0 - pr.left) / echelle, (geste.y0 - pr.top) / echelle];
      const p1 = [(e.clientX - pr.left) / echelle, (e.clientY - pr.top) / echelle];
      $("#trace", plan).innerHTML = `<path d="M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}" stroke="#111" stroke-width="1.5" stroke-dasharray="5 5" fill="none"/>`;
    }
  };
  const fin = (e) => {
    if (!geste) return;
    const g = geste; geste = null;
    if (outil === "deplacer") { g.el.classList.remove("tire"); sauver(); }
    if (outil === "scotch" && !g.bouge) {
      const [lx, ly] = g.depart;
      const coin = (ly < 0.5 ? "h" : "b") + (lx < 0.5 ? "g" : "d");
      const sc = g.it.scotch || (g.it.scotch = []);
      const deja = sc.findIndex(([c]) => c === coin);
      if (deja >= 0) sc.splice(deja, 1);
      else { if (sc.length >= 2) sc.shift(); sc.push([coin, m.scotchType || "kraft"]); }
      sauver(); dessiner();
    }
    if (outil === "dechirer") {
      $("#trace", plan).innerHTML = "";
      if (!g.bouge) return;
      let { it, el } = g;
      if (g.libre) {
        // Geste commencé hors d'un scrap : on prend le scrap traversé au milieu du geste
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

  function dechirer(it, a, b) {
    const res = coupe(a, b);
    if (!res) { toast("Glisse franchement d'un bord à l'autre du scrap."); return; }
    ETAT.ctx.dechireAvant = { id: it.id, avant: it.dechire || null };
    it.dechire = res.garde;
    sauver();
    // Le morceau arraché tombe, puis disparaît
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

  return () => window.removeEventListener("resize", ajuster);
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

/* Vitrine du profil (plan 370 × 300) */
function vitrineMonter(el, editable) {
  if (!el) return null;
  const plan = $("#vplan", el);
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
