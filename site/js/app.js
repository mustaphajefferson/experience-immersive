/* SCRAP — navigation, actions des boutons, menu caché. */
"use strict";

const APP = document.getElementById("app");
let courant = null;
let nettoyer = null;
const pile = [];
/* Sens du passage d'un écran à l'autre : on avance, on revient, ou on change
 * d'onglet. Chacun a son mouvement — c'est ce qui fait qu'on sait toujours où
 * on est allé, sans avoir à y penser. */
let sensEcran = "avant";
const ONGLETS_ID = ["13", "24", "28", "38"];

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
  if (id !== "19" && id !== "24.4") cameraMurArreter();
  if (!String(id).startsWith("24") && id !== "25" && id !== "26" && id !== "27") ETAT.ctx.livreOuvert = false;
  const s = document.createElement("section");
  const fondu = ETAT.ctx.fondu ? " en-fondu" : "";
  ETAT.ctx.fondu = false;
  const sens = ONGLETS_ID.includes(id) && ONGLETS_ID.includes(courant) ? "onglet" : sensEcran;
  s.className = `ecran va-${sens} ${e.classe || ""}${o.garderDefilement ? " sans-anim" : ""}${fondu}`;
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
  if (pile.length > 1 && pile[pile.length - 2] === id) { pile.pop(); sensEcran = "arriere"; }
  else if (pile[pile.length - 1] !== id) { pile.push(id); sensEcran = "avant"; }
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
    // puis le mouvement (07.1) : c'est la troisième autorisation du parcours,
    // et elle était purement et simplement sautée
    const suite = () => { if (!fait) { fait = true; aller("07.1"); } };
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
  torche() { basculerTorche(); },
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
      if (ok) {
        brancherInclinaison();
        $$("[data-action='activerGyro']").forEach((b) => b.remove());
        if (demande) toast("Penche ton téléphone");
      } else if (demande) toast("Ton téléphone n'a pas autorisé le capteur.");
    });
  },
  autoriserMouvement() {
    demanderGyro().then((ok) => {
      if (ok) { brancherInclinaison(); ETAT.reglages.profondeur = true; sauver(); }
      aller("08");
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
    // on retient d'où part l'affiche : le scrapbook terminera le mouvement
    ETAT.ctx.vol = volPreparer($(".scrap-img"));
    collerSurMur(id);
    ETAT.ctx.murMode = "regarder";
    if (s.collection && collection(s.collection) && complete(s.collection) && !ETAT.celebrees.includes(s.collection)) {
      ETAT.celebrees.push(s.collection);
      ETAT.ctx.collection = s.collection;
      ETAT.ctx.packOuvert = null;
      ETAT.ctx.vol = null;
      sauver();
      aller("32");
    } else { sauver(); aller("24"); }
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
  ouvrirSelection() { if (ETAT.ctx.murSel) { ETAT.ctx.scrap = ETAT.ctx.murSel; aller("21"); } },
  itemDevant() {
    const o = trouverElement(ETAT.ctx.murSel); if (!o) return;
    if (o.type) { o.devant = true; ETAT.mur.notes = ETAT.mur.notes.filter((n) => n !== o).concat(o); }
    else ETAT.mur.items = ETAT.mur.items.filter((i) => i !== o).concat(o);
    sauver(); rafraichir(); toast("Mis au premier plan");
  },
  itemAligner() {
    const o = trouverElement(ETAT.ctx.murSel); if (!o) return;
    o.rot = 0; o.x = Math.round(o.x / 8) * 8; o.y = Math.round(o.y / 8) * 8;
    sauver(); rafraichir(); vibrer(8);
  },
  itemRetirer() {
    const id = ETAT.ctx.murSel; if (!id) return;
    const o = trouverElement(id);
    if (o && o.type) ETAT.mur.notes = ETAT.mur.notes.filter((n) => n.id !== id);
    else ETAT.mur.items = ETAT.mur.items.filter((i) => i.id !== id);
    ETAT.ctx.murSel = null; sauver(); rafraichir();
    toast(o && o.type ? "Élément retiré" : "Décollé. Le scrap reste dans ta collection.");
  },
  /* Poser un titre, une étiquette, une flèche… au milieu de ce qu'on regarde */
  ajouterNote(el) {
    const t = TYPES_NOTE.find((x) => x.type === el.dataset.id); if (!t) return;
    /* Le milieu de ce qu'on regarde, ramené dans le repère de la PAGE.
     * La vue est exprimée dans le repère de la planche, qui commence une
     * marge plus tôt : sans ce décalage, l'élément atterrissait à neuf cents
     * pixels de la page, donc invisible — c'est ce qui faisait croire que
     * les flèches, les tickets et les post-it ne marchaient pas. */
    const vue = ETAT.ctx.vue || { k: 1, x: 0, y: 0 };
    const zone = $("#mur");
    const k = vue.k || 1;
    const cx = zone ? (zone.clientWidth / 2 - vue.x) / k - MARGE_MUR : LARGEUR_MUR / 2;
    const cy = zone ? (zone.clientHeight / 2 - vue.y) / k - MARGE_MUR : 200;
    const n = {
      id: "n" + Date.now(),
      type: t.type,
      texte: t.type === "date" ? aujourdhui().date : t.exemple,
      // l'élément arrive au milieu de ce qu'on regarde, marges comprises :
      // si on travaille sur le côté de la page, il n'atterrit pas ailleurs
      x: Math.round(clamp(cx - (estTexte(t.type) ? 90 : t.w / 2), -MARGE_MUR + 20, LARGEUR_MUR + MARGE_MUR - 60)),
      y: Math.round(clamp(cy - 20, -MARGE_MUR + 20, ETAT.mur.hauteur + MARGE_MUR - 60)),
      w: t.w, rot: Math.round(Math.random() * 6 - 3), devant: true,
      couleur: t.couleur || null,
    };
    (ETAT.mur.notes || (ETAT.mur.notes = [])).push(n);
    ETAT.ctx.murSel = n.id;
    ETAT.ctx.murMode = "deplacer";
    sauver(); vibrer(10);
    aller("24", { remplace: true });
  },
  choisirDispo(el) { ETAT.ctx.dispoColl = el.dataset.id; rafraichir(); },
  /* Les réglages d'outil ne redessinent que le panneau et le fond : la page,
   * les affiches et la barre du bas ne rejouent plus leur arrivée à chaque clic. */
  choisirFond(el) { ETAT.mur.fond = el.dataset.id; sauver(); majPanneauOutil(); vibrer(6); },
  choisirScotch(el) { ETAT.mur.scotchType = el.dataset.id; sauver(); majPanneauOutil(); vibrer(6); },
  teinteFond(el) { ETAT.mur.teinte = el.dataset.id || null; sauver(); majPanneauOutil(); vibrer(6); },
  choisirDechirure(el) { ETAT.mur.dechireType = el.dataset.id; sauver(); majPanneauOutil(); },
  couleurNote(el) {
    const o = trouverElement(ETAT.ctx.murSel);
    if (!o || !o.type) return;
    o.couleur = el.dataset.id;
    sauver(); rafraichir(); vibrer(6);
  },
  matiereNote(el) {
    const o = trouverElement(ETAT.ctx.murSel);
    if (!o || o.type !== "ruban") return;
    o.matiere = el.dataset.id;
    sauver(); rafraichir(); vibrer(6);
  },
  rangerMur(el) { rangerMur(el.dataset.id); ETAT.ctx.murSel = null; ETAT.ctx.vue = null; rafraichir(); toast("Page rangée"); },
  couleurTrait(el) { (ETAT.mur.dessin || (ETAT.mur.dessin = {})).couleur = el.dataset.id; sauver(); majPanneauOutil(); vibrer(5); },
  epaisseurTrait(el) { (ETAT.mur.dessin || (ETAT.mur.dessin = {})).w = +el.dataset.id; sauver(); majPanneauOutil(); vibrer(5); },
  annulerTrait() {
    const t = ETAT.mur.traits || [];
    if (!t.length) { toast("Rien à annuler"); return; }
    t.pop(); sauver(); rafraichir();
  },
  effacerTraits() { ETAT.mur.traits = []; sauver(); rafraichir(); toast("Dessins effacés"); },
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
  /* ───────── Export du scrapbook */
  formatExport(el) { ETAT.ctx.formatExport = el.dataset.id; rafraichir(); majApercuExport(); },
  telechargerMur() {
    exporterMur(ETAT.ctx.formatExport || "story").then((c) => {
      const a = document.createElement("a");
      a.download = `scrapbook-${ETAT.utilisateur.pseudo.replace("@", "")}.jpg`;
      a.href = c.toDataURL("image/jpeg", 0.92);
      a.click();
      toast("Image enregistrée");
    }).catch(() => toast("L'export n'a pas abouti"));
  },
  partagerMur() {
    exporterMur(ETAT.ctx.formatExport || "story").then((c) => new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.9)))
      .then((blob) => {
        const f = new File([blob], "scrapbook.jpg", { type: "image/jpeg" });
        if (navigator.canShare && navigator.canShare({ files: [f] })) {
          return navigator.share({ files: [f], title: "Mon scrapbook SCRAP", text: "Ma ville en morceaux." });
        }
        ACTIONS.telechargerMur();
        toast("Ton téléphone ne partage pas les images : elle est enregistrée.");
      }).catch(() => {});
  },
  prendrePhotoMur() {
    const f = document.createElement("div"); f.className = "flash";
    const e = document.querySelector(".ecran"); if (e) e.appendChild(f);
    photoDuMur();
  },
  /* ───────── Ouverture du pack */
  ouvrirPack() {
    const cid = ETAT.ctx.collection || "concerts";
    if (ETAT.ctx.packOuvert === cid) return;
    const p = $("#pack");
    vibrer([14, 50, 20, 40, 30]);
    if (p) p.classList.add("ouvre");
    setTimeout(() => {
      ETAT.ctx.packOuvert = cid;
      rafraichir();
      setTimeout(() => { const c = $("#carte-exclusive"); if (c) eclat(c, { n: 16 }); }, 260);
    }, 620);
  },
  collerExclusif() {
    const cid = ETAT.ctx.collection || "concerts", c = collection(cid), id = "excl-" + cid;
    if (!ETAT.scraps[id]) {
      const { date, heure } = aujourdhui();
      ETAT.scraps[id] = { titre: "Édition exclusive — " + c.nom, artiste: "SCRAP", ratio: 0.72, num: 1, lieu: c.zone, arr: ETAT.utilisateur.arrondissement, date, heure, collection: "exclusifs", themes: ["Exclusif"], holo: true, scans: 64, murs: 1, img: svgExclusif(cid), exclusif: cid };
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
  /* ───────── Passage de relais : un scrap qui change de main, en vrai */
  ouvrirEchange(el) {
    ETAT.ctx.echange = { ami: +el.dataset.id || ETAT.ctx.personne || 0, etape: "choix", donne: null };
    aller("51");
  },
  choisirDon(el) {
    (ETAT.ctx.echange || (ETAT.ctx.echange = { ami: 0 })).donne = el.dataset.id;
    rafraichir(); vibrer(6);
  },
  lancerEchange() {
    const e = ETAT.ctx.echange;
    if (!e || !e.donne) return;
    e.etape = "approche";
    aller("51", { remplace: true });
  },
  conclureEchange() {
    const e = ETAT.ctx.echange;
    if (!e || e.etape === "fait") return;
    const ami = ETAT.personnes[e.ami] || ETAT.personnes[0];
    const id = "don-" + ami.pseudo.replace(/\W/g, "");
    if (!ETAT.scraps[id]) {
      const { date, heure } = aujourdhui();
      // le scrap reçu garde le nom de celui qui l'a donné : c'est ce qui en
      // fait autre chose qu'une image de plus
      ETAT.scraps[id] = {
        titre: "Club Fiasco — tirage de " + ami.pseudo, artiste: "Échangé en main propre",
        ratio: 0.7503, num: 6, lieu: ami.quartier, arr: "Paris 20e", date, heure,
        collection: "concerts", themes: ["Échange", "Club"], scans: 44, murs: 2,
        img: "assets/affiches/fiasco.jpg", offert: ami.pseudo,
      };
    }
    e.recu = id;
    e.etape = "fait";
    sauver();
    aller("51", { remplace: true });
  },
  collerRecu() {
    const e = ETAT.ctx.echange || {};
    if (!e.recu) return aller("24");
    ETAT.ctx.scrap = e.recu;
    collerSurMur(e.recu);
    ETAT.ctx.murMode = "regarder";
    sauver();
    aller("24");
  },
  copierLien() {
    const url = location.origin + location.pathname + "#/21";
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast("Lien copié"), () => toast("Lien : " + url));
  },
  partagerNatif() {
    const url = location.origin + location.pathname + "#/21";
    if (navigator.share) navigator.share({ title: "SCRAP", text: "Regarde ce scrap capturé à Belleville", url }).catch(() => {});
    else ACTIONS.copierLien();
  },
  /* ───────── Menu de démo (bouton DEV de l'accueil) */
  menuDev() {
    if ($(".feuille-dev")) return;
    const n = totalScraps();
    const fin = D.collections.filter((c) => complete(c.id)).length;
    const v = document.createElement("div");
    v.className = "voile-dev";
    v.innerHTML = `<div class="feuille feuille-dev">
      <span class="etiquette-dev">DEV · hors application</span>
      <span class="t-titre-m" style="display:block;margin-top:12px">Dans quel état veux-tu partir ?</span>
      <p class="t-texte-petit secondaire" style="margin:8px 0 18px">Session en cours : ${pluriel(n, "scrap")}, ${pluriel(fin, "collection complète", "collections complètes")}.</p>
      <div class="pile">
        ${bouton("Reprendre où j'en étais", { action: "devReprendre" })}
        ${bouton("Repartir de la démo d'Inès", { type: "secondaire", action: "devDemo" })}
        ${bouton("Compte vierge (premier lancement)", { type: "secondaire", action: "devVide" })}
      </div>
      <p class="t-texte-petit secondaire" style="margin:14px 0 0">La démo d'Inès remet 15 scraps, un scrapbook déjà commencé et des collections à finir — de quoi rejouer l'ouverture du pack et le badge.</p>
    </div>`;
    document.body.appendChild(v);
    requestAnimationFrame(() => v.classList.add("entre"));
    v.addEventListener("click", (e) => { if (e.target === v) fermerDev(); });
  },
  devReprendre() { fermerDev(); },
  devDemo() { reinitialiser(); fermerDev(); aller("01", { remplace: true }); rendre("01"); toast("Démo d'Inès remise à zéro"); },
  devVide() { reinitialiserVide(); fermerDev(); aller("01", { remplace: true }); rendre("01"); toast("Compte vierge"); },
  bientot() { toast("Disponible dans la vraie app"); },
  effacerHistorique() { toast("Historique des lieux effacé"); },
  exporter() { toast("Export envoyé à " + ETAT.utilisateur.email + " (démo)"); },
  deconnecter() { aller("01"); toast("Déconnecté"); },
  supprimerCompte() { aller("01"); toast("Compte supprimé (démo : rien n'est effacé)"); },
  reessayer() { if (navigator.onLine) aller("13"); else toast("Toujours pas de réseau"); },
  choisirPhoto() { $("#photo-49").click(); },
};

function fermerDev() {
  const v = $(".voile-dev");
  if (!v) return;
  v.classList.add("sort");
  setTimeout(() => v.remove(), 220);
}

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
  if (k === "noteTexte") {
    const n = trouverElement(ETAT.ctx.murSel);
    if (!n || !n.type) return;
    n.texte = e.target.value;
    const el = $(`[data-note="${CSS.escape(n.id)}"]`);
    if (!el) return;
    const dedans = el.querySelector(".papier-texte");
    if (dedans) dedans.textContent = n.texte;
    else if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = n.texte;
    else el.insertBefore(document.createTextNode(n.texte), el.firstChild);
    return;
  }
  if (k === "voileFond") {
    ETAT.mur.voile = v;
    const l = $("#voile-val"); if (l) l.textContent = v + " %";
    const x = $(".voile-fond"); if (x) x.style.opacity = v / 100;
    return;
  }
  if (k === "itemTaille" || k === "itemRotation") {
    const o = trouverElement(ETAT.ctx.murSel);
    if (!o) return;
    const el = $(`[data-item="${CSS.escape(o.id)}"]`) || $(`[data-note="${CSS.escape(o.id)}"]`);
    if (k === "itemTaille") {
      o.w = v;
      const texte = o.type && estTexte(o.type);
      const l = $("#item-taille-val"); if (l) l.textContent = texte ? v + " px" : Math.round((v / 128) * 100) + " %";
      if (el) {
        if (texte) el.style.fontSize = v + "px";
        else {
          el.style.width = v + "px";
          if (o.type === "punaise" || o.type === "gommette") el.style.height = v + "px";
          if (o.type === "trombone") el.style.height = Math.round(v * 1.9) + "px";
          if (o.type && estPapier(o.type)) el.style.fontSize = Math.max(8, Math.round(v * (o.type === "ticket" ? 0.105 : 0.145))) + "px";
        }
      }
    } else {
      o.rot = v;
      const l = $("#item-rot-val"); if (l) l.textContent = v + "°";
      if (el) el.style.transform = `rotate(${v}deg)`;
    }
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
  if (t.dataset.input && (t.dataset.input.startsWith("vitrine") || t.dataset.input.startsWith("item") || t.dataset.input === "noteTexte" || t.dataset.input === "voileFond")) sauver();
  if (t.dataset.change === "photoCapture") photoFichier(t.files[0]);
  if (t.dataset.change === "photoMur" && t.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const L = Math.min(1400, im.width);
        const c = document.createElement("canvas");
        c.width = L; c.height = Math.round((L * im.height) / im.width);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        enregistrerPhotoMur(c.toDataURL("image/jpeg", 0.82));
      };
      im.src = r.result;
    };
    r.readAsDataURL(t.files[0]);
  }
  /* Photo de fond du scrapbook : on la réduit avant de l'enregistrer, sinon
   * elle ne tient pas dans la mémoire du navigateur. */
  if (t.dataset.change === "fondPhoto" && t.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const L = Math.min(900, im.width);
        const c = document.createElement("canvas");
        c.width = L; c.height = Math.round((L * im.height) / im.width);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        ETAT.mur.fondImage = c.toDataURL("image/jpeg", 0.72);
        ETAT.mur.fond = "photo";
        if (!ETAT.mur.voile) ETAT.mur.voile = 25;
        sauver(); rafraichir(); vibrer(8);
      };
      im.src = r.result;
    };
    r.readAsDataURL(t.files[0]);
  }
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
  if (!ETAT.mur.notes) ETAT.mur.notes = [];
  inclinaisonDemarrer();   // l'inclinaison du téléphone, pour toute l'app
  const id = idDuHash();
  if (!id) { location.replace("#/01"); pile.push("01"); rendre("01"); return; }
  pile.push(id);
  rendre(id);
})();
