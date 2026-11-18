/* SCRAP — le scanner.
 *
 * Comme dans Notes : la caméra cherche les contours de l'affiche en direct,
 * dessine le cadre dessus, et dès que le cadre reste immobile une seconde,
 * la photo se prend toute seule. L'image est ensuite redressée (la
 * perspective est corrigée) pour que l'affiche soit bien droite.
 *
 * Comment la détection marche, en trois temps :
 *   1. on réduit l'image à 160 px de large et on calcule les contrastes
 *      (Sobel : à quel point chaque pixel diffère de ses voisins) ;
 *   2. on cherche les quatre bords de l'affiche — la colonne la plus
 *      contrastée à gauche, à droite, la ligne la plus contrastée en haut,
 *      en bas ;
 *   3. on affine chaque bord en suivant le contraste point par point, puis
 *      on croise les quatre droites : ça donne les quatre coins, même si
 *      l'affiche est vue de travers.
 */
"use strict";

let FLUX = null;
let SCAN = null;                 // boucle d'analyse en cours
let TORCHE = false;              // état de la lampe (elle s'éteint avec le flux)

/* ═════════ Caméra */

function cameraDemarrer(video) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const c = $("#consigne");
    if (c) c.textContent = "Caméra indisponible ici : choisis une photo de l'affiche avec le bouton à gauche.";
    return null;
  }
  let arrete = false;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
    .then((flux) => {
      if (arrete) { flux.getTracks().forEach((t) => t.stop()); return; }
      FLUX = flux;
      video.srcObject = flux;
      majBoutonTorche();
      video.play().then(() => detectionDemarrer(video)).catch(() => {});
    })
    .catch(() => { if (!arrete) aller("49", { remplace: true }); });
  return () => { arrete = true; cameraArreter(); };
}

function cameraArreter() {
  detectionArreter();
  if (FLUX) FLUX.getTracks().forEach((t) => t.stop());
  FLUX = null;
  TORCHE = false;
}

/* ═════════ La lampe (torche)
 *
 * Une affiche collée le soir est presque toujours dans le noir : sans lampe,
 * la photo sort grise et la détection des contours ne trouve rien. Tous les
 * téléphones ne l'exposent pas au navigateur (Safari iOS ne le fait pas
 * encore) : quand ce n'est pas possible, le bouton le dit au lieu de faire
 * semblant. */
function torcheDisponible() {
  if (!FLUX) return false;
  const p = FLUX.getVideoTracks()[0];
  if (!p || !p.getCapabilities) return false;
  try { return !!p.getCapabilities().torch; } catch (e) { return false; }
}

function basculerTorche() {
  const p = FLUX && FLUX.getVideoTracks()[0];
  if (!p || !torcheDisponible()) {
    toast("Ce téléphone ne donne pas la lampe au navigateur. Éclaire l'affiche autrement.");
    return;
  }
  TORCHE = !TORCHE;
  p.applyConstraints({ advanced: [{ torch: TORCHE }] })
    .then(() => { majBoutonTorche(); vibrer(8); })
    .catch(() => { TORCHE = false; majBoutonTorche(); toast("La lampe n'a pas voulu s'allumer."); });
}

function majBoutonTorche() {
  const b = $("#torche");
  if (!b) return;
  const ok = torcheDisponible();
  b.classList.toggle("on", TORCHE);
  b.classList.toggle("indispo", !ok);
  b.setAttribute("aria-pressed", String(TORCHE));
}

/* ═════════ Détection des contours en direct */

function detectionArreter() { if (SCAN) { SCAN.vivant = false; SCAN = null; } }

function detectionDemarrer(video) {
  detectionArreter();
  const cadre = $("#cadre-scan"), etat = $("#etat-scan"), jauge = $("#jauge-scan");
  if (!cadre) return;

  const analyse = document.createElement("canvas");
  const ctx = analyse.getContext("2d", { willReadFrequently: true });
  const s = { vivant: true, quad: null, lisse: null, stableDepuis: 0, pris: false };
  SCAN = s;

  const periode = 1000 / ((window.CONFIG && CONFIG.scan.analysesParSec) || 12);
  let dernier = 0;

  const boucle = (t) => {
    if (!s.vivant) return;
    requestAnimationFrame(boucle);
    if (t - dernier < periode || !video.videoWidth || s.pris) return;
    dernier = t;

    const vue = zoneVisible(video);
    if (!vue) return;
    const L = 160, H = Math.round((L * vue.sh) / vue.sw);
    if (analyse.width !== L) { analyse.width = L; analyse.height = H; }
    ctx.drawImage(video, vue.sx, vue.sy, vue.sw, vue.sh, 0, 0, L, H);

    const quad = chercherQuadrilatere(ctx.getImageData(0, 0, L, H), L, H);

    if (!quad) {
      s.quad = null; s.stableDepuis = 0;
      s.lisse = null;
      cadre.classList.remove("trouve", "verrouille");
      if (etat) etat.textContent = "Cherche une affiche…";
      if (jauge) jauge.style.setProperty("--p", 0);
      dessinerQuad(cadre, null);
      return;
    }

    // lissage : le cadre suit l'affiche sans trembler
    s.lisse = s.lisse ? s.lisse.map((p, i) => [p[0] + (quad[i][0] - p[0]) * 0.35, p[1] + (quad[i][1] - p[1]) * 0.35]) : quad;
    dessinerQuad(cadre, s.lisse);
    cadre.classList.add("trouve");

    const bouge = s.quad ? Math.max(...quad.map((p, i) => Math.hypot(p[0] - s.quad[i][0], p[1] - s.quad[i][1]))) : 1;
    s.quad = quad;

    const auto = ETAT.reglages.scanAuto !== false && (window.CONFIG ? CONFIG.scan.auto : true);
    if (bouge < 0.022) {
      if (!s.stableDepuis) s.stableDepuis = t;
      const duree = (window.CONFIG && CONFIG.scan.stabiliteMs) || 900;
      const p = clamp((t - s.stableDepuis) / duree, 0, 1);
      if (jauge) jauge.style.setProperty("--p", p.toFixed(3));
      if (etat) etat.textContent = auto ? "Affiche repérée · ne bouge plus" : "Affiche repérée · appuie pour capturer";
      if (p >= 1 && auto) { cadre.classList.add("verrouille"); s.pris = true; capturerQuad(video, s.lisse); }
    } else {
      s.stableDepuis = 0;
      if (jauge) jauge.style.setProperty("--p", 0);
      if (etat) etat.textContent = "Affiche repérée · stabilise le téléphone";
    }
  };
  requestAnimationFrame(boucle);
}

/* Partie du flux réellement visible à l'écran (la vidéo est en object-fit: cover) */
function zoneVisible(video) {
  const r = video.getBoundingClientRect();
  const vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !r.width) return null;
  const k = Math.max(r.width / vw, r.height / vh);
  const sw = Math.min(vw, r.width / k), sh = Math.min(vh, r.height / k);
  return { sx: (vw - sw) / 2, sy: (vh - sh) / 2, sw, sh, k, rect: r };
}

/* ───────── Le cœur : trouver le quadrilatère de l'affiche.
 * Renvoie 4 coins normalisés (0 à 1) dans l'ordre : haut-gauche, haut-droit,
 * bas-droit, bas-gauche. Ou null si rien de net. */
function chercherQuadrilatere(image, L, H) {
  const d = image.data;

  /* Contrastes en couleur, pas seulement en luminosité : une affiche rouge
   * sur un mur gris a presque la même luminosité que le mur, mais pas du
   * tout la même couleur. On additionne donc les écarts des trois canaux. */
  const gx = new Float32Array(L * H), gy = new Float32Array(L * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < L - 1; x++) {
      const i = y * L + x, p = i * 4;
      let sx = 0, sy = 0;
      for (let c = 0; c < 3; c++) {
        const a = d[p - (L + 1) * 4 + c], b = d[p - L * 4 + c], e = d[p - (L - 1) * 4 + c];
        const f = d[p - 4 + c], g = d[p + 4 + c];
        const h = d[p + (L - 1) * 4 + c], j = d[p + L * 4 + c], k = d[p + (L + 1) * 4 + c];
        sx += Math.abs(a + 2 * f + h - e - 2 * g - k);
        sy += Math.abs(a + 2 * b + e - h - 2 * j - k);
      }
      gx[i] = sx; gy[i] = sy;
    }
  }

  /* Un bord d'affiche, c'est un trait long et continu. Un titre à l'intérieur
   * de l'affiche, c'est beaucoup de contraste mais sur peu de hauteur. On
   * compte donc, pour chaque colonne, le nombre de lignes où ça contraste
   * franchement : le vrai bord gagne largement. */
  let somme = 0, n = 0;
  for (let y = 2; y < H - 2; y++) for (let x = 2; x < L - 2; x++) { somme += gx[y * L + x]; n++; }
  const seuil = Math.max(60, (somme / Math.max(1, n)) * 2.4);

  const colC = new Float32Array(L), ligC = new Float32Array(H);
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < L - 2; x++) {
      const i = y * L + x;
      if (gx[i] > seuil) colC[x]++;
      if (gy[i] > seuil) ligC[y]++;
    }
  }
  /* Une affiche est rarement bien droite dans le cadre. On cherche donc le
   * bord non pas colonne par colonne, mais le long de droites légèrement
   * penchées : pour chaque pente essayée, celle qui traverse le plus de
   * pixels contrastés gagne. (Transformée de Hough, version économe.) */
  const PENTES = [-0.3, -0.22, -0.15, -0.09, -0.04, 0, 0.04, 0.09, 0.15, 0.22, 0.3];
  const droiteForte = (g, grand, petit, deb, fin, vertical, versDebut) => {
    const scores = [];
    const cnt = new Float32Array(grand);
    let meilleurScore = 0;
    for (const a of PENTES) {
      cnt.fill(0);
      for (let u = 2; u < petit - 2; u += 2) {
        const dec = a * (u - petit / 2);
        for (let v = deb; v < fin; v++) {
          const vv = Math.round(v + dec);
          if (vv < 1 || vv > grand - 2) continue;
          if ((vertical ? g[u * grand + vv] : g[vv * petit + u]) > seuil) cnt[v]++;
        }
      }
      for (let v = deb + 1; v < fin - 1; v++) {
        const s = ((cnt[v - 1] + 2 * cnt[v] + cnt[v + 1]) / 4) * 2;   // ×2 : une ligne sur deux a été lue
        scores.push({ a, mid: v, score: s });
        if (s > meilleurScore) meilleurScore = s;
      }
    }
    if (!meilleurScore) return null;
    /* Le bord de l'affiche est le trait le plus EXTÉRIEUR parmi les traits
     * nets — sinon on attrape un gros titre au milieu de l'affiche, qui
     * contraste autant que le bord. */
    const retenus = scores.filter((c) => c.score >= meilleurScore * 0.72);
    retenus.sort((x, y) => (versDebut ? x.mid - y.mid : y.mid - x.mid) || y.score - x.score);
    const choisi = retenus[0];
    // à position égale, on garde la pente la mieux notée
    const memeBord = retenus.filter((c) => Math.abs(c.mid - choisi.mid) <= 2).sort((x, y) => y.score - x.score)[0];
    return memeBord || choisi;
  };
  // bords verticaux : on parcourt les lignes (u = y), on cherche la colonne (v = x)
  const bg = droiteForte(gx, L, H, 3, Math.round(L * 0.45), true, true);
  const bd = droiteForte(gx, L, H, Math.round(L * 0.55), L - 3, true, false);
  // bords horizontaux : on parcourt les colonnes (u = x), on cherche la ligne (v = y)
  const bh = droiteForte(gy, H, L, 3, Math.round(H * 0.45), false, true);
  const bb = droiteForte(gy, H, L, Math.round(H * 0.55), H - 3, false, false);
  if (!bg || !bd || !bh || !bb) return null;

  const xg = bg.mid, xd = bd.mid, yh = bh.mid, yb = bb.mid;
  const l = (xd - xg) / L, ht = (yb - yh) / H;
  if (l < 0.3 || ht < 0.3) return null;
  if (l * ht < ((window.CONFIG && CONFIG.scan.surfaceMin) || 0.1)) return null;

  // chaque bord doit courir le long de l'affiche, pas sur trois pixels
  if (bg.score < (yb - yh) * 0.4 || bd.score < (yb - yh) * 0.4) return null;
  if (bh.score < (xd - xg) * 0.4 || bb.score < (xd - xg) * 0.4) return null;

  // affiner : suivre chaque bord point par point autour de la droite trouvée
  const fen = Math.max(3, Math.round(L * 0.045));
  const droiteV = (b) => {
    const pts = [];
    for (let y = yh + 3; y < yb - 3; y += 2) {
      const x0 = Math.round(b.mid + b.a * (y - H / 2));
      let m = -1, meilleur = x0;
      for (let x = Math.max(1, x0 - fen); x <= Math.min(L - 2, x0 + fen); x++) { const v = gx[y * L + x]; if (v > m) { m = v; meilleur = x; } }
      if (m > seuil * 0.5) pts.push([y, meilleur, m]);
    }
    return ajuster(pts, b.mid) || { a: b.a, b: b.mid - b.a * (H / 2) };
  };
  const droiteH = (b) => {
    const pts = [];
    for (let x = xg + 3; x < xd - 3; x += 2) {
      const y0 = Math.round(b.mid + b.a * (x - L / 2));
      let m = -1, meilleur = y0;
      for (let y = Math.max(1, y0 - fen); y <= Math.min(H - 2, y0 + fen); y++) { const v = gy[y * L + x]; if (v > m) { m = v; meilleur = y; } }
      if (m > seuil * 0.5) pts.push([x, meilleur, m]);
    }
    return ajuster(pts, b.mid) || { a: b.a, b: b.mid - b.a * (L / 2) };
  };

  const dg = droiteV(bg), dd = droiteV(bd), dh = droiteH(bh), db = droiteH(bb);
  if (!dg || !dd || !dh || !db) return null;

  // croisement d'une droite « x = a·y + b » et d'une droite « y = c·x + d »
  const croix = (v, h) => {
    const den = 1 - v.a * h.a;
    if (Math.abs(den) < 1e-6) return null;
    const x = (v.a * h.b + v.b) / den;
    return [x, h.a * x + h.b];
  };
  const coins = [croix(dg, dh), croix(dd, dh), croix(dd, db), croix(dg, db)];
  if (coins.some((c) => !c)) return null;

  const norm = coins.map(([x, y]) => [clamp(x / L, -0.05, 1.05), clamp(y / H, -0.05, 1.05)]);
  // garde-fou : le quadrilatère doit rester convexe et pas trop écrasé
  if (aireQuad(norm) < 0.08) return null;
  return norm;
}

/* Ajustement d'une droite par moindres carrés, en jetant les points aberrants */
function ajuster(pts, defaut) {
  if (pts.length < 6) return null;
  let garde = pts;
  for (let tour = 0; tour < 2; tour++) {
    let su = 0, sv = 0, suv = 0, suu = 0, p = 0;
    for (const [u, v, w] of garde) { su += u * w; sv += v * w; suv += u * v * w; suu += u * u * w; p += w; }
    const den = p * suu - su * su;
    if (Math.abs(den) < 1e-6) return { a: 0, b: defaut };
    const a = (p * suv - su * sv) / den;
    const b = (sv - a * su) / p;
    if (tour === 1 || Math.abs(a) > 0.6) return { a: clamp(a, -0.6, 0.6), b };
    const ecarts = garde.map(([u, v]) => Math.abs(v - (a * u + b)));
    const seuil = [...ecarts].sort((x, y) => x - y)[Math.floor(ecarts.length * 0.7)] + 0.8;
    const reste = garde.filter((_, i) => ecarts[i] <= seuil);
    if (reste.length >= 6) garde = reste;
  }
  return null;
}

const aireQuad = (q) => Math.abs(q.reduce((s, [x, y], i) => { const [x2, y2] = q[(i + 1) % 4]; return s + x * y2 - x2 * y; }, 0)) / 2;

/* ───────── Dessin du cadre au-dessus de la caméra */
function dessinerQuad(svg, quad) {
  const r = svg.getBoundingClientRect();
  const H = r.width ? (100 * r.height) / r.width : 160;
  svg.setAttribute("viewBox", `0 0 100 ${H.toFixed(2)}`);

  const forme = svg.querySelector("polygon");
  const voile = svg.querySelector(".voile-scan");
  const coins = svg.querySelectorAll(".coin-scan");
  if (!quad) {
    forme.setAttribute("points", "");
    voile.setAttribute("d", "");
    coins.forEach((c) => c.setAttribute("opacity", 0));
    return;
  }
  const p = quad.map(([x, y]) => [x * 100, y * H]);
  forme.setAttribute("points", p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" "));
  // voile sombre percé du quadrilatère (règle pair-impair)
  voile.setAttribute("d", `M0 0H100V${H.toFixed(2)}H0Z M${p.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`);
  coins.forEach((c, i) => {
    c.setAttribute("opacity", 1);
    c.setAttribute("cx", p[i][0].toFixed(2));
    c.setAttribute("cy", p[i][1].toFixed(2));
  });
}

/* ═════════ Capture */

/* Capture déclenchée par le bouton : on prend le quadrilatère courant, ou le viseur */
function cameraCapturer() {
  const video = $("#video");
  if (!video || !video.videoWidth) { toast("La caméra se lance… réessaie dans une seconde."); return; }
  if (SCAN && SCAN.pris) return;
  if (SCAN) SCAN.pris = true;
  capturerQuad(video, SCAN && SCAN.lisse);
}

function capturerQuad(video, quad) {
  const vue = zoneVisible(video);
  if (!vue) return;

  const flash = document.createElement("div");
  flash.className = "flash";
  const ecran = document.querySelector(".ecran");
  if (ecran) ecran.appendChild(flash);
  vibrer([18, 40, 12]);

  // image source en pleine définition
  const src = document.createElement("canvas");
  src.width = Math.round(vue.sw); src.height = Math.round(vue.sh);
  src.getContext("2d").drawImage(video, vue.sx, vue.sy, vue.sw, vue.sh, 0, 0, src.width, src.height);

  // quadrilatère en pixels de l'image source ; sans détection, on prend un cadre centré
  const coins = (quad || [[0.14, 0.2], [0.86, 0.2], [0.86, 0.74], [0.14, 0.74]])
    .map(([x, y]) => [clamp(x, 0, 1) * src.width, clamp(y, 0, 1) * src.height]);

  let sortie;
  try { sortie = redresser(src, coins); }
  catch (e) { console.error(e); sortie = src; }

  const img = sortie.toDataURL("image/jpeg", 0.86);
  /* Est-ce une affiche qu'on connaît ? Le bouton de démonstration passe
   * devant le seuil — pendant une soutenance, on ne joue pas sa démo aux
   * dés — mais pas devant la mesure : c'est toujours l'affiche la plus
   * ressemblante qui est jouée, et les deux ne se confondent jamais. */
  const seuil = (window.CONFIG && CONFIG.afficheVivante && CONFIG.afficheVivante.seuil) || 0.5;
  const trouve = reconnaitreAffiche(sortie);
  if (trouve) console.info(`SCRAP · affiche la plus proche : ${trouve.affiche.id} (${trouve.score.toFixed(3)})`);
  const vivante = trouve && (ETAT.ctx.forcerVivante || trouve.score >= seuil) ? trouve.affiche : null;
  setTimeout(() => nouvelleCapture(img, sortie.width / sortie.height, { scanne: !!quad, vivante }), 240);
}

/* ═════════ Reconnaître L'affiche
 *
 * Une seule affiche nous intéresse : celle que SCRAP a éditée. On la
 * reconnaît sans réseau de neurones et sans serveur — l'image redressée est
 * réduite à une grille de 8 × 11, on en garde la luminosité et la « rougeur »
 * de chaque case, on normalise, et on compare à l'empreinte de référence
 * (config.js). La normalisation efface la lumière de la rue, le flou et les
 * écarts de cadrage ; il reste la composition, qui ne ressemble à aucune
 * autre affiche.
 *
 * On teste aussi l'affiche à l'envers : on ne sait jamais comment elle sera
 * collée, ni dans quel sens on la photographiera. */
function empreinteVisuelle(source, retournee) {
  const cfg = (window.CONFIG && CONFIG.afficheVivante) || {};
  const [GX, GY] = cfg.grille || [8, 11];
  const c = document.createElement("canvas");
  c.width = GX; c.height = GY;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = "high";
  if (retournee) { x.translate(GX, GY); x.rotate(Math.PI); }
  x.drawImage(source, 0, 0, GX, GY);
  const d = x.getImageData(0, 0, GX, GY).data;
  const lum = [], rouge = [];
  for (let i = 0; i < GX * GY; i++) {
    const r = d[i * 4], v = d[i * 4 + 1], b = d[i * 4 + 2];
    lum.push(0.299 * r + 0.587 * v + 0.114 * b);
    rouge.push(r - (v + b) / 2);
  }
  const norme = (t) => {
    const m = t.reduce((a2, b2) => a2 + b2, 0) / t.length;
    const e = Math.sqrt(t.reduce((a2, b2) => a2 + (b2 - m) * (b2 - m), 0) / t.length) || 1;
    return t.map((v) => (v - m) / e);
  };
  return norme(lum).concat(norme(rouge));
}

/* L'affiche vivante qui ressemble le plus à ce qu'on vient de photographier,
 * avec son score (de -1 à 1). On compare à toutes celles qu'on connaît : il
 * n'y en a que deux aujourd'hui, il y en aura dix demain, et la liste vient
 * de config.js. */
function reconnaitreAffiche(source) {
  const cfg = (window.CONFIG && CONFIG.afficheVivante) || {};
  const liste = cfg.liste || [];
  if (!liste.length || !source || !source.width) return null;
  const vues = [empreinteVisuelle(source, false), empreinteVisuelle(source, true)];
  let meilleure = null;
  liste.forEach((a) => {
    const ref = a.empreinte || [];
    vues.forEach((e) => {
      if (e.length !== ref.length) return;
      let s = 0;
      for (let i = 0; i < e.length; i++) s += e[i] * ref[i];
      s /= e.length;
      if (!meilleure || s > meilleure.score) meilleure = { affiche: a, score: s };
    });
  });
  return meilleure;
}

/* ───────── Redressement : la perspective corrigée, comme un scanner.
 * On calcule l'homographie qui envoie le rectangle de sortie sur les quatre
 * coins trouvés, puis on va chercher chaque pixel dans l'image d'origine. */
function redresser(src, c) {
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const largeur = (dist(c[0], c[1]) + dist(c[3], c[2])) / 2;
  const hauteur = (dist(c[0], c[3]) + dist(c[1], c[2])) / 2;
  if (!largeur || !hauteur) return src;

  const W = Math.max(120, Math.round(Math.min(820, largeur)));
  const Hh = Math.max(120, Math.round((W * hauteur) / largeur));

  const h = homographie([[0, 0], [W, 0], [W, Hh], [0, Hh]], c);
  if (!h) return src;

  const sctx = src.getContext("2d", { willReadFrequently: true });
  const si = sctx.getImageData(0, 0, src.width, src.height);
  const sd = si.data, sw = src.width, sh = src.height;

  const out = document.createElement("canvas");
  out.width = W; out.height = Hh;
  const octx = out.getContext("2d");
  const oi = octx.createImageData(W, Hh);
  const od = oi.data;

  for (let y = 0; y < Hh; y++) {
    for (let x = 0; x < W; x++) {
      const w = h[6] * x + h[7] * y + 1;
      const ux = (h[0] * x + h[1] * y + h[2]) / w;
      const uy = (h[3] * x + h[4] * y + h[5]) / w;
      const o = (y * W + x) * 4;
      if (ux < 0 || uy < 0 || ux >= sw - 1 || uy >= sh - 1) { od[o] = od[o + 1] = od[o + 2] = 238; od[o + 3] = 255; continue; }
      // interpolation bilinéaire
      const x0 = ux | 0, y0 = uy | 0, fx = ux - x0, fy = uy - y0;
      const i00 = (y0 * sw + x0) * 4, i10 = i00 + 4, i01 = i00 + sw * 4, i11 = i01 + 4;
      for (let k = 0; k < 3; k++) {
        od[o + k] = (sd[i00 + k] * (1 - fx) + sd[i10 + k] * fx) * (1 - fy) + (sd[i01 + k] * (1 - fx) + sd[i11 + k] * fx) * fy;
      }
      od[o + 3] = 255;
    }
  }
  octx.putImageData(oi, 0, 0);
  return out;
}

/* Homographie envoyant les 4 points « de » sur les 4 points « vers ».
 * Système 8×8 résolu par élimination de Gauss. */
function homographie(de, vers) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = de[i], [u, v] = vers[i];
    A.push([x, y, 1, 0, 0, 0, -x * u, -y * u]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -x * v, -y * v]); b.push(v);
  }
  for (let i = 0; i < 8; i++) {
    let p = i;
    for (let r = i + 1; r < 8; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    if (Math.abs(A[p][i]) < 1e-9) return null;
    [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
    for (let r = 0; r < 8; r++) {
      if (r === i) continue;
      const k = A[r][i] / A[i][i];
      if (!k) continue;
      for (let cc = i; cc < 8; cc++) A[r][cc] -= k * A[i][cc];
      b[r] -= k * b[i];
    }
  }
  return b.map((v, i) => v / A[i][i]);
}

/* ═════════ Photo prise dans la galerie (sans caméra) */
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
      nouvelleCapture(c.toDataURL("image/jpeg", 0.86), c.width / c.height, { scanne: false });
    };
    im.src = lecteur.result;
  };
  lecteur.readAsDataURL(fichier);
}

/* ═════════ Suite du parcours : vérifier, puis identifier */
function nouvelleCapture(img, ratio, o = {}) {
  const ouverte = D.collections.find((c) => !complete(c.id));
  const num = 4 + Math.floor(Math.random() * 120);
  const av = o.vivante;
  ETAT.ctx.capture = av
    ? {
      /* Une affiche vivante arrive déjà identifiée, et rare : ces tirages-là
       * sont courts, et peu de gens pensent à les scanner. */
      img, ratio, num: 2, titre: av.titre, lieu: av.lieu,
      collection: av.collection || "fetes", themes: av.themes || ["Affiche"],
      holo: true, tagsPerso: [], scanne: !!o.scanne, vivante: av.id,
    }
    : {
      img, ratio, num, titre: "", lieu: "Rue de Belleville",
      collection: ouverte ? ouverte.id : "concerts", themes: [],
      holo: Math.random() < 0.3, tagsPerso: [], scanne: !!o.scanne,
    };
  cameraArreter();
  aller(o.vivante ? "19.3" : "19.1", { remplace: true });
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
    scans: p.num, murs: 0, img: p.img, capture: true, vivante: !!p.vivante,
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

/* ═════════ Photo d'un mur (écran 24.4)
 * Sert de fond à l'export « sur un mur » : on prend une vraie photo, le
 * scrapbook est posé dessus au moment de composer l'image. */
let FLUX_MUR = null;

function cameraMurDemarrer(video) {
  if (!video || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const c = $("#consigne-mur");
    if (c) c.textContent = "Caméra indisponible ici : choisis une photo avec le bouton à gauche.";
    return null;
  }
  let arrete = false;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } }, audio: false })
    .then((f) => {
      if (arrete) { f.getTracks().forEach((t) => t.stop()); return; }
      FLUX_MUR = f; video.srcObject = f; video.play().catch(() => {});
    })
    .catch(() => { const c = $("#consigne-mur"); if (c) c.textContent = "Caméra refusée : choisis une photo avec le bouton à gauche."; });
  return () => { arrete = true; cameraMurArreter(); };
}
function cameraMurArreter() {
  if (FLUX_MUR) FLUX_MUR.getTracks().forEach((t) => t.stop());
  FLUX_MUR = null;
}

function photoDuMur() {
  const v = $("#video-mur");
  if (!v || !v.videoWidth) { toast("La caméra se lance… réessaie dans une seconde."); return; }
  const L = Math.min(1400, v.videoWidth);
  const c = document.createElement("canvas");
  c.width = L; c.height = Math.round((L * v.videoHeight) / v.videoWidth);
  c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
  enregistrerPhotoMur(c.toDataURL("image/jpeg", 0.82));
}

function enregistrerPhotoMur(dataUrl) {
  ETAT.mur.photoMur = dataUrl;
  ETAT.ctx.formatExport = "mur";
  sauver();
  cameraMurArreter();
  vibrer([16, 40, 12]);
  aller("24.2", { remplace: true });
}
