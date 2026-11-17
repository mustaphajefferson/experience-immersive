/* SCRAP — navigation, actions des boutons, menu caché. */
"use strict";

const APP = document.getElementById("app");
let courant = null;
let nettoyer = null;
const pile = [];

/* ───────── Navigation (#/13, #/19.1…) */
function aller(id, o = {}) {
  if (o.ctx) Object.assign(ETAT.ctx, o.ctx);
  if (!ECRANS[id]) id = "50";
  const h = "#/" + id;
  if (location.hash === h) { rendre(id, { garderDefilement: o.garderDefilement }); return; }
  if (o.remplace) { location.replace(h); } else { location.hash = h; }
}
function idDuHash() { const id = location.hash.replace(/^#\/?/, ""); return ECRANS[id] ? id : null; }

function rendre(id, o = {}) {
  const e = ECRANS[id] || ECRANS["50"];
  const ancien = $(".defile", APP);
  const defil = o.garderDefilement && ancien ? ancien.scrollTop : 0;
  if (nettoyer) { try { nettoyer(); } catch (err) { /* rien */ } nettoyer = null; }
  if (id !== "19") cameraArreter();
  $$(".revelation").forEach((x) => x.remove());   // pas de révélation qui traîne d'un écran à l'autre
  const s = document.createElement("section");
  s.className = `ecran ${e.classe || ""}${o.garderDefilement ? " sans-anim" : ""}`;
  s.dataset.ecran = id;
  try { s.innerHTML = e.rendu(); } catch (err) { console.error(err); s.innerHTML = ECRANS["50"].rendu(); }
  APP.replaceChildren(s);
  courant = id;
  document.title = `SCRAP · ${id} ${e.titre}`;
  if (o.garderDefilement) { const d = $(".defile", s); if (d) d.scrollTop = defil; }
  const g = $("[data-glisser]", s);
  const n1 = g ? glisserDecouverte(g) : null;
  const n2 = e.monter ? e.monter(s) : null;
  nettoyer = () => { n1 && n1(); n2 && n2(); };
}

window.addEventListener("hashchange", () => {
  const id = idDuHash() || "01";
  if (pile.length > 1 && pile[pile.length - 2] === id) pile.pop(); else if (pile[pile.length - 1] !== id) pile.push(id);
  rendre(id);
});

/* ───────── Gestes */
function glisser(el, gauche, droite) {
  if (!el) return null;
  let x0 = null, y0 = null;
  const d = (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; };
  const f = (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { e.preventDefault(); (dx < 0 ? gauche : droite)(); }
  };
  el.addEventListener("touchstart", d, { passive: true });
  el.addEventListener("touchend", f);
  return () => { el.removeEventListener("touchstart", d); el.removeEventListener("touchend", f); };
}
function glisserDecouverte(el) {
  const [suiv, prec] = el.dataset.glisser.split("|");
  return glisser(el, () => suiv && aller(suiv), () => prec && aller(prec));
}

/* ───────── Actions */
const rafraichir = () => rendre(courant, { garderDefilement: true });
const ACTIONS = {
  retour(el) {
    if (pile.length > 1) history.back();
    else aller(el.dataset.vers || "13", { remplace: true });
  },
  fermer(el) { ACTIONS.retour(el); },
  basculer(el) {
    const k = el.dataset.cle;
    ETAT.reglages[k] = !ETAT.reglages[k];
    el.classList.toggle("on", ETAT.reglages[k]);
    sauver();
    if (courant === "14") rafraichir();
  },
  cocher(el) { el.classList.toggle("active"); el.innerHTML = el.classList.contains("active") ? icone("valider") : ""; },
  autoriserCamera() {
    const suite = () => aller("07");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return suite();
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((f) => { f.getTracks().forEach((t) => t.stop()); suite(); }).catch(suite);
  },
  autoriserPosition() {
    let fait = false;
    const suite = () => { if (!fait) { fait = true; aller("08"); } };
    if (!navigator.geolocation) return suite();
    navigator.geolocation.getCurrentPosition(suite, suite, { timeout: 8000 });
    setTimeout(suite, 9000);
  },
  envoyerLien() { $("#envoye").classList.remove("cache"); toast("Lien envoyé (démo)"); },
  enregistrerPseudo() {
    const p = $("#pseudo").value.trim().replace(/^@?/, "@");
    if (p.length > 3) ETAT.utilisateur.pseudo = p;
    const q = $("#quartier").value.split(",")[0].trim();
    if (q) ETAT.utilisateur.quartier = q;
    sauver(); aller("12");
  },
  choisirDepart(el) {
    const l = ETAT.collectionsDepart, id = el.dataset.id, i = l.indexOf(id);
    if (i >= 0) l.splice(i, 1);
    else if (l.length >= 3) { toast("Trois collections au maximum"); return; }
    else l.push(id);
    sauver(); rafraichir();
  },
  monProfil() { ETAT.ctx.personne = null; aller("35"); },
  ouvrirCible(el) { ETAT.ctx.cible = el.dataset.id; aller("16"); },
  elargir() { ETAT.reglages.rayon = 2000; ETAT.filtres = { rayon: 2000, collection: "toutes", etat: "tous" }; sauver(); aller("13"); },
  filtreCarte(el) { ETAT.filtres[el.dataset.cle] = el.dataset.val; sauver(); rafraichir(); },
  reinitFiltres() { ETAT.filtres = { rayon: 500, collection: "toutes", etat: "tous" }; ETAT.reglages.rayon = 500; ETAT.reglages.manquants = true; sauver(); rafraichir(); },
  capturer() { cameraCapturer(); },
  passerLancement() { aller("02", { remplace: true }); },
  basculerAuto(el) {
    ETAT.reglages.scanAuto = ETAT.reglages.scanAuto === false;
    el.classList.toggle("active", ETAT.reglages.scanAuto !== false);
    sauver();
    toast(ETAT.reglages.scanAuto !== false ? "Capture automatique" : "Capture au bouton");
  },
  garderScan() { aller("19.2"); },
  reprendreScan() { ETAT.ctx.capture = null; aller("19", { remplace: true }); },
  activerGyro(el) {
    const demande = el && el.isConnected;   // vrai seulement si la personne a touché le bouton
    demanderGyro().then((ok) => {
      const scene = $("[data-gyro]");
      if (ok && scene && scene._brancherGyro) {
        scene._brancherGyro();
        scene.classList.remove("attend-gyro");
        $$("[data-action='activerGyro']").forEach((b) => b.remove());
        if (demande) toast("Penche ton téléphone");
      } else if (demande) toast("Ton téléphone n'a pas autorisé le capteur.");
    });
  },
  captureCollection(el) {
    ETAT.ctx.capture.collection = el.dataset.id;
    $$("[data-action='captureCollection']").forEach((b) => b.classList.toggle("active", b === el));
  },
  captureTag(el) {
    const t = ETAT.ctx.capture.themes, id = el.dataset.id, i = t.indexOf(id);
    if (i >= 0) t.splice(i, 1); else t.push(id);
    el.classList.toggle("active", i < 0);
  },
  captureHolo(el) { ETAT.ctx.capture.holo = !ETAT.ctx.capture.holo; el.classList.toggle("on", ETAT.ctx.capture.holo); },
  ajouterTag() { $("#tag-perso").classList.remove("cache"); $("#nouveau-tag").focus(); },
  validerCapture() { validerCapture(); },
  signaler() { toast("Merci : l'affiche est signalée et rejoindra la carte."); },
  retourner() {
    const r = $("#retourne"); if (!r) return;
    r.classList.toggle("verso");
    const verso = r.classList.contains("verso");
    courant = verso ? "22" : "21";
    history.replaceState(null, "", "#/" + courant);
    pile[pile.length - 1] = courant;
    vibrer(8);
    if (verso) setTimeout(animerVerso, 280);
    // premier retournement : c'est le geste qu'il faut pour demander le capteur
    if (gyroDemandeNecessaire()) ACTIONS.activerGyro($("[data-action='activerGyro']") || document.createElement("button"));
  },
  favori(el) {
    const s = scrap(ETAT.ctx.scrap);
    s.favori = !s.favori;
    sauver();
    const b = el.closest(".coeur") || el;
    b.classList.toggle("on", s.favori);
    b.setAttribute("aria-pressed", String(!!s.favori));
    if (s.favori) { b.classList.remove("bat"); void b.offsetWidth; b.classList.add("bat"); eclat(b, { n: 8 }); vibrer([8, 30, 14]); }
    else vibrer(6);
  },
  coller() {
    const id = ETAT.ctx.scrap, s = scrap(id);
    collerSurMur(id);
    ETAT.ctx.murMode = "deplacer";
    if (s.collection && collection(s.collection) && complete(s.collection) && !ETAT.celebrees.includes(s.collection)) {
      ETAT.celebrees.push(s.collection);
      ETAT.ctx.collection = s.collection;
      sauver();
      aller("32");
    } else { sauver(); aller("24"); setTimeout(() => toast("Collé sur ton scrapbook"), 300); }
  },
  billetterie() { toast("Ouverture de la billetterie (démo)"); },
  itineraireLieu() { ETAT.ctx.cible = "lieu"; aller("17"); },
  validerMur() { ETAT.ctx.murSel = null; ETAT.ctx.murMode = "regarder"; sauver(); rafraichir(); toast("Scrapbook enregistré"); },
  modeMur(el) {
    ETAT.ctx.murMode = el.dataset.id; ETAT.ctx.murSel = null;
    if (courant === "24") rafraichir(); else aller("24", { remplace: true });
  },
  fermerOutil() { ETAT.ctx.murSel = null; aller("24", { remplace: true }); },
  deselectionnerItem() { ETAT.ctx.murSel = null; rafraichir(); },
  itemDevant() {
    const it = ETAT.mur.items.find((i) => i.id === ETAT.ctx.murSel); if (!it) return;
    ETAT.mur.items = ETAT.mur.items.filter((i) => i !== it).concat(it);
    sauver(); rafraichir(); toast("Mis au premier plan");
  },
  itemAligner() {
    const it = ETAT.mur.items.find((i) => i.id === ETAT.ctx.murSel); if (!it) return;
    it.rot = 0; it.x = Math.round(it.x / 8) * 8; it.y = Math.round(it.y / 8) * 8;
    sauver(); rafraichir(); vibrer(8);
  },
  itemRetirer() {
    const id = ETAT.ctx.murSel; if (!id) return;
    ETAT.mur.items = ETAT.mur.items.filter((i) => i.id !== id);
    ETAT.ctx.murSel = null; sauver(); rafraichir();
    toast("Décollé. Le scrap reste dans ta collection.");
  },
  choisirDispo(el) { ETAT.ctx.dispoColl = el.dataset.id; rafraichir(); },
  choisirFond(el) { ETAT.mur.fond = el.dataset.id; sauver(); rafraichir(); vibrer(6); },
  choisirScotch(el) { ETAT.mur.scotchType = el.dataset.id; sauver(); rafraichir(); vibrer(6); },
  annulerDechirure() {
    const a = ETAT.ctx.dechireAvant;
    if (!a) { toast("Rien à annuler"); return; }
    const it = ETAT.mur.items.find((i) => i.id === a.id);
    if (it) it.dechire = a.avant;
    ETAT.ctx.dechireAvant = null; sauver(); rafraichir();
  },
  recollerTout() { ETAT.mur.items.forEach((i) => { i.dechire = null; }); sauver(); rafraichir(); toast("Tout est recollé"); },
  filtreColl(el) { ETAT.ctx.filtreColl = el.dataset.id; rafraichir(); },
  ouvrirScrap(el) { ETAT.ctx.scrap = el.dataset.id; aller("21"); },
  choisirSel(el) {
    const s = ETAT.ctx.selection || (ETAT.ctx.selection = []), id = el.dataset.id, i = s.indexOf(id);
    if (i >= 0) s.splice(i, 1); else s.push(id);
    rafraichir();
  },
  annulerSelection() { ETAT.ctx.selection = []; aller("28"); },
  ajouterVitrine() {
    const s = ETAT.ctx.selection || []; if (!s.length) return;
    const id = s[s.length - 1];
    if (!ETAT.vitrine.some((v) => v.id === id)) ETAT.vitrine.push({ id, x: 130, y: 80, w: 100, rot: 0 });
    ETAT.ctx.vitrineSel = id; ETAT.ctx.selection = [];
    sauver(); aller("34");
  },
  ouvrirCollection(el) { ETAT.ctx.collection = el.dataset.id; aller("31"); },
  chercherCollection(el) {
    const c = D.cibles.find((x) => x.collection === el.dataset.id);
    if (!c) { toast("Plus rien à chercher dans cette collection"); return; }
    ETAT.ctx.cible = c.id; aller("16");
  },
  collerExclusif() {
    const cid = ETAT.ctx.collection || "concerts", c = collection(cid), id = "excl-" + cid;
    if (!ETAT.scraps[id]) {
      const { date, heure } = aujourdhui();
      ETAT.scraps[id] = { titre: "Édition exclusive — " + c.nom, artiste: "SCRAP", ratio: 0.72, num: 1, lieu: c.zone, arr: ETAT.utilisateur.arrondissement, date, heure, collection: "exclusifs", themes: ["Exclusif"], holo: true, scans: 64, murs: 1, img: svgExclusif(cid) };
    }
    collerSurMur(id); sauver(); aller("33");
  },
  choisirBadge(el) { ETAT.utilisateur.badge = el.dataset.id; ETAT.ctx.personne = null; sauver(); aller("35"); toast("Badge affiché sur ton profil"); },
  choisirBadgeLocal(el) { ETAT.ctx.badgeChoix = el.dataset.id; rafraichir(); },
  badgeVerrouille() { toast("Encore verrouillé : continue la collection."); },
  enregistrerBadge() { if (ETAT.ctx.badgeChoix) ETAT.utilisateur.badge = ETAT.ctx.badgeChoix; ETAT.ctx.badgeChoix = null; sauver(); aller("35"); },
  validerVitrine() { ETAT.ctx.vitrineSel = null; sauver(); ETAT.ctx.personne = null; aller("35"); toast("Vitrine enregistrée"); },
  retirerVitrine() { ETAT.vitrine = ETAT.vitrine.filter((v) => v.id !== ETAT.ctx.vitrineSel); ETAT.ctx.vitrineSel = null; sauver(); rafraichir(); },
  enregistrerProfil() {
    const u = ETAT.utilisateur;
    const p = $("#p-pseudo").value.trim(); if (p) u.pseudo = p.replace(/^@?/, "@");
    u.bio = $("#p-bio").value.trim();
    const q = $("#p-quartier").value.trim(); if (q) u.quartier = q;
    sauver(); ETAT.ctx.personne = null; aller("35"); toast("Profil enregistré");
  },
  ongletAbo(el) { ETAT.ctx.ongletAbo = el.dataset.id; rafraichir(); },
  voirPersonne(el) { ETAT.ctx.personne = +el.dataset.id; aller("35"); },
  suivre(el) { const p = ETAT.personnes[+el.dataset.id]; p.suivi = !p.suivi; sauver(); rafraichir(); },
  copierLien() {
    const url = location.origin + location.pathname + "#/21";
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast("Lien copié"), () => toast("Lien : " + url));
  },
  partagerNatif() {
    const url = location.origin + location.pathname + "#/21";
    if (navigator.share) navigator.share({ title: "SCRAP", text: "Regarde ce scrap capturé à Belleville", url }).catch(() => {});
    else ACTIONS.copierLien();
  },
  bientot() { toast("Disponible dans la vraie app"); },
  effacerHistorique() { toast("Historique des lieux effacé"); },
  exporter() { toast("Export envoyé à " + ETAT.utilisateur.email + " (démo)"); },
  deconnecter() { aller("02"); toast("Déconnecté"); },
  supprimerCompte() { aller("02"); toast("Compte supprimé (démo : rien n'est effacé)"); },
  reessayer() { if (navigator.onLine) aller("13"); else toast("Toujours pas de réseau"); },
  choisirPhoto() { $("#photo-49").click(); },
};

function collerSurMur(id) {
  const m = ETAT.mur;
  ETAT.ctx.recadrer = id;
  if (m.items.some((i) => i.id === id)) { ETAT.ctx.murSel = id; return; }
  const t = m.scotchType || "kraft";
  // on pose le nouveau scrap juste sous le plus bas, et la page s'allonge
  const hauteurDe = (i) => { const s = scrap(i.id); return i.w / ((s && s.ratio) || 0.75); };
  const bas = m.items.reduce((h, i) => Math.max(h, i.y + hauteurDe(i)), 0);
  const y = Math.max(20, bas + 16);
  m.items.push({ id, x: 40 + Math.random() * 200, y, w: 128, rot: Math.round(Math.random() * 8 - 4), scotch: [["hg", t], ["hd", t]] });
  m.hauteur = Math.max(m.hauteur, y + 320);
  ETAT.ctx.murSel = id;
}

/* ───────── Délégation des événements */
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-aller]");
  if (a && APP.contains(a) || (a && a.closest(".menu-cache"))) {
    e.preventDefault();
    aller(a.dataset.aller, { remplace: a.dataset.remplace === "1" });
    return;
  }
  const b = e.target.closest("[data-action]");
  if (b && ACTIONS[b.dataset.action]) { e.preventDefault(); ACTIONS[b.dataset.action](b, e); }
});
document.addEventListener("input", (e) => {
  const k = e.target.dataset && e.target.dataset.input;
  if (!k) return;
  const v = +e.target.value;
  if (k === "rayon") { ETAT.reglages.rayon = v; const l = $("#rayon-val"); if (l) l.textContent = v + " m"; }
  if (k === "itemTaille" || k === "itemRotation") {
    const it = ETAT.mur.items.find((x) => x.id === ETAT.ctx.murSel);
    if (!it) return;
    const el = $(`[data-item="${CSS.escape(it.id)}"]`);
    if (k === "itemTaille") { it.w = v; const l = $("#item-taille-val"); if (l) l.textContent = Math.round((v / 128) * 100) + " %"; if (el) el.style.width = v + "px"; }
    else { it.rot = v; const l = $("#item-rot-val"); if (l) l.textContent = v + "°"; if (el) el.style.transform = `rotate(${v}deg)`; }
    return;
  }
  if (k === "vitrineTaille" || k === "vitrineRotation") {
    const it = ETAT.vitrine.find((x) => x.id === ETAT.ctx.vitrineSel) || ETAT.vitrine[ETAT.vitrine.length - 1];
    if (!it) return;
    if (k === "vitrineTaille") { it.w = v; $("#v-taille").textContent = v + " %"; }
    else { it.rot = v; $("#v-rot").textContent = v + "°"; }
    const el = $(`[data-v="${CSS.escape(it.id)}"]`);
    if (el) { el.style.width = it.w + "px"; el.style.transform = `rotate(${it.rot}deg)`; }
  }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.input === "rayon") { sauver(); if (courant === "14") rafraichir(); }
  if (t.dataset.input && (t.dataset.input.startsWith("vitrine") || t.dataset.input.startsWith("item"))) sauver();
  if (t.dataset.change === "photoCapture") photoFichier(t.files[0]);
  if (t.dataset.change === "photoProfil" && t.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement("canvas"), k = 240 / Math.min(im.width, im.height);
        c.width = c.height = 240;
        c.getContext("2d").drawImage(im, (240 - im.width * k) / 2, (240 - im.height * k) / 2, im.width * k, im.height * k);
        ETAT.utilisateur.avatar = c.toDataURL("image/jpeg", 0.8);
        sauver(); rafraichir();
      };
      im.src = r.result;
    };
    r.readAsDataURL(t.files[0]);
  }
});
/* 19.1 : ajouter un tag perso avec Entrée */
document.addEventListener("keydown", (e) => {
  if (e.target.id === "nouveau-tag" && e.key === "Enter") {
    e.preventDefault();
    const v = e.target.value.trim();
    const p = ETAT.ctx.capture;
    if (v && p) { lireCapture(); p.tagsPerso.push(v); p.themes.push(v); rafraichir(); }
  }
  if (e.key === "m" && !/input|textarea/i.test(e.target.tagName)) ouvrirMenu();
});

/* ───────── Menu caché : appui long en haut de l'écran (ou touche M) */
function ouvrirMenu() {
  if ($(".menu-cache")) return;
  const m = document.createElement("div");
  m.className = "menu-cache";
  m.innerHTML = `${entete("Tous les écrans", { fermer: true })}
    <div class="defile">
      ${Object.entries(SECTIONS).map(([k, nom]) => `<p class="t-texte-meta secondaire" style="margin:20px 0 4px"><span class="accent">${k}</span> · ${nom}</p>
        ${ORDRE.filter((id) => ECRANS[id].section === k).map((id) => `<button data-aller="${id}"><span class="num">${id}</span><span class="t-texte-label">${esc(ECRANS[id].titre)}</span></button>`).join("")}`).join("")}
      <div style="margin-top:28px">${bouton("Réinitialiser la démo", { type: "secondaire", action: "reinitDemo" })}</div>
      <p class="t-texte-petit secondaire" style="margin:12px 0 0">Remet le compte d'Inès comme au départ : efface les scraps capturés, le scrapbook et les réglages.</p>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener("click", (e) => {
    if (e.target.closest("[data-action='fermer']")) { e.stopPropagation(); m.remove(); }
    if (e.target.closest("[data-aller]")) m.remove();
    if (e.target.closest("[data-action='reinitDemo']")) { e.stopPropagation(); reinitialiser(); m.remove(); toast("Démo réinitialisée"); aller("01"); }
  });
}
(function zoneMenu() {
  const z = document.createElement("div");
  z.className = "zone-menu";
  document.body.appendChild(z);
  let t = null;
  const go = () => { t = setTimeout(ouvrirMenu, 650); };
  const stop = () => clearTimeout(t);
  z.addEventListener("touchstart", go, { passive: true });
  z.addEventListener("touchend", stop);
  z.addEventListener("mousedown", go);
  z.addEventListener("mouseup", stop);
})();

/* ───────── Hors connexion */
window.addEventListener("offline", () => { if (["13", "14", "16", "17", "18"].includes(courant)) aller("48"); });

/* ───────── Démarrage */
(function demarrer() {
  if (!ETAT.reglages.hasOwnProperty("manquants")) ETAT.reglages.manquants = true;
  const id = idDuHash();
  if (!id) { location.replace("#/01"); pile.push("01"); rendre("01"); return; }
  pile.push(id);
  rendre(id);
})();
