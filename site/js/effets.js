/* SCRAP — effets partagés : vibration, profondeur au gyroscope, compteurs
 * animés, éclat du cœur, écrans de récompense.
 *
 * Tout est en vanilla : pas de librairie d'animation. Les effets respectent
 * « prefers-reduced-motion » : si la personne a coupé les animations dans son
 * téléphone, on affiche le résultat final sans bouger.
 */
"use strict";

const MOINS_ANIM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const vibrer = (ms = 10) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* rien */ } };

/* ───────── Profondeur : les couches bougent avec l'inclinaison du téléphone.
 * scene     : l'élément qui porte les variables --px / --py (de -1 à 1)
 * Les couches à l'intérieur portent data-prof (amplitude en px).
 * Sur ordinateur, la souris remplace le gyroscope.
 */
let gyroAutorise = null;           // null = pas encore demandé, true/false ensuite
const gyroDemandeNecessaire = () =>
  typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function" && gyroAutorise !== true;

function demanderGyro() {
  if (typeof DeviceOrientationEvent === "undefined" || typeof DeviceOrientationEvent.requestPermission !== "function") {
    gyroAutorise = true;
    return Promise.resolve(true);
  }
  return DeviceOrientationEvent.requestPermission()
    .then((r) => { gyroAutorise = r === "granted"; return gyroAutorise; })
    .catch(() => { gyroAutorise = false; return false; });
}

/* ───────── L'inclinaison du téléphone, mesurée une seule fois pour toute
 * l'app. On écrit --px et --py (de -1 à 1) sur la racine du document : toutes
 * les couches de tous les écrans en héritent, sans qu'aucun écran n'ait à
 * brancher quoi que ce soit. Sur ordinateur, la souris remplace le capteur. */
const INCLINAISON = { x: 0, y: 0, cibleX: 0, cibleY: 0, base: null, branche: false, anim: null };

function inclinaisonActive() {
  return !MOINS_ANIM && ETAT.reglages.profondeur !== false && !!(window.CONFIG && CONFIG.profondeur.actif);
}

function inclinaisonDemarrer() {
  const racine = document.documentElement;

  const boucle = () => {
    const vise = inclinaisonActive() ? 1 : 0;
    const dx = INCLINAISON.cibleX * vise - INCLINAISON.x;
    const dy = INCLINAISON.cibleY * vise - INCLINAISON.y;
    // quand plus rien ne bouge, on n'écrit rien : le navigateur se repose
    if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
      INCLINAISON.x += dx * 0.12;
      INCLINAISON.y += dy * 0.12;
      racine.style.setProperty("--px", INCLINAISON.x.toFixed(4));
      racine.style.setProperty("--py", INCLINAISON.y.toFixed(4));
    }
    INCLINAISON.anim = requestAnimationFrame(boucle);
  };
  boucle();

  INCLINAISON.surOrientation = (e) => {
    if (e.gamma === null || e.gamma === undefined) return;
    if (!INCLINAISON.base) INCLINAISON.base = { g: e.gamma, b: e.beta };
    const amp = (window.CONFIG && CONFIG.profondeur.amplitude) || 1;
    INCLINAISON.cibleX = clamp(((e.gamma - INCLINAISON.base.g) / 24) * amp, -1, 1);
    INCLINAISON.cibleY = clamp(((e.beta - INCLINAISON.base.b) / 24) * amp, -1, 1);
  };
  window.addEventListener("pointermove", (e) => {
    if (INCLINAISON.branche) return;   // le capteur a la priorité sur la souris
    INCLINAISON.cibleX = clamp((e.clientX / innerWidth - 0.5) * 2, -1, 1);
    INCLINAISON.cibleY = clamp((e.clientY / innerHeight - 0.5) * 2, -1, 1);
  });
  window.addEventListener("blur", () => { INCLINAISON.base = null; INCLINAISON.cibleX = 0; INCLINAISON.cibleY = 0; });
  if (!gyroDemandeNecessaire()) brancherInclinaison();
}

function brancherInclinaison() {
  if (INCLINAISON.branche) return;
  INCLINAISON.branche = true;
  window.addEventListener("deviceorientation", INCLINAISON.surOrientation, true);
}

/* Règle l'intensité de l'effet sur une scène (1 = normal). Les couches
 * à l'intérieur portent class="couche" et --p, l'amplitude en pixels. */
function profondeur(scene, o = {}) {
  if (!scene) return null;
  scene.style.setProperty("--amp", o.amplitude === undefined ? 1 : o.amplitude);
  scene.dataset.gyro = "1";
  return null;
}

/* Bouton « activer la 3D » (iOS seulement), à poser dans un écran */
const boutonGyro = () =>
  gyroDemandeNecessaire() ? `<button class="bouton-lien t-texte-meta" data-action="activerGyro">Activer la 3D</button>` : "";

/* ───────── Poussière de papier : quelques éclats qui flottent dans une scène.
 * Purement décoratif, et c'est ce qui donne la profondeur quand on penche. */
function poussiere(n = 14) {
  if (MOINS_ANIM) return "";
  let out = "";
  for (let i = 0; i < n; i++) {
    const p = 10 + Math.random() * 46;          // profondeur : plus c'est grand, plus ça bouge
    out += `<i class="grain couche" style="--p:${p.toFixed(0)};left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;
      --t:${(5 + Math.random() * 7).toFixed(1)}s;--d:${(-Math.random() * 7).toFixed(1)}s;--s:${(2 + Math.random() * 4).toFixed(1)}px;--o:${(0.18 + Math.random() * 0.3).toFixed(2)}"></i>`;
  }
  return `<div class="poussiere" aria-hidden="true">${out}</div>`;
}

/* ───────── Vol d'un scrap d'un écran à l'autre (l'affiche qu'on colle).
 * On garde la position de départ, et le scrapbook termine le mouvement. */
function volPreparer(el) {
  if (!el || MOINS_ANIM) return null;
  const r = el.getBoundingClientRect();
  return { img: el.currentSrc || el.src, x: r.left, y: r.top, w: r.width, h: r.height };
}
function volArriver(vol, cible, apres) {
  if (!vol || !cible || MOINS_ANIM) { apres && apres(); return; }
  const papier = cible.querySelector(".mur-papier") || cible;
  const r = papier.getBoundingClientRect();
  const clone = document.createElement("img");
  clone.className = "vol-scrap";
  clone.src = vol.img;
  clone.style.cssText = `left:${vol.x}px;top:${vol.y}px;width:${vol.w}px;height:${vol.h}px`;
  document.body.appendChild(clone);
  cible.style.visibility = "hidden";
  requestAnimationFrame(() => {
    clone.style.transition = "transform .62s cubic-bezier(.3,.9,.3,1), opacity .2s ease .5s";
    const k = r.width / vol.w;
    clone.style.transformOrigin = "0 0";
    clone.style.transform = `translate(${r.left - vol.x}px, ${r.top - vol.y}px) scale(${k}) rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
    clone.style.opacity = ".9";
  });
  setTimeout(() => {
    clone.remove();
    cible.style.visibility = "";
    cible.classList.add("vient-darriver");
    vibrer([12, 40, 18]);
    apres && apres();
  }, 640);
}

/* ───────── Compteur : des chiffres qui défilent avant de se poser.
 * 000 → 019, chiffre par chiffre, de gauche à droite. */
function compteurAnime(el, valeur, o = {}) {
  if (!el) return null;
  const texte = String(valeur).padStart(o.chiffres || 3, "0");
  if (MOINS_ANIM) { el.textContent = texte; return null; }
  const duree = o.duree || 1100;
  const debut = performance.now();
  const n = texte.length;
  let anim = null;
  const pas = () => {
    const t = clamp((performance.now() - debut) / duree, 0, 1);
    // chaque chiffre se fige l'un après l'autre
    let sortie = "";
    for (let i = 0; i < n; i++) {
      const fige = t >= (i + 1) / (n + 0.6);
      sortie += fige ? texte[i] : String(Math.floor(Math.random() * 10));
    }
    el.textContent = sortie;
    if (t < 1) anim = requestAnimationFrame(pas);
    else { el.textContent = texte; el.classList.add("pose"); vibrer(14); }
  };
  pas();
  return () => cancelAnimationFrame(anim);
}

/* ───────── Éclat : petits traits qui partent d'un bouton (favori, badge) */
function eclat(el, o = {}) {
  if (!el || MOINS_ANIM) return;
  const n = o.n || 10;
  const boite = document.createElement("span");
  boite.className = "eclat";
  for (let i = 0; i < n; i++) {
    const b = document.createElement("i");
    const a = (360 / n) * i + Math.random() * 12;
    b.style.cssText = `--a:${a}deg;--d:${18 + Math.random() * 16}px;--r:${Math.random() * 0.12 + 0.02}s`;
    boite.appendChild(b);
  }
  el.appendChild(boite);
  setTimeout(() => boite.remove(), 900);
}

/* ───────── Écran de récompense : un mot en très grand, puis la page.
 * Posé par-dessus l'écran, il disparaît tout seul. */
function revelation(mots, o = {}) {
  $$(".revelation").forEach((x) => x.remove());
  if (MOINS_ANIM) return;
  const v = document.createElement("div");
  v.className = "revelation" + (o.sombre ? " sombre" : "");
  v.innerHTML = `<div class="revelation-mots">${mots.map((m, i) =>
    `<span style="--i:${i}">${esc(m)}</span>`).join("")}</div>${o.sous ? `<p class="t-texte-meta">${esc(o.sous)}</p>` : ""}`;
  document.body.appendChild(v);
  vibrer([12, 60, 12]);
  const duree = o.duree || 1500 + mots.length * 120;
  setTimeout(() => { v.classList.add("sort"); setTimeout(() => v.remove(), 420); }, duree);
}

/* ───────── Compte à rebours doux : utilisé par le scanner */
function minuteur(ms, surFin) {
  const t = setTimeout(surFin, ms);
  return () => clearTimeout(t);
}

/* ───────── Rareté d'un scrap : calculée sur le rang de capture.
 * Être le 3e à capturer une affiche vaut plus que d'être le 300e. */
function rarete(s) {
  const n = s.num || 999;
  if (n <= 5) return { cle: "mythique", nom: "Mythique", texte: "Parmi les 5 premiers" };
  if (n <= 20) return { cle: "rare", nom: "Rare", texte: "Parmi les 20 premiers" };
  if (n <= 60) return { cle: "peuvue", nom: "Peu vue", texte: "Encore peu capturée" };
  return { cle: "commune", nom: "Commune", texte: "Déjà bien capturée" };
}
