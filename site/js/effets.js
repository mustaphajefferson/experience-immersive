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
const INCLINAISON = { x: 0, y: 0, cibleX: 0, cibleY: 0, base: null, branche: false, anim: null, souris: 0 };

function inclinaisonActive() {
  return !MOINS_ANIM && ETAT.reglages.profondeur !== false && !!(window.CONFIG && CONFIG.profondeur.actif);
}

/* Tant que le capteur n'est pas branché (autorisation iOS pas encore donnée,
 * ordinateur sans souris qui bouge), la page respire toute seule : une houle
 * très lente, deux ondes qui ne tombent jamais en phase. Personne n'a besoin
 * d'appuyer sur « Activer la 3D » pour voir que ça vit ; le capteur, quand il
 * arrive, prend simplement le relais. */
function inclinaisonAuRepos() {
  if (INCLINAISON.branche) return false;                        // le capteur parle : pas de houle
  if (performance.now() - INCLINAISON.souris < 2600) return false; // la souris vient de bouger
  return !!(window.CONFIG && CONFIG.profondeur.repos);
}

function inclinaisonDemarrer() {
  const racine = document.documentElement;

  const boucle = () => {
    const actif = inclinaisonActive();
    let viseX = actif ? INCLINAISON.cibleX : 0;
    let viseY = actif ? INCLINAISON.cibleY : 0;
    if (actif && inclinaisonAuRepos()) {
      const t = performance.now() / 1000;
      const a = (window.CONFIG && CONFIG.profondeur.repos) || 0.4;
      viseX = clamp(viseX + Math.sin(t * 0.54) * a + Math.sin(t * 0.23) * a * 0.42, -1, 1);
      viseY = clamp(viseY + Math.cos(t * 0.41) * a * 0.72 + Math.sin(t * 0.17) * a * 0.34, -1, 1);
    }
    const dx = viseX - INCLINAISON.x;
    const dy = viseY - INCLINAISON.y;
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

  /* La position neutre n'est pas fixée une fois pour toutes : elle suit
   * lentement la façon dont la personne tient son téléphone. Sans ça, la
   * première mesure fait loi — si elle est prise téléphone à plat sur une
   * table, tenir l'appareil normalement (60° ou 70°) met l'effet en butée et
   * tout reste penché à fond. Ici, le repos revient toujours au milieu, et
   * seul le MOUVEMENT compte, ce qui est exactement ce qu'on veut. */
  INCLINAISON.surOrientation = (e) => {
    if (e.gamma === null || e.gamma === undefined) return;
    if (!INCLINAISON.base) INCLINAISON.base = { g: e.gamma, b: e.beta };
    const base = INCLINAISON.base;
    // changement brutal (on retourne le téléphone, on s'allonge) : on réancre
    if (Math.abs(e.beta - base.b) > 50 || Math.abs(e.gamma - base.g) > 50) { base.g = e.gamma; base.b = e.beta; }
    const amp = (window.CONFIG && CONFIG.profondeur.amplitude) || 1;
    const port = (window.CONFIG && CONFIG.profondeur.portee) || 20;
    INCLINAISON.cibleX = clamp(((e.gamma - base.g) / port) * amp, -1, 1);
    INCLINAISON.cibleY = clamp(((e.beta - base.b) / port) * amp, -1, 1);
    // dérive douce du neutre : une inclinaison tenue revient au repos
    const suite = (window.CONFIG && CONFIG.profondeur.recentrage) || 0.012;
    base.g += (e.gamma - base.g) * suite;
    base.b += (e.beta - base.b) * suite;
  };
  window.addEventListener("pointermove", (e) => {
    if (INCLINAISON.branche) return;   // le capteur a la priorité sur la souris
    if (e.pointerType === "touch") return;  // un doigt qui fait défiler n'est pas une souris
    INCLINAISON.souris = performance.now();
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

/* ───────── Étoiles : les points qui gravitaient autour d'un objet précieux
 * sont devenus des étoiles à quatre branches. Chacune tourne et respire toute
 * seule — l'écran vit même quand le téléphone est posé sur la table — et se
 * décale en plus avec l'inclinaison, à sa propre profondeur. */
const ETOILE_D = "M12 0c.6 6.6 4.8 11 11.4 12-6.6 1-10.8 5.4-11.4 12-.6-6.6-4.8-11-11.4-12C7.2 11 11.4 6.6 12 0z";
function etoiles(n = 10, o = {}) {
  if (MOINS_ANIM) return "";
  let out = "";
  for (let i = 0; i < n; i++) {
    const p = (o.prof || 10) + Math.random() * (o.ecart || 44);
    const t = (o.taille || 7) + Math.random() * (o.variation || 11);
    out += `<svg class="etoile-flottante couche" viewBox="0 0 24 24" style="--p:${p.toFixed(0)};
      left:${(Math.random() * 96).toFixed(1)}%;top:${(Math.random() * 94).toFixed(1)}%;
      width:${t.toFixed(1)}px;--t:${(6 + Math.random() * 9).toFixed(1)}s;--d:${(-Math.random() * 9).toFixed(1)}s;
      --o:${(0.35 + Math.random() * 0.5).toFixed(2)}" aria-hidden="true"><path d="${ETOILE_D}"/></svg>`;
  }
  return `<div class="ciel${o.classe ? " " + o.classe : ""}" aria-hidden="true">${out}</div>`;
}

/* ───────── FLIP : le tri qui se voit.
 * On note où est chaque carte AVANT de changer l'ordre, on laisse le
 * navigateur refaire la page, puis on remet chaque carte à son ancienne
 * place et on la laisse glisser vers la nouvelle. Résultat : on comprend le
 * tri au lieu de le subir.
 * racine : un sélecteur (la grille) · cle : l'attribut qui identifie
 * chaque élément (data-id) · action : ce qui change l'ordre. */
function flip(racine, cle, action) {
  const avant = new Map();
  const lire = () => $$(`${racine} [${cle}]`);
  lire().forEach((el) => avant.set(el.getAttribute(cle), el.getBoundingClientRect()));
  action();
  if (MOINS_ANIM || !avant.size) return;
  requestAnimationFrame(() => {
    lire().forEach((el) => {
      const a = avant.get(el.getAttribute(cle));
      if (!a) return;                       // il n'était pas là : il surgit normalement
      const b = el.getBoundingClientRect();
      if (!b.width) return;
      const dx = a.left - b.left, dy = a.top - b.top, k = a.width / b.width;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(k - 1) < 0.01) return;
      el.style.animation = "none";
      el.style.transformOrigin = "0 0";
      el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${k.toFixed(3)})`;
      el.style.zIndex = "2";
      requestAnimationFrame(() => {
        el.style.transition = "transform .54s cubic-bezier(.22,.92,.26,1)";
        el.style.transform = "";
        setTimeout(() => { el.style.cssText = el.style.cssText.replace(/(transition|transform|transform-origin|animation|z-index)[^;]*;?/g, ""); }, 580);
      });
    });
  });
}

/* ───────── La page qui se tourne : on change de carnet.
 * Une feuille passe par-dessus l'écran et le contenu change pendant qu'elle
 * passe — on ne voit jamais la coupure. */
function tournerPage(sens, apres) {
  if (MOINS_ANIM) { apres(); return; }
  const v = document.createElement("div");
  v.className = "page-tourne" + (sens < 0 ? " vers-gauche" : "");
  v.innerHTML = "<i></i>";
  document.body.appendChild(v);
  vibrer([8, 30, 6]);
  setTimeout(apres, 300);
  setTimeout(() => v.remove(), 680);
}

/* ───────── La pluie d'étoiles : on vient d'ouvrir quelque chose de rare. */
function pluieEtoiles(el, n = 18) {
  if (!el || MOINS_ANIM) return;
  const boite = document.createElement("div");
  boite.className = "pluie";
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 60 + Math.random() * 170;
    boite.innerHTML += `<svg viewBox="0 0 24 24" style="--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d - 40).toFixed(0)}px;
      --r:${(Math.random() * 540 - 270).toFixed(0)}deg;--t:${(0.9 + Math.random() * 0.7).toFixed(2)}s;--d:${(Math.random() * 0.35).toFixed(2)}s;
      width:${(7 + Math.random() * 13).toFixed(0)}px"><path d="${ETOILE_D}"/></svg>`;
  }
  el.appendChild(boite);
  setTimeout(() => boite.remove(), 2000);
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

/* ───────── Le chargement d'une affiche : le papier se remplit du haut.
 * Une image qui arrive ne doit pas clignoter : elle s'imprime. On marque
 * toutes les affiches d'un écran au moment où il est posé, et chacune
 * s'anime quand elle est vraiment arrivée. Le scrapbook est mis de côté :
 * il se redessine à chaque sélection, l'animation y serait du bruit. */
const SEL_AFFICHES = ".carte-scrap img, .ligne-scrap img, .banniere-affiches img, .vignettes img, .scrap-img, .mini-affiche img, .echange-tel img";
function animerAffiches(racine) {
  if (MOINS_ANIM || !racine) return;
  $$(SEL_AFFICHES, racine).forEach((im) => {
    if (im.closest("#plan") || im.closest(".vitrine")) return;
    im.classList.add("affiche-papier");
    const prete = () => im.classList.add("prete");
    if (im.complete && im.naturalWidth) { requestAnimationFrame(prete); return; }
    im.addEventListener("load", prete, { once: true });
    im.addEventListener("error", prete, { once: true });
  });
}
