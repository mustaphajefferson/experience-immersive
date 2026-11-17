/* SCRAP — « Sur un vrai mur » (écran 24.3).
 *
 * De la réalité augmentée légère, qui marche partout : on affiche le flux de
 * la caméra, et on pose le scrapbook par-dessus, incliné selon le gyroscope.
 * Le mur est donc « suivi » par l'orientation du téléphone, pas par une
 * reconnaissance d'image — c'est ce que permet un navigateur aujourd'hui sans
 * application native (WebXR n'existe pas sur Safari iOS).
 *
 * On peut déplacer la page au doigt, la pincer pour l'agrandir, et prendre
 * une photo du résultat : la photo est composée dans un canvas, donc elle se
 * partage comme n'importe quelle image.
 */
"use strict";

let FLUX_REEL = null;

function reelMonter(racine) {
  const video = $("#video-reel", racine);
  const scene = $("#scene-reel", racine);
  const page = $("#page-reel", racine);
  if (!video || !page) return null;

  /* la page du scrapbook, dessinée comme sur l'écran 24 */
  const m = ETAT.mur;
  const bas = m.items.reduce((h, it) => { const s = scrap(it.id); return Math.max(h, it.y + (s ? it.w / s.ratio : it.w)); }, 320) + 20;
  page.style.width = LARGEUR_MUR + "px";
  page.style.height = bas + "px";
  page.className = "page-reel fond-" + m.fond;
  page.style.cssText += ";" + styleFond(m);
  page.innerHTML = (m.notes || []).filter((n) => !n.devant).map((n) => noteHtml(n, false)).join("")
    + m.items.map((it) => itemHtml(it, false)).join("")
    + (m.notes || []).filter((n) => n.devant).map((n) => noteHtml(n, false)).join("");

  const pose = ETAT.ctx.reel || (ETAT.ctx.reel = { k: 0.5, x: 0, y: 0 });
  const appliquer = () => {
    page.style.transform = `translate(-50%, -50%) translate(${pose.x}px, ${pose.y}px) scale(${pose.k})`;
  };
  appliquer();

  /* caméra */
  let arrete = false;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } }, audio: false })
      .then((f) => {
        if (arrete) { f.getTracks().forEach((t) => t.stop()); return; }
        FLUX_REEL = f; video.srcObject = f; video.play().catch(() => {});
      })
      .catch(() => { const c = $("#consigne-reel", racine); if (c) c.textContent = "Caméra indisponible : tu peux quand même déplacer la page."; });
  }

  /* gestes : un doigt déplace, deux doigts agrandissent */
  const doigts = new Map();
  let g = null, pince = null;
  const debut = (e) => {
    if (e.target.closest("button,label")) return;
    doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    scene.setPointerCapture && scene.setPointerCapture(e.pointerId);
    if (doigts.size === 2) {
      const [a, b] = [...doigts.values()];
      pince = { d0: Math.hypot(a.x - b.x, a.y - b.y), k0: pose.k };
      g = null; return;
    }
    g = { x0: e.clientX, y0: e.clientY, px: pose.x, py: pose.y };
  };
  const bouge = (e) => {
    if (doigts.has(e.pointerId)) doigts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pince && doigts.size >= 2) {
      const [a, b] = [...doigts.values()];
      pose.k = clamp((pince.k0 * Math.hypot(a.x - b.x, a.y - b.y)) / pince.d0, 0.25, 2.4);
      appliquer(); return;
    }
    if (!g) return;
    pose.x = g.px + (e.clientX - g.x0);
    pose.y = g.py + (e.clientY - g.y0);
    appliquer();
  };
  const fin = (e) => { doigts.delete(e.pointerId); if (doigts.size < 2) pince = null; if (!doigts.size) g = null; };
  scene.addEventListener("pointerdown", debut);
  scene.addEventListener("pointermove", bouge);
  scene.addEventListener("pointerup", fin);
  scene.addEventListener("pointercancel", fin);

  return () => {
    arrete = true;
    if (FLUX_REEL) FLUX_REEL.getTracks().forEach((t) => t.stop());
    FLUX_REEL = null;
  };
}

/* Photo du mur : flux de la caméra + scrapbook posé dessus, avec l'inclinaison
 * du moment reproduite en biais (un canvas ne sait pas faire de vraie
 * perspective, mais le biais suffit à donner le mur de travers). */
function photoReel() {
  const video = $("#video-reel");
  const page = $("#page-reel");
  if (!video || !page) return Promise.reject();
  const L = 1080;
  const vw = video.videoWidth || 1280, vh = video.videoHeight || 720;
  const r = video.getBoundingClientRect();
  const H = Math.round((L * r.height) / r.width);

  const c = document.createElement("canvas");
  c.width = L; c.height = H;
  const x = c.getContext("2d");

  // le fond : la partie du flux réellement visible
  const k = Math.max(r.width / vw, r.height / vh);
  const sw = Math.min(vw, r.width / k), sh = Math.min(vh, r.height / k);
  if (video.videoWidth) x.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, L, H);
  else { x.fillStyle = "#1C1C1B"; x.fillRect(0, 0, L, H); }

  const pose = ETAT.ctx.reel || { k: 0.5, x: 0, y: 0 };
  const px = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--px")) || 0;
  const py = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--py")) || 0;
  const e = L / r.width;   // de l'écran vers la photo

  return dessinerMurCanvas({ largeur: 900, marge: 10, pied: false }).then((mur) => {
    const w = mur.width * (pose.k * e) * (r.width / (LARGEUR_MUR + 20)) / (900 / (LARGEUR_MUR + 20));
    const h = (mur.height / mur.width) * w;
    x.save();
    x.translate(L / 2 + pose.x * e, H / 2 + pose.y * e);
    // biais : le mur n'est jamais tout à fait de face
    x.transform(1, py * 0.18, -px * 0.18, 1, 0, 0);
    x.globalAlpha = 0.97;
    x.drawImage(mur, -w / 2, -h / 2, w, h);
    x.restore();
    return c;
  });
}
