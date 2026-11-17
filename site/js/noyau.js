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
};
const icone = (nom, t = 24) =>
  `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${(1.5 * 24) / t}" stroke-linecap="square" aria-hidden="true"><path d="${ICONES[nom] || ""}"/></svg>`;

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
const totalScraps = () => idsScraps().length;

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
const onglets = (actif) => `<nav class="onglets">
  ${[["13", "Carte"], ["24", "Scrapbook"], ["28", "Collection"]].map(([id, lib], i) =>
    `<button class="onglet${i === actif ? " actif" : ""}" data-aller="${id}">${lib}</button>`).join("")}</nav>`;
const pied = (contenu, o = {}) => `<footer class="pied${o.filet ? " filet" : ""}${o.transparent ? " transparent" : ""}">${contenu}</footer>`;

/* Scraps : carte avec légende (numéro, lieu, tampon) */
const legende = (id) => {
  const s = scrap(id);
  return `<div class="legende"><div>
      <span class="t-texte-meta accent">Scrap N° ${pad3(s.num)}</span>${s.holo ? ` <span class="t-texte-meta secondaire">· Holo</span>` : ""}
      <div class="t-texte-petit">${esc(s.lieu)}</div></div>${tamponScrap(id)}</div>`;
};
const carteScrap = (id, o = {}) => `<button class="carte-scrap${o.choisie ? " choisie" : ""}" data-action="${o.action || "ouvrirScrap"}" data-id="${id}">
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
