/* SCRAP — les écrans, numérotés comme les maquettes Figma v4 (01 à 50, + 19.1).
 * Chaque écran : { titre, section, classe, rendu() → HTML, monter(racine) → nettoyage }.
 */
"use strict";

const SECTIONS = {
  A: "Lancement et inscription", B: "Carte et capture", C: "Scrapbook",
  D: "Collections", E: "Profil et partage", F: "Réglages", G: "États d'erreur",
};
const ECRANS = {};
const ecran = (id, section, titre, classe, rendu, monter) => { ECRANS[id] = { id, section, titre, classe, rendu, monter }; };

/* ═════════ A. Lancement et inscription */

/* 01 — l'accueil, d'un seul tenant (il n'y a plus d'écran 02 séparé : c'est
 * cette couture-là qui se voyait).
 *
 * Les affiches arrivent une à une et se rangent en quatre rangées. Dès qu'on
 * fait défiler, les rangées partent sur les côtés, en sens contraire, et le
 * nom et le bouton montent à leur place. Tout se joue sur une seule variable,
 * --s, qui vaut 0 en haut de la page et 1 une fois le mur sorti. */
/* Le bouton de démo. Volontairement hors charte — liseré pointillé, mention
 * « DEV » — pour qu'on voie tout de suite qu'il ne fait pas partie de l'app :
 * il sert à choisir, avant de s'identifier, si on reprend la session en cours
 * ou si on repart du compte de démo (c'est le seul moyen de revoir les écrans
 * de fin de collection une fois qu'on les a vus). */
const marqueDev = () => `<button class="marque-dev" data-action="menuDev">
  <i></i><span>DEV</span><span class="marque-dev-sous">Réinitialiser la démo</span></button>`;

const MUR_ACCUEIL = [
  ["alta", "rose", "sonda", "skeleton", "seb"],
  ["viudas", "fiasco", "white", "flea", "presence"],
  ["sanbimu", "ozkan", "habitat", "different", "scrt"],
  ["seb", "sonda", "rose", "viudas", "alta"],
];
const SCOTCHS_ACCUEIL = ["kraft", "transparent", "papier", "noir"];

ecran("01", "A", "Accueil", "grille", () => `
  <div class="defile accueil" id="accueil">
    <div class="mur-accueil">
      ${MUR_ACCUEIL.map((rangee, r) => `
        <div class="rangee-affiches" style="--sens:${r % 2 ? 1 : -1};--decalage:${r % 2 ? -40 : 0}px">
          ${rangee.concat(rangee).map((id, i) => `
            <div class="affiche-accueil" style="--i:${r * 5 + (i % 5)};--rot:${((i * 7 + r * 3) % 9) - 4}deg">
              <img src="assets/affiches/${id}.jpg" alt="" loading="${r < 2 ? "eager" : "lazy"}">
              ${i % 3 === 0 ? `<i class="scotch ${SCOTCHS_ACCUEIL[(i + r) % 4]} hg"></i>` : ""}
            </div>`).join("")}
        </div>`).join("")}
      <i class="voile-accueil"></i>
    </div>
    <div class="accueil-texte">
      <span class="mot">${"SCRAP".split("").map((l, i) => `<span class="lettre" style="--i:${i}"><b>${l}</b></span>`).join("")}<i class="point"></i></span>
      <p class="t-texte-corps secondaire" style="margin:14px 0 0">Ta ville en morceaux.</p>
      <p class="t-texte-petit secondaire" style="margin:18px 0 0;max-width:300px">Chaque affiche collée dans la rue est un scrap à capturer. Tu les ranges sur ton scrapbook, et tu sors en chercher d'autres.</p>
      <div class="accueil-boutons">
        ${bouton("Commencer", { aller: "03" })}
        ${lien("J'ai déjà un compte", { aller: "09", centre: true })}
      </div>
    </div>
    <span class="indice-defilement t-texte-meta secondaire">Fais défiler${icone("chevron", 16)}</span>
    ${marqueDev()}
  </div>`, (r) => {
  const zone = $("#accueil", r);
  if (!zone) return null;
  const maj = () => {
    const course = Math.max(1, zone.clientHeight * 0.68);
    zone.style.setProperty("--s", clamp(zone.scrollTop / course, 0, 1).toFixed(4));
  };
  maj();
  zone.addEventListener("scroll", maj, { passive: true });
  return () => zone.removeEventListener("scroll", maj);
});

const decouverte = (n, illus, titre, texte, suivant, btn) => `
  <div style="flex:none;padding:calc(env(safe-area-inset-top) + 16px) var(--marge) 0" class="rangee entre">
    <span class="t-texte-meta secondaire">${n} / 3</span>${lien("Passer", { aller: "06" })}
  </div>
  <div class="defile" style="display:flex;flex-direction:column;gap:24px" data-glisser="${n < 3 ? "0" + (n + 3) : ""}|${n > 1 ? "0" + (n + 1) : ""}">
    <div style="flex:1;min-height:280px">${illus}</div>
    <div><h1 class="t-titre-xl" style="margin:0">${titre}</h1><p class="t-texte-corps secondaire" style="margin:12px 0 0">${texte}</p></div>
    <div class="rangee" style="gap:8px">${[1, 2, 3].map((i) => `<i style="width:32px;height:2px;background:var(${i === n ? "--trait-fort" : "--trait-defaut"})"></i>`).join("")}</div>
  </div>
  ${pied(bouton(btn, { aller: suivant }), { transparent: true })}`;

ecran("03", "A", "Découverte 1 — Sors", "grille", () => decouverte(1, `
  <div class="illus fond-blanc" style="background:var(--fond-secondaire)">
    ${[[0, 30, 100, 3, 0], [0, 64, 100, 4, 0], [24, 0, 3, 100, 0], [68, 0, 3, 100, 0], [-10, 48, 120, 2, -14]].map(([l, t, w, h, r]) =>
      `<i style="position:absolute;left:${l}%;top:${t}%;width:${w}%;height:${h}%;background:#fff;transform:rotate(${r}deg)"></i>`).join("")}
    ${[[16, 18, "concerts", 1], [48, 36, "expos", 0], [80, 22, "marches", 1], [38, 74, "messages", 0], [82, 70, "expos", 0]].map(([l, t, col, n], i) =>
      `<span style="position:absolute;left:${l}%;top:${t}%">${pinHtml({ collection: col, nouveau: !!n, scans: 40 }, { index: i })}</span>`).join("")}
    <span class="ma-position" style="position:absolute;left:52%;top:56%"><i></i></span>
  </div>`, "Sors. Les scraps sont dehors.", "La carte montre les affiches collées autour de toi. Chaque affiche est un scrap à capturer.", "04", "Suivant"));

ecran("04", "A", "Découverte 2 — Capture", "grille", () => decouverte(2, `
  <div class="illus" style="display:grid;place-items:center">
    <div style="position:relative;width:62%;padding:12px">
      <div class="viseur" style="inset:0">${"<i></i>".repeat(4)}</div>
      <img src="assets/affiches/seb.jpg" alt="" style="width:100%">
    </div>
    <div style="margin-top:12px">${etiquette("Scrap N° 003", true)}</div>
  </div>`, "Capture-les.", "Chaque scrap porte ton numéro : 3e à l'avoir capturé, 128e… Les premiers sont les plus rares.", "05", "Suivant"));

ecran("05", "A", "Découverte 3 — Colle", "grille", () => decouverte(3, `
  <div class="illus fond-papier">
    <div class="mur-item" style="left:8%;top:10%;width:30%;transform:rotate(-4deg)"><img src="assets/affiches/alta.jpg" alt=""><i class="scotch kraft hg"></i><i class="scotch kraft hd"></i></div>
    <div class="mur-item" style="left:46%;top:6%;width:34%;transform:rotate(3deg)"><img src="assets/affiches/sanbimu.jpg" alt=""><i class="scotch transparent hd"></i></div>
    <div class="mur-item" style="left:16%;top:52%;width:26%;clip-path:polygon(0 0,100% 0,100% 55%,82% 62%,90% 70%,68% 78%,76% 86%,55% 100%,0 100%)"><img src="assets/affiches/skeleton.jpg" alt=""></div>
    <div class="mur-item" style="left:56%;top:54%;width:28%"><img src="assets/affiches/flea.jpg" alt=""><i class="scotch papier hg"></i></div>
  </div>`, "Colle-les.", "Compose ton scrapbook : scotch, déchirures, fond. Il te ressemble, et il reste privé tant que tu veux.", "06", "C'est parti"));

const autorisation = (ic, titre, texte, points, action, suivant) => `
  <div class="defile" style="padding-top:calc(env(safe-area-inset-top) + 72px)">
    <div class="pictogramme">${icone(ic, 40)}</div>
    <h1 class="t-titre-l centre" style="margin:28px 0 0">${titre}</h1>
    <p class="t-texte-corps secondaire centre" style="margin:12px 0 32px">${texte}</p>
    <div class="liste">${points.map((p) => `<div class="ligne">${icone("valider")}<span class="t-texte-petit" style="flex:1">${p}</span></div>`).join("")}</div>
  </div>
  ${pied(bouton(action[0], { action: action[1] }) + lien("Plus tard", { aller: suivant, centre: true }), { transparent: true })}`;

ecran("06", "A", "Accès à la caméra", "grille", () => autorisation("camera", "Accès à la caméra", "Pour capturer un scrap. La photo sert seulement à reconnaître l'affiche.",
  ["Rien n'est pris sans ton geste.", "Aucune personne n'est photographiée ni enregistrée.", "Tu peux couper l'accès à tout moment."],
  ["Autoriser la caméra", "autoriserCamera"], "07"));

ecran("07", "A", "Accès à la position", "grille", () => autorisation("position", "Accès à ta position", "Pour afficher les scraps autour de toi et t'y guider à pied.",
  ["Ta position n'est jamais partagée.", "Seulement pendant que l'app est ouverte.", "Rayon et historique réglables dans les réglages."],
  ["Autoriser pendant l'utilisation", "autoriserPosition"], "07.1"));

/* 07.1 — le capteur d'inclinaison. Demandé dès le début, comme la caméra :
 * c'est lui qui fait vivre toute l'app en profondeur. */
ecran("07.1", "A", "Accès au mouvement", "grille", () => `
  <div class="defile" style="padding-top:calc(env(safe-area-inset-top) + 56px)">
    <div class="scene-mouvement" id="scene-mouvement">
      <i class="decor-trame couche" style="--p:10"></i>
      <div class="demo-3d">
        <div class="mur-item couche" style="--p:10;left:4%;top:28px;width:34%;transform:rotate(-5deg)"><img src="assets/affiches/viudas.jpg" alt=""></div>
        <div class="mur-item couche" style="--p:30;left:33%;top:0;width:36%;transform:rotate(2deg)"><img src="assets/affiches/sonda.jpg" alt=""><i class="scotch kraft hg"></i></div>
        <div class="mur-item couche" style="--p:52;left:64%;top:34px;width:33%;transform:rotate(4deg)"><img src="assets/affiches/fiasco.jpg" alt=""></div>
      </div>
    </div>
    <h1 class="t-titre-l centre" style="margin:28px 0 0">Penche ton téléphone</h1>
    <p class="t-texte-corps secondaire centre" style="margin:12px 0 32px">Les scraps prennent du relief quand tu bouges. C'est le capteur d'inclinaison, celui qui sert aussi à tourner l'écran.</p>
    <div class="liste">${["Aucune donnée n'est enregistrée ni envoyée.", "Ça ne consomme presque rien.", "Tu peux refuser : l'app marche pareil, en plus sage."]
      .map((p) => `<div class="ligne">${icone("valider")}<span class="t-texte-petit" style="flex:1">${p}</span></div>`).join("")}</div>
  </div>
  ${pied(bouton("Activer le relief", { action: "autoriserMouvement" }) + lien("Plus tard", { aller: "08", centre: true }), { transparent: true })}`,
(r) => profondeur($("#scene-mouvement", r), { amplitude: 1.3 }));

ecran("08", "A", "Créer un compte", "grille", () => `
  ${entete("Créer un compte")}
  <div class="defile">
    ${champ("E-mail", "", { type: "email", placeholder: "ines@exemple.fr" })}
    ${champ("Mot de passe", "", { type: "password", placeholder: "••••••••", aide: "8 caractères minimum" })}
    <div class="rangee" style="align-items:flex-start;margin:4px 0 24px">
      <button class="coche active" data-action="cocher" aria-label="Accepter">${icone("valider")}</button>
      <span class="t-texte-petit">J'accepte les conditions d'utilisation et la politique de vie privée.</span>
    </div>
    ${bouton("Créer mon compte", { aller: "11" })}
    <div class="rangee" style="margin:20px 0"><i style="flex:1;height:1px;background:var(--trait-defaut)"></i><span class="t-texte-meta secondaire">ou</span><i style="flex:1;height:1px;background:var(--trait-defaut)"></i></div>
    <div class="pile">${bouton("Continuer avec Apple", { type: "secondaire", aller: "11" })}${bouton("Continuer avec Google", { type: "secondaire", aller: "11" })}</div>
    ${lien("J'ai déjà un compte", { aller: "09", centre: true })}
  </div>`);

ecran("09", "A", "Se connecter", "grille", () => `
  ${entete("Se connecter")}
  <div class="defile">
    <h1 class="t-titre-l" style="margin:8px 0 28px">Content de te revoir.</h1>
    ${champ("E-mail", ETAT.utilisateur.email, { type: "email" })}
    ${champ("Mot de passe", "scrapscrap", { type: "password" })}
    <div style="text-align:right;margin:-8px 0 24px">${lien("Mot de passe oublié ?", { aller: "10" })}</div>
    ${bouton("Se connecter", { aller: "13" })}
    <div class="rangee" style="margin:20px 0"><i style="flex:1;height:1px;background:var(--trait-defaut)"></i><span class="t-texte-meta secondaire">ou</span><i style="flex:1;height:1px;background:var(--trait-defaut)"></i></div>
    <div class="pile">${bouton("Continuer avec Apple", { type: "secondaire", aller: "13" })}${bouton("Continuer avec Google", { type: "secondaire", aller: "13" })}</div>
    ${lien("Créer un compte", { aller: "08", centre: true })}
  </div>`);

ecran("10", "A", "Mot de passe oublié", "grille", () => `
  ${entete("Mot de passe oublié")}
  <div class="defile">
    <div id="envoye" class="notification cache" style="margin-bottom:24px">${icone("valider")}<span class="t-texte-petit">Lien envoyé à ${esc(ETAT.utilisateur.email)}</span></div>
    <h1 class="t-titre-l" style="margin:8px 0 0">Pas de panique.</h1>
    <p class="t-texte-corps secondaire" style="margin:12px 0 28px">Entre ton e-mail : on t'envoie un lien pour choisir un nouveau mot de passe.</p>
    ${champ("E-mail", ETAT.utilisateur.email, { type: "email" })}
    ${bouton("Envoyer le lien", { action: "envoyerLien" })}
    ${lien("Revenir à la connexion", { aller: "09", centre: true })}
  </div>`);

ecran("11", "A", "Pseudo et avatar", "grille", () => `
  ${entete("Ton profil", { droite: `<span class="t-texte-meta secondaire">1 / 2</span>` })}
  <div class="defile">
    <label style="display:block;width:120px;margin:8px auto 0;cursor:pointer">${avatarPersonne(120)}
      <input type="file" accept="image/*" class="cache" data-change="photoProfil"></label>
    <label class="bouton-lien lien-centre" style="text-align:center">Choisir une photo<input type="file" accept="image/*" class="cache" data-change="photoProfil"></label>
    <div style="height:24px"></div>
    ${champ("Pseudo", ETAT.utilisateur.pseudo, { id: "pseudo", aide: "Disponible" })}
    ${champ("Quartier", `${ETAT.utilisateur.quartier}, ${ETAT.utilisateur.arrondissement}`, { id: "quartier" })}
    <p class="t-texte-petit secondaire">Ton quartier sert à te proposer des collections proches. Tu peux le cacher sur ton profil.</p>
  </div>
  ${pied(bouton("Continuer", { action: "enregistrerPseudo" }))}`, (r) => {
  const i = $("#pseudo", r);
  const aide = i.parentElement.querySelector("span:last-child");
  const maj = () => { aide.textContent = i.value.replace("@", "").length < 3 ? "Trop court" : "Disponible"; };
  i.addEventListener("input", maj);
});

ecran("12", "A", "Collections de départ", "grille", () => {
  const n = ETAT.collectionsDepart.length;
  const proches = ["concerts", "street", "marches"];
  const carte = (c, i) => {
    const on = ETAT.collectionsDepart.includes(c.id);
    return `<button class="carte-collection${on ? " choisie" : ""}" data-action="choisirDepart" data-id="${c.id}" style="--i:${i}">
      <span class="carte-collection-haut">
        <span class="carte-collection-icone">${icone(c.icone, 22)}</span>
        <span class="coche${on ? " active" : ""}">${on ? icone("valider", 18) : ""}</span>
      </span>
      <span class="t-texte-label carte-collection-nom">${esc(c.nom)}</span>
      <span class="t-texte-meta secondaire carte-collection-sous">${c.total} scraps${proches.includes(c.id) ? " · près de toi" : ""}</span>
      <span class="t-texte-petit secondaire carte-collection-resume">${esc(c.resume || c.zone)}</span>
    </button>`;
  };
  return `
  ${entete("Tes collections", { droite: `<span class="t-texte-meta secondaire">2 / 2</span>` })}
  <div class="defile">
    <h1 class="t-titre-l" style="margin:8px 0 8px">Par quoi tu commences ?</h1>
    <p class="t-texte-petit secondaire" style="margin:0 0 4px">Trois au maximum, pour qu'elles restent faisables à pied. Tu pourras en ouvrir d'autres plus tard.</p>
    <div class="compteur-choix"><i style="width:${(n / 3) * 100}%"></i></div>
    <p class="t-texte-meta secondaire" style="margin:16px 0 10px">Autour de Belleville</p>
    <div class="grille-collections">${D.collections.filter((c) => proches.includes(c.id)).map(carte).join("")}</div>
    <div style="margin-top:20px">${(() => {
      const reste = D.collections.filter((c) => !proches.includes(c.id));
      const prises = reste.filter((c) => ETAT.collectionsDepart.includes(c.id)).length;
      /* Le texte dit « trois au maximum » : poser les douze à plat le
       * contredisait. Les trois proches suffisent à démarrer, le reste
       * s'ouvre si on en veut. */
      return repli(`Tout le reste`, prises ? `${pluriel(prises, "choisie")} sur ${reste.length}` : `${reste.length} collections`,
        `<div class="grille-collections">${reste.map((c, i) => carte(c, i + 3)).join("")}</div>`,
        { id: "repli-collections-depart", ouvert: prises > 0 || (ETAT.ctx.replis || {})["repli-collections-depart"] });
    })()}</div>
  </div>
  ${pied(`<button class="bouton" data-aller="13"${n ? "" : " disabled"}>Commencer · ${pluriel(n, "collection")}</button>`, { filet: true })}`;
});

/* ═════════ B. Carte et capture */

const champCarte = () => `<button class="champ-carte" data-aller="15">${icone("recherche")}<span>Rechercher un scrap, un lieu</span></button>`;
const cibleProche = () => ciblesAFaire().sort((a, b) => distanceM(a) - distanceM(b))[0];

ecran("13", "B", "Carte d'accueil", "", () => {
  const c = cibleProche();
  const vide = !c;
  return `
  <div class="carte" id="carte"></div>
  <div class="carte-ui" style="position:relative;flex:1">
    <div class="carte-haut">${champCarte()}
      <button class="carre-bouton" data-action="monProfil" aria-label="Mon profil">${ETAT.utilisateur.avatar ? avatarPersonne(46) : icone("profil")}</button></div>
    <div style="padding:8px var(--marge) 0;display:flex;justify-content:flex-end"><button class="carre-bouton${filtresPoses() ? " actif" : ""}" data-aller="14" aria-label="Filtres">${icone("filtre")}</button></div>
    <div class="carte-bas">
      ${vide ? `<div class="panneau" style="flex-direction:column;align-items:flex-start;padding:16px">
          <span class="t-titre-m">Aucun scrap à moins de ${ETAT.reglages.rayon >= 1000 ? ETAT.reglages.rayon / 1000 + " km" : ETAT.reglages.rayon + " m"}</span>
          <span class="t-texte-petit secondaire">Élargis le rayon ou change de quartier.</span>
          ${lien("Élargir à 2 km", { action: "elargir" })}</div>`
        : `<button class="panneau" data-action="ouvrirCible" data-id="${c.id}">
          ${miniatureCible(c)}
          <span style="flex:1"><span class="rangee" style="gap:6px">${c.nouveau ? '<i class="pastille"></i>' : ""}<span class="t-texte-meta secondaire">${c.nouveau ? "Nouveau · " : ""}à ${distanceTxt(c)}</span></span>
          <span class="t-titre-m" style="display:block">${esc(c.titre)}</span><span class="t-texte-petit secondaire">${esc(c.adresse)}</span></span>
          <span class="secondaire">${icone("chevron")}</span></button>`}
      ${bouton("Capturer un scrap", { type: "capture", aller: "19" })}
    </div>
  </div>
  ${onglets(0)}`;
}, (r) => carteMonter($("#carte", r), { marqueurs: true }));

ecran("14", "B", "Filtres de la carte", "", () => {
  const f = ETAT.filtres;
  return `
  <div class="carte" id="carte"></div>
  <div class="voile" data-aller="13"></div>
  <div class="feuille">
    <div class="rangee entre"><span class="t-titre-m">Filtres</span>${lien("Réinitialiser", { action: "reinitFiltres" })}</div>
    <div style="margin-top:20px"><div class="curseur-ligne"><span class="t-texte-petit">Rayon</span><span class="t-texte-petit secondaire" id="rayon-val">${ETAT.reglages.rayon} m</span></div>
      <input type="range" min="200" max="2000" step="100" value="${ETAT.reglages.rayon}" data-input="rayon"></div>
    <div style="margin-top:20px">${boutonChoix("Collection",
      f.collection === "toutes" ? "Toutes" : (collection(f.collection) || {}).nom || "Toutes", "ouvrirChoixCollectionCarte")}</div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 10px">État</p>
    <div class="puces retour-ligne">${[["tous", "Tous"], ["nouveaux", "Nouveaux"]].map(([id, nom]) => puce(nom, f.etat === id, ` data-action="filtreCarte" data-cle="etat" data-val="${id}"`)).join("")}</div>
    <div style="margin-top:12px">${ligne("Seulement ce qui me manque", { toggle: "manquants" })}</div>
    <div style="margin-top:16px">${bouton(`Afficher ${pluriel(ciblesVisibles().length, "scrap")}`, { aller: "13" })}</div>
  </div>`;
}, (r) => carteMonter($("#carte", r), { marqueurs: true, statique: true }));

ecran("15", "B", "Recherche", "grille", () => `
  <header class="entete"><div class="entete-ligne">
    <button class="icone-bouton" data-action="retour" aria-label="Retour">${icone("retour")}</button>
    <div class="recherche" style="flex:1"><input id="q" type="search" placeholder="Une affiche à capturer, un lieu" autocomplete="off" value="${esc(ETAT.ctx.q || "")}"></div>
    ${lien("Annuler", { action: "retour" })}
  </div></header>
  <div class="defile" id="resultats"></div>`, (r) => {
  const q = $("#q", r), res = $("#resultats", r);
  const maj = () => { ETAT.ctx.q = q.value; res.innerHTML = resultatsRecherche(q.value); };
  q.addEventListener("input", maj);
  maj();
  setTimeout(() => q.focus(), 250);
});

function resultatsRecherche(q) {
  const n = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const m = n(q.trim());
  const ok = (...champs) => !m || champs.some((c) => n(c || "").includes(m));
  /* On ne cherche ici que ce qu'on n'a PAS encore : la recherche sert à
   * trouver quoi aller capturer. Les scraps déjà capturés se retrouvent dans
   * l'onglet Collection, qui est fait pour ça. */
  const ci = D.cibles.filter((c) => !c.fait && ok(c.titre, c.adresse, collection(c.collection).nom))
    .sort((a, b) => distanceM(a) - distanceM(b));
  const li = ok(D.lieu.nom, D.lieu.adresse) ? [D.lieu] : [];
  const bloc = (titre, html) => (html ? `<p class="t-texte-meta secondaire" style="margin:16px 0 4px">${titre}</p><div class="liste">${html}</div>` : "");
  const html =
    bloc("À capturer autour de toi", ci.slice(0, 8).map((c) => `<button class="ligne" data-action="ouvrirCible" data-id="${c.id}" style="min-height:72px">
      ${miniatureCible(c)}
      <span style="flex:1"><span class="t-texte-label" style="display:block">${esc(c.titre)}</span>
        <span class="t-texte-meta secondaire">${c.nouveau ? "Nouveau · " : ""}${esc(c.adresse)}</span></span>
      <span class="t-texte-meta secondaire">${distanceTxt(c)}</span>
      <span class="secondaire">${icone("chevron")}</span></button>`).join("")) +
    bloc("Lieux", li.map((l) => ligne(l.nom, { aller: "40", icone: "position", valeur: "350 m" })).join(""));
  return (html || `<p class="t-texte-corps secondaire centre" style="margin-top:48px">Rien trouvé pour « ${esc(q)} ».</p>`)
    + `<p class="t-texte-petit secondaire centre" style="margin:28px 0 0">Les scraps que tu as déjà capturés sont dans ${"<b>Collection</b>"}.</p>`;
}

ecran("16", "B", "Scrap repéré (avant capture)", "", () => {
  const c = cibleCourante();
  const col = collection(c.collection);
  const manque = !complete(c.collection);
  return `
  <div class="carte" id="carte"></div>
  <div class="carte-ui"><div class="carte-haut"><button class="carre-bouton" data-action="retour" aria-label="Retour">${icone("retour")}</button></div></div>
  <div class="feuille" style="max-height:60%">
    <span class="t-titre-m">${esc(c.titre)}</span>
    <p class="t-texte-meta secondaire" style="margin:8px 0 16px">Scrap repéré · à ${distanceTxt(c)} · ${minutes(c)} min à pied</p>
    <div class="rangee" style="align-items:stretch;gap:16px">
      <div style="width:110px;flex:none;background:var(--fond-secondaire);display:grid;place-items:center;text-align:center;padding:12px" class="secondaire">${icone("scan")}<span class="t-texte-meta">À capturer sur place</span></div>
      <div class="tableau" style="flex:1;border-top:1px solid var(--trait-defaut)">
        <div class="ligne" style="flex-direction:column;align-items:flex-start;gap:2px"><span class="t-texte-meta secondaire">Lieu</span><span class="t-texte-petit">${esc(c.adresse)}</span></div>
        <div class="ligne" style="flex-direction:column;align-items:flex-start;gap:2px"><span class="t-texte-meta secondaire">Collection</span><span class="t-texte-petit">${esc(col.nom)}${manque ? " · il te manque celui-ci" : ""}</span></div>
        <div class="ligne" style="flex-direction:column;align-items:flex-start;gap:2px"><span class="t-texte-meta secondaire">Déjà capturé</span><span class="t-texte-petit">${c.scans} personnes · tu serais le ${rangTxt(c.scans + 1)}</span></div>
      </div>
    </div>
    <div class="deux-col" style="margin-top:20px">${bouton("Y aller", { aller: "17" })}${bouton("Partager", { type: "secondaire", aller: "39" })}</div>
  </div>`;
}, (r) => carteMonter($("#carte", r), { cible: cibleCourante(), decalage: 0.25 }));

ecran("17", "B", "Itinéraire à pied", "", () => {
  const c = cibleCourante();
  return `
  <div class="carte" id="carte"></div>
  <div class="carte-ui" style="position:relative;flex:1">
    <div class="carte-haut"><div class="panneau" style="padding:12px 16px;flex-direction:column;align-items:stretch">
      <div class="rangee entre"><span class="t-titre-m">Vers ${esc(c.titre)}</span>${lien("Arrêter", { aller: "13" })}</div>
      <span class="t-texte-meta secondaire">${distanceTxt(c)} · ${minutes(c)} min à pied</span></div></div>
    <div class="carte-bas">
      ${boussoleHtml(c)}
      ${bouton("Capturer un scrap", { type: "capture", aller: "19" })}
    </div>
  </div>
  ${onglets(0)}`;
}, (r) => {
  const c = cibleCourante();
  const n1 = carteMonter($("#carte", r), { cible: c, itineraire: true });
  const n2 = boussoleMonter(r, c);
  return () => { n1 && n1(); n2 && n2(); };
});

ecran("18", "B", "Carte vide", "", () => `
  <div class="carte" id="carte"></div>
  <div class="carte-ui" style="position:relative;flex:1">
    <div class="carte-haut">${champCarte()}<button class="carre-bouton" data-action="monProfil" aria-label="Mon profil">${icone("profil")}</button></div>
    <div class="carte-bas">
      <div class="panneau" style="flex-direction:column;align-items:flex-start;padding:16px">
        <span class="t-titre-m">Aucun scrap à moins de 500 m</span>
        <span class="t-texte-petit secondaire">Élargis le rayon ou change de quartier.</span>
        ${lien("Élargir à 2 km", { action: "elargir" })}</div>
      ${bouton("Capturer un scrap", { type: "capture", aller: "19" })}
    </div>
  </div>
  ${onglets(0)}`, (r) => carteMonter($("#carte", r), { marqueurs: false }));

/* 19 — le scanner. Les contours de l'affiche sont suivis en direct ; dès que
 * le cadre ne bouge plus, la photo part toute seule (voir js/camera.js). */
ecran("19", "B", "Scanner", "sombre", () => `
  <video class="camera" id="video" playsinline autoplay muted></video>
  <svg class="cadre-scan" id="cadre-scan" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true">
    <path class="voile-scan" fill-rule="evenodd"></path>
    <polygon vector-effect="non-scaling-stroke"></polygon>
    ${'<circle class="coin-scan" r="2.4" opacity="0" vector-effect="non-scaling-stroke"></circle>'.repeat(4)}
  </svg>
  <i class="balayage-scan"></i>
  <header class="entete transparent" style="color:#fff;z-index:6"><div class="entete-ligne">
    <button class="icone-bouton" data-action="retour" aria-label="Fermer">${icone("fermer")}</button>
    <span class="entete-titre t-texte-meta">Vise une affiche</span>
    <button class="puce puce--sombre${ETAT.reglages.scanAuto === false ? "" : " active"}" data-action="basculerAuto">Auto</button>
  </div></header>
  <div class="etat-scan" id="etat-scan-boite">
    <span class="t-texte-meta" id="etat-scan">Cherche une affiche…</span>
  </div>
  <p class="t-texte-petit centre" id="consigne">Pas besoin d'appuyer : garde l'affiche dans le champ, la photo se prend toute seule.</p>
  <button class="coin-magique${ETAT.ctx.forcerVivante ? " arme" : ""}" data-action="forcerVivante" aria-label="Mode démonstration"></button>
  <div class="scanner-bas" style="z-index:3">
    <label class="galerie" aria-label="Choisir une photo">${icone("image")}<input type="file" accept="image/*" class="cache" data-change="photoCapture"></label>
    <button class="declencheur" id="jauge-scan" data-action="capturer" aria-label="Capturer"></button>
    <button class="galerie torche indispo" id="torche" data-action="torche" aria-pressed="false" aria-label="Lampe">${icone("lampe")}</button>
  </div>`, (r) => cameraDemarrer($("#video", r)));

/* 19.1 — on regarde ce qui a été scanné avant de l'identifier. */
ecran("19.1", "B", "Vérifier le scan", "sombre", () => {
  const p = ETAT.ctx.capture;
  if (!p) return `${entete("Vérifier le scan")}<div class="defile"><p class="t-texte-corps secondaire">Aucune capture en cours.</p>${bouton("Capturer un scrap", { type: "capture", aller: "19" })}</div>`;
  return `
  <header class="entete transparent" style="color:#fff;z-index:6"><div class="entete-ligne">
    <button class="icone-bouton" data-aller="19" aria-label="Reprendre">${icone("fermer")}</button>
    <span class="entete-titre t-texte-meta">${p.scanne ? "Contours redressés" : "Photo importée"}</span><span></span>
  </div></header>
  <div class="verif-zone">
    <div class="verif-scrap" id="verif-scrap">
      <i class="verif-lueur couche" style="--p:18"></i>
      <div class="verif-image couche" style="--p:5"><img src="${p.img}" alt="Scrap scanné"></div>
    </div>
    <div class="verif-infos">
      <span class="t-texte-meta accent">Scrap N° ${pad3(p.num)}</span>
      <span class="t-texte-meta" style="color:#9A9A96">${p.scanne ? "Détouré et remis droit" : "Importé de la galerie"} · ${rarete(p).nom.toLowerCase()}</span>
    </div>
  </div>
  <div class="verif-question">
    <span class="t-titre-m" style="color:#fff">Ce scan te plaît ?</span>
    <p class="t-texte-petit" style="color:#9A9A96;margin:6px 0 0">S'il est flou ou de travers, reprends-le : l'affiche garde le même numéro.</p>
  </div>
  ${pied(`<div class="rang">
    <button class="bouton bouton--secondaire bouton--sombre" data-action="reprendreScan">${icone("reprendre", 20)}Reprendre</button>
    <button class="bouton bouton--capture" data-action="garderScan">${icone("valider", 20)}Garder</button></div>`, { transparent: true })}`;
}, (r) => profondeur($("#verif-scrap", r), { amplitude: 1 }));

/* ═════════ 19.3 — L'AFFICHE VIVANTE
 *
 * Certaines affiches de la rue sont éditées par SCRAP. Quand on en scanne
 * une, l'app ne range pas une image de plus : elle la reconnaît et la
 * réveille. Le papier qu'on vient de photographier redevient du vecteur, se
 * redessine devant soi, et bouge quand on penche le téléphone ou qu'on le
 * touche.
 *
 * C'est le seul endroit de l'app où une affiche a le droit d'être animée :
 * parce que celle-là, c'est nous qui l'avons faite. La règle « l'affiche est
 * intouchable » protège les affiches des autres, pas les nôtres. */
const SVG_VIVANT = {};          // les affiches, chargées une fois pour toutes
const afficheVivanteCourante = () => {
  const liste = ((window.CONFIG && CONFIG.afficheVivante && CONFIG.afficheVivante.liste) || []);
  const id = ETAT.ctx.capture && ETAT.ctx.capture.vivante;
  return liste.find((a) => a.id === id) || liste[0] || null;
};

ecran("19.3", "B", "Affiche vivante", "sombre", () => {
  const a = afficheVivanteCourante();
  return `
  <header class="entete transparent" style="color:#fff;z-index:6"><div class="entete-ligne">
    <button class="icone-bouton" data-aller="19" aria-label="Reprendre">${icone("fermer")}</button>
    <span class="entete-titre t-texte-meta">Affiche vivante</span><span></span>
  </div></header>
  <div class="vivante-zone">
    <div class="vivante-scene" id="vivante-scene" data-action="secouerAffiche" role="button" tabindex="0">
      <span class="vivante-attente t-texte-meta">L'affiche se réveille…</span>
    </div>
  </div>
  <div class="vivante-pied">
    <span class="etiquette etiquette--num">${esc(a ? a.par : "Affiche vivante")} · N° 002</span>
    <p class="t-texte-petit" style="color:#9A9A96;margin:10px 0 0">Celle-ci a une version animée, publiée avec le papier. SCRAP l'a reconnue. Penche le téléphone, ou touche-la.</p>
  </div>
  ${pied(`<div class="rang">
    <button class="bouton bouton--secondaire bouton--sombre" data-aller="19">${icone("reprendre", 20)}Reprendre</button>
    <button class="bouton" data-aller="19.2">${icone("valider", 20)}Garder</button></div>`, { transparent: true })}`;
},
(r) => {
  const scene = $("#vivante-scene", r);
  if (!scene) return null;
  const a = afficheVivanteCourante();
  const poser = (texte) => {
    scene.innerHTML = texte;
    const svg = scene.querySelector("svg");
    if (svg) { svg.removeAttribute("width"); svg.removeAttribute("height"); }
    requestAnimationFrame(() => {
      scene.classList.add("reveil");
      vibrer([10, 60, 14, 40, 22]);
      setTimeout(() => pluieEtoiles(scene, 20), 1500);
    });
  };
  if (!a) return null;
  if (SVG_VIVANT[a.id]) poser(SVG_VIVANT[a.id]);
  else {
    fetch(a.fichier).then((x) => x.text()).then((t) => { SVG_VIVANT[a.id] = t; if ($("#vivante-scene")) poser(t); })
      .catch(() => { scene.innerHTML = `<img src="${ETAT.ctx.capture ? ETAT.ctx.capture.img : ""}" alt="" style="width:100%">`; });
  }
  return null;
});

ecran("19.2", "B", "Identifier le scrap", "grille", () => {
  const p = ETAT.ctx.capture;
  if (!p) return `${entete("Identifier le scrap")}<div class="defile"><p class="t-texte-corps secondaire">Aucune capture en cours.</p>${bouton("Capturer un scrap", { type: "capture", aller: "19" })}</div>`;
  const tags = ["Concert", "Club", "Expo", "Musique", "Marché", "Politique", "Street art", "Soirée", ...(p.tagsPerso || [])];
  return `
  ${entete("Identifier le scrap", { retourVers: "19.1" })}
  <div class="defile">
    <div style="display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:start">
      <button data-aller="19.1" style="display:block"><img src="${p.img}" alt="" style="width:120px;background:var(--fond-secondaire)"></button>
      <div><span class="t-texte-meta accent">Scrap N° ${pad3(p.num)}</span>
        <p class="t-texte-petit" style="margin:4px 0 0">Tu es le ${rangTxt(p.num)} à le capturer. ${esc(rarete(p).texte)}.</p>
        <p class="t-texte-petit secondaire" style="margin:8px 0 0">L'app ne reconnaît pas encore toute seule : nomme et classe ton scrap.</p></div>
    </div>
    <div style="height:24px"></div>
    ${champ("Titre", p.titre || "", { id: "titre-capture", placeholder: "Ex. Concert au Studio Belleville" })}
    ${champ("Lieu", p.lieu || "Rue de Belleville", { id: "lieu-capture" })}
    <p class="t-texte-meta secondaire" style="margin:4px 0 10px">Collection</p>
    <div class="puces retour-ligne">${collectionsSuggerees().map((cid) => {
      const c = collection(cid);
      return puce(`${c.nom} · ${progression(cid).n}/${c.total}`, p.collection === cid, ` data-action="captureCollection" data-id="${cid}"`);
    }).join("")}
      <button class="puce" data-action="choixCollectionCapture">Autre…</button></div>
    <div style="margin-top:20px">${repli("Tags et état", resumeTagsCapture(p), `
      <div class="puces retour-ligne" id="tags">${tags.map((t) => puce(t, (p.themes || []).includes(t), ` data-action="captureTag" data-id="${esc(t)}"`)).join("")}
        <button class="puce" data-action="ajouterTag">+ Tag</button></div>
      <div id="tag-perso" class="cache" style="margin-top:12px">${champ("Nouveau tag", "", { id: "nouveau-tag", placeholder: "Ex. Rap, Théâtre, Fanzine" })}</div>
      <div class="ligne" style="margin-top:4px"><span class="libelle">Scrap holo</span><button class="interrupteur${p.holo ? " on" : ""}" data-action="captureHolo"></button></div>`,
      { id: "repli-tags", ouvert: (ETAT.ctx.replis || {})["repli-tags"] })}</div>
  </div>
  ${pied(bouton("Valider le scrap", { action: "validerCapture" }))}`;
});

/* On ne pose plus les douze collections à plat juste après la capture : les
 * trois les plus probables (celles qu'on a ouvertes au départ, puis celles où
 * on a déjà des scraps) et « Autre… » pour le reste. */
function collectionsSuggerees() {
  const p = ETAT.ctx.capture || {};
  const l = collectionsOrdonnees().slice(0, 3).map((c) => c.id);
  if (p.collection && !l.includes(p.collection)) { l.unshift(p.collection); l.pop(); }
  return l;
}
const resumeTagsCapture = (p) => {
  const n = (p.themes || []).length;
  return (n ? pluriel(n, "tag") : "aucun tag") + (p.holo ? " · holo" : "");
};
/* Le repli est fermé : sa valeur doit rester juste sans redessiner la page. */
function majResumeTags() {
  const el = $("#repli-tags .repli-valeur");
  if (el && ETAT.ctx.capture) el.textContent = resumeTagsCapture(ETAT.ctx.capture);
}

ecran("20", "B", "Capture échouée", "sombre", () => `
  <img class="camera" src="assets/affiches/different.jpg" alt="" style="object-fit:contain;opacity:.6">
  <header class="entete transparent" style="color:#fff"><div class="entete-ligne"><button class="icone-bouton" data-aller="13">${icone("fermer")}</button></div></header>
  <div class="feuille" style="color:var(--texte-principal)">
    <span class="t-titre-m">Pas de scrap ici</span>
    <p class="t-texte-corps secondaire" style="margin:12px 0 20px">L'affiche est abîmée, cachée, ou pas encore sur la carte. Tu peux la signaler pour qu'elle rejoigne la collection de tout le monde.</p>
    <div class="pile">${bouton("Signaler l'affiche", { type: "secondaire", action: "signaler" })}${bouton("Réessayer", { aller: "19" })}</div>
  </div>`);

/* Recto (21) et verso (22) : un seul écran, la carte se retourne.
 * Le décor derrière la carte suit l'inclinaison du téléphone (gyroscope), et
 * l'effet est d'autant plus fort que le scrap est rare : être le 3e à capturer
 * une affiche se voit, être le 300e beaucoup moins. */
function rectoVerso(verso) {
  /* Un scrap d'un carnet rapporté d'ailleurs n'est pas dans la collection
   * d'Inès : on l'affiche quand même, en lecture seule. */
  const id = ETAT.ctx.scrap && infoScrap(ETAT.ctx.scrap) ? ETAT.ctx.scrap : "alta";
  ETAT.ctx.scrap = id;
  const s = infoScrap(id);
  const archive = !scrap(id);
  const col = collection(s.collection);
  const p = col ? progression(s.collection) : null;
  const surMur = ETAT.mur.items.some((it) => it.id === id);
  const frais = ETAT.ctx.frais === id;
  const r = rarete(s);
  const exclusif = s.collection === "exclusifs" ? (s.exclusif || "concerts") : null;
  const lignes = [["Artiste", s.artiste || "—"], ["Lieu", `${s.lieu}, ${s.arr.replace("Paris ", "")}`],
    [s.offert ? "Reçu le" : "Capturé le", `${s.date} · ${s.heure}`],
    ...(s.offert ? [["Donné par", s.offert]] : [["Tags", (s.themes || []).join(" · ") || "—"]]),
    ["État", s.holo ? "Holo" : "Normal"], ["Rareté", r.nom],
    ["Collection", col ? `${col.nom} · ${p.n} / ${p.total}` : "Exclusif"]];
  return `
  ${entete("Scrap capturé", { droite: `<button class="icone-bouton" data-aller="39" aria-label="Partager">${icone("partager")}</button>` })}
  <div class="defile scrap-page rarete-${r.cle}">
    <div class="scrap-scene${s.holo ? " est-holo" : ""}" id="scene-scrap">
      <div class="scrap-creux boite-prof" aria-hidden="true">
        <i class="prof-vide" style="--z:1"></i>
        <i class="prof-sol" style="--z:.92"></i>
        <i class="prof-halo" style="--z:.74"></i>
      </div>
      <i class="decor-halo couche" style="--p:26"></i>
      <i class="decor-rayons couche" style="--p:38"></i>
      <i class="decor-trame couche" style="--p:12"></i>
      ${s.holo ? '<i class="aura-holo couche" style="--p:34"></i>' : ""}
      ${poussiere(8)}${etoiles(9, { prof: 16, ecart: 46, taille: 7, variation: 9 })}
      <div class="scrap-inclinaison">
        <div class="retourne${verso ? " verso" : ""}" id="retourne" data-action="retourner">
          <div class="retourne-int">
            ${exclusif
              ? `<div class="face scrap-img face--exclusive">${carteExclusive(exclusif)}</div>`
              : `<img class="face scrap-img" src="${imgScrap(id)}" alt="${esc(s.titre)}" style="aspect-ratio:${s.ratio}">`}
            <div class="face face--verso"><div class="verso-carte">
              <div class="verso-haut">${logo(15)}<span class="t-texte-meta secondaire">${esc(r.nom)}</span></div>
              <div class="verso-numero">
                <span class="t-chiffre-capture accent" id="num-verso">${pad3(s.num)}</span>
                <span class="t-texte-meta secondaire">${rangTxt(s.num)} à l'avoir capturé</span>
              </div>
              <div class="tableau verso-tableau">
                ${lignes.map(([k, v], i) => `<div class="ligne" style="--i:${i}"><span class="cle t-texte-meta secondaire">${k}</span><span class="t-texte-petit">${esc(v)}</span></div>`).join("")}
              </div>
              <div class="verso-bas">
                <span class="t-texte-meta secondaire">${s.scans} captures · ${pluriel(s.murs, "scrapbook")}</span>
                <span class="t-texte-meta accent">${esc(s.arr)}</span>
              </div>
              <i class="verso-codebarre" aria-hidden="true"></i>
            </div></div>
          </div>
        </div>
      </div>
      <i class="viseur-scrap couche" style="--p:-10">${"<i></i>".repeat(4)}</i>
      <span class="repere-scrap haut-gauche couche" style="--p:30">${icone("plus", 14)}</span>
      <span class="repere-scrap bas-droit couche" style="--p:40">${icone("plus", 14)}</span>
      <span class="flottant etiquette-flottante couche" style="--p:34">${esc(col ? col.nom : "Exclusif")}</span>
      <span class="flottant num-flottant couche" style="--p:32">N° <b id="num-recto">${pad3(s.num)}</b></span>
      <span class="flottant date-flottante couche" style="--p:24">${esc(s.date)}</span>
      <i class="regle-scrap couche" style="--p:16"></i>
      <span class="scrap-tampon couche" style="--p:20">${tampon("Scrap N° " + pad3(s.num), `${s.arr} · ${s.date}`, { grand: true, plein: !col || complete(s.collection), pose: frais })}</span>
    </div>

    <div class="rangee" style="margin-top:20px;gap:8px;flex-wrap:wrap">
      ${etiquette("Scrap N° " + pad3(s.num), true)}
      <span class="etiquette etiquette--rarete">${esc(r.nom)}</span>
      ${s.holo ? etiquette("Holo") : ""}
    </div>
    <div class="rangee entre" style="margin-top:10px;align-items:flex-start;gap:12px">
      <div style="min-width:0">
        <h1 class="t-titre-l" style="margin:0 0 4px">${esc(s.titre)}</h1>
        <p class="t-texte-petit secondaire" style="margin:0">${esc(s.lieu)} · ${esc(r.texte.toLowerCase())}</p>
      </div>
      ${archive ? `<span class="etiquette">Carnet ${esc(ETAT.mur.nom || "")}</span>`
        : `<button class="coeur${s.favori ? " on" : ""}" data-action="favori" aria-pressed="${!!s.favori}" aria-label="${s.favori ? "Retirer des favoris" : "Ajouter aux favoris"}">
        ${icone("coeur", 24)}<span class="t-texte-meta">Favori</span></button>`}
    </div>
    <div class="rangee entre" style="margin-top:18px">
      <span class="t-texte-meta secondaire">Touche la carte pour la retourner</span>${boutonGyro()}
    </div>
    <div class="centre">${lien("Voir l'événement", { aller: "23", centre: true })}</div>
  </div>
  ${pied(archive
    ? bouton("Revenir au carnet", { aller: "24" })
    : surMur ? bouton("Voir sur mon scrapbook", { aller: "24" }) : bouton("Coller sur mon scrapbook", { action: "coller" }))}`;
}
const monterRecto = (r) => {
  const toutNeuf = ETAT.ctx.frais === ETAT.ctx.scrap;
  ETAT.ctx.frais = null;
  // le tampon frappe : l'à-coup se voit et se sent
  if (toutNeuf) setTimeout(() => vibrer([16, 40, 12]), 220);
  const s = infoScrap(ETAT.ctx.scrap);
  // le numéro du recto défile lui aussi avant de se poser
  const nr = $("#num-recto", r);
  if (nr && s) setTimeout(() => compteurAnime(nr, s.num, { duree: 820 }), 260);
  const n1 = glisser($("#retourne", r), () => ACTIONS.retourner(), () => ACTIONS.retourner());
  const n2 = profondeur($("#scene-scrap", r), { amplitude: s && rarete(s).cle === "commune" ? 0.6 : 1.15 });
  if ($("#retourne", r) && $("#retourne", r).classList.contains("verso")) setTimeout(animerVerso, 120);
  return () => { n1 && n1(); n2 && n2(); };
};
/* Le verso s'anime à chaque fois qu'on le découvre : le numéro défile en
 * chiffres au hasard avant de se poser, puis le petit tampon se pose dessus. */
function animerVerso() {
  const el = $("#num-verso");
  if (!el) return;
  const s = infoScrap(ETAT.ctx.scrap);
  el.classList.remove("pose");
  compteurAnime(el, s ? s.num : 0, { duree: 1000 });
  const t = $(".verso-tableau");
  if (t) { t.classList.remove("entre-en-scene"); void t.offsetWidth; t.classList.add("entre-en-scene"); }
}
ecran("21", "B", "Scrap capturé — recto", "grille", () => rectoVerso(false), monterRecto);
ecran("22", "B", "Scrap capturé — verso", "grille", () => rectoVerso(true), monterRecto);

ecran("23", "B", "Détail de l'événement", "grille", () => {
  const id = ETAT.ctx.scrap && scrap(ETAT.ctx.scrap) ? ETAT.ctx.scrap : "alta";
  const s = scrap(id);
  return `
  ${entete("Événement", { droite: `<button class="icone-bouton" data-aller="39">${icone("partager")}</button>` })}
  <div class="defile">
    <div style="display:grid;grid-template-columns:86px 1fr;gap:16px">
      <img src="${imgScrap(id)}" alt="" style="width:86px">
      <div><h1 class="t-titre-l" style="margin:0 0 10px">${esc(s.titre)}</h1>${etiquette((s.themes || ["Événement"])[0])}</div>
    </div>
    <div class="tableau" style="margin-top:24px;border-top:1px solid var(--trait-defaut)">
      ${[["Date", "Ven. 12.12 · 21:00"], ["Lieu", D.lieu.nom + ", 20e"], ["Prix", "12 € · gratuit avant 22 h"], ["Accès", "Métro Belleville (2, 11)"]]
        .map(([k, v]) => `<div class="ligne"><span class="cle t-texte-meta secondaire">${k}</span><span class="t-texte-petit">${esc(v)}</span></div>`).join("")}
    </div>
    <p class="t-texte-corps" style="margin:20px 0 12px">Une nuit d'écoute en haute fidélité, du jazz au club. Le scrap de cette affiche fait partie de ta collection ${esc(collection(s.collection) ? collection(s.collection).nom : "")}.</p>
    ${lien("Voir le lieu : " + D.lieu.nom, { aller: "40" })}
  </div>
  ${pied(bouton("Voir l'événement", { action: "billetterie" }) + bouton("Itinéraire", { type: "secondaire", action: "itineraireLieu" }))}`;
});

/* ═════════ C. Scrapbook (24 à 27 : même page, outil différent)
 * 24 a deux modes : Vue (on promène et on zoome, rien ne bouge) et
 * Disposition (on range : déplacer, agrandir, tourner). */
const FONDS = [["papier", "Papier"], ["grille", "Quadrillé"], ["millimetre", "Millimétré"], ["kraft", "Kraft"],
  ["beton", "Béton"], ["liege", "Liège"], ["journal", "Journal"], ["noir", "Noir"],
  ["calque", "Calque"], ["seyes", "Seyès"], ["carton", "Carton"], ["ardoise", "Ardoise"]];
const SCOTCHS = [["transparent", "Transparent"], ["kraft", "Kraft"], ["papier", "Papier"], ["noir", "Noir"],
  ["rubalise", "Rubalise"], ["raye", "Rayé"], ["fluo", "Fluo"], ["dore", "Doré"]];
/* Le mode n'est plus un choix à faire, c'est l'état du tiroir : fermé on
 * regarde, ouvert on range. */
const modeMur = () => (ETAT.ctx.tiroir ? "deplacer" : "regarder");

const commandesZoom = () => `<div class="mur-commandes">
  <button data-zoom="plus" aria-label="Zoomer">${icone("plus", 20)}</button>
  <button data-zoom="moins" aria-label="Dézoomer">${icone("zoomMoins", 20)}</button>
  <button data-zoom="ensemble" aria-label="Vue d'ensemble">${icone("vue", 20)}</button>
  <span class="t-texte-meta secondaire" id="zoom-valeur">100 %</span>
</div>`;

/* Les trois familles d'éléments du scrapbook. On ne montre que celle qu'on
 * regarde : les seize autres boutons ne servent pas tant qu'on n'a pas décidé
 * si on écrivait, collait ou marquait. */
const FAMILLES_NOTE = [
  ["ecrire", "Écrire", "un titre, une étiquette, une date"],
  ["papiers", "Papiers", "un papier qu'on colle et sur lequel on écrit"],
  ["marquer", "Marquer", "flèches, étoiles, scotch, punaises"],
];
const MEMBRES_NOTE = {
  ecrire: ["titre", "soustitre", "etiquette", "date"],
  papiers: ["postit", "bulle", "ticket"],
};
const familleDe = (t) => (MEMBRES_NOTE.ecrire.includes(t) ? "ecrire" : MEMBRES_NOTE.papiers.includes(t) ? "papiers" : "marquer");
const familleNote = () => ETAT.ctx.familleNote || "ecrire";

const DECHIRURES = [
  ["coin", "Un coin", "Comme une affiche décollée trop vite."],
  ["bord", "Un bord", "On arrache une bande, en haut ou en bas."],
  ["moitie", "En deux", "La coupe passe au milieu."],
  ["arrachee", "Arrachée", "Une grosse bouchée, bien irrégulière."],
  ["mesure", "Sur mesure", "Glisse ton doigt à travers le scrap."],
];

/* Le tiroir d'outils.
 *
 * Avant, les sept outils étaient posés en permanence sous la page, y compris
 * quand on venait simplement regarder son carnet : on filmait une barre
 * d'outils plutôt qu'un scrapbook. Maintenant il n'y a qu'un bouton. On le
 * touche, le tiroir monte, et on est en Disposition — le mode n'est plus une
 * question posée à l'arrivée, c'est la conséquence du geste.
 *
 * Sur les écrans d'outil (24.1, 24.3, 25, 26, 27) le tiroir est ouvert par
 * définition : on y est entré par lui. */
const tiroirOuvert = (ecranId) => ecranId !== "24" || !!ETAT.ctx.tiroir;

const OUTILS_SCRAPBOOK = (ecranId) => {
  if (!tiroirOuvert(ecranId)) {
    /* L'astuce ne sert que la première fois. Ensuite c'est du bruit : on la
     * remplace par l'état de la page, qui lui change. */
    const vue = ETAT.ctx.astuceVue;
    ETAT.ctx.astuceVue = true;
    return `<div class="outils outils--ferme">
      <button class="puce puce--composer" data-action="ouvrirTiroir">${icone("composer", 16)}Composer</button>
      <span class="t-texte-meta secondaire une-ligne astuce-ligne">${vue
        ? "" : "Un doigt promène · deux doigts zooment"}</span>
    </div>`;
  }
  return `<div class="outils">
    ${puce("Ranger", ecranId === "24", ' data-action="modeMur" data-id="deplacer"')}
    ${puce("Ajouter", ecranId === "24.1", ' data-aller="24.1" data-remplace="1"')}
    ${puce("Dessiner", ecranId === "24.3", ' data-aller="24.3" data-remplace="1"')}
    ${puce("Scotch", ecranId === "26", ' data-aller="26" data-remplace="1"')}
    ${puce("Déchirer", ecranId === "27", ' data-aller="27" data-remplace="1"')}
    ${puce("Fond", ecranId === "25", ' data-aller="25" data-remplace="1"')}
    <button class="puce puce--fin" data-action="fermerTiroir">Terminé</button>
  </div>`;
};

/* Les panneaux d'outils tiennent en deux rangées au maximum : le scrapbook
 * est le sujet de la page, un panneau qui mange les deux tiers de l'écran
 * empêche de voir ce qu'on fabrique. Tout ce qui se choisit défile donc
 * horizontalement, et les explications tiennent sur une ligne.
 *
 * Ils sont aussi autonomes : changer de scotch ou de fond ne redessine que
 * le panneau et le fond, jamais la page entière — sinon les affiches et la
 * barre du bas rejouaient leur animation d'arrivée à chaque réglage. */
function panneauOutil(ecranId, outils) {
  const m = ETAT.mur;
  const dechirure = m.dechireType || "coin";
  const tete = (titre, aide) => `<div class="outil-tete">
    <span class="t-texte-label">${titre}</span>
    <span class="t-texte-meta secondaire une-ligne">${aide}</span>
    ${lien("OK", { action: "fermerOutil" })}</div>`;

  const corps = {
    /* Seize éléments à plat, c'était un catalogue. Trois familles : on écrit,
     * on colle un papier, ou on marque quelque chose. */
    "24.1": `${tete("Ajouter", (FAMILLES_NOTE.find((f) => f[0] === familleNote()) || [])[2] || "")}
      <div class="puces" style="margin-bottom:8px">${FAMILLES_NOTE.map(([k, nom]) =>
        puce(nom, familleNote() === k, ` data-action="familleNote" data-id="${k}"`)).join("")}</div>
      <div class="palette">${TYPES_NOTE.filter((t) => familleDe(t.type) === familleNote()).map((t) => `<button data-action="ajouterNote" data-id="${t.type}">
        <span class="palette-apercu note-${t.type}">${estTexte(t.type) ? esc((t.exemple || "Texte").slice(0, 3)) : icone(t.icone, 20)}</span>
        <span class="t-texte-meta">${t.nom}</span></button>`).join("")}</div>`,

    "24.3": `${tete("Dessiner", "trace au doigt, deux doigts zooment")}
      ${rangeeCouleurs((m.dessin && m.dessin.couleur) || "#111111", "couleurTrait")}
      <div class="rangee" style="gap:8px;margin-top:8px">
        ${[[2, "Fin"], [4, "Moyen"], [8, "Gros"], [14, "Marqueur"]].map(([w, nom]) =>
          `<button class="epaisseur-trait${(m.dessin && m.dessin.w || 4) === w ? " choisi" : ""}" data-action="epaisseurTrait" data-id="${w}" aria-label="${nom}" title="${nom}"><i style="height:${Math.min(w, 10)}px"></i></button>`).join("")}
        <span style="flex:1"></span>
        <button class="puce" data-action="annulerTrait">Annuler</button>
        <button class="puce" data-action="effacerTraits">Effacer</button>
      </div>`,

    "25": `${tete("Fond", "la matière du papier, puis sa teinte")}
      <div class="nuancier">${FONDS.map(([k, nom]) =>
        `<button class="${m.fond === k ? "choisi" : ""}" data-action="choisirFond" data-id="${k}"><span class="apercu fond-${k}"></span><span class="t-texte-meta${m.fond === k ? "" : " secondaire"}">${nom}</span></button>`).join("")}
        <label class="${m.fond === "photo" ? "choisi" : ""}">
          <span class="apercu apercu-photo" ${m.fondImage ? `style="background-image:url(${m.fondImage})"` : ""}>${m.fondImage ? "" : icone("image", 18)}</span>
          <span class="t-texte-meta${m.fond === "photo" ? "" : " secondaire"}">Ta photo</span>
          <input type="file" accept="image/*" class="cache" data-change="fondPhoto"></label>
      </div>
      ${m.fond === "photo" && m.fondImage
        ? `<div class="curseur-ligne" style="margin-top:8px"><span class="t-texte-meta secondaire">Voile</span><span class="t-texte-meta secondaire" id="voile-val">${m.voile || 0} %</span></div>
           <input type="range" min="0" max="80" value="${m.voile || 0}" data-input="voileFond">`
        /* Neuf fois sur dix on choisit une matière et on s'arrête là : la
         * teinte n'a pas à occuper une rangée tant qu'on ne la demande pas. */
        : repli("Teinte", m.teinte ? "posée" : "aucune",
          `<div class="rangee" style="gap:8px">
             ${rangeeCouleurs(m.teinte || "", "teinteFond")}
             ${m.teinte ? `<button class="puce" data-action="teinteFond" data-id="">Sans teinte</button>` : ""}
           </div>`, { id: "repli-teinte", ouvert: !!(ETAT.ctx.replis || {})["repli-teinte"] })}`,

    "26": `${tete("Scotch", "touche un scrap où tu veux le poser")}
      <div class="rouleaux">${SCOTCHS.map(([k, nom]) =>
        `<button class="${(m.scotchType || "kraft") === k ? "choisi" : ""}" data-action="choisirScotch" data-id="${k}"><span class="apercu"><i class="scotch ${k}"></i></span><span class="t-texte-meta${(m.scotchType || "kraft") === k ? "" : " secondaire"}">${nom}</span></button>`).join("")}</div>`,

    "27": `${tete("Déchirer", esc((DECHIRURES.find((d) => d[0] === dechirure) || [])[2] || ""))}
      <div class="puces" style="margin-top:2px">${DECHIRURES.map(([k, nom]) =>
        puce(nom, dechirure === k, ` data-action="choisirDechirure" data-id="${k}"`)).join("")}</div>
      <div class="rangee" style="gap:8px;margin-top:8px">
        <span class="t-texte-meta secondaire une-ligne" style="flex:1">Le morceau arraché reste dans ta collection.</span>
        <button class="puce" data-action="annulerDechirure">Annuler</button>
        <button class="puce" data-action="recollerTout">Recoller</button>
      </div>`,
  };
  return `<div class="pied filet panneau-outil" id="panneau-outil">${corps[ecranId] || ""}${outils || OUTILS_SCRAPBOOK(ecranId)}</div>`;
}

/* Ne redessiner que le panneau (et le fond, s'il a changé) */
function majPanneauOutil() {
  const ec = $(".ecran");
  const p = $("#panneau-outil");
  if (!ec || !p) return rafraichir();
  p.outerHTML = panneauOutil(ec.dataset.ecran, OUTILS_SCRAPBOOK(ec.dataset.ecran));
  majFondMur();
}
function majFondMur() {
  const z = $("#mur");
  if (!z) return;
  const m = ETAT.mur;
  FONDS.forEach(([k]) => z.classList.remove("fond-" + k));
  z.classList.remove("fond-photo");
  z.classList.add("fond-" + m.fond);
  z.setAttribute("style", styleFond(m));
  const t = $(".voile-teinte", z);
  if (m.teinte) {
    if (t) t.style.background = m.teinte;
    else z.insertAdjacentHTML("afterbegin", teinteHtml(m));
  } else if (t) t.remove();
}

/* ───────── Les carnets.
 * Un carnet par ville : celui du quartier, en cours, et ceux qu'on a
 * rapportés d'ailleurs, terminés. Changer de carnet tourne une page.
 *
 * La barre des carnets occupait une rangée entière en haut de la page, tout
 * le temps. Elle est rentrée dans le titre : « Belleville ▾ ». On gagne la
 * rangée, et le titre redevient un titre. */
function ouvrirChoixCarnet() {
  const liste = ETAT.carnets || [];
  if (liste.length < 2) return ACTIONS.nouveauCarnet();
  ouvrirFeuille("Mes carnets", "Un carnet par ville. Changer de carnet tourne une page.",
    liste.map((c) => ({
      id: c.id,
      nom: c.nom,
      sous: c.termine ? `${c.ville || ""} · terminé` : `${pluriel(c.items.length, "scrap")} · en cours`,
      actif: c.id === ETAT.carnetActif,
    })),
    (id) => { if (id !== ETAT.carnetActif) ACTIONS.ouvrirCarnet({ dataset: { id } }); },
    `<div style="margin-top:14px">${bouton("Nouveau carnet", { type: "secondaire", action: "nouveauCarnet" })}</div>`);
}

function scrapbook(ecranId) {
  const m = ETAT.mur;
  const mode = modeMur();
  const remplissage = Math.round(remplissageMur() * 100);
  const outils = OUTILS_SCRAPBOOK(ecranId);

  const panneaux = {
    "24": `${mode === "deplacer" ? '<div class="panneau-item vide" id="panneau-item"></div>' : ""}
      ${outils}${onglets(1)}`,
    "24.1": panneauOutil("24.1", outils),
    "24.3": panneauOutil("24.3", outils),
    "25": panneauOutil("25", outils),
    "26": panneauOutil("26", outils),
    "27": panneauOutil("27", outils),
  };

  const nomOutil = { "24.1": "Ajouter", "24.3": "Dessiner", 25: "Fond", 26: "Scotch", 27: "Déchirer" }[ecranId];
  const sous = m.termine
    ? `${esc(m.ville || "")} · ${esc(m.periode || "")} · ${pluriel(m.items.length, "scrap")}`
    : `${esc(ETAT.utilisateur.quartier)} · ${pluriel(m.items.length, "scrap")} · page remplie à ${remplissage} %`;
  return `
  <header class="entete"><div class="entete-ligne">
    <div class="entete-gauche">
      <button class="titre-carnet" data-action="ouvrirChoixCarnet">
        <span class="t-titre-m">${esc(m.nom || "Mon scrapbook")}</span>${icone("chevronBas", 18)}</button>
      <span class="t-texte-meta secondaire">${sous}</span></div>
    ${ecranId === "24"
      ? `<button class="icone-bouton" data-aller="24.2" aria-label="Partager mon scrapbook">${icone("partager")}</button>`
      : `<span class="t-texte-meta secondaire">${nomOutil}</span>`}
  </div></header>
  ${ecranId === "24" && !ETAT.ctx.livreOuvert ? `<div class="livre" id="livre" aria-hidden="true">
    <i class="livre-couv gauche"></i><i class="livre-couv droite"></i>
    <span class="livre-titre">${logo(28)}<span class="t-texte-meta">${esc(m.nom || ETAT.utilisateur.quartier)}</span></span>
  </div>` : ""}
  <div class="mur-zone fond-${m.fond} mode-${ecranId === "24" ? mode : ecranId}" id="mur" style="${styleFond(m)}">
    ${teinteHtml(m)}
    ${m.fond === "photo" && m.voile ? `<i class="voile-fond" style="opacity:${(m.voile || 0) / 100}"></i>` : ""}
    <div class="mur-plan" id="plan"></div>
    ${commandesZoom()}
    <div class="note-ensemble"><span class="t-texte-meta">Page remplie à ${remplissage} %</span><span class="t-texte-meta secondaire">Il reste de la place : continue à sortir.</span></div>
  </div>
  ${panneaux[ecranId]}`;
}
ecran("24", "C", "Mon scrapbook", "", () => scrapbook("24"), (r) => {
  const n = murMonter(r, modeMur());
  // le carnet s'ouvre en arrivant, une seule fois par visite
  const livre = $("#livre", r);
  let t = null;
  if (livre) {
    ETAT.ctx.livreOuvert = true;
    requestAnimationFrame(() => livre.classList.add("ouvre"));
    t = setTimeout(() => livre.remove(), 1100);
  }
  return () => { n && n(); clearTimeout(t); };
});
ecran("24.1", "C", "Ajouter un élément", "", () => scrapbook("24.1"), (r) => murMonter(r, "deplacer"));
ecran("24.3", "C", "Dessiner", "", () => scrapbook("24.3"), (r) => murMonter(r, "dessiner"));
ecran("25", "C", "Personnaliser — fond", "", () => scrapbook("25"), (r) => murMonter(r, "aucun"));
ecran("26", "C", "Personnaliser — scotch", "", () => scrapbook("26"), (r) => murMonter(r, "scotch"));
ecran("27", "C", "Personnaliser — déchirer", "", () => scrapbook("27"), (r) => murMonter(r, "dechirer"));

/* 24.2 — exporter la page en image, pour la poster ailleurs */
const FORMATS_EXPORT = [["story", "Story", "9 / 16"], ["carre", "Carré", "1 / 1"], ["mur", "Sur un mur", "posée sur ta photo de mur"], ["page", "Page entière", "la page telle quelle"]];
ecran("24.2", "C", "Partager mon scrapbook", "grille", () => {
  const f = ETAT.ctx.formatExport || "story";
  return `
  ${entete("Partager", { retourVers: "24" })}
  <div class="defile">
    <p class="t-texte-petit secondaire" style="margin:0 0 14px">Ta page devient une image : scraps, scotch, déchirures, titres et fond, tout y est. Rien n'est publié par SCRAP — tu postes où tu veux.</p>
    <div class="puces">${FORMATS_EXPORT.map(([k, nom]) => puce(nom, f === k, ` data-action="formatExport" data-id="${k}"`)).join("")}</div>
    <div class="apercu-export format-${f}" id="apercu-export">
      <div class="apercu-attente t-texte-meta secondaire">Composition…</div>
    </div>
    <p class="t-texte-meta secondaire centre" style="margin:12px 0 0">${esc((FORMATS_EXPORT.find((x) => x[0] === f) || [])[2] || "")}</p>
    ${f === "mur" ? `<div style="margin-top:14px">${bouton(ETAT.mur.photoMur ? "Reprendre la photo du mur" : "Photographier un mur", { type: "secondaire", aller: "24.4" })}</div>` : ""}
  </div>
  ${pied(`<div class="rang">
    <button class="bouton bouton--secondaire" data-action="telechargerMur">${icone("telecharger", 20)}Enregistrer</button>
    <button class="bouton" data-action="partagerMur">${icone("partager", 20)}Partager</button></div>`)}`;
}, () => {
  if ((ETAT.ctx.formatExport || "story") === "mur" && !ETAT.mur.photoMur) { aller("24.4", { remplace: true }); return null; }
  majApercuExport();
  return null;
});

function majApercuExport() {
  const boite = $("#apercu-export");
  if (!boite) return;
  exporterMur(ETAT.ctx.formatExport || "story").then((c) => {
    const b = $("#apercu-export");
    if (!b) return;
    b.innerHTML = "";
    const im = new Image();
    im.src = c.toDataURL("image/jpeg", 0.88);
    im.alt = "Aperçu de ton scrapbook";
    b.appendChild(im);
  }).catch(() => { const b = $("#apercu-export"); if (b) b.innerHTML = '<div class="apercu-attente t-texte-meta secondaire">Aperçu impossible ici</div>'; });
}

/* 24.4 — photographier un vrai mur, pour poser la page dessus dans la story.
 * C'est une photo, pas de la réalité augmentée : rien n'est suivi en direct,
 * et c'est justement ce qui marche sur tous les téléphones. */
ecran("24.4", "C", "Photo d'un mur", "sombre", () => `
  <video class="camera" id="video-mur" playsinline autoplay muted></video>
  <i class="cadre-mur" aria-hidden="true"></i>
  <header class="entete transparent" style="color:#fff;z-index:6"><div class="entete-ligne">
    <button class="icone-bouton" data-aller="24.2" aria-label="Fermer">${icone("fermer")}</button>
    <span class="entete-titre t-texte-meta">Photographie un mur</span><span></span>
  </div></header>
  <p class="t-texte-petit centre" id="consigne-mur">Cadre un mur, un rideau de fer, une palissade. Ton scrapbook sera posé dessus.</p>
  <div class="scanner-bas" style="z-index:3">
    <label class="galerie" aria-label="Choisir une photo">${icone("image")}<input type="file" accept="image/*" class="cache" data-change="photoMur"></label>
    <button class="declencheur" data-action="prendrePhotoMur" aria-label="Prendre la photo"></button>
    <span style="width:44px"></span>
  </div>`, (r) => cameraMurDemarrer($("#video-mur", r)));

/* ═════════ D. Collections */
const FILTRES_COLL = [["derniers", "Derniers"], ["rares", "Plus rares"], ["favoris", "Favoris"], ["lieu", "Lieu"], ["etat", "État"], ["theme", "Thème"]];
function scrapsTries() {
  const f = ETAT.ctx.filtreColl || "derniers";
  const t = (s) => { const [j, mo, a] = s.date.split("."); return +(a + mo + j + s.heure.replace(":", "")); };
  let ids = idsScraps().filter((id) => scrap(id).collection !== "exclusifs" || f === "derniers");
  if (f === "favoris") ids = ids.filter((id) => scrap(id).favori);
  if (f === "etat") ids = ids.filter((id) => scrap(id).holo);
  const cmp = {
    derniers: (a, b) => t(scrap(b)) - t(scrap(a)),
    favoris: (a, b) => t(scrap(b)) - t(scrap(a)),
    rares: (a, b) => scrap(a).num - scrap(b).num,
    lieu: (a, b) => scrap(a).lieu.localeCompare(scrap(b).lieu),
    etat: (a, b) => scrap(a).num - scrap(b).num,
    theme: (a, b) => (scrap(a).themes || [""])[0].localeCompare((scrap(b).themes || [""])[0]),
  }[f];
  return ids.sort(cmp);
}
const quartiers = () => new Set(idsScraps().map((id) => scrap(id).arr)).size;

/* Dispositions de la collection : on range ses scraps comme on veut. */
const DISPOS = [["mosaique", "grille4", "Mosaïque"], ["dense", "grille9", "Serré"], ["liste", "liste", "Liste"], ["plein", "empile", "En grand"]];
const dispoCourante = () => ETAT.ctx.dispoColl || "mosaique";
const dispoInfo = () => DISPOS.find(([id]) => id === dispoCourante()) || DISPOS[0];
/* Les quatre dispositions tenaient une rangée entière alors qu'une seule est
 * active : un bouton qui porte l'icône courante, et les quatre s'ouvrent au
 * toucher. Pareil pour les six tris. */
const choixDispo = () => `<button class="dispo actif" data-action="ouvrirChoixDispo"
  aria-label="Disposition" title="Disposition · ${dispoInfo()[2]}">${icone(dispoInfo()[1], 20)}</button>`;
const nomFiltreColl = () => (FILTRES_COLL.find(([id]) => id === (ETAT.ctx.filtreColl || "derniers")) || FILTRES_COLL[0])[1];
const barreTriColl = () => `<div class="rangee entre" style="gap:8px">
  ${boutonChoix("Tri", nomFiltreColl(), "ouvrirChoixTri")}
  ${choixDispo()}</div>`;

function murScraps(ids, o = {}) {
  const dispo = dispoCourante();
  if (!ids.length) return `<p class="t-texte-corps secondaire centre" style="margin-top:40px">Aucun scrap ici pour l'instant.</p>`;
  if (dispo === "liste") {
    return `<div class="liste">${ids.map((id, i) => {
      const s = scrap(id), r = rarete(s);
      const sel = o.selection ? o.selection.indexOf(id) : -1;
      return `<button class="ligne ligne-scrap surgit${sel >= 0 ? " choisie" : ""}" data-action="${o.action || "ouvrirScrap"}" data-id="${id}" style="--i:${Math.min(i, 14)}">
        <img src="${imgScrap(id)}" alt="" style="width:44px;height:58px;object-fit:contain;background:var(--fond-secondaire)">
        <span style="flex:1;min-width:0"><span class="t-texte-label" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.titre)}</span>
          <span class="t-texte-meta secondaire">N° ${pad3(s.num)} · ${esc(s.lieu)}</span></span>
        ${s.favori ? `<span class="coeur-mini on">${icone("coeur", 16)}</span>` : ""}
        <span class="etiquette etiquette--rarete etiquette--mini">${esc(r.nom)}</span></button>`;
    }).join("")}</div>`;
  }
  return `<div class="grille-scraps dispo-${dispo}">${ids.map((id, i) => carteScrap(id, { i, ...(o.carte ? o.carte(id) : {}) })).join("")}</div>`;
}

ecran("28", "D", "Ma collection", "grille", () => {
  const ids = scrapsTries();
  const enCours = D.collections.filter((c) => !complete(c.id)).length;
  return `
  ${grandTitre("Ma collection", `${pluriel(totalScraps(), "scrap")} · ${pluriel(quartiers(), "quartier")}`, lien("Sélectionner", { aller: "29" }))}
  <div class="defile">
    ${barreTriColl()}
    <div style="margin:12px 0 20px">${ligne("Mes collections", { aller: "30", valeur: `${enCours} en cours` })}</div>
    <p class="t-texte-meta secondaire" style="margin:0 0 10px">${pluriel(ids.length, "scrap")} affiché${ids.length > 1 ? "s" : ""}</p>
    ${murScraps(ids)}
  </div>
  ${onglets(2)}`;
});

ecran("29", "D", "Sélection", "grille", () => {
  const sel = ETAT.ctx.selection || [];
  const der = sel[sel.length - 1];
  return `
  ${grandTitre("Sélection", sel.length ? `${pluriel(sel.length, "sélectionné")} · le dernier : N° ${pad3(scrap(der).num)}` : "Touche les scraps à mettre en avant", lien("Annuler", { action: "annulerSelection" }))}
  <div class="defile">
    ${barreTriColl()}
    <div style="height:16px"></div>
    ${murScraps(scrapsTries(), {
      action: "choisirSel", selection: sel,
      carte: (id) => { const i = sel.indexOf(id); return { action: "choisirSel", coche: i >= 0 ? String(i + 1).padStart(2, "0") : "", choisie: i >= 0 }; },
    })}
  </div>
  ${pied(`<button class="bouton" data-action="ajouterVitrine"${sel.length ? "" : " disabled"}>Ajouter le dernier au profil</button>`, { filet: true })}
  ${onglets(2)}`;
});

const vignettes = (cid, n) => {
  const ids = dansCollection(cid);
  const total = collection(cid).total;
  const cases = Math.min(total, n);
  const pleins = ids.length >= total ? cases : Math.min(ids.length, cases - 1);
  return `<div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:var(--gouttiere)">${Array.from({ length: cases }, (_, i) =>
    i < pleins ? `<img src="${imgScrap(ids[i])}" alt="" style="width:100%;height:60px;object-fit:contain">`
      : `<span class="vide-case" style="height:60px">${icone("plus")}</span>`).join("")}</div>`;
};

ecran("30", "D", "Mes collections", "grille", () => {
  const fin = D.collections.filter((c) => complete(c.id)).length;
  const tot = D.collections.reduce((a, c) => a + c.total, 0);
  const n = D.collections.reduce((a, c) => a + Math.min(progression(c.id).n, c.total), 0);
  return `
  ${grandTitre("Mes collections", `${D.collections.length} collections · ${fin} complète${fin > 1 ? "s" : ""} · ${n} / ${tot} scraps`)}
  <div class="defile">
    ${D.collections.map((c, i) => {
      const p = progression(c.id), ok = complete(c.id), manque = p.total - p.n;
      return `<div class="fond-blanc bloc-collection surgit" style="--i:${Math.min(i, 14)};border-top:1px solid var(--trait-defaut);padding:16px 0 20px;margin:0 calc(-1*var(--marge));padding-left:var(--marge);padding-right:var(--marge)">
        <button style="display:block;width:100%;text-align:left" data-action="ouvrirCollection" data-id="${c.id}">
          <div class="rangee entre"><span class="t-titre-m">${esc(c.nom)}</span>${ok ? tampon("Complète", `${p.total} / ${p.total}`, { plein: true }) : `<span class="t-titre-m">${p.n} / ${p.total}</span>`}</div>
          <div class="t-texte-meta secondaire" style="margin-top:6px">${p.n === 0 ? "Pas commencée" : ok ? "Scrap exclusif débloqué" : manque === 1 ? "Il manque 1 scrap" : `Il manque ${manque} scraps`}</div>
          <div class="barre-progression"><i style="width:${Math.min(100, (p.n / p.total) * 100)}%"></i></div>
          ${vignettes(c.id, 6)}
        </button>
        ${ok ? "" : `<div style="text-align:right;margin-top:10px">${lien("Voir sur la carte", { action: "chercherCollection", data: ` data-id="${c.id}"` })}</div>`}
      </div>`;
    }).join("")}
  </div>
  ${onglets(2)}`;
});

ecran("31", "D", "Fiche d'une collection", "grille", () => {
  const cid = ETAT.ctx.collection || "concerts";
  const c = collection(cid), p = progression(cid), ids = dansCollection(cid), manque = Math.max(0, p.total - p.n);
  const cible = D.cibles.find((x) => x.collection === cid);
  return `
  ${entete(c.nom, { droite: `<button class="icone-bouton" data-aller="39">${icone("partager")}</button>` })}
  <div class="defile">
    <span class="t-texte-meta secondaire">Collection · ${esc(c.zone)}</span>
    <div class="t-titre-xl" style="margin:8px 0 4px">${p.n} / ${p.total}</div>
    <div class="barre-progression"><i style="width:${Math.min(100, (p.n / p.total) * 100)}%"></i></div>
    <p class="t-texte-petit secondaire">${manque ? `Il te manque ${pluriel(manque, "scrap")}.${cible ? ` Le plus proche est à ${distanceTxt(cible)}.` : ""}` : "Collection complète. Bravo."}</p>
    <div class="quatre-col" style="margin-top:16px;row-gap:16px">
      ${ids.map((id) => `<button data-action="ouvrirScrap" data-id="${id}" style="text-align:left"><img src="${imgScrap(id)}" alt="" style="width:100%;height:116px;object-fit:contain;background:var(--fond-principal)"><span class="t-texte-meta accent">N° ${pad3(scrap(id).num)}</span></button>`).join("")}
      ${Array.from({ length: manque }, () => `<button class="vide-case" style="height:116px" data-action="chercherCollection" data-id="${cid}">${icone("plus")}</button>`).join("")}
    </div>
    <p class="t-texte-meta secondaire" style="margin:28px 0 12px">À la clé</p>
    <div class="rangee" style="align-items:flex-start">${badgeHtml(D.badges.find((b) => b.collection === cid) || { id: cid, icone: c.icone }, { ok: complete(cid), choisi: complete(cid) })}
      <span class="t-texte-petit secondaire" style="flex:1">${esc(c.recompense)}, réservé à ceux qui finissent la collection.</span></div>
  </div>
  ${manque ? pied(bouton("Voir le dernier sur la carte", { action: "chercherCollection", data: ` data-id="${cid}"` })) : ""}`;
});

/* La carte exclusive telle qu'elle est collée dans le scrapbook : du papier
 * holographique figé, encre noire, comme un vrai sticker foil. La version
 * vivante (écran 32) ajoute les reflets qui bougent. */
const svgExclusif = (cid) => {
  const c = collection(cid);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1000" viewBox="0 0 720 1000">
    <defs>
      <radialGradient id="foil" cx="50%" cy="46%" r="78%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="18%" stop-color="#ffe3f0"/>
        <stop offset="34%" stop-color="#d9fff2"/><stop offset="50%" stop-color="#fff7d2"/>
        <stop offset="66%" stop-color="#d7e6ff"/><stop offset="82%" stop-color="#f0d9ff"/>
        <stop offset="100%" stop-color="#d4fff0"/>
      </radialGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="38%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#ffffff" stop-opacity=".75"/>
        <stop offset="62%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="720" height="1000" fill="url(#foil)"/>
    <rect width="720" height="1000" fill="url(#sheen)"/>
    <rect x="40" y="40" width="640" height="920" fill="none" stroke="#111" stroke-width="3"/>
    <text x="70" y="140" fill="#111" font-family="Inter,Arial" font-weight="600" font-size="34" letter-spacing="2">SCRAP · ÉDITION EXCLUSIVE</text>
    <text x="64" y="470" fill="#111" font-family="Inter,Arial" font-weight="700" font-size="150" textLength="590" lengthAdjust="spacingAndGlyphs">${c.nom.split(" ")[0].toUpperCase()}</text>
    <rect x="70" y="520" width="80" height="80" fill="#FF0000"/>
    <text x="70" y="690" fill="#111" font-family="Inter,Arial" font-weight="500" font-size="40">${c.zone.toUpperCase()}</text>
    <text x="70" y="744" fill="#555" font-family="Inter,Arial" font-weight="500" font-size="40">COLLECTION COMPLÈTE</text>
    <text x="70" y="900" fill="#111" font-family="Inter,Arial" font-weight="600" font-size="120" letter-spacing="-6">N° 001</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};
/* La carte exclusive n'est pas une affiche de la rue : c'est SCRAP qui la
 * fabrique. C'est donc le seul objet de l'app qui a le droit à l'holographie
 * et à des couches séparées — la règle « l'affiche est intouchable » ne
 * s'applique qu'aux vraies affiches. */
/* ───────── Le décor au fond de la fenêtre.
 * Du vecteur simple, en silhouette : pas une illustration, des formes qu'on
 * lit en un coup d'œil même à 3 cm de large. Les concerts ont le décor le
 * plus écrit, parce que c'est la collection de tête du projet ; les autres
 * reprennent la même scène avec le motif de leur badge en enseigne. */
const DECOR_CONCERTS = `
  <g class="prof-lointain">
    <circle cx="100" cy="40" r="26" fill="none" stroke="#111" stroke-width="1.2" opacity=".5"/>
    <circle cx="100" cy="40" r="15" fill="#111" opacity=".9"/>
    <path d="M100 4v16M100 60v16M64 40h16M120 40h16M74 14l11 11M126 55l-11-11M126 25l-11 11M74 66l11-11"
      stroke="#111" stroke-width="1.2" opacity=".45"/>
  </g>
  <g class="prof-eq">
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${73 + i * 9}" y="58" width="5" height="26" fill="#111" style="--i:${i}"/>`).join("")}
  </g>
  <g fill="#111">
    <path d="M2 56h30v48H2zM168 56h30v48h-30z"/>
    <path d="M8 44h18v12H8zM174 44h18v12h-18z"/>
  </g>
  <g fill="none" stroke="#FFF" stroke-width="1.6">
    <circle cx="17" cy="72" r="8"/><circle cx="17" cy="92" r="5"/>
    <circle cx="183" cy="72" r="8"/><circle cx="183" cy="92" r="5"/>
  </g>
  <g class="prof-foule" fill="#111">
    <path d="M0 104h200v16H0z"/>
    ${[6, 20, 33, 47, 60, 74, 88, 101, 115, 128, 142, 155, 169, 182, 195].map((x, i) =>
      `<rect x="${x}" y="${90 + (i % 3) * 4}" width="4" height="18" style="--i:${i % 5}"/>`).join("")}
  </g>`;
const decorExclusif = (cid) => cid === "concerts" ? DECOR_CONCERTS : `
  <g class="prof-lointain">
    <circle cx="100" cy="46" r="30" fill="none" stroke="#111" stroke-width="1.2" opacity=".5"/>
    <g transform="translate(68 14) scale(1)" stroke="#111" stroke-width="2.4" fill="none" stroke-linecap="square">
      <path d="${MOTIFS_BADGE[cid] || MOTIFS_BADGE.holo}"/>
    </g>
  </g>
  <g class="prof-foule" fill="#111">
    <path d="M0 104h200v16H0z"/>
    ${[8, 26, 44, 62, 80, 98, 116, 134, 152, 170, 188].map((x, i) =>
      `<rect x="${x}" y="${92 + (i % 2) * 5}" width="5" height="16" style="--i:${i % 5}"/>`).join("")}
  </g>`;

/* La carte exclusive n'est pas une affiche de la rue : c'est SCRAP qui la
 * fabrique. C'est donc le seul objet de l'app qui a le droit à l'holographie
 * et à des couches séparées — la règle « l'affiche est intouchable » ne
 * s'applique qu'aux vraies affiches.
 *
 * v10 — une fenêtre découpée dans le foil. On ne regarde plus un relief posé
 * sur la carte : on regarde DEDANS. Le cadre de la fenêtre ne bouge pas, le
 * fond s'enfonce, et les couches glissent les unes derrière les autres quand
 * on penche — l'impression d'une pièce derrière le papier. Tout tourne aussi
 * tout seul : la carte est vivante même téléphone posé. */
function carteExclusive(cid) {
  const c = collection(cid);
  const mot = c.nom.split(" ")[0].toUpperCase();
  return `<div class="carte-exclusive holo" id="carte-exclusive">
    <i class="exc-fond"></i>
    <i class="holo-guilloche" aria-hidden="true"></i>
    <i class="exc-cadre"></i>
    <span class="exc-entete">SCRAP · ÉDITION EXCLUSIVE</span>

    <div class="exc-fenetre boite-prof" aria-hidden="true">
      <i class="prof-vide" style="--z:1"></i>
      <i class="prof-sol" style="--z:.92"></i>
      <i class="prof-halo" style="--z:.78"></i>
      <svg class="prof-decor" style="--z:.6" viewBox="0 0 200 120" preserveAspectRatio="xMidYMax meet">${decorExclusif(cid)}</svg>
      <i class="prof-poussiere" style="--z:.3"></i>
      ${etoiles(7, { classe: "prof-ciel", prof: 10, ecart: 26, taille: 6, variation: 8 })}
      <i class="prof-vitre"></i>
    </div>

    <span class="exc-mot" style="font-size:${Math.min(20, 108 / Math.max(4, mot.length)).toFixed(1)}cqw">${esc(mot)}</span>
    <i class="exc-filet"></i>
    <i class="exc-carre"></i>
    <span class="exc-zone">${esc(c.zone.toUpperCase())}</span>
    <span class="exc-num">N° 001</span>
    <span class="exc-serie">001 / 064</span>
    <svg class="exc-sceau" viewBox="0 0 24 24" aria-hidden="true"><path d="${ETOILE_D}"/></svg>
    <i class="holo-prisme" aria-hidden="true"></i>
    <i class="holo-eclat" aria-hidden="true"></i>
  </div>`;
}

ecran("32", "D", "Collection complète — scrap exclusif", "grille", () => {
  const cid = ETAT.ctx.collection || "concerts";
  const c = collection(cid);
  const ouvert = ETAT.ctx.packOuvert === cid;
  return `
  ${entete("", { fermer: true })}
  <div class="defile scene-pack${ouvert ? " ouvert" : ""}" id="scene-pack">
    <span class="t-texte-meta secondaire">Collection complète</span>
    <h1 class="t-titre-xl" style="margin:8px 0 20px">${esc(c.nom)}</h1>
    <div class="scene-exclusif" id="scene-exclusif">
      <i class="decor-halo couche" style="--p:30"></i>
      <i class="decor-rayons couche" style="--p:44"></i>
      ${poussiere(8)}${etoiles(13, { prof: 14, ecart: 54, taille: 8, variation: 12 })}
      <div class="pack" id="pack" data-action="ouvrirPack" role="button" tabindex="0">
        <i class="pack-haut"></i>
        <i class="pack-hachures" aria-hidden="true"></i>
        <svg class="pack-marque" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
          <path d="${MOTIFS_BADGE[cid] || MOTIFS_BADGE.holo}"/></svg>
        <svg class="pack-coins" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 14V4h10M86 4h10v10M96 86v10H86M14 96H4V86" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <div class="pack-corps">
          <i class="pack-etoiles haut" aria-hidden="true"></i>
          <span class="pack-logo">${logo(22)}</span>
          <span class="pack-titre t-texte-meta">Édition exclusive</span>
          <span class="pack-mot">${esc(c.nom.split(" ")[0].toUpperCase())}</span>
          <span class="pack-pied t-texte-meta">1 scrap · numéroté</span>
          <i class="pack-etoiles bas" aria-hidden="true"></i>
        </div>
        <i class="pack-languette" id="pack-languette"></i>
        <span class="pack-aide t-texte-meta">Tire la languette</span>
      </div>
      <div class="exclusif-carte couche" style="--p:6">${carteExclusive(cid)}</div>
    </div>
    <div class="apres-pack">
      <div class="rangee entre" style="margin-top:24px;align-items:flex-start">
        <div>${etiquette("Scrap exclusif")}<p class="t-texte-petit secondaire" style="margin:10px 0 0;max-width:180px">Réservé aux 64 personnes qui ont fini la collection.</p></div>
        ${tampon(`Complète · ${c.total} / ${c.total}`, `${aujourdhui().date} · Paris`, { grand: true, plein: true, pose: true })}
      </div>
      <div class="rangee entre" style="margin-top:14px;gap:12px"><span class="t-texte-meta secondaire">Penche-la pour la faire briller</span>${boutonGyro()}</div>
    </div>
  </div>
  ${pied(ouvert
    ? bouton("Coller sur mon scrapbook", { action: "collerExclusif" }) + lien("Voir mon badge", { aller: "33", centre: true })
    : bouton("Ouvrir le pack", { action: "ouvrirPack" }))}`;
}, (r) => {
  const cid = ETAT.ctx.collection || "concerts";
  const c = collection(cid);
  const ouvert = ETAT.ctx.packOuvert === cid;
  if (!ouvert) revelation(["COLLECTION", "COMPLÈTE"], { sous: c ? c.nom.toUpperCase() : "", duree: 1700 });
  else setTimeout(() => pluieEtoiles($("#scene-exclusif", r), 22), 420);
  const n1 = languetteMonter(r);
  const n2 = profondeur($("#scene-exclusif", r), { amplitude: 1.3 });
  return () => { n1 && n1(); n2 && n2(); };
});

/* ───────── La languette qu'on tire.
 * Ouvrir un pack au clic, c'est un bouton. Ici la bande résiste, suit le
 * doigt, vibre par crans, et cède d'un coup passé les trois quarts. Si on
 * lâche avant, elle revient : on n'ouvre pas un pack par accident. */
function languetteMonter(racine) {
  const l = $("#pack-languette", racine), pack = $("#pack", racine);
  if (!l || !pack) return null;
  let g = null;
  const COURSE = 130;
  const majTension = (t) => pack.style.setProperty("--tire", t.toFixed(3));
  const debut = (e) => {
    if (ETAT.ctx.packOuvert === (ETAT.ctx.collection || "concerts")) return;
    e.preventDefault();
    g = { x: e.clientX, cran: 0, parti: false };
    pack.classList.add("tension");
    l.setPointerCapture && l.setPointerCapture(e.pointerId);
  };
  const bouge = (e) => {
    if (!g || g.parti) return;
    const t = clamp((e.clientX - g.x) / COURSE, 0, 1);
    majTension(t);
    const cran = Math.floor(t * 6);
    if (cran > g.cran) { g.cran = cran; vibrer(5); }   // la bande craque, cran par cran
    if (t >= 1) { g.parti = true; fin(e); ACTIONS.ouvrirPack(); }
  };
  const fin = (e) => {
    if (!g) return;
    const parti = g.parti;
    g = null;
    pack.classList.remove("tension");
    if (!parti) { pack.classList.add("revient"); majTension(0); setTimeout(() => pack.classList.remove("revient"), 320); }
    if (e && l.releasePointerCapture && e.pointerId !== undefined) { try { l.releasePointerCapture(e.pointerId); } catch (err) { /* rien */ } }
  };
  l.addEventListener("pointerdown", debut);
  l.addEventListener("pointermove", bouge);
  l.addEventListener("pointerup", fin);
  l.addEventListener("pointercancel", fin);
  return () => { l.removeEventListener("pointerdown", debut); l.removeEventListener("pointermove", bouge); l.removeEventListener("pointerup", fin); l.removeEventListener("pointercancel", fin); };
}

ecran("33", "D", "Badge débloqué", "grille", () => {
  const cid = ETAT.ctx.collection || "concerts";
  const b = D.badges.find((x) => x.collection === cid) || D.badges[3];
  const c = collection(cid);
  return `
  ${entete("", { fermer: true })}
  <div class="defile centre badge-page" id="scene-badge" style="padding-top:40px">
    <i class="decor-halo couche" style="--p:28"></i>
    <i class="decor-rayons couche" style="--p:40"></i>
    <div class="badge-vitrine couche" style="--p:8" id="badge-pose">${badgeHtml(b, { ok: true, choisi: true, taille: 136, pose: true })}</div>
    <p class="t-texte-meta secondaire" style="margin:28px 0 8px">Badge débloqué</p>
    <h1 class="t-titre-l" style="margin:0">${esc(b.nom)}</h1>
    <p class="t-texte-corps secondaire" style="margin:12px 0 28px">Tu as capturé les ${c.total} scraps de la collection ${esc(c.nom)}.</p>
    ${tampon("Badge · " + b.nom, `${c.zone} · ${aujourdhui().date}`, { grand: true, plein: true, pose: true })}
  </div>
  ${pied(bouton("Afficher sur mon profil", { action: "choisirBadge", data: ` data-id="${b.id}"` }) + lien("Plus tard", { aller: "24", centre: true }))}`;
}, (r) => {
  const b = D.badges.find((x) => x.collection === (ETAT.ctx.collection || "concerts")) || D.badges[3];
  revelation(["BADGE", "DÉBLOQUÉ"], { sous: b.nom.toUpperCase(), sombre: true, duree: 1600 });
  setTimeout(() => eclat($("#badge-pose", r), { n: 14 }), 1750);
  return profondeur($("#scene-badge", r), { amplitude: 1.1 });
});

/* ═════════ E. Profil et partage */
ecran("34", "E", "Placer sur ma vitrine", "grille", () => {
  const u = ETAT.utilisateur;
  const sel = ETAT.vitrine.find((v) => v.id === ETAT.ctx.vitrineSel) || ETAT.vitrine[ETAT.vitrine.length - 1];
  return `
  ${entete("Ma vitrine", { droite: lien("Annuler", { aller: "35" }) })}
  <div class="defile">
    <div class="rangee">${avatarPersonne(48)}<div><span class="t-titre-m" style="display:block">${esc(u.nom)}</span><span class="t-texte-meta secondaire">${esc(u.quartier)} · rang ${u.rang}</span></div></div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 8px">Vitrine · glisse un scrap pour le placer</p>
    <div class="vitrine fond-papier" id="vitrine"><div class="vitrine-plan" id="vplan"></div></div>
    <div id="reglages-vitrine" style="margin-top:16px">${sel
      /* Les deux curseurs ne servent qu'à l'affiche touchée : ils se replient
       * tant qu'on n'a rien choisi, et s'ouvrent avec le nom du scrap. */
      ? repli(`Régler · N° ${pad3(scrap(sel.id).num)}`, `${Math.round(sel.w)} % · ${sel.rot}°`, `
        <div><div class="curseur-ligne"><span class="t-texte-petit">Taille</span><span class="t-texte-petit secondaire" id="v-taille">${Math.round((sel.w / 100) * 100)} %</span></div>
          <input type="range" min="60" max="180" value="${sel.w}" data-input="vitrineTaille"></div>
        <div style="margin-top:8px"><div class="curseur-ligne"><span class="t-texte-petit">Rotation</span><span class="t-texte-petit secondaire" id="v-rot">${sel.rot}°</span></div>
          <input type="range" min="-20" max="20" value="${sel.rot}" data-input="vitrineRotation"></div>
        <div style="margin-top:8px">${lien("Retirer de la vitrine", { action: "retirerVitrine" })}</div>`,
        { id: "repli-vitrine", ouvert: !!(ETAT.ctx.replis || {})["repli-vitrine"] })
      : `<p class="t-texte-petit secondaire" style="margin:0">Touche un scrap de la vitrine pour le régler.</p>`}</div>
  </div>
  ${pied(bouton("Valider", { action: "validerVitrine" }))}`;
}, (r) => vitrineMonter($("#vitrine", r), true));

ecran("35", "E", "Profil vu par les autres", "grille", () => {
  const autre = ETAT.ctx.personne != null ? ETAT.personnes[ETAT.ctx.personne] : null;
  const u = ETAT.utilisateur;
  const nom = autre ? autre.pseudo.replace("@", "") : u.nom;
  const badgesOk = badgesDe(autre);
  const choisi = D.badges.find((b) => b.id === u.badge);
  const fond = autre ? ["kraft", "journal", "beton", "liege", "millimetre", "carton", "seyes"][ETAT.ctx.personne % 7] : (ETAT.mur.fond || "papier");
  const rep = repartitionDe(autre);
  const affiches = affichesDe(autre);
  const avant = autre ? affiches[0] : ETAT.miseEnAvant;
  return `
  ${entete("Profil", { droite: `<button class="icone-bouton" data-aller="39" aria-label="Partager">${icone("partager")}</button>` })}
  <div class="defile plein">
    <div class="profil-banniere fond-${fond}">
      <div class="banniere-affiches">${affiches.slice(0, 8).map((id, i) =>
        `<img src="${imgScrap(id)}" alt="" style="--i:${i}">`).join("")}</div>
      ${autre ? "" : `<button class="banniere-fond" data-aller="25" aria-label="Changer le fond">${icone("fond", 18)}</button>`}
    </div>
    <div class="profil-tete">
      <div class="profil-avatar">${avatarPersonne(96, autre)}</div>
      ${!autre && choisi ? `<span class="profil-badge">${badgeHtml(choisi, { ok: true, choisi: true, taille: 44 })}</span>` : ""}
    </div>
    <div style="padding:0 var(--marge)">
      <h1 class="t-titre-xl" style="margin:12px 0 4px">${esc(nom)}</h1>
      <p class="t-texte-meta secondaire" style="margin:0">${esc(titreCollectionneur(autre))} · ${esc(autre ? autre.quartier : u.quartier)} · rang ${autre ? 30 : u.rang}</p>
      ${!autre && u.bio ? `<p class="t-texte-corps" style="margin:14px 0 0">${esc(u.bio)}</p>` : ""}
      ${autre ? "" : `<div style="margin-top:10px">${lien("24 abonnés · 31 abonnements", { aller: "38" })}</div>`}
    </div>
    <div class="compteurs" style="margin:20px 0 0">
      ${[[autre ? autre.scraps : totalScraps(), "Scraps"], [autre ? 3 : quartiers(), "Quartiers"], [autre ? 2 : D.badges.filter(badgeDebloque).length, "Badges"]]
        .map(([v, l]) => `<div><div class="t-titre-l">${v}</div><span class="t-texte-meta secondaire">${l}</span></div>`).join("")}
    </div>
    <div style="padding:20px var(--marge) 24px">
      ${repli("Ce qu'il y a dans sa collection", rep.map((x) => `${x.n} ${x.nom.toLowerCase()}`).slice(0, 2).join(" · "),
        `<div class="barres-rarete">${rep.map((x) => `<span class="barre-rarete rarete-${x.cle}" style="--part:${x.part}">
          <i></i><span class="t-texte-meta">${esc(x.nom)}</span><span class="t-texte-meta secondaire">${x.n}</span></span>`).join("")}</div>`,
        { id: "repli-rarete", ouvert: !!(ETAT.ctx.replis || {})["repli-rarete"] })}

      <div class="deux-col" style="margin-top:24px">
        <div><p class="t-texte-meta secondaire" style="margin:0 0 8px">Scrap mis en avant</p>
          <button ${autre ? "" : `data-action="ouvrirScrap" data-id="${avant}"`}><img src="${imgScrap(avant)}" alt="" style="width:100%"></button></div>
        <div><p class="t-texte-meta secondaire" style="margin:0 0 8px">Vitrine</p>
          <button class="vitrine fond-${fond}" id="vitrine" ${autre ? "" : 'data-aller="34"'} style="display:block"><div class="vitrine-plan" id="vplan"></div></button></div>
      </div>
      <p class="t-texte-meta secondaire" style="margin:24px 0 8px">Badges</p>
      <div class="quatre-col">${badgesOk.map((b) => `<button ${autre ? "" : 'data-aller="36"'} style="text-align:left">${badgeHtml(b, { ok: true, choisi: b.id === u.badge })}<span class="t-texte-meta" style="display:block;margin-top:8px">${esc(b.nom)}</span></button>`).join("")}</div>
    </div>
  </div>
  ${autre ? "" : onglets(-1)}
  ${pied(autre
    ? `<div class="rang">${bouton(autre.suivi ? "Suivi" : "Suivre", { type: autre.suivi ? "secondaire" : "", action: "suivre", data: ` data-id="${ETAT.ctx.personne}"` })}${bouton("Échanger en vrai", { action: "ouvrirEchange", data: ` data-id="${ETAT.ctx.personne}"` })}</div>`
    : `<div class="rang">${bouton("Modifier le profil", { aller: "37" })}${bouton("Réglages", { type: "secondaire", aller: "41" })}</div>`)}`;
}, (r) => {
  const autre = ETAT.ctx.personne != null ? ETAT.personnes[ETAT.ctx.personne] : null;
  /* La vitrine d'un autre colleur : ses trois affiches à lui, posées de la
   * même façon pour tout le monde — on vient voir ce qu'il a, pas comment il
   * range. */
  const sienne = autre
    ? affichesDe(autre).slice(0, 3).map((id, i) => ({ id, x: 14 + i * 116, y: [28, 18, 40][i], w: [104, 92, 100][i], rot: [-3, 2, 4][i] }))
    : null;
  return vitrineMonter($("#vitrine", r), false, sienne);
});

ecran("36", "E", "Choisir un badge", "grille", () => {
  const u = ETAT.utilisateur;
  const choix = ETAT.ctx.badgeChoix || u.badge;
  const neuf = D.badges.find((b) => b.collection && complete(b.collection));
  return `
  ${entete("Badges")}
  <div class="defile">
    ${neuf ? `<div class="notification" style="margin-bottom:20px">${icone("valider")}<span class="t-texte-petit">Badge débloqué : ${esc(neuf.nom)}</span><button class="bouton-lien inverse" data-action="choisirBadgeLocal" data-id="${neuf.id}">Voir</button></div>` : ""}
    <p class="t-texte-meta secondaire" style="margin:0 0 12px">Choisis le badge affiché sur ton profil</p>
    <div class="grille-badges">${D.badges.map((b) => {
      const ok = badgeDebloque(b);
      const prog = b.collection ? `${progression(b.collection).n} / ${progression(b.collection).total}` : b.objectif ? `${totalScraps()} / ${b.objectif}` : "";
      return `<button class="cell" ${ok ? `data-action="choisirBadgeLocal" data-id="${b.id}"` : 'data-action="badgeVerrouille"'}>
        ${badgeHtml(b, { ok, choisi: b.id === choix })}
        <span class="t-texte-meta${ok ? "" : " secondaire"}">${esc(b.nom)}</span>${ok ? "" : `<span class="t-texte-meta secondaire" style="margin-top:2px">${prog}</span>`}</button>`;
    }).join("")}</div>
    <p class="t-texte-meta secondaire" style="margin:28px 0 8px">Aperçu sur mon profil</p>
    <div class="rangee fond-blanc" style="padding:16px;box-shadow:inset 0 0 0 1px var(--trait-defaut)">
      ${avatarPersonne(64)}<div style="flex:1"><span class="t-titre-l" style="display:block">${esc(u.nom)}</span><span class="t-texte-meta secondaire">${esc(u.quartier)} · rang ${u.rang}</span></div>
      ${badgeHtml(D.badges.find((b) => b.id === choix) || D.badges[0], { ok: true, choisi: true, taille: 44 })}</div>
  </div>
  ${pied(bouton("Enregistrer", { action: "enregistrerBadge" }))}`;
});

ecran("37", "E", "Modifier le profil", "grille", () => {
  const u = ETAT.utilisateur;
  return `
  ${entete("Modifier le profil", { droite: lien("Enregistrer", { action: "enregistrerProfil" }) })}
  <div class="defile">
    <div class="rangee" style="gap:16px">${avatarPersonne(88)}<label class="bouton-lien">Changer la photo<input type="file" accept="image/*" class="cache" data-change="photoProfil"></label></div>
    <div style="height:24px"></div>
    ${champ("Pseudo", u.pseudo, { id: "p-pseudo" })}
    ${champ("Bio", u.bio, { id: "p-bio", multi: true })}
    ${champ("Quartier", u.quartier, { id: "p-quartier" })}
    <div class="liste">${ligne("Ma vitrine", { aller: "34", valeur: pluriel(ETAT.vitrine.length, "scrap") })}${ligne("Badge affiché", { aller: "36", valeur: (D.badges.find((b) => b.id === u.badge) || {}).nom })}${ligne("Réglages", { aller: "41" })}</div>
  </div>`;
});

/* 38 — Amis. Quatrième onglet : les gens avec qui on colle.
 * C'est d'ici qu'on ouvre le profil de quelqu'un, et depuis son profil qu'on
 * lui passe un scrap en main propre (écran 51). */
ecran("38", "E", "Amis", "grille", () => {
  const o = ETAT.ctx.ongletAbo || "abonnes";
  const proches = ETAT.personnes.filter((p) => p.suivi).slice(0, 3);
  return `
  ${grandTitre("Amis", `${ETAT.personnes.filter((p) => p.suivi).length} suivis · ${ETAT.personnes.length} autour de toi`)}
  <div class="defile">
    ${proches.length ? `<p class="t-texte-meta secondaire" style="margin:0 0 10px">Dans ton quartier en ce moment</p>
      <div class="rangee proches">${proches.map((p) => {
        const i = ETAT.personnes.indexOf(p);
        return `<button class="proche" data-action="voirPersonne" data-id="${i}">
          ${avatarPersonne(54, p)}
          <span class="t-texte-meta une-ligne">${esc(p.pseudo)}</span>
          <span class="t-texte-meta secondaire une-ligne">${esc(p.quartier)}</span></button>`;
      }).join("")}</div>
      <p class="t-texte-petit secondaire" style="margin:10px 0 18px">Croise-les dehors pour échanger un scrap en main propre.</p>` : ""}
    <div class="puces">${puce("Abonnés · 24", o === "abonnes", ' data-action="ongletAbo" data-id="abonnes"')}${puce("Abonnements · 31", o === "abonnements", ' data-action="ongletAbo" data-id="abonnements"')}</div>
    <div class="recherche" style="margin:16px 0 4px">${icone("recherche")}<input id="q-abo" type="search" placeholder="Rechercher" autocomplete="off"></div>
    <div id="liste-abo">${listePersonnes("")}</div>
  </div>
  ${onglets(3)}`;
}, (r) => { const q = $("#q-abo", r); q.addEventListener("input", () => { $("#liste-abo", r).innerHTML = listePersonnes(q.value); }); });

function listePersonnes(q) {
  const o = ETAT.ctx.ongletAbo || "abonnes";
  return ETAT.personnes.map((p, i) => [p, i])
    .filter(([p]) => (o === "abonnes" || p.suivi) && p.pseudo.includes(q.toLowerCase()))
    .map(([p, i]) => `<div class="ligne" style="min-height:72px">
      <button class="rangee" style="flex:1;text-align:left" data-action="voirPersonne" data-id="${i}">${avatarPersonne(44, p)}<span><span class="t-texte-label" style="display:block">${esc(p.pseudo)}</span><span class="t-texte-meta secondaire">${p.scraps} scraps · ${esc(p.quartier)}</span></span></button>
      <button class="bouton bouton--petit${p.suivi ? " bouton--secondaire" : ""}" data-action="suivre" data-id="${i}">${p.suivi ? "Suivi" : "Suivre"}</button></div>`).join("");
}

ecran("39", "E", "Partager un scrap", "grille", () => {
  const id = ETAT.ctx.scrap && scrap(ETAT.ctx.scrap) ? ETAT.ctx.scrap : "alta";
  const s = scrap(id);
  return `
  ${entete("Partager", { fermer: true })}
  <div class="defile">
    <div class="rangee fond-blanc" style="padding:12px;box-shadow:inset 0 0 0 1px var(--trait-defaut);align-items:flex-start">
      <img src="${imgScrap(id)}" alt="" style="width:80px">
      <div style="flex:1"><span class="t-texte-meta accent">Scrap N° ${pad3(s.num)}</span><div class="t-titre-m" style="margin:4px 0">${esc(s.titre)}</div>
        <span class="t-texte-petit secondaire">${esc(ETAT.utilisateur.pseudo)}</span><div style="margin-top:10px">${tamponScrap(id)}</div></div>
    </div>
    <p class="t-texte-petit secondaire" style="margin:16px 0">Seuls ce scrap et ton pseudo seront visibles. Ta position, jamais.</p>
    ${ligne("Afficher mon quartier", { toggle: "montrerQuartier" })}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gouttiere);margin-top:20px">
      ${[["lien", "Lien", "copierLien"], ["message", "Message", "partagerNatif"], ["partager", "Autres", "partagerNatif"]].map(([ic, nom, a]) =>
        `<button data-action="${a}" style="display:grid;place-items:center;gap:8px;height:88px;box-shadow:inset 0 0 0 1px var(--trait-fort);background:var(--fond-principal)">${icone(ic)}<span class="t-texte-meta">${nom}</span></button>`).join("")}
    </div>
  </div>
  ${pied(bouton("Copier le lien", { action: "copierLien" }))}`;
});

ecran("40", "E", "Lieu partenaire", "grille", () => {
  const l = D.lieu;
  return `
  ${entete("Lieu", { droite: `<button class="icone-bouton" data-aller="39">${icone("partager")}</button>` })}
  <div class="defile">
    <div style="height:160px;background:var(--fond-secondaire);display:grid;place-items:center">${logo(40)}</div>
    <h1 class="t-titre-l" style="margin:16px 0 6px">${esc(l.nom)}</h1>
    <span class="t-texte-meta secondaire">${esc(l.type)}</span>
    <div class="tableau" style="margin-top:16px;border-top:1px solid var(--trait-defaut)">
      ${[["Adresse", l.adresse], ["Horaires", l.horaires], ["Distance", l.distance]].map(([k, v]) => `<div class="ligne"><span class="cle t-texte-meta secondaire">${k}</span><span class="t-texte-petit">${esc(v)}</span></div>`).join("")}
    </div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 8px">Scraps de ce lieu · ${l.scraps.length} / ${l.total}</p>
    <div class="quatre-col">${l.scraps.map((id) => `<button data-action="ouvrirScrap" data-id="${id}"><img src="${imgScrap(id)}" alt="" style="width:100%;height:116px;object-fit:contain"></button>`).join("")}
      ${Array.from({ length: Math.min(2, l.total - l.scraps.length) }, () => `<span class="vide-case" style="height:116px">${icone("plus")}</span>`).join("")}</div>
  </div>
  ${pied(`<div class="rang">${bouton("Y aller", { action: "itineraireLieu" })}${bouton("Site du lieu", { type: "secondaire", action: "billetterie" })}</div>`)}`;
});

/* ═════════ F. Réglages */
/* 51 — Le passage de relais.
 *
 * Un scrap ne s'échange qu'en vrai, deux téléphones côte à côte. Pas d'envoi
 * à distance, pas de marché : c'est la seule fonction sociale de l'app qui
 * demande de se croiser dehors, et c'est voulu — tout le reste de SCRAP
 * pousse à sortir, l'échange ne pouvait pas être le contraire.
 *
 * Trois temps : on choisit le double qu'on donne, on approche les
 * téléphones, le scrap change de main et garde le nom de qui l'a donné. */
ecran("51", "E", "Passage de relais", "grille", () => {
  const e = ETAT.ctx.echange || {};
  const ami = ETAT.personnes[e.ami] || ETAT.personnes[0];
  const etape = e.etape || "choix";
  const donne = e.donne && scrap(e.donne);

  if (etape === "fait") {
    const recu = scrap(e.recu);
    return `
    ${entete("Échangé", { fermer: true })}
    <div class="defile centre" id="scene-echange">
      <i class="decor-halo couche" style="--p:26"></i>
      <p class="t-texte-meta secondaire" style="margin:8px 0 0">Reçu de ${esc(ami.pseudo)}, en main propre</p>
      <div class="echange-recu couche" style="--p:10">
        <img src="${imgScrap(e.recu)}" alt="" style="width:62%;margin:0 auto">
      </div>
      <h1 class="t-titre-l" style="margin:18px 0 4px">${esc(recu ? recu.titre : "")}</h1>
      <p class="t-texte-petit secondaire" style="margin:0 0 16px">Scrap N° ${pad3(recu ? recu.num : 1)} · ${esc(recu ? rarete(recu).nom : "")}</p>
      ${tampon("Passage de relais", `${esc(ami.quartier)} · ${aujourdhui().date}`, { grand: true, plein: true, pose: true })}
      <p class="t-texte-petit secondaire" style="margin:20px auto 0;max-width:280px">Ton double est parti chez ${esc(ami.pseudo)}. Un scrap échangé garde le nom de celui qui l'a donné.</p>
    </div>
    ${pied(bouton("Coller sur mon scrapbook", { action: "collerRecu" }) + lien("Plus tard", { aller: "38", centre: true }))}`;
  }

  if (etape === "approche") {
    return `
    ${entete("Approchez vos téléphones", { fermer: true })}
    <div class="defile centre echange-scene" id="scene-echange">
      <div class="echange-duo">
        <span class="echange-tel gauche"><img src="${imgScrap(e.donne)}" alt=""></span>
        <i class="echange-onde"></i><i class="echange-onde" style="animation-delay:.45s"></i>
        <span class="echange-tel droite">${avatarPersonne(44, ami)}</span>
      </div>
      <h1 class="t-titre-m" style="margin:28px 0 6px">Dos à dos, à quelques centimètres</h1>
      <p class="t-texte-corps secondaire" style="margin:0 auto;max-width:290px">L'échange ne se fait que comme ça : les deux téléphones doivent être au même endroit, au même moment.</p>
      <p class="t-texte-meta secondaire" style="margin:22px 0 0" id="echange-etat">Recherche de ${esc(ami.pseudo)}…</p>
    </div>
    ${pied(lien("Annuler", { aller: "38", centre: true }), { transparent: true })}`;
  }

  const doubles = idsScraps().filter((id) => scrap(id).collection !== "exclusifs").slice(0, 12);
  return `
  ${entete("Passage de relais", { fermer: true })}
  <div class="defile">
    <div class="rangee" style="margin-bottom:16px">${avatarPersonne(44, ami)}
      <span><span class="t-texte-label" style="display:block">${esc(ami.pseudo)}</span>
        <span class="t-texte-meta secondaire">${ami.scraps} scraps · ${esc(ami.quartier)}</span></span></div>
    <p class="t-texte-petit secondaire" style="margin:0 0 16px">Choisis le scrap que tu lui donnes. Tu gardes le tien : c'est le double qui part, avec ton pseudo dessus.</p>
    <div class="grille-scraps dispo-dense">${doubles.map((id, i) =>
      carteScrap(id, { i, action: "choisirDon", choisie: e.donne === id })).join("")}</div>
  </div>
  ${pied(`<button class="bouton" data-action="lancerEchange"${donne ? "" : " disabled"}>${donne ? "Approcher les téléphones" : "Choisis un scrap"}</button>`)}`;
}, (r) => {
  const e = ETAT.ctx.echange || {};
  if (e.etape === "approche") {
    // la rencontre se joue en quelques secondes : on la laisse respirer
    const etat = $("#echange-etat", r);
    const t1 = setTimeout(() => { if (etat) etat.textContent = "Téléphone trouvé · ne bougez plus"; vibrer(12); }, 1500);
    const t2 = setTimeout(() => ACTIONS.conclureEchange(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }
  if (e.etape === "fait") {
    revelation(["PASSAGE", "DE RELAIS"], { duree: 1500 });
    setTimeout(() => vibrer([16, 50, 16]), 300);
  }
  return profondeur($("#scene-echange", r), { amplitude: 1.1 });
});

ecran("41", "F", "Réglages", "grille", () => {
  const u = ETAT.utilisateur;
  return `
  ${entete("Réglages")}
  <div class="defile">
    <button class="ligne" data-aller="37" style="min-height:88px">${avatarPersonne(56)}<span style="flex:1"><span class="t-texte-label" style="display:block">${esc(u.pseudo)}</span><span class="t-texte-petit secondaire">Modifier le profil</span></span><span class="secondaire">${icone("chevron")}</span></button>
    <p class="t-texte-meta secondaire" style="margin:20px 0 4px">Mon compte</p>
    <div class="liste">${ligne("Confidentialité", { aller: "42", icone: "cadenas" })}${ligne("Notifications", { aller: "43", icone: "cloche" })}${ligne("Position", { aller: "44", icone: "position" })}${ligne("Compte", { aller: "45", icone: "profil" })}</div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 4px">Affichage</p>
    <div class="liste">${ligne("Relief au mouvement", { toggle: "profondeur", icone: "mur3d" })}</div>
    <p class="t-texte-petit secondaire" style="margin:6px 0 0">Les scraps prennent du relief quand tu penches le téléphone. À couper si ça te gêne ou pour économiser la batterie.</p>
    <p class="t-texte-meta secondaire" style="margin:20px 0 4px">Infos</p>
    <div class="liste">${ligne("Aide et mentions", { aller: "46", icone: "aide" })}${ligne("Vie privée", { aller: "47", icone: "cadenas" })}</div>
    <p class="t-texte-meta secondaire centre" style="margin-top:32px">SCRAP · version 1.0 · prototype</p>
  </div>
  ${onglets(-1)}`;
});
const reglagesListe = (titre, note, lignes) => `${entete(titre)}<div class="defile"><p class="t-texte-petit secondaire" style="margin:0 0 16px">${note}</p><div class="liste">${lignes}</div></div>`;
ecran("42", "F", "Confidentialité", "grille", () => reglagesListe("Confidentialité", "Par défaut, ton scrapbook est privé. Tu choisis ce que les autres voient.",
  ligne("Scrapbook public", { toggle: "murPublic" }) + ligne("Profil visible dans la recherche", { toggle: "profilRecherche" }) + ligne("Afficher mon quartier", { toggle: "montrerQuartier" }) +
  ligne("Afficher mon rang", { toggle: "montrerRang" }) + ligne("Qui peut me suivre", { valeur: "Tout le monde", action: "bientot" }) + ligne("Comptes bloqués", { valeur: "0", action: "bientot" })));
ecran("43", "F", "Notifications", "grille", () => reglagesListe("Notifications", "Jamais plus d'une par jour. Aucun rappel si tu ne sors pas.",
  ligne("Un rappel par semaine", { toggle: "rappelHebdo" }) + ligne("Jour du rappel", { valeur: "Samedi", action: "bientot" }) + ligne("Scrap rare à proximité", { toggle: "rareProche" }) +
  ligne("Collection presque complète", { toggle: "presqueComplete" }) + ligne("Nouvel abonné", { toggle: "nouvelAbonne" }) + ligne("Silence la nuit (22 h – 9 h)", { toggle: "silenceNuit" })));
ecran("44", "F", "Position", "grille", () => `${entete("Position")}<div class="defile">
  <p class="t-texte-petit secondaire" style="margin:0 0 16px">Ta position sert à afficher les scraps autour de toi. Elle n'est jamais partagée.</p>
  <div class="liste">${ligne("Localisation", { valeur: "Pendant l'utilisation", action: "bientot" })}${ligne("Position précise", { toggle: "positionPrecise" })}</div>
  <div style="margin:20px 0"><div class="curseur-ligne"><span class="t-texte-petit">Rayon de la carte</span><span class="t-texte-petit secondaire" id="rayon-val">${ETAT.reglages.rayon} m</span></div>
    <input type="range" min="200" max="2000" step="100" value="${ETAT.reglages.rayon}" data-input="rayon"></div>
  <div class="liste">${ligne("Historique des lieux", { valeur: "30 jours", action: "bientot" })}</div>
  <div style="margin-top:16px">${lien("Effacer l'historique", { action: "effacerHistorique" })}</div></div>`);
ecran("45", "F", "Compte", "grille", () => `${entete("Compte")}<div class="defile">
  <div class="liste">${ligne("E-mail", { valeur: ETAT.utilisateur.email, action: "bientot" })}${ligne("Mot de passe", { valeur: "Modifier", aller: "10" })}${ligne("Comptes liés", { valeur: "Apple", action: "bientot" })}${ligne("Exporter mes données", { action: "exporter" })}</div>
  <p class="t-texte-meta secondaire" style="margin:24px 0 4px">Zone sensible</p>
  <div class="liste">${ligne("Se déconnecter", { action: "deconnecter", sansChevron: true })}${ligne("Supprimer mon compte", { action: "supprimerCompte", sansChevron: true, souligne: true })}</div>
  <p class="t-texte-petit secondaire" style="margin-top:12px">La suppression efface ton profil, ton scrapbook et tes scraps sous 30 jours.</p></div>`);
ecran("46", "F", "Aide et mentions", "grille", () => `${entete("Aide et mentions")}<div class="defile">
  <p class="t-texte-meta secondaire" style="margin:0 0 4px">Aide</p>
  <div class="liste">${ligne("Comment capturer un scrap", { aller: "04" })}${ligne("Signaler une affiche", { action: "signaler" })}${ligne("Nous écrire", { action: "bientot" })}</div>
  <p class="t-texte-meta secondaire" style="margin:24px 0 4px">Mentions</p>
  <div class="liste">${ligne("Conditions d'utilisation", { action: "bientot" })}${ligne("Mentions légales", { action: "bientot" })}${ligne("Crédits des affiches", { action: "bientot" })}</div>
  <p class="t-texte-meta secondaire centre" style="margin-top:32px">Projet étudiant · LISAA · 2026</p></div>`);
ecran("47", "F", "Vie privée", "grille", () => `${entete("Vie privée")}<div class="defile">
  <h1 class="t-titre-l" style="margin:8px 0 20px">Ta vie privée</h1>
  ${[["Ce qu'on garde", "Ton e-mail, ton pseudo, tes scraps et ton scrapbook. La photo d'une affiche sert à la reconnaître, puis elle est effacée."],
     ["Ce qu'on ne fait jamais", "Partager ta position, vendre tes données, photographier des personnes, te relancer quand tu restes chez toi."],
     ["Tes droits", "Consulter, exporter ou effacer tes données à tout moment, depuis Réglages › Compte."]]
    .map(([t, x]) => `<div style="border-top:1px solid var(--trait-defaut);padding:16px 0 20px" class="fond-blanc"><h2 class="t-titre-m" style="margin:0 0 8px">${t}</h2><p class="t-texte-corps secondaire" style="margin:0">${x}</p></div>`).join("")}
  </div>${pied(bouton("Exporter mes données", { type: "secondaire", action: "exporter" }))}`);

/* ═════════ G. États d'erreur */
const etatVide = (ic, titre, texte, btn, o = {}) => `
  <div class="defile" style="display:flex;flex-direction:column;justify-content:center">
    <div class="pictogramme">${icone(ic, 40)}</div>
    <h1 class="t-titre-l centre" style="margin:28px 0 12px">${titre}</h1>
    <p class="t-texte-corps secondaire centre" style="margin:0">${texte}</p>
  </div>
  ${pied(btn + (o.lien || ""), { transparent: true })}${o.onglets !== undefined ? onglets(o.onglets) : ""}`;
ecran("48", "G", "Pas de connexion", "grille", () => etatVide("horsligne", "Pas de connexion", "Tes scraps et ton scrapbook restent disponibles. La carte et la capture reviennent avec le réseau.", bouton("Réessayer", { action: "reessayer" }), { onglets: 0 }));
ecran("49", "G", "Caméra coupée", "grille", () => etatVide("camera", "La caméra est coupée", "Sans elle, impossible de capturer un scrap. Active-la dans Réglages › Safari › Caméra, ou choisis une photo de l'affiche.",
  bouton("Choisir une photo", { action: "choisirPhoto" }) + `<input type="file" accept="image/*" class="cache" id="photo-49" data-change="photoCapture">`, { lien: lien("Réessayer la caméra", { aller: "19", centre: true }) }));
ecran("50", "G", "Erreur de chargement", "grille", () => etatVide("attention", "Quelque chose a coincé", "Le chargement n'a pas abouti. Réessaie dans un instant.", bouton("Réessayer", { aller: "13" }), { lien: lien("Revenir à la carte", { aller: "13", centre: true }) }));

const ORDRE = Object.keys(ECRANS).sort((a, b) => parseFloat(a) - parseFloat(b));
