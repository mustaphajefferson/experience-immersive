/* SCRAP — noyau : utilitaires, composants HTML, état du compte démo. */
"use strict";

/* ───────── Utilitaires */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad3 = (n) => String(n).padStart(3, "0");
const rangTxt = (n) => (n === 1 ? "1re" : n + "e");
const pluriel = (n, mot, motPl) => `${n} ${n > 1 ? motPl || mot + "s" : mot}`;
const aujourdhui = () => {
  const d = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return { date: `${p(d.getDate())}.${p(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`, heure: `${p(d.getHours())}:${p(d.getMinutes())}` };
};

/* ───────── Icônes (24 px, trait 1,5, extrémités carrées) */
const ICONES = {
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
  deplacer: "M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3",
  aide: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M11 17h2",
  lien: "M10 14l4-4M8 11l-2 2a3.5 3.5 0 0 0 5 5l2-2M16 13l2-2a3.5 3.5 0 0 0-5-5l-2 2",
  message: "M4 5h16v11H9l-5 4z",
  attention: "M12 3l10 18H2zM12 10v5M11 18h2",
  image: "M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01",
  reglages: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4",
  coeur: "M12 20S3.5 14.4 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 14.4 12 20 12 20z",
  bombe: "M9 8h6v12H9zM10.5 4.5h3V8h-3zM16.5 5h1.4M18.6 3.2h1.4M17.6 8.2h1.4",
  masque: "M3 4h8v6.5A4 4 0 0 1 3 10.5zM5.6 7h.8M8.2 7h.8M13 8h8v6.5a4 4 0 0 1-8 0zM15.6 11h.8M18.2 11h.8",
  pellicule: "M3 5h18v14H3zM7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4",
  verre: "M5 4h14l-7 8zM12 12v6M8.5 18h7",
  ballon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5l4 2.9-1.5 4.6h-5L8 10.4z",
  cintre: "M12 7.4a2 2 0 1 1 2 2c-1.1 0-2 .7-2 1.7v.9M12 12L3 18.5h18z",
  lettre: "M6 20 12 4l6 16M8.6 14.4h6.8",
  fantome: "M5 20V10a7 7 0 0 1 14 0v10l-2.3-2-2.3 2-2.4-2-2.3 2zM9.4 10h.9M13.7 10h.9",
  loupe: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM15.5 15.5 20 20M8.5 11h5M11 8.5v5",
  grille4: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  grille9: "M4 4h4.6v4.6H4zM9.7 4h4.6v4.6H9.7zM15.4 4H20v4.6h-4.6zM4 9.7h4.6v4.6H4zM9.7 9.7h4.6v4.6H9.7zM15.4 9.7H20v4.6h-4.6zM4 15.4h4.6V20H4zM9.7 15.4h4.6V20H9.7zM15.4 15.4H20V20h-4.6z",
  liste: "M4 6h3v3H4zM10 7.5h10M4 13h3v3H4zM10 14.5h10",
  empile: "M6 3h12v18H6zM9 7h6M9 11h6",
  zoomPlus: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM15.5 15.5 20 20M8.5 11h5M11 8.5v5",
  zoomMoins: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM15.5 15.5 20 20M8.5 11h5",
  taille: "M4 4h9v9H4zM11 11h9v9h-9zM16 11v-4M20 11h-4",
  vue: "M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  reprendre: "M4 10a8 8 0 1 1 1 6M4 5v5h5",
  etiquette: "M3 7h18v10H3zM6.5 10h8M6.5 14h5",
  calendrier: "M3 6h18v15H3zM3 10h18M8 3v4M16 3v4M7 14h3v3H7z",
  fleche: "M3 17c6-8 12-11 18-11M16 2.5 21 6l-3 5",
  ruban: "M3 9h18v6H3zM7 9v6M12 9v6M17 9v6",
  punaise: "M12 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 16v6",
  telecharger: "M12 3v12M7.5 11 12 15.5 16.5 11M4 20h16",
  mur3d: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
  ciseaux: "M7 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7 22a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM9 8.5 20 20M9 15.5 20 4",
  texte: "M5 5h14M12 5v14M8.5 19h7",
  lampe: "M9 14.5A5.5 5.5 0 1 1 15 14.5V18H9zM10 21h4M12 2v2M4.5 6l1.5 1M19.5 6L18 7",
  palette: "M12 3a9 9 0 0 0 0 18c1.5 0 2-1 1.4-1.9-.6-1 .1-2.1 1.3-2.1H17a4 4 0 0 0 4-4c0-5-4-10-9-10zM7.5 10.5h.01M11 7.5h.01M15.5 9h.01",
  postit: "M4 4h16v11l-5 5H4zM20 15h-5v5",
  trombone: "M16 7v9a4 4 0 0 1-8 0V6.5a2.5 2.5 0 0 1 5 0V16a1 1 0 0 1-2 0V8",
  ticket: "M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM12 7v2M12 12v2M12 17v2",
  bulle: "M4 4h16v11H9l-4 4v-4H4zM8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01",
  gommette: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};
const icone = (nom, t = 24) =>
  `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${(1.5 * 24) / t}" stroke-linecap="square" aria-hidden="true"><path d="${ICONES[nom] || ""}"/></svg>`;

/* ───────── Badges : des sceaux, pas des pictos.
 * Cadre perforé comme un timbre + un motif dessiné pour chaque badge.
 * Si un badge n'a pas de motif, on agrandit l'icône de sa collection. */
const MOTIFS_BADGE = {
  premier: "M27 43V24l-6 4.5M21 43h15",
  belleville: "M11 45l12-14 7 8 6-7 17 13zM31 18v10M31 18l9 3-9 3",
  holo: "M32 15l12 17-12 17-12-17zM32 24l6 8-6 8-6-8zM14 23l-5-3M50 23l5-3M14 41l-5 3M50 41l5 3",
  concerts: "M27 42V20l16-3v19M27 42a5 5 0 1 1-10 0 5 5 0 0 1 10 0zM43 38a5 5 0 1 1-10 0 5 5 0 0 1 10 0z",
  expos: "M12 16h40v30H12zM18 40l9-10 6 6 6-6 10 10M22 24h4v4h-4z",
  marches: "M12 20h40v8H12zM20 20v8M28 20v8M36 20v8M44 20v8M17 28v18h30V28M27 46V34h10v12",
  messages: "M14 26v12h8l16 9V17l-16 9zM45 25a9 9 0 0 1 0 14",
  cinquante: "M24 23h-9v9h4a5 5 0 1 1-5 5M44 23a5 5 0 0 1 5 5v9a5 5 0 0 1-10 0v-9a5 5 0 0 1 5-5",
  street: "M25 26h14v22H25zM28 16h8v10h-8zM44 17h4M50 13h4M47 25h4",
  disparues: "M14 48V26a18 18 0 0 1 36 0v22l-6-5-6 5-6-5-6 5zM25 26h3M37 26h3",
};
function badgeSvg(b, t = 64) {
  const motif = MOTIFS_BADGE[b.id];
  const dedans = motif
    ? `<path d="${motif}" stroke-width="2.2"/>`
    : `<g transform="translate(12.8 12.8) scale(1.6)"><path d="${ICONES[b.icone] || ""}" stroke-width="1.4"/></g>`;
  return `<svg class="badge-svg" viewBox="0 0 64 64" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
    <rect x="1" y="1" width="62" height="62" stroke-width="1.5"/>
    <rect x="6" y="6" width="52" height="52" stroke-width="1" stroke-dasharray="2 3.5" opacity=".6"/>
    <path d="M1 13h5M1 51h5M58 13h5M58 51h5M13 1v5M51 1v5M13 58v5M51 58v5" stroke-width="1.5"/>
    ${dedans}</svg>`;
}
const badgeHtml = (b, o = {}) => {
  const ok = o.ok !== undefined ? o.ok : badgeDebloque(b);
  const t = o.taille || 64;
  return `<span class="badge${ok ? "" : " verrou"}${o.choisi ? " choisi" : ""}${o.pose ? " pose" : ""}" style="width:${t}px;height:${t}px">
    ${badgeSvg(b, t)}${ok ? "" : `<i class="badge-cadenas">${icone("cadenas", 16)}</i>`}</span>`;
};

/* ───────── État du compte démo (sauvegardé sur le téléphone) */
const CLE = "scrap-demo-v1";
const D = window.DONNEES;
let ETAT;
function etatInitial() {
  return {
    utilisateur: { ...D.utilisateur },
    scraps: JSON.parse(JSON.stringify(D.scraps)),
    captures: [],               // ordre des scraps capturés pendant la démo
    mur: JSON.parse(JSON.stringify(D.mur)),
    vitrine: JSON.parse(JSON.stringify(D.vitrine)),
    miseEnAvant: D.miseEnAvant,
    personnes: JSON.parse(JSON.stringify(D.personnes)),
    reglages: { ...D.reglages, manquants: true },
    filtres: { rayon: 500, collection: "toutes", etat: "tous", manquants: true },
    collectionsDepart: ["concerts", "expos"],
    celebrees: [],              // collections dont la complétion a été fêtée
    exclusifs: [],
    ctx: {},
  };
}
function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    ETAT = brut ? { ...etatInitial(), ...JSON.parse(brut) } : etatInitial();
  } catch (e) { ETAT = etatInitial(); }
}
function sauver() {
  try { localStorage.setItem(CLE, JSON.stringify(ETAT)); }
  catch (e) { toast("Mémoire du téléphone pleine : la dernière capture n'est pas sauvegardée."); }
}
function reinitialiser() {
  try { localStorage.removeItem(CLE); } catch (e) { /* rien */ }
  ETAT = etatInitial();
}
/* Compte vierge : le premier lancement, carnet vide, rien de capturé.
 * Sert à rejouer l'inscription et les écrans vides. */
function reinitialiserVide() {
  reinitialiser();
  ETAT.scraps = {};
  ETAT.mur = { fond: "papier", fondImage: null, voile: 0, notes: [], traits: [], hauteur: 1600, items: [] };
  ETAT.vitrine = [];
  ETAT.miseEnAvant = null;
  ETAT.utilisateur = { ...D.utilisateur, badge: null };
  ETAT.collectionsDepart = [];
  sauver();
}
charger();

/* ───────── Données calculées */
const scrap = (id) => ETAT.scraps[id];
const imgScrap = (id) => (scrap(id) && scrap(id).img) || `assets/affiches/${id}.jpg`;
const idsScraps = () => Object.keys(ETAT.scraps);
const collection = (cid) => D.collections.find((c) => c.id === cid);
const dansCollection = (cid) => idsScraps().filter((id) => scrap(id).collection === cid);
const progression = (cid) => ({ n: dansCollection(cid).length, total: collection(cid).total });
const complete = (cid) => { if (!collection(cid)) return true; const p = progression(cid); return p.n >= p.total; };
const badgeDebloque = (b) => b.debloque || (b.collection && complete(b.collection)) || (b.objectif && idsScraps().length >= b.objectif);
/* Collections rangées : celles que la personne a ouvertes d'abord, puis celles
 * où elle a déjà des scraps, puis le reste. */
const collectionsOrdonnees = () => {
  const depart = ETAT.collectionsDepart || [];
  const poids = (c) => (depart.includes(c.id) ? 0 : dansCollection(c.id).length ? 1 : 2);
  return D.collections.slice().sort((a, b) => poids(a) - poids(b));
};
const totalScraps = () => idsScraps().length;

/* Ce que la collection dit de la personne : la collection la mieux remplie. */
function titreCollectionneur(autre) {
  if (autre) return "Colleur du " + autre.quartier;
  const ids = idsScraps();
  if (!ids.length) return "Carnet vide, pour l'instant";
  const compte = {};
  ids.forEach((id) => { const c = scrap(id).collection; compte[c] = (compte[c] || 0) + 1; });
  const meilleur = Object.entries(compte).sort((a, b) => b[1] - a[1])[0];
  const col = collection(meilleur[0]);
  const rares = ids.filter((id) => ["mythique", "rare"].includes(rarete(scrap(id)).cle)).length;
  return (rares >= 3 ? "Œil rare · " : "") + (col ? col.nom + " en tête" : "Collection mêlée");
}

/* Répartition des scraps par rareté, pour la petite jauge du profil. */
function repartitionRarete() {
  const ordre = ["mythique", "rare", "peuvue", "commune"];
  const ids = idsScraps();
  const noms = { mythique: "Mythiques", rare: "Rares", peuvue: "Peu vues", commune: "Communes" };
  return ordre.map((cle) => {
    const n = ids.filter((id) => rarete(scrap(id)).cle === cle).length;
    return { cle, nom: noms[cle], n, part: ids.length ? n / ids.length : 0 };
  }).filter((x) => x.n > 0);
}

/* ───────── Composants HTML */
const tampon = (l1, l2, o = {}) =>
  `<span class="tampon${o.plein ? " plein" : ""}${o.grand ? " grand" : ""}${o.pose ? " pose" : ""}"><span>${esc(l1)}<br>${esc(l2)}</span></span>`;
const tamponScrap = (id, o = {}) => {
  const s = scrap(id);
  return tampon(s.date, s.arr, { plein: complete(s.collection), ...o });
};
const etiquette = (txt, num) => `<span class="etiquette${num ? " etiquette--num" : ""}">${esc(txt)}</span>`;
const interrupteur = (cle, on) => `<button class="interrupteur${on ? " on" : ""}" data-action="basculer" data-cle="${cle}" aria-pressed="${!!on}" aria-label="Activer"></button>`;
const ligne = (libelle, o = {}) => {
  const attrs = o.aller ? ` data-aller="${o.aller}"` : o.action ? ` data-action="${o.action}"${o.data || ""}` : "";
  const tag = o.toggle !== undefined ? "div" : "button";
  return `<${tag} class="ligne"${attrs}>
    ${o.icone ? icone(o.icone) : ""}
    <span class="libelle${o.souligne ? " souligne" : ""}">${esc(libelle)}</span>
    ${o.valeur ? `<span class="valeur">${esc(o.valeur)}</span>` : ""}
    ${o.toggle !== undefined ? interrupteur(o.toggle, ETAT.reglages[o.toggle]) : o.sansChevron ? "" : `<span class="secondaire">${icone("chevron")}</span>`}
  </${tag}>`;
};
const bouton = (txt, o = {}) => {
  const cls = o.type === "secondaire" ? " bouton--secondaire" : o.type === "capture" ? " bouton--capture" : "";
  const attrs = o.aller ? ` data-aller="${o.aller}"` : o.action ? ` data-action="${o.action}"${o.data || ""}` : "";
  return `<button class="bouton${cls}"${attrs}${o.id ? ` id="${o.id}"` : ""}>${o.type === "capture" ? icone("scan") : ""}${esc(txt)}</button>`;
};
const lien = (txt, o = {}) => {
  const attrs = o.aller ? ` data-aller="${o.aller}"` : o.action ? ` data-action="${o.action}"${o.data || ""}` : "";
  return `<button class="bouton-lien${o.centre ? " lien-centre" : ""}"${attrs}>${esc(txt)}</button>`;
};
const puce = (txt, active, attrs = "") => `<button class="puce${active ? " active" : ""}"${attrs}>${esc(txt)}</button>`;
const avatar = (taille, initiales, img) =>
  `<span class="avatar" style="width:${taille}px;height:${taille}px">${img ? `<img src="${img}" alt="">` : `<span class="${taille > 70 ? "t-titre-l" : "t-texte-label"}">${esc(initiales)}</span>`}</span>`;
const champ = (label, valeur, o = {}) =>
  `<label class="champ"><span class="t-texte-meta secondaire">${esc(label)}</span>${o.multi
    ? `<textarea ${o.id ? `id="${o.id}"` : ""} maxlength="80">${esc(valeur)}</textarea>`
    : `<input type="${o.type || "text"}" value="${esc(valeur)}" ${o.placeholder ? `placeholder="${esc(o.placeholder)}"` : ""} ${o.id ? `id="${o.id}"` : ""} autocomplete="off">`}${o.aide ? `<span class="t-texte-meta secondaire" style="display:block;margin-top:8px">${esc(o.aide)}</span>` : ""}</label>`;

/* En-têtes et barres */
const entete = (titre, o = {}) => `<header class="entete">
  <div class="entete-ligne">
    ${o.sansRetour ? "<span></span>" : `<button class="icone-bouton" data-action="${o.fermer ? "fermer" : "retour"}"${o.retourVers ? ` data-vers="${o.retourVers}"` : ""} aria-label="${o.fermer ? "Fermer" : "Retour"}">${icone(o.fermer ? "fermer" : "retour")}</button>`}
    <span class="entete-titre t-titre-m">${esc(titre)}</span>
    ${o.droite || "<span></span>"}
  </div></header>`;
const grandTitre = (titre, meta, droite = "") => `<div class="grand-titre">
  <div class="ligne-titre"><h1 class="t-titre-xl" style="margin:0">${esc(titre)}</h1>${droite}</div>
  ${meta ? `<p class="t-texte-meta secondaire" style="margin:8px 0 0">${esc(meta)}</p>` : ""}</div>`;
/* La barre de l'onglet courant ne réapparaît pas d'un coup à sa nouvelle
 * place : elle glisse depuis l'onglet qu'on vient de quitter. --saut dit de
 * combien d'onglets elle vient. */
const onglets = (actif) => {
  const prec = ETAT.ctx.ongletPrec;
  const saut = prec === undefined || prec === actif ? 0 : prec - actif;
  ETAT.ctx.ongletPrec = actif;
  return `<nav class="onglets" style="--saut:${saut}">
  ${[["13", "Carte"], ["24", "Scrapbook"], ["28", "Collection"], ["38", "Amis"]].map(([id, lib], i) =>
    `<button class="onglet${i === actif ? " actif" : ""}" data-aller="${id}"><span>${lib}</span></button>`).join("")}</nav>`;
};
const pied = (contenu, o = {}) => `<footer class="pied${o.filet ? " filet" : ""}${o.transparent ? " transparent" : ""}">${contenu}</footer>`;

/* Scraps : carte avec légende (numéro, lieu, tampon) */
const legende = (id) => {
  const s = scrap(id);
  return `<div class="legende"><div>
      <span class="t-texte-meta accent">Scrap N° ${pad3(s.num)}</span>${s.holo ? ` <span class="t-texte-meta secondaire">· Holo</span>` : ""}
      <div class="t-texte-petit">${esc(s.lieu)}</div></div>${tamponScrap(id)}</div>`;
};
const carteScrap = (id, o = {}) => `<button class="carte-scrap surgit${o.choisie ? " choisie" : ""}" data-action="${o.action || "ouvrirScrap"}" data-id="${id}" style="--i:${Math.min(o.i || 0, 14)}">
  <img class="scrap-img" src="${imgScrap(id)}" alt="${esc(scrap(id).titre)}" loading="lazy" style="aspect-ratio:${scrap(id).ratio}">
  ${o.coche !== undefined ? `<span class="coche${o.coche ? " num" : ""}">${o.coche ? esc(o.coche) : ""}</span>` : ""}
  ${legende(id)}</button>`;
const logo = (taille) => `<span class="logo" style="font-size:${taille}px">SCRAP<i></i></span>`;

/* ───────── Toast */
function toast(txt) {
  $$(".toast").forEach((t) => t.remove());
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = txt;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}
