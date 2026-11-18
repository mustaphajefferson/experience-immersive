/* SCRAP — carte de Belleville (Leaflet, fond CARTO passé en gris).
 * Les tuiles CARTO demandent une clé : voir js/config.js.
 */
"use strict";

const RAYON_TERRE = 6371000;
function distanceEntre(a, b) {
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(b[0] - a[0]), dLng = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * RAYON_TERRE * Math.asin(Math.sqrt(h));
}
const distanceM = (c) => distanceEntre(D.position, [c.lat, c.lng]);
/* La vignette d'une affiche repérée : la même dans le bandeau de la carte et
 * dans la recherche, pour qu'on reconnaisse tout de suite de quoi on parle. */
const miniatureCible = (c) => {
  const col = collection(c.collection);
  return `<span class="mini-cible${c.fait ? " fait" : ""}">${icone(c.fait ? "valider" : col ? col.icone : "scan", 20)}</span>`;
};
const distanceTxt = (c) => { const m = distanceM(c); return m >= 1000 ? (m / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(m / 10) * 10 + " m"; };
const minutes = (c) => Math.max(1, Math.round(distanceM(c) / 80));

/* Vrai dès qu'un filtre s'écarte du réglage par défaut : le bouton passe en accent. */
const filtresPoses = () => {
  const f = ETAT.filtres, r = ETAT.reglages;
  return f.collection !== "toutes" || f.etat !== "tous" || r.rayon !== 500 || r.manquants !== true;
};

function ciblesVisibles() {
  const f = ETAT.filtres, r = ETAT.reglages;
  return D.cibles.filter((c) =>
    distanceM(c) <= r.rayon &&
    (f.collection === "toutes" || c.collection === f.collection) &&
    (f.etat !== "nouveaux" || c.nouveau) &&
    (!r.manquants || !complete(c.collection)));
}
/* Les affiches qu'il reste à capturer, les plus proches d'abord. */
const ciblesAFaire = () => ciblesVisibles().filter((c) => !c.fait);

function cibleCourante() {
  if (ETAT.ctx.cible === "lieu") return { id: "lieu", titre: D.lieu.nom, adresse: D.lieu.adresse, lat: D.lieu.lat, lng: D.lieu.lng, collection: "concerts", scans: 312 };
  return D.cibles.find((c) => c.id === ETAT.ctx.cible) || D.cibles[0];
}

/* ═════════ La boussole de capture
 *
 * Sur l'itinéraire, on range le téléphone et on suit la vibration : plus on
 * approche de l'affiche, plus elle bat vite. C'est le chaud-froid du jeu de
 * l'enfance, et c'est ce qui fait lever les yeux au lieu de fixer l'écran.
 *
 * Trois sources : la position (pour la distance), le cap du téléphone (pour
 * la flèche) et le temps (pour la cadence). Si le téléphone ne bouge pas —
 * un test assis, une démo devant un jury — la distance se rapproche toute
 * seule à vitesse de marche, pour que l'effet soit montrable.
 */
function relevement(de, vers) {
  const r = (d) => (d * Math.PI) / 180;
  const dLng = r(vers[1] - de[1]);
  const y = Math.sin(dLng) * Math.cos(r(vers[0]));
  const x = Math.cos(r(de[0])) * Math.sin(r(vers[0])) - Math.sin(r(de[0])) * Math.cos(r(vers[0])) * Math.cos(dLng);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

/* L'état de la chasse, selon la distance qui reste. */
function chaleur(m) {
  if (m <= 12) return { cle: "arrive", nom: "Tu y es", aide: "Lève les yeux : l'affiche est là.", periode: 0 };
  if (m <= 40) return { cle: "brule", nom: "Tu brûles", aide: "À quelques pas. Cherche sur les murs.", periode: 260 };
  if (m <= 120) return { cle: "chaud", nom: "Tu chauffes", aide: "C'est tout près, dans cette rue.", periode: 520 };
  if (m <= 300) return { cle: "tiede", nom: "Tu te rapproches", aide: "Continue, la vibration va s'accélérer.", periode: 900 };
  return { cle: "froid", nom: "C'est encore loin", aide: "Suis le trajet, le téléphone te dira quand.", periode: 1500 };
}

function boussoleHtml(c) {
  return `<div class="boussole" id="boussole">
    <div class="boussole-cadran" id="boussole-cadran">
      <i class="boussole-onde"></i>
      <svg class="boussole-fleche" id="boussole-fleche" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 7 L61 30 L50 24.5 L39 30 Z"/>
      </svg>
      <span class="boussole-dist"><b id="boussole-m">${Math.round(distanceM(c))}</b><span class="t-texte-meta"> m</span></span>
    </div>
    <div class="boussole-texte">
      <span class="t-texte-label" id="boussole-etat">${chaleur(distanceM(c)).nom}</span>
      <span class="t-texte-meta secondaire" id="boussole-aide">${chaleur(distanceM(c)).aide}</span>
      <span class="boussole-jauge" aria-hidden="true"><i id="boussole-jauge"></i></span>
    </div>
  </div>`;
}

function boussoleMonter(racine, c) {
  const cadran = $("#boussole-cadran", racine);
  if (!cadran || !c) return null;
  const fleche = $("#boussole-fleche", racine);
  const mTexte = $("#boussole-m", racine);
  const etat = $("#boussole-etat", racine);
  const aide = $("#boussole-aide", racine);
  const jauge = $("#boussole-jauge", racine);
  const boite = $("#boussole", racine);
  const cible = [c.lat, c.lng];
  const depart = distanceM(c);

  const E = {
    pos: D.position.slice(), dist: depart, cap: 0, capLisse: 0, vraiMouvement: false,
    vivant: true, anim: null, bat: null, veille: null, derniereChaleur: null,
  };

  /* ───────── Position */
  if (navigator.geolocation) {
    E.veille = navigator.geolocation.watchPosition((p) => {
      const n = [p.coords.latitude, p.coords.longitude];
      if (distanceEntre(n, E.pos) > 3) E.vraiMouvement = true;
      E.pos = n;
      E.dist = distanceEntre(n, cible);
    }, () => {}, { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 });
  }

  /* ───────── Cap du téléphone (la flèche) */
  const surCap = (e) => {
    const h = e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null
      ? e.webkitCompassHeading
      : e.absolute && e.alpha !== null ? 360 - e.alpha : null;
    if (h !== null) E.cap = h;
  };
  window.addEventListener("deviceorientationabsolute", surCap, true);
  window.addEventListener("deviceorientation", surCap, true);

  /* ───────── La marche simulée, pour pouvoir montrer l'effet assis */
  const t0 = performance.now();
  const simuler = () => {
    if (E.vraiMouvement || !(window.CONFIG && CONFIG.boussole && CONFIG.boussole.marcheSimulee)) return;
    const ecoule = (performance.now() - t0) / 1000;
    E.dist = Math.max(6, depart - ecoule * (CONFIG.boussole.vitesse || 1.25));
  };

  /* ───────── La cadence : un battement, une onde, une vibration */
  const battre = () => {
    if (!E.vivant) return;
    const ch = chaleur(E.dist);
    if (ch.periode === 0) {
      cadran.classList.add("arrive");
      E.bat = setTimeout(battre, 900);
      return;
    }
    cadran.classList.remove("arrive");
    cadran.classList.remove("bat");
    void cadran.offsetWidth;
    cadran.style.setProperty("--bat", ch.periode + "ms");
    cadran.classList.add("bat");
    vibrer(ch.cle === "brule" ? [18, 40, 18] : 14);
    E.bat = setTimeout(battre, ch.periode);
  };

  const boucle = () => {
    if (!E.vivant) return;
    simuler();
    const rel = relevement(E.pos, cible);
    // la flèche montre la direction de l'affiche par rapport à où on regarde
    let a = ((rel - E.cap) % 360 + 360) % 360;
    let d = a - E.capLisse;
    if (d > 180) d -= 360; else if (d < -180) d += 360;
    E.capLisse += d * 0.16;
    if (fleche) fleche.style.rotate = E.capLisse.toFixed(1) + "deg";
    const m = Math.max(0, Math.round(E.dist));
    if (mTexte && mTexte.textContent !== String(m)) mTexte.textContent = m;
    if (jauge) jauge.style.width = clamp(1 - E.dist / Math.max(80, depart), 0, 1) * 100 + "%";
    const ch = chaleur(E.dist);
    if (ch.cle !== E.derniereChaleur) {
      E.derniereChaleur = ch.cle;
      if (etat) etat.textContent = ch.nom;
      if (aide) aide.textContent = ch.aide;
      if (boite) boite.className = "boussole chaleur-" + ch.cle;
    }
    E.anim = requestAnimationFrame(boucle);
  };
  boucle();
  battre();

  return () => {
    E.vivant = false;
    cancelAnimationFrame(E.anim);
    clearTimeout(E.bat);
    if (E.veille !== null && navigator.geolocation) navigator.geolocation.clearWatch(E.veille);
    window.removeEventListener("deviceorientationabsolute", surCap, true);
    window.removeEventListener("deviceorientation", surCap, true);
  };
}

/* ───────── Le pin d'un scrap : une petite affiche plantée sur une pointe.
 * Tête carrée (rayon 0, comme tout le reste), icône de la collection dedans,
 * pointe en bas, pastille rouge si le scrap est nouveau. */
function pinHtml(c, o = {}) {
  const col = collection(c.collection);
  const classes = ["pin", o.choisi ? "choisi" : "", c.fait ? "fait" : "", c.nouveau && !c.fait ? "nouveau" : ""].filter(Boolean).join(" ");
  return `<span class="${classes}" style="--retard:${Math.min(o.index || 0, 44) * 26}ms">
    <span class="pin-tete">${icone(c.fait ? "valider" : col ? col.icone : "scan", 16)}</span>
    <i class="pin-pointe"></i>
    ${c.nouveau && !c.fait ? '<i class="pastille"></i>' : ""}
  </span>`;
}
const TAILLE_PIN = [28, 38];
const TAILLE_PIN_CHOISI = [36, 48];

/* ───────── Fond de carte : on essaie les styles de config.js l'un après l'autre */
function coucheTuiles(carte) {
  const fonds = (window.CONFIG && CONFIG.fondsCarte) || [];
  const cle = (window.CONFIG && CONFIG.cartoCle) || "";
  let rang = 0, couche = null, erreurs = 0;

  const poser = () => {
    const f = fonds[rang];
    if (!f) return;
    couche = L.tileLayer(f.url.replace("{cle}", cle), {
      maxZoom: 19,
      detectRetina: !f.sansRetine,
      crossOrigin: true,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' + (f.nom.startsWith("CARTO") ? ' © <a href="https://carto.com/attributions">CARTO</a>' : ""),
    });
    erreurs = 0;
    couche.on("tileerror", () => {
      // Quelques tuiles manquantes arrivent partout ; on ne bascule qu'en cas de refus net.
      if (++erreurs < 4 || rang >= fonds.length - 1) return;
      console.warn(`SCRAP : fond « ${f.nom} » refusé, bascule sur « ${fonds[rang + 1].nom} ».`);
      carte.removeLayer(couche);
      rang++;
      poser();
    });
    couche.addTo(carte);
  };
  poser();
}

function carteMonter(el, o = {}) {
  if (!window.L) { el.innerHTML = carteDessinee(); return null; }
  const carte = L.map(el, {
    zoomControl: false, attributionControl: true,
    dragging: !o.statique, touchZoom: !o.statique, scrollWheelZoom: !o.statique, doubleClickZoom: !o.statique,
    zoomSnap: 0.25, fadeAnimation: true,
  }).setView(o.cible ? [o.cible.lat, o.cible.lng] : D.centre, o.cible ? 17 : 16);
  coucheTuiles(carte);

  const divIcone = (html, w, h) => L.divIcon({ className: "", html, iconSize: [w, h], iconAnchor: [w / 2, h] });

  /* Rayon de recherche : un cercle discret autour de soi */
  if (o.marqueurs && !o.cible) {
    L.circle(D.position, {
      radius: ETAT.reglages.rayon, interactive: false,
      color: "#111111", weight: 1, opacity: .35, dashArray: "4 6", fill: true, fillColor: "#111111", fillOpacity: .03,
    }).addTo(carte);
  }

  L.marker(D.position, { icon: divIcone('<span class="ma-position"><i></i></span>', 18, 18), interactive: false, keyboard: false, zIndexOffset: 400 }).addTo(carte);

  if (o.marqueurs) {
    /* L'arrivée sur la carte : les pins tombent du plus proche au plus
     * lointain. Le quartier se dessine autour de soi, au lieu que tout
     * apparaisse d'un bloc — et on regarde d'abord ce qui est à portée. */
    const liste = ciblesVisibles();
    const rang = new Map(liste.slice()
      .sort((a, b) => distanceEntre(D.position, [a.lat, a.lng]) - distanceEntre(D.position, [b.lat, b.lng]))
      .map((c, i) => [c.id, i]));
    liste.forEach((c) => {
      L.marker([c.lat, c.lng], { icon: divIcone(pinHtml(c, { index: rang.get(c.id) || 0 }), ...TAILLE_PIN), keyboard: false, riseOnHover: true })
        .on("click", () => { if (!o.statique) { vibrer(8); ETAT.ctx.cible = c.id; aller("16"); } })
        .addTo(carte);
    });
  }
  if (o.cible) {
    L.marker([o.cible.lat, o.cible.lng], { icon: divIcone(pinHtml(o.cible, { choisi: true }), ...TAILLE_PIN_CHOISI), interactive: false, zIndexOffset: 300 }).addTo(carte);
  }
  if (o.itineraire && o.cible) {
    const coude = [D.position[0], o.cible.lng];
    const points = [D.position, coude, [o.cible.lat, o.cible.lng]];
    L.polyline(points, { color: "#FFFFFF", weight: 9, lineCap: "square", lineJoin: "miter", opacity: .9, interactive: false }).addTo(carte);
    const trace = L.polyline(points, { color: "#111111", weight: 3, lineCap: "square", lineJoin: "miter", dashArray: "1 7", interactive: false }).addTo(carte);
    carte.fitBounds(trace.getBounds(), { paddingTopLeft: [40, 170], paddingBottomRight: [40, 230] });
  }
  setTimeout(() => {
    carte.invalidateSize();
    if (o.decalage) carte.panBy([0, el.clientHeight * o.decalage], { animate: false });
  }, 60);
  return () => carte.remove();
}

/* Si Leaflet n'est pas chargé : une carte dessinée (même logique que les maquettes) */
function carteDessinee() {
  const rues = [[0, 20, 100, 1.4, 0], [0, 52, 100, 2, 0], [26, 0, 2.4, 100, 0], [68, 0, 3, 100, 0], [-10, 34, 120, 1.2, -16], [-10, 70, 120, 1.2, 18]];
  return `<div style="position:absolute;inset:0;background:var(--fond-secondaire);overflow:hidden">
    ${rues.map(([l, t, w, h, r]) => `<i style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;background:#fff;transform:rotate(${r}deg)"></i>`).join("")}
    ${ciblesVisibles().map((c, i) => `<span data-action="ouvrirCible" data-id="${c.id}" style="position:absolute;left:${12 + ((i * 37) % 76)}%;top:${16 + ((i * 23) % 60)}%">${pinHtml(c, { index: i })}</span>`).join("")}
    <span class="ma-position" style="position:absolute;left:52%;top:46%"><i></i></span></div>`;
}
