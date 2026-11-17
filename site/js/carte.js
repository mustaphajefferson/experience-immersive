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
const distanceTxt = (c) => { const m = distanceM(c); return m >= 1000 ? (m / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(m / 10) * 10 + " m"; };
const minutes = (c) => Math.max(1, Math.round(distanceM(c) / 80));

function ciblesVisibles() {
  const f = ETAT.filtres, r = ETAT.reglages;
  return D.cibles.filter((c) =>
    distanceM(c) <= r.rayon &&
    (f.collection === "toutes" || c.collection === f.collection) &&
    (f.etat !== "nouveaux" || c.nouveau) &&
    (!r.manquants || !complete(c.collection)));
}
function cibleCourante() {
  if (ETAT.ctx.cible === "lieu") return { id: "lieu", titre: D.lieu.nom, adresse: D.lieu.adresse, lat: D.lieu.lat, lng: D.lieu.lng, collection: "concerts", scans: 312 };
  return D.cibles.find((c) => c.id === ETAT.ctx.cible) || D.cibles[0];
}

/* ───────── Le pin d'un scrap : une petite affiche plantée sur une pointe.
 * Tête carrée (rayon 0, comme tout le reste), icône de la collection dedans,
 * pointe en bas, pastille rouge si le scrap est nouveau. */
function pinHtml(c, o = {}) {
  const col = collection(c.collection);
  const classes = ["pin", o.choisi ? "choisi" : "", c.nouveau ? "nouveau" : ""].filter(Boolean).join(" ");
  return `<span class="${classes}" style="--retard:${(o.index || 0) * 60}ms">
    <span class="pin-tete">${icone(col ? col.icone : "scan", 16)}</span>
    <i class="pin-pointe"></i>
    ${c.nouveau ? '<i class="pastille"></i>' : ""}
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
    ciblesVisibles().forEach((c, i) => {
      L.marker([c.lat, c.lng], { icon: divIcone(pinHtml(c, { index: i }), ...TAILLE_PIN), keyboard: false, riseOnHover: true })
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
