/* Prototype « Expérience immersive » : les 11 écrans du parcours d'Inès.
 *
 * Vanilla JS, sans dépendance. Couleurs, typographie et grille viennent de css/tokens.css,
 * généré par tools/build.py à partir de design/tokens.json.
 * Chaque écran est rendu en HTML ; les interactions passent par délégation sur #ecran.
 */
(() => {
  "use strict";

  const D = window.DONNEES;
  const ORDRE = Object.keys(D.affiches);
  const W = 402;
  const H = 874;

  /* ---------- Utilitaires ---------- */

  const $ = (sel) => document.querySelector(sel);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;
  const echapper = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const dateTri = (id) => {
    const [j, m, a] = D.affiches[id].date.split(" ")[0].split(".");
    return new Date(+a, m - 1, +j).getTime();
  };
  const rang = (id) => {
    const n = parseInt(D.affiches[id].num, 10);
    return n === 1 ? "1re" : `${n}e`;
  };
  const dansCollection = (cid) => ORDRE.filter((id) => D.affiches[id].collection === cid).length;
  const nomCollection = (cid) => D.collections.find((c) => c.id === cid).nom;
  const totalCollection = (cid) => D.collections.find((c) => c.id === cid).total;

  const ICONES = {
    scan: '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/>',
    carte: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    mur: '<path d="M4 4h7v7H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 13h7v7H4z"/>',
    collection: '<path d="M4 6h16v4H4zM4 14h7v6H4zM13 14h7v6h-7z"/>',
    profil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    recherche: '<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
    position: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    fermer: '<path d="M6 6l12 12M18 6L6 18"/>',
    retour: '<path d="M15 5l-7 7 7 7"/>',
    coche: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    partager:
      '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    zoomer: '<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5M11 8v6M8 11h6"/>',
    deplacer:
      '<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
    dechirer: '<path d="M3 3h18v18l-3-2-3 2-3-2-3 2-3-2-3 2z"/>',
    tirer: '<path d="M12 19V5M6 11l6-6 6 6M4 21h16"/>',
    musique: '<path d="M9 18V5l11-2v13M9 18a2.5 2.5 0 1 1-2-2.45M20 16a2.5 2.5 0 1 1-2-2.45"/>',
    etoile: '<path d="M12 3l2.6 5.6 6.1.7-4.6 4.2 1.3 6L12 16.5 6.6 19.5l1.3-6-4.6-4.2 6.1-.7z"/>',
    fourchette: '<path d="M7 3v7M5 3v5M9 3v5M7 10v11M16 21V3c-2 1.5-3 4-3 7s1 4 3 4"/>',
  };

  const icone = (nom, taille = 24) =>
    `<svg width="${taille}" height="${taille}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${ICONES[nom] || ""}</svg>`;

  // L'affiche est toujours montée à son format d'origine : jamais recadrée, sans filtre ni texte par-dessus.
  const affiche = (id, classe = "") => {
    const a = D.affiches[id];
    return `<div class="affiche ${classe}" style="--ratio:${a.ratio}"><img src="assets/affiches/${a.fichier}" alt="${echapper(a.titre)}" draggable="false"></div>`;
  };

  // Grille de fond (règle 09) : colonnes 16 / 8 / 86,5, quarts de colonne, ligne tous les 24 px, marquée tous les 96 px.
  function grilleSVG() {
    const M = 16;
    const G = 8;
    const C = (W - 2 * M - 3 * G) / 4;
    const verticales = [{ x: M, marque: true }];
    for (let i = 0; i < 4; i++) {
      const debut = M + i * (C + G);
      for (let k = 1; k < 4; k++) verticales.push({ x: debut + (k * C) / 4, marque: false });
      if (i < 3) verticales.push({ x: debut + C + G / 2, marque: true });
    }
    verticales.push({ x: W - M, marque: true });
    const horizontales = [];
    for (let y = 0; y <= H; y += 24) horizontales.push({ y, marque: y % 96 === 0 });

    let s = "";
    verticales.forEach(({ x, marque }) => {
      const px = Math.round(x) + 0.5;
      const style = marque ? "stroke:var(--grille-trait-marque)" : "stroke:var(--grille-trait)";
      s += `<line x1="${px}" y1="0" x2="${px}" y2="${H}" style="${style}"/>`;
    });
    horizontales.forEach(({ y, marque }) => {
      const py = y + 0.5;
      const style = marque ? "stroke:var(--grille-trait-marque)" : "stroke:var(--grille-trait)";
      s += `<line x1="0" y1="${py}" x2="${W}" y2="${py}" style="${style}"/>`;
    });
    verticales
      .filter((v) => v.marque)
      .forEach(({ x }) =>
        horizontales
          .filter((h) => h.marque)
          .forEach(({ y }) => {
            const px = Math.round(x) + 0.5;
            const py = y + 0.5;
            s += `<path d="M${px - 4.5} ${py}h9M${px} ${py - 4.5}v9" fill="none" style="stroke:var(--grille-repere)"/>`;
          })
      );
    return `<svg class="fond-grille" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
  }
  const GRILLE = grilleSVG();

  const CARTE_SVG = `<svg class="carte-fond" viewBox="0 0 402 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M-10 150L420 96M-10 300L420 330M-10 470L420 430M90 -10L120 620M230 -10L205 620M330 -10L368 620" fill="none" style="stroke:var(--fond-principal)" stroke-width="12"/>
    <path d="M-10 230L420 210M-10 390L420 400M-10 560L420 540M160 -10L175 620M290 -10L300 620" fill="none" style="stroke:var(--trait-defaut)" stroke-width="1"/>
  </svg>`;

  /* ---------- Données dérivées ---------- */

  const COLLECTION_FILTRES = [
    ["dernieres", "Dernières"],
    ["rares", "Plus rares"],
    ["favoris", "Favoris"],
    ["lieu", "Lieu"],
    ["etat", "État"],
    ["theme", "Thème"],
  ];

  const OUTILS_MUR = [
    ["zoomer", "Zoomer"],
    ["deplacer", "Déplacer"],
    ["dechirer", "Déchirer"],
    ["tirer", "Tirer"],
  ];

  const BADGES = [
    { id: "premier-scan", nom: "1er scan", icone: "scan", progression: () => [ORDRE.length, 1] },
    { id: "concerts", nom: "Concerts", icone: "musique", progression: () => [dansCollection("concerts"), 3] },
    {
      id: "holo", nom: "Holo", icone: "etoile",
      progression: () => [ORDRE.filter((id) => D.affiches[id].holo).length, 6],
    },
    {
      id: "quartiers", nom: "Quartiers", icone: "position",
      progression: () => [new Set(ORDRE.map((id) => D.affiches[id].quartier)).size, 8],
    },
    { id: "restaurants", nom: "Restaurants", icone: "fourchette", progression: () => [dansCollection("restaurants"), 3] },
    { id: "mur", nom: "Mur", icone: "mur", progression: () => [etat.mur.length, 10] },
  ];

  /* ---------- État ---------- */

  const MUR_INITIAL = [
    { id: "alta", x: 16, y: 20, w: 150 },
    { id: "seb", x: 190, y: 14, w: 110 },
    { id: "ozkan", x: 222, y: 170, w: 150 },
    { id: "presence", x: 14, y: 230, w: 128 },
    { id: "skeleton", x: 170, y: 330, w: 140 },
    { id: "different", x: 30, y: 420, w: 160, dechire: true },
    { id: "habitat", x: 210, y: 470, w: 140 },
    { id: "white", x: 36, y: 500, w: 120 },
  ];

  const etat = {
    ecran: "01",
    apercu: "alta",
    filtre: "dernieres",
    scanne: "alta",
    face: "recto",
    selection: [],
    mur: MUR_INITIAL.map((m, i) => ({ echelle: 1, dechire: false, z: i + 1, ...m })),
    murSel: "alta",
    outilMur: "deplacer",
    vitrine: { id: "alta", taille: 100, rotation: 0, x: 50, y: 50 },
    badge: "premier-scan",
    badgeNotif: true,
    suivi: false,
    toast: "",
  };

  let glisse = null; // geste en cours : { type, el, moved, ... }
  let vientDeGlisser = false; // empêche le clic qui suit un glisser
  let minuterie = null;

  const maxZ = () => Math.max(0, ...etat.mur.map((m) => m.z));

  /* ---------- Éléments communs ---------- */

  function onglets(actif) {
    const liste = [
      ["01", "carte", "Carte"],
      ["05", "mur", "Mur"],
      ["06", "collection", "Collection"],
    ];
    return `<nav class="onglets" aria-label="Navigation principale">${liste
      .map(
        ([id, ic, lib]) =>
          `<button class="onglet${id === actif ? " actif" : ""}" data-aller="${id}"${id === actif ? ' aria-current="page"' : ""}>${icone(ic)}<span>${lib}</span></button>`
      )
      .join("")}</nav>`;
  }

  function grille(ids, mode) {
    return `<div class="grille">${ids
      .map((id) => {
        const a = D.affiches[id];
        const i = etat.selection.indexOf(id);
        const coche =
          mode === "selection"
            ? `<span class="coche${i >= 0 ? " on" : ""}" aria-hidden="true">${i >= 0 ? icone("coche", 16) : ""}</span>`
            : "";
        return `<div class="carte-affiche" role="button" tabindex="0" data-id-grille="${id}">
          ${affiche(id)}
          <div class="legende-min">
            <div class="ligne-num"><span class="etiquette-num">N° ${a.num}</span>${coche}</div>
            <span class="t-texte-petit">${echapper(a.lieu)}</span>
            <span class="t-texte-meta secondaire">${a.date.split(" ")[0]}</span>
          </div>
        </div>`;
      })
      .join("")}</div>`;
  }

  const styleVitrine = (v) =>
    `left:${v.x}%;top:${v.y}%;width:${v.taille * 0.5}%;transform:translate(-50%,-50%) rotate(${v.rotation}deg)`;

  function vitrineAffiche(glissable) {
    return `<div class="vitrine-affiche" data-vitrine${glissable ? ' data-glisse="vitrine"' : ""} style="${styleVitrine(etat.vitrine)}">${affiche(etat.vitrine.id)}</div>`;
  }

  function tuileBadge(b, { choisi = false, interactif = false } = {}) {
    const [v, c] = b.progression();
    const ok = v >= c;
    const action = interactif && ok ? ` data-action="choisir-badge" data-val="${b.id}"` : "";
    return `<div class="badge${ok ? " debloque" : " verrouille"}${choisi ? " choisi" : ""}"${action}>
      <span class="badge-carre">${icone(b.icone, 24)}</span>
      <span class="t-texte-petit">${b.nom}</span>
      ${ok ? "" : `<span class="t-texte-meta secondaire">${v} / ${c}</span><span class="barre"><span style="width:${Math.min(100, (v / c) * 100)}%"></span></span>`}
    </div>`;
  }

  const compteur = (n, libelle) =>
    `<div class="compteur"><span class="t-titre-m">${n}</span><span class="t-texte-meta secondaire">${libelle}</span></div>`;

  function trier(f) {
    const ids = [...ORDRE];
    const A = (id) => D.affiches[id];
    switch (f) {
      case "dernieres":
        return ids.sort((x, y) => dateTri(y) - dateTri(x));
      case "rares":
        return ids.sort((x, y) => parseInt(A(x).num, 10) - parseInt(A(y).num, 10));
      case "favoris":
        return ids.filter((id) => A(id).favori);
      case "lieu":
        return ids.sort((x, y) => A(x).lieu.localeCompare(A(y).lieu, "fr"));
      case "etat":
        return ids.sort((x, y) => Number(!!A(y).holo) - Number(!!A(x).holo));
      case "theme":
        return ids.sort((x, y) => A(x).theme.localeCompare(A(y).theme, "fr"));
      default:
        return ids;
    }
  }

  /* ---------- Écrans ---------- */

  function rendreCarte() {
    const a = D.affiches[etat.apercu];
    const marqueurs = ORDRE.map((id) => {
      const d = D.affiches[id];
      const [x, y] = d.pos;
      return `<button class="marqueur${id === etat.apercu ? " actif" : ""}" data-marqueur="${id}" style="left:${x}%;top:${y}%" aria-label="Affiche N° ${d.num}">${d.nouveau ? '<span class="pastille"></span>' : ""}</button>`;
    }).join("");
    return `
      <header class="entete entete--recherche">
        <label class="recherche">${icone("recherche", 20)}<input type="search" placeholder="Rechercher une affiche, un lieu" aria-label="Rechercher une affiche"></label>
        <button class="icone-bouton" data-aller="09" aria-label="Mon profil">${icone("profil")}</button>
      </header>
      <div class="carte">
        ${CARTE_SVG}
        ${marqueurs}
        <span class="position" style="left:50%;top:48%" aria-label="Ma position"></span>
      </div>
      <div class="apercu" role="button" tabindex="0" data-ouvrir="${etat.apercu}">
        ${affiche(etat.apercu, "vignette")}
        <span class="apercu-texte">
          <span class="t-titre-m">${a.titre}</span>
          <span class="t-texte-petit secondaire">${a.lieu} · ${a.date.split(" ")[0]}</span>
        </span>
        <span class="t-texte-meta secondaire">N° ${a.num}</span>
      </div>
      <div class="pied"><button class="bouton bouton--capture" data-aller="02">${icone("scan")}Scanner une affiche</button></div>
      ${onglets("01")}`;
  }

  function rendreScanner() {
    return `
      <header class="entete">
        <button class="icone-bouton" data-aller="01" aria-label="Fermer">${icone("fermer")}</button>
        <span class="t-texte-meta">Scanner</span>
        <span class="espace-icone"></span>
      </header>
      <div class="corps cadre-zone">
        <div class="visee">${affiche("white")}<div class="cadre"></div></div>
        <p class="t-texte-meta centre">Cadre l'affiche</p>
        <p class="t-texte-petit secondaire centre">L'affiche entière dans le cadre, téléphone bien droit.</p>
      </div>
      <div class="pied pied--declencheur"><button class="declencheur" data-action="scanner" aria-label="Scanner l'affiche"></button></div>`;
  }

  // 03 (recto) et 04 (verso) : même écran, deux faces que l'on fait glisser.
  function rendreScannee() {
    const a = D.affiches[etat.scanne];
    const recto = `
      <section class="face face--recto">
        <div class="affiche-grand">${affiche(etat.scanne)}</div>
        <div class="legende">
          <div class="lig-etiquettes">
            <span class="etiquette etiquette--numero">N° ${a.num}</span>
            ${a.holo ? '<span class="etiquette">État · Holo</span>' : ""}
          </div>
          <p class="t-texte-meta secondaire">${rang(etat.scanne)} personne à la scanner</p>
          <h2 class="t-titre-l">${a.titre}</h2>
          <p class="t-texte-petit secondaire">${a.lieu} · ${a.date}</p>
        </div>
        <button class="indice t-texte-meta" data-retourner>← Glisser pour retourner</button>
      </section>`;
    const lignes = [
      ["Artiste", a.artiste],
      ["Lieu", a.lieu],
      ["Date", a.date],
      ["Thème", a.theme],
      ["État", a.holo ? "Holographique" : "Standard"],
      ["Collection", `${nomCollection(a.collection)} · ${dansCollection(a.collection)} / ${totalCollection(a.collection)}`],
    ];
    const verso = `
      <section class="face face--verso">
        <p class="t-chiffre-capture accent">${a.num}</p>
        <dl class="tableau">
          ${lignes
            .map(([k, v]) => `<div class="ligne-tab"><dt class="t-texte-meta secondaire">${k}</dt><dd class="t-texte-label">${echapper(v)}</dd></div>`)
            .join("")}
        </dl>
        <p class="t-texte-petit secondaire">Scannée par ${a.scans} personnes</p>
        <button class="indice t-texte-meta" data-retourner>Glisser pour revenir à l'affiche →</button>
      </section>`;
    return `
      <header class="entete">
        <button class="icone-bouton" data-aller="01" aria-label="Retour">${icone("retour")}</button>
        <h1 class="t-titre-m">Affiche</h1>
        <button class="icone-bouton" data-action="partager" aria-label="Partager">${icone("partager")}</button>
      </header>
      <div class="faces">
        <div class="faces-piste" data-glisse="pistes" data-face="${etat.face}">${recto}${verso}</div>
      </div>
      <div class="pied"><button class="bouton bouton--principal" data-action="ajouter-mur">Ajouter au mur</button></div>`;
  }

  function rendreMur() {
    const sel = etat.mur.find((m) => m.id === etat.murSel);
    const info = sel
      ? `Zoom ${Math.round(sel.echelle * 100)} % · glisser pour déplacer`
      : "Touche une affiche pour l'utiliser";
    const items = etat.mur
      .map((m) => {
        const contenu = m.dechire
          ? `<div class="dechire">${affiche(m.id)}${affiche(m.id)}</div>`
          : affiche(m.id);
        return `<div class="mur-item${m.id === etat.murSel ? " selection" : ""}" data-mur="${m.id}" data-glisse="mur"
          style="left:${m.x}px;top:${m.y}px;width:${m.w}px;z-index:${m.z};transform:scale(${m.echelle})">${contenu}</div>`;
      })
      .join("");
    return `
      <header class="entete">
        <div class="entete-texte">
          <h1 class="t-titre-m">Mon mur</h1>
          <p class="t-texte-meta secondaire">Belleville · ${pluriel(etat.mur.length, "affiche")}</p>
        </div>
        <button class="bouton-lien" data-action="valider-mur">Valider</button>
      </header>
      <div class="mur-zone">${items}</div>
      <div class="zone-outils">
        <p class="t-texte-meta secondaire">${info}</p>
        <div class="outils">${OUTILS_MUR
          .map(([v, lib]) => `<button class="outil${etat.outilMur === v ? " actif" : ""}" data-action="outil" data-val="${v}">${icone(v)}<span>${lib}</span></button>`)
          .join("")}</div>
      </div>`;
  }

  function rendreCollection() {
    return `
      <header class="entete entete--titre">
        <h1 class="t-titre-m">Ma collection</h1>
        <button class="bouton-lien" data-action="mode-selection">Sélectionner</button>
      </header>
      <div class="filtres">${COLLECTION_FILTRES
        .map(([v, lib]) => `<button class="puce${etat.filtre === v ? " actif" : ""}" data-action="filtre" data-val="${v}">${lib}</button>`)
        .join("")}</div>
      <div class="corps">${grille(trier(etat.filtre), "normal")}</div>
      ${onglets("06")}`;
  }

  function rendreSelection() {
    const n = etat.selection.length;
    const dernier = etat.selection.at(-1);
    return `
      <header class="entete">
        <button class="bouton-lien" data-aller="06">Annuler</button>
        <h1 class="t-titre-m">Sélection</h1>
        <span class="espace-icone"></span>
      </header>
      <p class="bande t-texte-meta secondaire">${n} sélectionnée${n > 1 ? "s" : ""}${dernier ? ` · la dernière : N° ${D.affiches[dernier].num}` : ""}</p>
      <div class="corps">${grille(ORDRE, "selection")}</div>
      <div class="pied"><button class="bouton bouton--principal" data-action="ajouter-profil"${n ? "" : " disabled"}>Ajouter la dernière au profil</button></div>`;
  }

  function rendreVitrine() {
    const v = etat.vitrine;
    return `
      <header class="entete">
        <button class="icone-bouton" data-aller="07" aria-label="Retour">${icone("retour")}</button>
        <h1 class="t-titre-m">Placer sur le profil</h1>
        <span class="espace-icone"></span>
      </header>
      <div class="corps">
        <p class="t-texte-meta secondaire">Vitrine · glisse l'affiche pour la placer</p>
        <div class="vitrine">${vitrineAffiche(true)}</div>
        <div class="reglages">
          <label class="reglage">
            <span class="t-texte-meta">Taille</span>
            <span class="t-texte-petit" data-val-taille>${v.taille} %</span>
            <input type="range" min="60" max="140" step="1" value="${v.taille}" data-slider="taille">
          </label>
          <label class="reglage">
            <span class="t-texte-meta">Rotation</span>
            <span class="t-texte-petit" data-val-rotation>${v.rotation}°</span>
            <input type="range" min="-10" max="10" step="1" value="${v.rotation}" data-slider="rotation">
          </label>
        </div>
      </div>
      <div class="pied"><button class="bouton bouton--principal" data-action="valider-vitrine">Valider</button></div>`;
  }

  function rendreProfil() {
    const holos = ORDRE.filter((id) => D.affiches[id].holo).length;
    const nbCollections = D.collections.filter((c) => dansCollection(c.id) > 0).length;
    return `
      <header class="entete">
        <button class="icone-bouton" data-aller="01" aria-label="Retour">${icone("retour")}</button>
        <h1 class="t-titre-m">Profil</h1>
        <span class="espace-icone"></span>
      </header>
      <div class="corps">
        <div class="profil-tete">
          <div class="avatar">${icone("profil", 40)}</div>
          <div>
            <h2 class="t-titre-l">Inès</h2>
            <p class="t-texte-petit secondaire">Belleville · rang 12</p>
          </div>
        </div>
        <div class="compteurs">
          ${compteur(ORDRE.length, "affiches")}${compteur(nbCollections, "collections")}${compteur(holos, "holos")}
        </div>
        <div class="lien-droite"><button class="bouton-lien" data-aller="11">Voir mes collections</button></div>
        <section class="section">
          <h2 class="t-texte-meta secondaire">Affiche mise en avant</h2>
          <div class="vitrine vitrine--court">${vitrineAffiche(false)}</div>
        </section>
        <section class="section">
          <h2 class="t-texte-meta secondaire">Mur public</h2>
          <div class="mini-mur">${etat.mur.map((m) => affiche(m.id)).join("")}</div>
        </section>
        <section class="section">
          <div class="ligne-tete">
            <h2 class="t-texte-meta secondaire">Badges</h2>
            <button class="bouton-lien" data-aller="10">Modifier</button>
          </div>
          <div class="badges">${BADGES.map((b) => tuileBadge(b)).join("")}</div>
        </section>
      </div>
      <div class="pied pied--deux">
        <button class="bouton bouton--principal" data-action="suivre">${etat.suivi ? "Suivi" : "Suivre"}</button>
        <button class="bouton bouton--secondaire" data-action="partager">${icone("partager", 20)}Partager</button>
      </div>`;
  }

  function rendreBadges() {
    const notif = etat.badgeNotif
      ? `<div class="notification"><span class="t-texte-petit">Badge débloqué : Concerts</span>
          <button class="icone-bouton" data-action="fermer-notif" aria-label="Fermer la notification">${icone("fermer", 20)}</button></div>`
      : "";
    return `${notif}
      <header class="entete">
        <button class="icone-bouton" data-aller="09" aria-label="Retour">${icone("retour")}</button>
        <h1 class="t-titre-m">Modifier un badge</h1>
        <span class="espace-icone"></span>
      </header>
      <div class="corps">
        <p class="t-texte-petit secondaire">Choisis le badge affiché sur ton profil</p>
        <div class="badges badges--quatre">${BADGES
          .map((b) => tuileBadge(b, { choisi: b.id === etat.badge, interactif: true }))
          .join("")}</div>
        <section class="section">
          <h2 class="t-texte-meta secondaire">Aperçu sur mon profil</h2>
          <div class="apercu-badge">${tuileBadge(BADGES.find((b) => b.id === etat.badge), { choisi: true })}</div>
        </section>
      </div>
      <div class="pied"><button class="bouton bouton--principal" data-action="enregistrer-badge">Enregistrer</button></div>`;
  }

  function ligneCollection(c) {
    const ids = ORDRE.filter((id) => D.affiches[id].collection === c.id);
    const n = ids.length;
    const manque = c.total - n;
    const vignettes =
      ids.map((id) => `<div class="vignette-min">${affiche(id)}</div>`).join("") +
      '<div class="emplacement"></div>'.repeat(manque);
    const etiquette =
      n === 0 ? "Non commencée" : manque > 0 ? `Il manque ${pluriel(manque, "affiche")}` : "Complète";
    return `
      <section class="ligne-collection">
        <div class="ligne-tete">
          <h2 class="t-titre-m">${c.nom}</h2>
          <span class="t-texte-meta">${n} / ${c.total}</span>
        </div>
        <div class="barre-progression"><span style="width:${(n / c.total) * 100}%"></span></div>
        <div class="vignettes">${vignettes}</div>
        <div class="ligne-pied">
          <span class="t-texte-petit secondaire">${etiquette}</span>
          <button class="bouton-lien" data-aller="01">Voir sur la carte</button>
        </div>
      </section>`;
  }

  function rendreCollections() {
    const total = D.collections.reduce((s, c) => s + c.total, 0);
    return `
      <header class="entete">
        <button class="icone-bouton" data-aller="09" aria-label="Retour">${icone("retour")}</button>
        <span class="t-texte-meta">Progression</span>
        <span class="espace-icone"></span>
      </header>
      <div class="corps">
        <h1 class="t-titre-xl">Mes collections</h1>
        <p class="t-texte-meta secondaire">${ORDRE.length} / ${total} affiches</p>
        ${D.collections.map(ligneCollection).join("")}
      </div>`;
  }

  /* ---------- Table des écrans ---------- */

  const ECRANS = {
    "01": { nom: "Carte d'accueil", theme: "clair", grille: true, rendu: rendreCarte },
    "02": { nom: "Scanner", theme: "sombre", grille: false, rendu: rendreScanner },
    "03": { nom: "Affiche scannée (recto)", theme: "clair", grille: true, rendu: rendreScannee },
    "04": { nom: "Verso (par swipe)", theme: "clair", grille: true, rendu: rendreScannee },
    "05": { nom: "Mur virtuel", theme: "clair", grille: true, rendu: rendreMur },
    "06": { nom: "Collection", theme: "clair", grille: true, rendu: rendreCollection },
    "07": { nom: "Sélection", theme: "clair", grille: true, rendu: rendreSelection },
    "08": { nom: "Placer sur le profil", theme: "clair", grille: true, rendu: rendreVitrine },
    "09": { nom: "Profil vu par les autres", theme: "clair", grille: true, rendu: rendreProfil },
    "10": { nom: "Modifier un badge", theme: "clair", grille: true, rendu: rendreBadges },
    "11": { nom: "Mes collections", theme: "clair", grille: true, rendu: rendreCollections },
  };

  const racine = $("#ecran");

  function rendreSommaire() {
    $("#sommaire").innerHTML = Object.entries(ECRANS)
      .map(
        ([id, e]) =>
          `<a href="#${id}"${id === etat.ecran ? ' class="actif" aria-current="page"' : ""}><span class="num">${id}</span>${e.nom}</a>`
      )
      .join("");
  }

  function renderEcran() {
    const id = etat.ecran;
    const e = ECRANS[id];
    racine.dataset.theme = e.theme;
    racine.dataset.ecran = id;
    racine.innerHTML =
      (e.grille ? GRILLE : "") +
      `<div class="vue">${e.rendu()}</div>` +
      (etat.toast ? `<div class="toast" role="status">${echapper(etat.toast)}</div>` : "");
    rendreSommaire();
    document.title = `${id} · ${e.nom} — Prototype`;
  }

  function allerA(id) {
    if (location.hash === `#${id}`) renderEcran();
    else location.hash = id;
  }

  function lireEcran() {
    const h = location.hash.replace("#", "");
    return ECRANS[h] ? h : "01";
  }

  function notifier(texte) {
    etat.toast = texte;
    renderEcran();
    clearTimeout(minuterie);
    minuterie = setTimeout(() => {
      etat.toast = "";
      renderEcran();
    }, 1800);
  }

  /* ---------- Actions ---------- */

  function majFace() {
    const piste = $(".faces-piste");
    if (piste) piste.dataset.face = etat.face;
  }

  function majVitrine() {
    const v = etat.vitrine;
    const el = $("[data-vitrine]");
    if (el) el.style.cssText = styleVitrine(v);
    const t = $("[data-val-taille]");
    if (t) t.textContent = `${v.taille} %`;
    const r = $("[data-val-rotation]");
    if (r) r.textContent = `${v.rotation}°`;
  }

  function cliqueMur(id) {
    const m = etat.mur.find((x) => x.id === id);
    if (!m) return;
    etat.murSel = id;
    if (etat.outilMur === "zoomer") {
      const pas = [1, 1.2, 0.8];
      m.echelle = pas[(pas.indexOf(m.echelle) + 1) % pas.length];
    }
    if (etat.outilMur === "dechirer") m.dechire = !m.dechire;
    if (etat.outilMur === "tirer") m.z = maxZ() + 1;
    renderEcran();
  }

  function cliqueGrille(id) {
    if (etat.ecran === "07") {
      const i = etat.selection.indexOf(id);
      if (i >= 0) etat.selection.splice(i, 1);
      else etat.selection.push(id);
      renderEcran();
      return;
    }
    etat.scanne = id;
    etat.face = "recto";
    allerA("03");
  }

  const ACTIONS = {
    scanner() {
      etat.scanne = "alta";
      etat.face = "recto";
      allerA("03");
    },
    "ajouter-mur"() {
      if (!etat.mur.some((m) => m.id === etat.scanne)) {
        etat.mur.push({ id: etat.scanne, x: 40, y: 60, w: 140, echelle: 1, dechire: false, z: maxZ() + 1 });
      }
      etat.murSel = etat.scanne;
      allerA("05");
    },
    "valider-mur"() {
      allerA("06");
    },
    outil(el) {
      etat.outilMur = el.dataset.val;
      renderEcran();
    },
    filtre(el) {
      etat.filtre = el.dataset.val;
      renderEcran();
    },
    "mode-selection"() {
      etat.selection = [];
      allerA("07");
    },
    "ajouter-profil"() {
      etat.vitrine.id = etat.selection.at(-1);
      allerA("08");
    },
    "valider-vitrine"() {
      allerA("09");
    },
    suivre() {
      etat.suivi = !etat.suivi;
      renderEcran();
    },
    partager() {
      notifier("Partage : non disponible dans le prototype");
    },
    "choisir-badge"(el) {
      etat.badge = el.dataset.val;
      renderEcran();
    },
    "enregistrer-badge"() {
      allerA("09");
    },
    "fermer-notif"() {
      etat.badgeNotif = false;
      renderEcran();
    },
  };

  /* ---------- Interactions (délégation sur #ecran) ---------- */

  racine.addEventListener("click", (e) => {
    if (vientDeGlisser) {
      vientDeGlisser = false;
      return;
    }
    const t = e.target;
    const aller = t.closest("[data-aller]");
    if (aller) return allerA(aller.dataset.aller);

    const action = t.closest("[data-action]");
    if (action && !action.disabled) {
      const f = ACTIONS[action.dataset.action];
      if (f) f(action);
      return;
    }

    const ouvrir = t.closest("[data-ouvrir]");
    if (ouvrir) {
      etat.scanne = ouvrir.dataset.ouvrir;
      etat.face = "recto";
      return allerA("03");
    }

    const marqueur = t.closest("[data-marqueur]");
    if (marqueur) {
      etat.apercu = marqueur.dataset.marqueur;
      return renderEcran();
    }

    if (t.closest("[data-retourner]")) {
      etat.face = etat.face === "recto" ? "verso" : "recto";
      return majFace();
    }

    const cellule = t.closest("[data-id-grille]");
    if (cellule) return cliqueGrille(cellule.dataset.idGrille);

    const mur = t.closest("[data-mur]");
    if (mur) return cliqueMur(mur.dataset.mur);
  });

  racine.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches('[role="button"]')) e.target.click();
  });

  racine.addEventListener("input", (e) => {
    const s = e.target.dataset.slider;
    if (!s) return;
    etat.vitrine[s] = Number(e.target.value);
    majVitrine();
  });

  racine.addEventListener("pointerdown", (e) => {
    vientDeGlisser = false;
    const el = e.target.closest("[data-glisse]");
    if (!el) return;
    const type = el.dataset.glisse;
    if (type === "mur" && etat.outilMur !== "deplacer") return;
    const m = type === "mur" ? etat.mur.find((x) => x.id === el.dataset.mur) : null;
    glisse = {
      type,
      el,
      m,
      zone: el.parentElement,
      x0: e.clientX,
      y0: e.clientY,
      moved: false,
      mx: m ? m.x : 0,
      my: m ? m.y : 0,
      vx: etat.vitrine.x,
      vy: etat.vitrine.y,
      base: el.dataset.face === "verso" ? -el.offsetWidth / 2 : 0,
    };
  });

  window.addEventListener("pointermove", (e) => {
    const g = glisse;
    if (!g) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (!g.moved && Math.hypot(dx, dy) < 4) return;
    g.moved = true;

    if (g.type === "mur") {
      g.m.x = clamp(g.mx + dx, -20, g.zone.clientWidth - 40);
      g.m.y = clamp(g.my + dy, 0, g.zone.clientHeight - 40);
      g.el.style.left = `${g.m.x}px`;
      g.el.style.top = `${g.m.y}px`;
    } else if (g.type === "vitrine") {
      const r = g.zone.getBoundingClientRect();
      etat.vitrine.x = clamp(g.vx + (dx / r.width) * 100, 0, 100);
      etat.vitrine.y = clamp(g.vy + (dy / r.height) * 100, 0, 100);
      majVitrine();
    } else if (g.type === "pistes") {
      g.el.classList.add("en-glisse");
      g.el.style.transform = `translateX(${g.base + dx}px)`;
    }
  });

  window.addEventListener("pointerup", (e) => {
    const g = glisse;
    glisse = null;
    if (!g) return;
    vientDeGlisser = g.moved;
    if (g.type === "pistes" && g.moved) {
      const dx = e.clientX - g.x0;
      if (dx < -60) etat.face = "verso";
      else if (dx > 60) etat.face = "recto";
      g.el.classList.remove("en-glisse");
      g.el.style.transform = "";
      g.el.dataset.face = etat.face;
    }
  });

  window.addEventListener("hashchange", () => {
    const id = lireEcran();
    if (id === "03") etat.face = "recto";
    if (id === "04") etat.face = "verso";
    etat.ecran = id;
    renderEcran();
  });

  /* ---------- Démarrage ---------- */

  etat.ecran = lireEcran();
  if (etat.ecran === "04") etat.face = "verso";
  renderEcran();
})();
