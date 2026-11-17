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

ecran("01", "A", "Lancement animé", "grille", () => `
  <div class="lancement">
    <div class="frag frag-1"><img src="assets/affiches/seb.jpg" alt=""></div>
    <div class="frag frag-2"><img src="assets/affiches/fiasco.jpg" alt=""></div>
    <div class="frag frag-3"><img src="assets/affiches/skeleton.jpg" alt=""></div>
    <i class="scotch kraft s1"></i><i class="scotch transparent s2"></i><i class="scotch papier s3"></i>
    <div class="logo-bloc">${logo(76)}<p class="t-texte-corps secondaire accroche-lancement" style="margin:12px 0 0">Ta ville en morceaux.</p></div>
  </div>`, () => {
  const t = setTimeout(() => aller("02", { remplace: true }), 2900);
  return () => clearTimeout(t);
});

ecran("02", "A", "Bienvenue", "grille", () => `
  <div class="defile" style="display:flex;flex-direction:column;justify-content:center;padding-top:calc(env(safe-area-inset-top) + 24px)">
    <div style="position:relative;height:230px;margin-bottom:40px">
      <div class="mur-item" style="left:2%;top:34px;width:31%;transform:rotate(-6deg)"><img src="assets/affiches/alta.jpg" alt=""><i class="scotch kraft hg"></i></div>
      <div class="mur-item" style="left:34%;top:0;width:32%;transform:rotate(3deg)"><img src="assets/affiches/rose.jpg" alt=""><i class="scotch transparent hd"></i></div>
      <div class="mur-item" style="left:67%;top:40px;width:31%;transform:rotate(-4deg)"><img src="assets/affiches/sonda.jpg" alt=""><i class="scotch papier hg"></i></div>
    </div>
    <div class="centre">${logo(64)}<p class="t-texte-corps secondaire" style="margin:12px 0 0">Ta ville en morceaux.</p></div>
  </div>
  ${pied(bouton("Commencer", { aller: "03" }) + lien("J'ai déjà un compte", { aller: "09", centre: true }), { transparent: true })}`);

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
    ${[[16, 18, 1], [48, 40, 0], [80, 22, 1], [38, 76, 0], [82, 72, 0]].map(([l, t, n]) =>
      `<span class="marqueur" style="left:${l}%;top:${t}%">${n ? '<i class="pastille"></i>' : ""}</span>`).join("")}
    <span class="ma-position" style="position:absolute;left:52%;top:56%"></span>
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
  ["Autoriser pendant l'utilisation", "autoriserPosition"], "08"));

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
    <label style="display:block;width:120px;margin:8px auto 0;cursor:pointer">${avatar(120, ETAT.utilisateur.initiales, ETAT.utilisateur.avatar)}
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
  return `
  ${entete("Tes collections", { droite: `<span class="t-texte-meta secondaire">2 / 2</span>` })}
  <div class="defile">
    <h1 class="t-titre-l" style="margin:8px 0 8px">Par quoi tu commences ?</h1>
    <p class="t-texte-petit secondaire" style="margin:0 0 20px">Trois au maximum, pour qu'elles restent faisables à pied.</p>
    <div class="liste">${D.collections.map((c) => {
      const on = ETAT.collectionsDepart.includes(c.id);
      return `<button class="ligne" data-action="choisirDepart" data-id="${c.id}" style="min-height:72px">
        <span class="coche${on ? " active" : ""}">${on ? icone("valider") : ""}</span>
        <span style="flex:1"><span class="t-texte-label" style="display:block">${esc(c.nom)}</span>
        <span class="t-texte-meta secondaire">${c.total} scraps · ${esc(c.zone)}</span></span></button>`;
    }).join("")}</div>
  </div>
  ${pied(`<button class="bouton" data-aller="13"${n ? "" : " disabled"}>Commencer · ${pluriel(n, "collection")}</button>`)}`;
});

/* ═════════ B. Carte et capture */

const champCarte = () => `<button class="champ-carte" data-aller="15">${icone("recherche")}<span>Rechercher un scrap, un lieu</span></button>`;
const cibleProche = () => {
  const visibles = ciblesVisibles();
  return visibles.sort((a, b) => distanceM(a) - distanceM(b))[0];
};

ecran("13", "B", "Carte d'accueil", "", () => {
  const c = cibleProche();
  const vide = !c;
  return `
  <div class="carte" id="carte"></div>
  <div class="carte-ui" style="position:relative;flex:1">
    <div class="carte-haut">${champCarte()}
      <button class="carre-bouton" data-action="monProfil" aria-label="Mon profil">${ETAT.utilisateur.avatar ? avatar(46, "", ETAT.utilisateur.avatar) : icone("profil")}</button></div>
    <div style="padding:8px var(--marge) 0;display:flex;justify-content:flex-end"><button class="carre-bouton" data-aller="14" aria-label="Filtres">${icone("filtre")}</button></div>
    <div class="carte-bas">
      ${vide ? `<div class="panneau" style="flex-direction:column;align-items:flex-start;padding:16px">
          <span class="t-titre-m">Aucun scrap à moins de ${ETAT.reglages.rayon >= 1000 ? ETAT.reglages.rayon / 1000 + " km" : ETAT.reglages.rayon + " m"}</span>
          <span class="t-texte-petit secondaire">Élargis le rayon ou change de quartier.</span>
          ${lien("Élargir à 2 km", { action: "elargir" })}</div>`
        : `<button class="panneau" data-action="ouvrirCible" data-id="${c.id}">
          <span style="width:48px;height:64px;display:grid;place-items:center;background:var(--fond-secondaire);flex:none">${icone("scan")}</span>
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
    <p class="t-texte-meta secondaire" style="margin:20px 0 10px">Collections</p>
    <div class="puces retour-ligne">${[["toutes", "Toutes"], ...D.collections.map((c) => [c.id, c.nom])].map(([id, nom]) => puce(nom, f.collection === id, ` data-action="filtreCarte" data-cle="collection" data-val="${id}"`)).join("")}</div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 10px">État</p>
    <div class="puces retour-ligne">${[["tous", "Tous"], ["nouveaux", "Nouveaux"]].map(([id, nom]) => puce(nom, f.etat === id, ` data-action="filtreCarte" data-cle="etat" data-val="${id}"`)).join("")}</div>
    <div style="margin-top:12px">${ligne("Seulement ce qui me manque", { toggle: "manquants" })}</div>
    <div style="margin-top:16px">${bouton(`Afficher ${pluriel(ciblesVisibles().length, "scrap")}`, { aller: "13" })}</div>
  </div>`;
}, (r) => carteMonter($("#carte", r), { marqueurs: true, statique: true }));

ecran("15", "B", "Recherche", "grille", () => `
  <header class="entete"><div class="entete-ligne">
    <button class="icone-bouton" data-action="retour" aria-label="Retour">${icone("retour")}</button>
    <div class="recherche" style="flex:1"><input id="q" type="search" placeholder="Un scrap, un lieu, un artiste" autocomplete="off" value="${esc(ETAT.ctx.q || "")}"></div>
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
  const sc = idsScraps().filter((id) => ok(scrap(id).titre, scrap(id).lieu, scrap(id).artiste, (scrap(id).themes || []).join(" ")));
  const ci = D.cibles.filter((c) => ok(c.titre, c.adresse, collection(c.collection).nom));
  const li = ok(D.lieu.nom, D.lieu.adresse) ? [D.lieu] : [];
  const bloc = (titre, html) => (html ? `<p class="t-texte-meta secondaire" style="margin:16px 0 4px">${titre}</p><div class="liste">${html}</div>` : "");
  const html =
    bloc("Mes scraps", sc.slice(0, 6).map((id) => `<button class="ligne" data-action="ouvrirScrap" data-id="${id}" style="min-height:72px">
      <img src="${imgScrap(id)}" alt="" style="width:40px;height:54px;object-fit:contain;background:var(--fond-secondaire)">
      <span style="flex:1"><span class="t-texte-label" style="display:block">${esc(scrap(id).titre)}</span><span class="t-texte-meta secondaire">${esc(scrap(id).lieu)} · N° ${pad3(scrap(id).num)}</span></span>
      <span class="secondaire">${icone("chevron")}</span></button>`).join("")) +
    bloc("Repérés sur la carte", ci.slice(0, 5).map((c) => ligne(c.titre, { action: "ouvrirCible", data: ` data-id="${c.id}"`, icone: "scan", valeur: distanceTxt(c) })).join("")) +
    bloc("Lieux", li.map((l) => ligne(l.nom, { aller: "40", icone: "position", valeur: "350 m" })).join(""));
  return html || `<p class="t-texte-corps secondaire centre" style="margin-top:48px">Rien trouvé pour « ${esc(q)} ».</p>`;
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
      <div class="panneau" style="padding:16px">${icone("position")}<span style="flex:1"><span class="t-texte-label" style="display:block">Continue tout droit sur 120 m</span><span class="t-texte-meta secondaire">Puis à gauche, ${esc(c.adresse)}</span></span></div>
      ${bouton("Capturer un scrap", { type: "capture", aller: "19" })}
    </div>
  </div>
  ${onglets(0)}`;
}, (r) => carteMonter($("#carte", r), { cible: cibleCourante(), itineraire: true }));

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

ecran("19", "B", "Scanner", "sombre", () => `
  <video class="camera" id="video" playsinline autoplay muted></video>
  <div class="viseur" id="viseur">${"<i></i>".repeat(4)}</div>
  <header class="entete transparent" style="color:#fff;z-index:6"><div class="entete-ligne">
    <button class="icone-bouton" data-action="retour" aria-label="Fermer">${icone("fermer")}</button>
    <span class="entete-titre t-texte-meta">Cadre l'affiche</span><span></span></div></header>
  <p class="t-texte-petit centre" id="consigne" style="position:absolute;left:14%;right:14%;bottom:calc(19% + env(safe-area-inset-bottom));color:#9A9A96;margin:0;z-index:2">L'affiche entière dans le cadre, téléphone bien droit.</p>
  <div class="scanner-bas" style="z-index:3">
    <label class="galerie" aria-label="Choisir une photo">${icone("image")}<input type="file" accept="image/*" class="cache" data-change="photoCapture"></label>
    <button class="declencheur" data-action="capturer" aria-label="Capturer"></button>
    <span style="width:44px"></span>
  </div>`, (r) => cameraDemarrer($("#video", r)));

ecran("19.1", "B", "Identifier le scrap", "grille", () => {
  const p = ETAT.ctx.capture;
  if (!p) return `${entete("Identifier le scrap")}<div class="defile"><p class="t-texte-corps secondaire">Aucune capture en cours.</p>${bouton("Capturer un scrap", { type: "capture", aller: "19" })}</div>`;
  const tags = ["Concert", "Club", "Expo", "Musique", "Marché", "Politique", "Street art", "Soirée", ...(p.tagsPerso || [])];
  return `
  ${entete("Identifier le scrap", { retourVers: "19" })}
  <div class="defile">
    <div style="display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:start">
      <img src="${p.img}" alt="" style="width:120px;background:var(--fond-secondaire)">
      <div><span class="t-texte-meta accent">Scrap N° ${pad3(p.num)}</span>
        <p class="t-texte-petit" style="margin:4px 0 0">Tu es le ${rangTxt(p.num)} à le capturer.</p>
        <p class="t-texte-petit secondaire" style="margin:8px 0 0">L'app ne reconnaît pas encore toute seule : nomme et classe ton scrap.</p></div>
    </div>
    <div style="height:24px"></div>
    ${champ("Titre", p.titre || "", { id: "titre-capture", placeholder: "Ex. Concert au Studio Belleville" })}
    ${champ("Lieu", p.lieu || "Rue de Belleville", { id: "lieu-capture" })}
    <p class="t-texte-meta secondaire" style="margin:4px 0 10px">Collection</p>
    <div class="puces retour-ligne">${D.collections.map((c) => puce(`${c.nom} · ${progression(c.id).n}/${c.total}`, p.collection === c.id, ` data-action="captureCollection" data-id="${c.id}"`)).join("")}</div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 10px">Tags</p>
    <div class="puces retour-ligne" id="tags">${tags.map((t) => puce(t, (p.themes || []).includes(t), ` data-action="captureTag" data-id="${esc(t)}"`)).join("")}
      <button class="puce" data-action="ajouterTag">+ Tag</button></div>
    <div id="tag-perso" class="cache" style="margin-top:12px">${champ("Nouveau tag", "", { id: "nouveau-tag", placeholder: "Ex. Rap, Théâtre, Fanzine" })}</div>
    <div style="margin-top:12px">
      <div class="ligne"><span class="libelle">Scrap holo</span><button class="interrupteur${p.holo ? " on" : ""}" data-action="captureHolo"></button></div></div>
  </div>
  ${pied(bouton("Valider le scrap", { action: "validerCapture" }))}`;
});

ecran("20", "B", "Capture échouée", "sombre", () => `
  <img class="camera" src="assets/affiches/different.jpg" alt="" style="object-fit:contain;opacity:.6">
  <header class="entete transparent" style="color:#fff"><div class="entete-ligne"><button class="icone-bouton" data-aller="13">${icone("fermer")}</button></div></header>
  <div class="feuille" style="color:var(--texte-principal)">
    <span class="t-titre-m">Pas de scrap ici</span>
    <p class="t-texte-corps secondaire" style="margin:12px 0 20px">L'affiche est abîmée, cachée, ou pas encore sur la carte. Tu peux la signaler pour qu'elle rejoigne la collection de tout le monde.</p>
    <div class="pile">${bouton("Signaler l'affiche", { type: "secondaire", action: "signaler" })}${bouton("Réessayer", { aller: "19" })}</div>
  </div>`);

/* Recto (21) et verso (22) : un seul écran, la carte se retourne */
function rectoVerso(verso) {
  const id = ETAT.ctx.scrap && scrap(ETAT.ctx.scrap) ? ETAT.ctx.scrap : "alta";
  ETAT.ctx.scrap = id;
  const s = scrap(id);
  const col = collection(s.collection);
  const p = col ? progression(s.collection) : null;
  const surMur = ETAT.mur.items.some((it) => it.id === id);
  const frais = ETAT.ctx.frais === id;
  return `
  ${entete("Scrap capturé", { droite: `<button class="icone-bouton" data-aller="39" aria-label="Partager">${icone("partager")}</button>` })}
  <div class="defile">
    <div class="retourne${verso ? " verso" : ""}" id="retourne" data-action="retourner">
      <div class="retourne-int">
        <img class="face scrap-img" src="${imgScrap(id)}" alt="${esc(s.titre)}" style="aspect-ratio:${s.ratio}">
        <div class="face face--verso">
          <div class="t-chiffre-capture accent">${pad3(s.num)}</div>
          <span class="t-texte-meta secondaire">Ton numéro de scrap</span>
          <div class="tableau" style="margin-top:16px;border-top:1px solid var(--trait-defaut)">
            ${[["Artiste", s.artiste || "—"], ["Lieu", `${s.lieu}, ${s.arr.replace("Paris ", "")}`], ["Capturé le", `${s.date} · ${s.heure}`],
              ["Tags", (s.themes || []).join(" · ") || "—"], ["État", s.holo ? "Holo" : "Normal"], ["Collection", col ? `${col.nom} · ${p.n} / ${p.total}` : "Exclusif"]]
              .map(([k, v]) => `<div class="ligne"><span class="cle t-texte-meta secondaire">${k}</span><span class="t-texte-petit">${esc(v)}</span></div>`).join("")}
          </div>
          <p class="t-texte-petit" style="margin:12px 0 0">Capturé par ${s.scans} personnes. Collé sur ${s.murs} scrapbooks.</p>
        </div>
      </div>
    </div>
    <div class="rangee" style="margin-top:14px;gap:8px">${etiquette("Scrap N° " + pad3(s.num), true)}<span class="t-texte-meta secondaire">${rangTxt(s.num)} à l'avoir capturé</span></div>
    <div class="rangee entre" style="margin-top:10px;align-items:flex-start">
      <div style="min-width:0">
        <h1 class="t-titre-l" style="margin:0 0 4px">${esc(s.titre)}</h1>
        <p class="t-texte-petit secondaire" style="margin:0 0 10px">${esc(s.lieu)}</p>
        <div class="rangee" style="gap:8px">${s.holo ? etiquette("Holo") : ""}
          <button class="bouton-lien t-texte-petit" data-action="favori">${s.favori ? "Retirer des favoris" : "Ajouter aux favoris"}</button></div>
      </div>
      ${tampon("Scrap N° " + pad3(s.num), `${s.arr} · ${s.date}`, { grand: true, plein: !col || complete(s.collection), pose: frais })}
    </div>
    <p class="t-texte-meta secondaire centre" style="margin:20px 0 0">Touche ou glisse la carte pour la retourner</p>
    <div class="centre">${lien("Voir l'événement", { aller: "23", centre: true })}</div>
  </div>
  ${pied(surMur ? bouton("Voir sur mon scrapbook", { aller: "24" }) : bouton("Coller sur mon scrapbook", { action: "coller" }))}`;
}
const monterRecto = (r) => {
  ETAT.ctx.frais = null;
  return glisser($("#retourne", r), () => ACTIONS.retourner(), () => ACTIONS.retourner());
};
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

/* ═════════ C. Scrapbook (24 à 27 : même écran, outil différent) */
const OUTILS = [["24", "Déplacer"], ["26", "Scotch"], ["27", "Déchirer"], ["25", "Fond"]];
function scrapbook(outil) {
  const m = ETAT.mur;
  const panneaux = {
    "24": `<div class="outils">${OUTILS.map(([id, nom]) => puce(nom, id === "24", ` data-aller="${id}" data-remplace="1"`)).join("")}</div>${onglets(1)}`,
    "25": `<div class="pied filet">
        <div class="rangee entre"><span class="t-titre-m">Fond</span>${lien("OK", { aller: "24" })}</div>
        <div class="nuancier" style="margin-top:12px">${[["papier", "Papier"], ["grille", "Quadrillé"], ["beton", "Béton"], ["liege", "Liège"], ["noir", "Noir"]]
          .map(([k, nom]) => `<button class="${m.fond === k ? "choisi" : ""}" data-action="choisirFond" data-id="${k}"><span class="apercu fond-${k}" style="display:block;background-size:12px 12px"></span><span class="t-texte-meta${m.fond === k ? "" : " secondaire"}" style="display:block;margin-top:8px">${nom}</span></button>`).join("")}</div>
        <p class="t-texte-petit secondaire" style="margin:8px 0 0">Le fond ne change que ton scrapbook. Les scraps, eux, restent intacts.</p></div>`,
    "26": `<div class="pied filet">
        <div class="rangee entre"><span class="t-titre-m">Scotch</span>${lien("OK", { aller: "24" })}</div>
        <div class="rouleaux" style="margin-top:12px">${[["transparent", "Transparent"], ["kraft", "Kraft"], ["papier", "Papier"], ["noir", "Noir"]]
          .map(([k, nom]) => `<button class="${(m.scotchType || "kraft") === k ? "choisi" : ""}" data-action="choisirScotch" data-id="${k}"><span class="apercu"><i class="scotch ${k}"></i></span><span class="t-texte-meta${(m.scotchType || "kraft") === k ? "" : " secondaire"}" style="display:block;margin-top:8px">${nom}</span></button>`).join("")}</div>
        <p class="t-texte-petit secondaire" style="margin:8px 0 0">Touche un coin d'un scrap pour y poser un bout de scotch. Deux bouts au maximum par scrap ; touche un bout pour l'enlever.</p></div>`,
    "27": `<div class="pied filet">
        <div class="rangee entre"><span class="t-titre-m">Déchirer</span>${lien("OK", { aller: "24" })}</div>
        <p class="t-texte-petit secondaire" style="margin:8px 0 12px">Glisse ton doigt à travers un scrap pour le déchirer. Le morceau arraché reste dans ta collection : tu ne perds jamais un scrap.</p>
        <div class="deux-col">${bouton("Annuler", { type: "secondaire", action: "annulerDechirure" })}${bouton("Recoller tout", { type: "secondaire", action: "recollerTout" })}</div></div>`,
  };
  return `
  <header class="entete"><div class="entete-ligne">
    <div class="entete-gauche"><span class="t-titre-m">Mon scrapbook</span><span class="t-texte-meta secondaire">${esc(ETAT.utilisateur.quartier)} · ${pluriel(m.items.length, "scrap")}</span></div>
    ${outil === "24" ? lien("Valider", { action: "validerMur" }) : `<span class="t-texte-meta secondaire">${OUTILS.find((o) => o[0] === outil)[1]}</span>`}
  </div></header>
  <div class="mur-zone fond-${m.fond}" id="mur"><div class="mur-plan" id="plan" style="height:${m.hauteur}px"></div></div>
  ${panneaux[outil]}`;
}
ecran("24", "C", "Mon scrapbook", "", () => scrapbook("24"), (r) => murMonter(r, "deplacer"));
ecran("25", "C", "Personnaliser — fond", "", () => scrapbook("25"), (r) => murMonter(r, "aucun"));
ecran("26", "C", "Personnaliser — scotch", "", () => scrapbook("26"), (r) => murMonter(r, "scotch"));
ecran("27", "C", "Personnaliser — déchirer", "", () => scrapbook("27"), (r) => murMonter(r, "dechirer"));

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

ecran("28", "D", "Ma collection", "grille", () => {
  const ids = scrapsTries();
  const enCours = D.collections.filter((c) => !complete(c.id)).length;
  return `
  ${grandTitre("Ma collection", `${pluriel(totalScraps(), "scrap")} · ${pluriel(quartiers(), "quartier")}`, lien("Sélectionner", { aller: "29" }))}
  <div class="defile">
    <div class="puces">${FILTRES_COLL.map(([id, nom]) => puce(nom, (ETAT.ctx.filtreColl || "derniers") === id, ` data-action="filtreColl" data-id="${id}"`)).join("")}</div>
    <div style="margin:12px 0 20px">${ligne("Mes collections", { aller: "30", valeur: `${enCours} en cours` })}</div>
    ${ids.length ? `<div class="grille-scraps">${ids.map((id) => carteScrap(id)).join("")}</div>` : `<p class="t-texte-corps secondaire centre" style="margin-top:40px">Aucun scrap ici pour l'instant.</p>`}
  </div>
  ${onglets(2)}`;
});

ecran("29", "D", "Sélection", "grille", () => {
  const sel = ETAT.ctx.selection || [];
  const der = sel[sel.length - 1];
  return `
  ${grandTitre("Sélection", sel.length ? `${pluriel(sel.length, "sélectionné")} · le dernier : N° ${pad3(scrap(der).num)}` : "Touche les scraps à mettre en avant", lien("Annuler", { action: "annulerSelection" }))}
  <div class="defile">
    <div class="puces" style="margin-bottom:20px">${FILTRES_COLL.map(([id, nom]) => puce(nom, (ETAT.ctx.filtreColl || "derniers") === id, ` data-action="filtreColl" data-id="${id}"`)).join("")}</div>
    <div class="grille-scraps">${scrapsTries().map((id) => { const i = sel.indexOf(id); return carteScrap(id, { action: "choisirSel", coche: i >= 0 ? String(i + 1).padStart(2, "0") : "", choisie: i >= 0 }); }).join("")}</div>
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
    ${D.collections.map((c) => {
      const p = progression(c.id), ok = complete(c.id), manque = p.total - p.n;
      return `<div class="fond-blanc" style="border-top:1px solid var(--trait-defaut);padding:16px 0 20px;margin:0 calc(-1*var(--marge));padding-left:var(--marge);padding-right:var(--marge)">
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
    <div class="rangee" style="align-items:flex-start"><span class="badge${complete(cid) ? " choisi" : ""}">${icone(c.icone)}</span>
      <span class="t-texte-petit secondaire" style="flex:1">${esc(c.recompense)}, réservé à ceux qui finissent la collection.</span></div>
  </div>
  ${manque ? pied(bouton("Voir le dernier sur la carte", { action: "chercherCollection", data: ` data-id="${cid}"` })) : ""}`;
});

const svgExclusif = (cid) => {
  const c = collection(cid);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1000" viewBox="0 0 720 1000"><rect width="720" height="1000" fill="#111"/>
    <rect x="40" y="40" width="640" height="920" fill="none" stroke="#fff" stroke-width="3"/>
    <text x="70" y="140" fill="#fff" font-family="Inter,Arial" font-weight="600" font-size="34" letter-spacing="2">SCRAP · ÉDITION EXCLUSIVE</text>
    <text x="64" y="470" fill="#fff" font-family="Inter,Arial" font-weight="700" font-size="150" textLength="590" lengthAdjust="spacingAndGlyphs">${c.nom.split(" ")[0].toUpperCase()}</text>
    <rect x="70" y="520" width="80" height="80" fill="#FF0000"/>
    <text x="70" y="690" fill="#fff" font-family="Inter,Arial" font-weight="500" font-size="40">${c.zone.toUpperCase()}</text>
    <text x="70" y="744" fill="#fff" font-family="Inter,Arial" font-weight="500" font-size="40">COLLECTION COMPLÈTE</text>
    <text x="70" y="900" fill="#fff" font-family="Inter,Arial" font-weight="600" font-size="120" letter-spacing="-6">N° 001</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};
ecran("32", "D", "Collection complète — scrap exclusif", "grille", () => {
  const cid = ETAT.ctx.collection || "concerts";
  const c = collection(cid);
  return `
  ${entete("", { fermer: true })}
  <div class="defile">
    <span class="t-texte-meta secondaire">Collection complète</span>
    <h1 class="t-titre-xl" style="margin:8px 0 24px">${esc(c.nom)}</h1>
    <div style="position:relative;width:56%;margin:0 auto"><img src="${svgExclusif(cid)}" alt="Scrap exclusif" style="width:100%"><i class="scotch noir" style="left:-18px;top:2px;transform:rotate(-38deg)"></i><i class="scotch noir" style="right:-18px;top:2px;transform:rotate(38deg)"></i></div>
    <div class="rangee entre" style="margin-top:24px;align-items:flex-start">
      <div>${etiquette("Scrap exclusif")}<p class="t-texte-petit secondaire" style="margin:10px 0 0;max-width:180px">Réservé aux 64 personnes qui ont fini la collection.</p></div>
      ${tampon(`Complète · ${c.total} / ${c.total}`, `${aujourdhui().date} · Paris`, { grand: true, plein: true, pose: true })}
    </div>
  </div>
  ${pied(bouton("Coller sur mon scrapbook", { action: "collerExclusif" }) + lien("Voir mon badge", { aller: "33", centre: true }))}`;
});

ecran("33", "D", "Badge débloqué", "grille", () => {
  const cid = ETAT.ctx.collection || "concerts";
  const b = D.badges.find((x) => x.collection === cid) || D.badges[3];
  const c = collection(cid);
  return `
  ${entete("", { fermer: true })}
  <div class="defile centre" style="padding-top:48px">
    <span class="badge grand choisi" style="margin:0 auto">${icone(b.icone, 48)}</span>
    <p class="t-texte-meta secondaire" style="margin:28px 0 8px">Badge débloqué</p>
    <h1 class="t-titre-l" style="margin:0">${esc(b.nom)}</h1>
    <p class="t-texte-corps secondaire" style="margin:12px 0 28px">Tu as capturé les ${c.total} scraps de la collection ${esc(c.nom)}.</p>
    ${tampon("Badge · " + b.nom, `${c.zone} · ${aujourdhui().date}`, { grand: true, plein: true, pose: true })}
  </div>
  ${pied(bouton("Afficher sur mon profil", { action: "choisirBadge", data: ` data-id="${b.id}"` }) + lien("Plus tard", { aller: "24", centre: true }))}`;
});

/* ═════════ E. Profil et partage */
ecran("34", "E", "Placer sur ma vitrine", "grille", () => {
  const u = ETAT.utilisateur;
  const sel = ETAT.vitrine.find((v) => v.id === ETAT.ctx.vitrineSel) || ETAT.vitrine[ETAT.vitrine.length - 1];
  return `
  ${entete("Ma vitrine", { droite: lien("Annuler", { aller: "35" }) })}
  <div class="defile">
    <div class="rangee">${avatar(48, u.initiales, u.avatar)}<div><span class="t-titre-m" style="display:block">${esc(u.nom)}</span><span class="t-texte-meta secondaire">${esc(u.quartier)} · rang ${u.rang}</span></div></div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 8px">Vitrine · glisse un scrap pour le placer</p>
    <div class="vitrine fond-papier" id="vitrine"><div class="vitrine-plan" id="vplan"></div></div>
    <div id="reglages-vitrine" style="margin-top:16px">${sel ? `
      <span class="t-texte-meta secondaire">Scrap sélectionné · N° ${pad3(scrap(sel.id).num)}</span>
      <div style="margin-top:12px"><div class="curseur-ligne"><span class="t-texte-petit">Taille</span><span class="t-texte-petit secondaire" id="v-taille">${Math.round((sel.w / 100) * 100)} %</span></div>
        <input type="range" min="60" max="180" value="${sel.w}" data-input="vitrineTaille"></div>
      <div style="margin-top:8px"><div class="curseur-ligne"><span class="t-texte-petit">Rotation</span><span class="t-texte-petit secondaire" id="v-rot">${sel.rot}°</span></div>
        <input type="range" min="-20" max="20" value="${sel.rot}" data-input="vitrineRotation"></div>
      <div style="margin-top:8px">${lien("Retirer de la vitrine", { action: "retirerVitrine" })}</div>` : ""}</div>
  </div>
  ${pied(bouton("Valider", { action: "validerVitrine" }))}`;
}, (r) => vitrineMonter($("#vitrine", r), true));

ecran("35", "E", "Profil vu par les autres", "grille", () => {
  const autre = ETAT.ctx.personne != null ? ETAT.personnes[ETAT.ctx.personne] : null;
  const u = ETAT.utilisateur;
  const nom = autre ? autre.pseudo.replace("@", "") : u.nom;
  const badgesOk = D.badges.filter(badgeDebloque).slice(0, 4);
  const choisi = D.badges.find((b) => b.id === u.badge);
  return `
  ${entete("Profil", { droite: `<button class="icone-bouton" data-aller="39" aria-label="Partager">${icone("partager")}</button>` })}
  <div class="defile">
    <div class="rangee" style="align-items:flex-start;gap:16px">
      ${avatar(88, autre ? autre.initiales : u.initiales, autre ? null : u.avatar)}
      <div><h1 class="t-titre-l" style="margin:4px 0 6px">${esc(nom)}</h1>
        <span class="t-texte-meta secondaire">${esc(autre ? autre.quartier : u.quartier)} · rang ${autre ? 30 : u.rang}</span>
        ${!autre && choisi ? `<div style="margin-top:8px">${etiquette(choisi.nom)}</div>` : ""}
        ${autre ? "" : `<div style="margin-top:8px">${lien("24 abonnés · 31 abonnements", { aller: "38" })}</div>`}</div>
    </div>
    ${!autre && u.bio ? `<p class="t-texte-corps" style="margin:16px 0 0">${esc(u.bio)}</p>` : ""}
    <div class="compteurs" style="margin-top:20px">
      ${[[autre ? autre.scraps : totalScraps(), "Scraps"], [autre ? 3 : quartiers(), "Quartiers"], [autre ? 2 : D.badges.filter(badgeDebloque).length, "Badges"]]
        .map(([v, l]) => `<div><div class="t-titre-l">${v}</div><span class="t-texte-meta secondaire">${l}</span></div>`).join("")}
    </div>
    <div class="deux-col" style="margin-top:20px">
      <div><p class="t-texte-meta secondaire" style="margin:0 0 8px">Scrap mis en avant</p>
        <button data-action="ouvrirScrap" data-id="${ETAT.miseEnAvant}"><img src="${imgScrap(ETAT.miseEnAvant)}" alt="" style="width:100%"></button></div>
      <div><p class="t-texte-meta secondaire" style="margin:0 0 8px">Vitrine</p>
        <button class="vitrine fond-papier" id="vitrine" ${autre ? "" : 'data-aller="34"'} style="display:block"><div class="vitrine-plan" id="vplan"></div></button></div>
    </div>
    <p class="t-texte-meta secondaire" style="margin:24px 0 8px">Badges</p>
    <div class="quatre-col">${badgesOk.map((b) => `<button ${autre ? "" : 'data-aller="36"'} style="text-align:left"><span class="badge${b.id === u.badge ? " choisi" : ""}">${icone(b.icone)}</span><span class="t-texte-meta" style="display:block;margin-top:8px">${esc(b.nom)}</span></button>`).join("")}</div>
  </div>
  ${pied(autre
    ? `<div class="rang">${bouton(autre.suivi ? "Suivi" : "Suivre", { type: autre.suivi ? "secondaire" : "", action: "suivre", data: ` data-id="${ETAT.ctx.personne}"` })}${bouton("Partager", { type: "secondaire", aller: "39" })}</div>`
    : `<div class="rang">${bouton("Modifier le profil", { aller: "37" })}${bouton("Réglages", { type: "secondaire", aller: "41" })}</div>`)}`;
}, (r) => vitrineMonter($("#vitrine", r), false));

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
        <span class="badge${ok ? "" : " verrou"}${b.id === choix ? " choisi" : ""}">${icone(b.icone)}</span>
        <span class="t-texte-meta${ok ? "" : " secondaire"}">${esc(b.nom)}</span>${ok ? "" : `<span class="t-texte-meta secondaire" style="margin-top:2px">${prog}</span>`}</button>`;
    }).join("")}</div>
    <p class="t-texte-meta secondaire" style="margin:28px 0 8px">Aperçu sur mon profil</p>
    <div class="rangee fond-blanc" style="padding:16px;box-shadow:inset 0 0 0 1px var(--trait-defaut)">
      ${avatar(64, u.initiales, u.avatar)}<div style="flex:1"><span class="t-titre-l" style="display:block">${esc(u.nom)}</span><span class="t-texte-meta secondaire">${esc(u.quartier)} · rang ${u.rang}</span></div>
      <span class="badge choisi" style="width:40px;height:40px">${icone(D.badges.find((b) => b.id === choix).icone)}</span></div>
  </div>
  ${pied(bouton("Enregistrer", { action: "enregistrerBadge" }))}`;
});

ecran("37", "E", "Modifier le profil", "grille", () => {
  const u = ETAT.utilisateur;
  return `
  ${entete("Modifier le profil", { droite: lien("Enregistrer", { action: "enregistrerProfil" }) })}
  <div class="defile">
    <div class="rangee" style="gap:16px">${avatar(88, u.initiales, u.avatar)}<label class="bouton-lien">Changer la photo<input type="file" accept="image/*" class="cache" data-change="photoProfil"></label></div>
    <div style="height:24px"></div>
    ${champ("Pseudo", u.pseudo, { id: "p-pseudo" })}
    ${champ("Bio", u.bio, { id: "p-bio", multi: true })}
    ${champ("Quartier", u.quartier, { id: "p-quartier" })}
    <div class="liste">${ligne("Ma vitrine", { aller: "34", valeur: pluriel(ETAT.vitrine.length, "scrap") })}${ligne("Badge affiché", { aller: "36", valeur: (D.badges.find((b) => b.id === u.badge) || {}).nom })}${ligne("Réglages", { aller: "41" })}</div>
  </div>`;
});

ecran("38", "E", "Abonnés et abonnements", "grille", () => {
  const o = ETAT.ctx.ongletAbo || "abonnes";
  return `
  ${entete(ETAT.utilisateur.pseudo)}
  <div class="defile">
    <div class="puces">${puce("Abonnés · 24", o === "abonnes", ' data-action="ongletAbo" data-id="abonnes"')}${puce("Abonnements · 31", o === "abonnements", ' data-action="ongletAbo" data-id="abonnements"')}</div>
    <div class="recherche" style="margin:16px 0 4px">${icone("recherche")}<input id="q-abo" type="search" placeholder="Rechercher" autocomplete="off"></div>
    <div id="liste-abo">${listePersonnes("")}</div>
  </div>`;
}, (r) => { const q = $("#q-abo", r); q.addEventListener("input", () => { $("#liste-abo", r).innerHTML = listePersonnes(q.value); }); });

function listePersonnes(q) {
  const o = ETAT.ctx.ongletAbo || "abonnes";
  return ETAT.personnes.map((p, i) => [p, i])
    .filter(([p]) => (o === "abonnes" || p.suivi) && p.pseudo.includes(q.toLowerCase()))
    .map(([p, i]) => `<div class="ligne" style="min-height:72px">
      <button class="rangee" style="flex:1;text-align:left" data-action="voirPersonne" data-id="${i}">${avatar(44, p.initiales)}<span><span class="t-texte-label" style="display:block">${esc(p.pseudo)}</span><span class="t-texte-meta secondaire">${p.scraps} scraps · ${esc(p.quartier)}</span></span></button>
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
    <p class="t-texte-petit secondaire" style="margin:12px 0 0">Capture les ${l.total} scraps du lieu : une entrée offerte.</p>
  </div>
  ${pied(`<div class="rang">${bouton("Y aller", { action: "itineraireLieu" })}${bouton("Site du lieu", { type: "secondaire", action: "billetterie" })}</div>`)}`;
});

/* ═════════ F. Réglages */
ecran("41", "F", "Réglages", "grille", () => {
  const u = ETAT.utilisateur;
  return `
  ${entete("Réglages")}
  <div class="defile">
    <button class="ligne" data-aller="37" style="min-height:88px">${avatar(56, u.initiales, u.avatar)}<span style="flex:1"><span class="t-texte-label" style="display:block">${esc(u.pseudo)}</span><span class="t-texte-petit secondaire">Modifier le profil</span></span><span class="secondaire">${icone("chevron")}</span></button>
    <p class="t-texte-meta secondaire" style="margin:20px 0 4px">Mon compte</p>
    <div class="liste">${ligne("Confidentialité", { aller: "42", icone: "cadenas" })}${ligne("Notifications", { aller: "43", icone: "cloche" })}${ligne("Position", { aller: "44", icone: "position" })}${ligne("Compte", { aller: "45", icone: "profil" })}</div>
    <p class="t-texte-meta secondaire" style="margin:20px 0 4px">Infos</p>
    <div class="liste">${ligne("Aide et mentions", { aller: "46", icone: "aide" })}${ligne("Vie privée", { aller: "47", icone: "cadenas" })}</div>
    <p class="t-texte-meta secondaire centre" style="margin-top:32px">SCRAP · version 1.0 · prototype</p>
  </div>`;
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
