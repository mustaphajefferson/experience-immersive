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

function profondeur(scene, o = {}) {
  if (!scene || MOINS_ANIM || !(window.CONFIG && CONFIG.profondeur.actif)) return null;
  const amp = (o.amplitude || 1) * CONFIG.profondeur.amplitude;
  let cibleX = 0, cibleY = 0, x = 0, y = 0, base = null, anim = null, vivant = true;

  const boucle = () => {
    if (!vivant) return;
    x += (cibleX - x) * 0.12;
    y += (cibleY - y) * 0.12;
    scene.style.setProperty("--px", x.toFixed(4));
    scene.style.setProperty("--py", y.toFixed(4));
    anim = requestAnimationFrame(boucle);
  };
  boucle();

  const surOrientation = (e) => {
    if (e.gamma === null || e.gamma === undefined) return;
    if (!base) base = { g: e.gamma, b: e.beta };
    cibleX = clamp(((e.gamma - base.g) / 26) * amp, -1, 1);
    cibleY = clamp(((e.beta - base.b) / 26) * amp, -1, 1);
  };
  const surSouris = (e) => {
    const r = scene.getBoundingClientRect();
    cibleX = clamp(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * amp, -1, 1);
    cibleY = clamp(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * amp, -1, 1);
  };
  const recentrer = () => { base = null; cibleX = 0; cibleY = 0; };

  const brancherGyro = () => window.addEventListener("deviceorientation", surOrientation, true);
  if (gyroDemandeNecessaire()) {
    // iOS : il faut un geste de la personne. Le bouton est posé par l'écran.
    scene.classList.add("attend-gyro");
  } else {
    brancherGyro();
  }
  scene.dataset.gyro = "1";
  scene._brancherGyro = brancherGyro;
  window.addEventListener("pointermove", surSouris);
  window.addEventListener("blur", recentrer);

  return () => {
    vivant = false;
    cancelAnimationFrame(anim);
    window.removeEventListener("deviceorientation", surOrientation, true);
    window.removeEventListener("pointermove", surSouris);
    window.removeEventListener("blur", recentrer);
  };
}

/* Bouton « activer la 3D » (iOS seulement), à poser dans un écran */
const boutonGyro = () =>
  gyroDemandeNecessaire() ? `<button class="bouton-lien t-texte-meta" data-action="activerGyro">Activer la 3D</button>` : "";

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
