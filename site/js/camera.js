/* SCRAP — vraie caméra : flux arrière, capture recadrée sur le viseur, ou photo de la galerie. */
"use strict";

let FLUX = null;

function cameraDemarrer(video) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    $("#consigne").textContent = "Caméra indisponible ici : choisis une photo de l'affiche avec le bouton à gauche.";
    return null;
  }
  let arrete = false;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
    .then((flux) => {
      if (arrete) { flux.getTracks().forEach((t) => t.stop()); return; }
      FLUX = flux;
      video.srcObject = flux;
      video.play().catch(() => {});
    })
    .catch(() => { if (!arrete) aller("49", { remplace: true }); });
  return () => { arrete = true; cameraArreter(); };
}
function cameraArreter() {
  if (FLUX) FLUX.getTracks().forEach((t) => t.stop());
  FLUX = null;
}

function cameraCapturer() {
  const video = $("#video"), viseur = $("#viseur");
  if (!video || !video.videoWidth) { toast("La caméra se lance… réessaie dans une seconde."); return; }
  const vw = video.videoWidth, vh = video.videoHeight;
  const e = video.getBoundingClientRect(), v = viseur.getBoundingClientRect();
  const k = Math.max(e.width / vw, e.height / vh);         // object-fit: cover
  const ox = (e.width - vw * k) / 2, oy = (e.height - vh * k) / 2;
  let sx = (v.left - e.left - ox) / k, sy = (v.top - e.top - oy) / k;
  let sw = v.width / k, sh = v.height / k;
  sx = clamp(sx, 0, vw); sy = clamp(sy, 0, vh); sw = Math.min(sw, vw - sx); sh = Math.min(sh, vh - sy);
  const largeur = Math.min(900, Math.round(sw));
  const c = document.createElement("canvas");
  c.width = largeur; c.height = Math.round((largeur * sh) / sw);
  c.getContext("2d").drawImage(video, sx, sy, sw, sh, 0, 0, c.width, c.height);
  const flash = document.createElement("div");
  flash.className = "flash";
  document.querySelector(".ecran").appendChild(flash);
  if (navigator.vibrate) navigator.vibrate(30);
  const img = c.toDataURL("image/jpeg", 0.82);
  setTimeout(() => nouvelleCapture(img, c.width / c.height), 260);
}

function photoFichier(fichier) {
  if (!fichier) return;
  const lecteur = new FileReader();
  lecteur.onload = () => {
    const im = new Image();
    im.onload = () => {
      const largeur = Math.min(900, im.width);
      const c = document.createElement("canvas");
      c.width = largeur; c.height = Math.round((largeur * im.height) / im.width);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      nouvelleCapture(c.toDataURL("image/jpeg", 0.82), c.width / c.height);
    };
    im.src = lecteur.result;
  };
  lecteur.readAsDataURL(fichier);
}

function nouvelleCapture(img, ratio) {
  const ouverte = D.collections.find((c) => !complete(c.id));
  const num = 4 + Math.floor(Math.random() * 120);
  ETAT.ctx.capture = { img, ratio, num, titre: "", lieu: "Rue de Belleville", collection: ouverte ? ouverte.id : "concerts", themes: [], holo: Math.random() < 0.3, tagsPerso: [] };
  aller("19.1");
}

function validerCapture() {
  const p = ETAT.ctx.capture;
  if (!p) return;
  lireCapture();
  const { date, heure } = aujourdhui();
  const id = "cap-" + Date.now();
  ETAT.scraps[id] = {
    titre: p.titre.trim() || "Affiche sans titre", artiste: "—", ratio: p.ratio, num: p.num,
    lieu: p.lieu.trim() || "Belleville", arr: ETAT.utilisateur.arrondissement, date, heure,
    collection: p.collection, themes: p.themes.length ? p.themes : ["Affiche"], holo: p.holo,
    scans: p.num, murs: 0, img: p.img, capture: true,
  };
  ETAT.captures.push(id);
  ETAT.ctx.capture = null;
  ETAT.ctx.scrap = id;
  ETAT.ctx.frais = id;
  sauver();
  aller("21", { remplace: true });
}
function lireCapture() {
  const p = ETAT.ctx.capture; if (!p) return;
  const t = $("#titre-capture"), l = $("#lieu-capture");
  if (t) p.titre = t.value;
  if (l) p.lieu = l.value;
}
