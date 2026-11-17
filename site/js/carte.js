/* SCRAP — carte de Belleville (Leaflet, fond OpenStreetMap / CARTO passé en gris). */
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

function carteMonter(el, o = {}) {
  if (!window.L) { el.innerHTML = carteDessinee(); return null; }
  const carte = L.map(el, {
    zoomControl: false, attributionControl: true,
    dragging: !o.statique, touchZoom: !o.statique, scrollWheelZoom: !o.statique, doubleClickZoom: !o.statique,
    zoomSnap: 0.25,
  }).setView(o.cible ? [o.cible.lat, o.cible.lng] : D.centre, o.cible ? 17 : 16);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd", maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(carte);

  const icone = (html, w, h) => L.divIcon({ className: "", html, iconSize: [w, h], iconAnchor: [w / 2, h] });
  L.marker(D.position, { icon: icone('<span class="ma-position"></span>', 16, 16), interactive: false, keyboard: false }).addTo(carte);

  if (o.marqueurs) {
    ciblesVisibles().forEach((c) => {
      L.marker([c.lat, c.lng], { icon: icone(`<span class="marqueur">${c.nouveau ? '<i class="pastille"></i>' : ""}</span>`, 14, 20), keyboard: false })
        .on("click", () => { if (!o.statique) { ETAT.ctx.cible = c.id; aller("16"); } })
        .addTo(carte);
    });
  }
  if (o.cible) {
    L.marker([o.cible.lat, o.cible.lng], { icon: icone('<span class="marqueur choisi"></span>', 20, 28), interactive: false }).addTo(carte);
  }
  if (o.itineraire && o.cible) {
    const coude = [D.position[0], o.cible.lng];
    const trace = L.polyline([D.position, coude, [o.cible.lat, o.cible.lng]], { color: "#111111", weight: 4, lineCap: "square", lineJoin: "miter" }).addTo(carte);
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
    ${ciblesVisibles().map((c, i) => `<span class="marqueur" data-action="ouvrirCible" data-id="${c.id}" style="position:absolute;left:${12 + ((i * 37) % 76)}%;top:${16 + ((i * 23) % 60)}%">${c.nouveau ? '<i class="pastille"></i>' : ""}</span>`).join("")}
    <span class="ma-position" style="position:absolute;left:52%;top:46%"></span></div>`;
}
