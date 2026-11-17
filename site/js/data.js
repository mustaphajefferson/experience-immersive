/* SCRAP — données du compte démo (Inès).
 *
 * Tout est fictif. Les affiches viennent du moodboard de l'équipe (assets/affiches/).
 * Les scraps capturés pendant la démo s'ajoutent à cette base (sauvegardés sur le téléphone,
 * remis à zéro depuis le menu caché).
 */
window.DONNEES = {
  utilisateur: {
    pseudo: "@ines.colle",
    nom: "Inès",
    initiales: "IN",
    quartier: "Belleville",
    arrondissement: "Paris 20e",
    rang: 12,
    bio: "Je colle, je décolle, je collectionne.",
    email: "ines@exemple.fr",
    badge: "holo",
    avatar: null,
  },

  /* Les collections proposées au départ (écran 12) et suivies ensuite.
   * teinte : la couleur de la pastille de la collection dans les listes. */
  collections: [
    { id: "concerts", nom: "Concerts", total: 8, icone: "note", zone: "Belleville", teinte: "#111111", resume: "Salles, caves, bars à concert", recompense: "Badge Concerts et un scrap exclusif" },
    { id: "expos", nom: "Expos et culture", total: 9, icone: "etoile", zone: "Est parisien", resume: "Galeries, musées, vernissages", recompense: "Badge Expos et un scrap exclusif" },
    { id: "marches", nom: "Marchés et food", total: 6, icone: "couvert", zone: "Belleville", resume: "Marchés, cantines, food trucks", recompense: "Badge Marchés" },
    { id: "messages", nom: "Messages politiques", total: 10, icone: "megaphone", zone: "20e", resume: "Tracts, syndicats, collages", recompense: "Badge Messages" },
    { id: "street", nom: "Street art et graff", total: 12, icone: "bombe", zone: "Dénoyez / Ménilmontant", resume: "Collages, pochoirs, fresques", recompense: "Badge Street art et un scrap exclusif" },
    { id: "theatre", nom: "Théâtre et danse", total: 7, icone: "masque", zone: "Est parisien", resume: "Salles, compagnies, impros", recompense: "Badge Théâtre" },
    { id: "cinema", nom: "Cinéma et ciné-clubs", total: 8, icone: "pellicule", zone: "19e / 20e", resume: "Salles d'art et essai, séances en plein air", recompense: "Badge Cinéma" },
    { id: "fetes", nom: "Soirées et fêtes", total: 9, icone: "verre", zone: "Oberkampf", resume: "Clubs, after, fêtes de quartier", recompense: "Badge Soirées" },
    { id: "sport", nom: "Sport et assos", total: 6, icone: "ballon", zone: "Belleville", resume: "Clubs, tournois, salles de quartier", recompense: "Badge Sport" },
    { id: "vintage", nom: "Brocantes et vintage", total: 5, icone: "cintre", zone: "Est parisien", resume: "Vide-greniers, friperies, puces", recompense: "Badge Brocantes" },
    { id: "typo", nom: "Typo et graphisme", total: 8, icone: "lettre", zone: "Partout", resume: "Belles affiches, pour la lettre", recompense: "Badge Typo" },
    { id: "disparues", nom: "Affiches disparues", total: 4, icone: "fantome", zone: "Partout", resume: "Arrachées ou recouvertes depuis ta capture", recompense: "Badge Disparues, le plus rare" },
  ],

  /* Scraps déjà capturés. num = rang de capture (N° 003 = 3e personne). */
  scraps: {
    alta: { titre: "Alta Fidelidad", artiste: "Alta Fidelidad Sound Rooms", ratio: 0.7549, num: 3, lieu: "Rue de Belleville", arr: "Paris 20e", date: "12.11.26", heure: "21:04", collection: "concerts", themes: ["Concert", "Musique"], holo: true, favori: true, scans: 128, murs: 12 },
    seb: { titre: "Seb Radix — Rank-O", artiste: "Seb Radix", ratio: 0.7077, num: 19, lieu: "Rue Ramponeau", arr: "Paris 20e", date: "12.11.26", heure: "18:40", collection: "concerts", themes: ["Concert", "Club"], holo: true, scans: 96, murs: 8 },
    fiasco: { titre: "Club Fiasco", artiste: "Redman, DJ Fred, Locust", ratio: 0.7503, num: 41, lieu: "Rue Dénoyez", arr: "Paris 20e", date: "11.11.26", heure: "23:10", collection: "concerts", themes: ["Club", "Musique"], scans: 74, murs: 5 },
    rose: { titre: "Rose Frequency", artiste: "Kharmyn, D. Rose, DJ Jazzie Rose", ratio: 0.7503, num: 8, lieu: "Rue des Couronnes", arr: "Paris 20e", date: "10.11.26", heure: "22:02", collection: "concerts", themes: ["Club", "Musique"], favori: true, scans: 51, murs: 9 },
    viudas: { titre: "Viudas Negras", artiste: "Viudas Negras + Katharsis", ratio: 0.7503, num: 27, lieu: "Boulevard de Belleville", arr: "Paris 11e", date: "09.11.26", heure: "20:15", collection: "concerts", themes: ["Concert"], holo: true, scans: 63, murs: 4 },
    sonda: { titre: "Sonda at Sonder", artiste: "Cortezz, Ara Chan", ratio: 0.7588, num: 64, lieu: "Rue Julien-Lacroix", arr: "Paris 20e", date: "08.11.26", heure: "11:20", collection: "concerts", themes: ["Musique", "Café"], scans: 102, murs: 3 },
    scrt: { titre: "SCRT Summer Party", artiste: "SCRT", ratio: 0.7999, num: 112, lieu: "Rue Oberkampf", arr: "Paris 11e", date: "07.11.26", heure: "19:30", collection: "concerts", themes: ["Soirée"], scans: 140, murs: 7 },
    white: { titre: "White Space Is Not Empty Space", artiste: "Collectif Blanc", ratio: 0.7077, num: 52, lieu: "Rue du Jourdain", arr: "Paris 19e", date: "05.11.26", heure: "15:12", collection: "expos", themes: ["Expo", "Graphisme"], favori: true, scans: 70, murs: 6 },
    presence: { titre: "Presence — Emmerson", artiste: "Emmerson", ratio: 0.7071, num: 88, lieu: "Rue de Belleville", arr: "Paris 20e", date: "03.11.26", heure: "19:30", collection: "expos", themes: ["Expo", "Photo"], scans: 91, murs: 5 },
    habitat: { titre: "Habitat 67", artiste: "Exposition architecture", ratio: 0.8141, num: 58, lieu: "Rue des Pyrénées", arr: "Paris 20e", date: "06.11.26", heure: "14:02", collection: "expos", themes: ["Expo", "Architecture"], scans: 66, murs: 2 },
    sanbimu: { titre: "Sanbimu — Still Life", artiste: "Sanbimu", ratio: 0.7503, num: 71, lieu: "Canal Saint-Martin", arr: "Paris 10e", date: "09.11.26", heure: "18:40", collection: "expos", themes: ["Expo", "Peinture"], scans: 85, murs: 4 },
    ozkan: { titre: "Emre-Audrey Ozkan", artiste: "Emre-Audrey Ozkan", ratio: 0.707, num: 17, lieu: "Rue de Ménilmontant", arr: "Paris 20e", date: "11.11.26", heure: "08:12", collection: "expos", themes: ["Expo"], holo: true, scans: 40, murs: 3 },
    skeleton: { titre: "Danse macabre", artiste: "Atelier Os", ratio: 0.5924, num: 2, lieu: "Place des Fêtes", arr: "Paris 19e", date: "08.11.26", heure: "23:15", collection: "expos", themes: ["Expo", "Gravure"], holo: true, favori: true, scans: 22, murs: 11 },
    different: { titre: "Different Form", artiste: "Stone Paper", ratio: 0.7063, num: 89, lieu: "Rue des Couronnes", arr: "Paris 20e", date: "02.11.26", heure: "12:20", collection: "expos", themes: ["Expo", "Graphisme"], scans: 89, murs: 2 },
    flea: { titre: "Late Edition Flea Market", artiste: "Late Edition", ratio: 0.7533, num: 33, lieu: "Parc de Belleville", arr: "Paris 20e", date: "01.11.26", heure: "10:05", collection: "marches", themes: ["Marché", "Vintage"], scans: 58, murs: 3 },
  },

  /* Affiches repérées sur la carte, pas encore capturées. */
  centre: [48.8716, 2.3772],
  position: [48.8712, 2.3765],
  cibles: [
    { id: "c1", titre: "Affiche de concert", collection: "concerts", lat: 48.8724, lng: 2.3790, adresse: "28 rue de Belleville", nouveau: true, scans: 127 },
    { id: "c2", titre: "Expo photo — Ménilmontant", collection: "expos", lat: 48.8682, lng: 2.3838, adresse: "Rue de Ménilmontant", scans: 34 },
    { id: "c3", titre: "Marché de la rue Dénoyez", collection: "marches", lat: 48.8709, lng: 2.3769, adresse: "Rue Dénoyez", nouveau: true, scans: 12 },
    { id: "c4", titre: "Affiche militante", collection: "messages", lat: 48.8738, lng: 2.3745, adresse: "Rue de la Villette", scans: 8 },
    { id: "c5", titre: "Tract collé — climat", collection: "messages", lat: 48.8697, lng: 2.3812, adresse: "Rue des Couronnes", nouveau: true, scans: 3 },
    { id: "c6", titre: "Brocante du Jourdain", collection: "marches", lat: 48.8752, lng: 2.3889, adresse: "Rue du Jourdain", scans: 19 },
    { id: "c7", titre: "Expo gravure", collection: "expos", lat: 48.8771, lng: 2.3812, adresse: "Rue des Pyrénées", scans: 27 },
    { id: "c8", titre: "Food truck — samedi", collection: "marches", lat: 48.8688, lng: 2.3726, adresse: "Rue du Faubourg-du-Temple", scans: 15 },
    { id: "c9", titre: "Affiche syndicale", collection: "messages", lat: 48.8730, lng: 2.3702, adresse: "Boulevard de la Villette", scans: 6 },
    { id: "c10", titre: "Collage rue Dénoyez", collection: "street", lat: 48.8713, lng: 2.3758, adresse: "Rue Dénoyez", nouveau: true, scans: 4 },
    { id: "c11", titre: "Fresque — mur de Ménilmontant", collection: "street", lat: 48.8702, lng: 2.3846, adresse: "Rue de Ménilmontant", scans: 46 },
    { id: "c12", titre: "Théâtre de la Colline — saison", collection: "theatre", lat: 48.8669, lng: 2.3889, adresse: "Rue Malte-Brun", scans: 38 },
    { id: "c13", titre: "Ciné-club en plein air", collection: "cinema", lat: 48.8757, lng: 2.3831, adresse: "Place des Fêtes", nouveau: true, scans: 11 },
    { id: "c14", titre: "Nuit Oberkampf", collection: "fetes", lat: 48.8669, lng: 2.3772, adresse: "Rue Oberkampf", scans: 88 },
    { id: "c15", titre: "Tournoi du gymnase", collection: "sport", lat: 48.8741, lng: 2.3818, adresse: "Rue de la Mare", scans: 7 },
    { id: "c16", titre: "Vide-grenier du Jourdain", collection: "vintage", lat: 48.8761, lng: 2.3864, adresse: "Rue du Jourdain", scans: 23 },
    { id: "c17", titre: "Affiche typographique", collection: "typo", lat: 48.8694, lng: 2.3791, adresse: "Rue Julien-Lacroix", nouveau: true, scans: 2 },
    { id: "c18", titre: "Mur recouvert — hier encore", collection: "disparues", lat: 48.8726, lng: 2.3733, adresse: "Rue Rébeval", scans: 1 },
  ],

  lieu: {
    nom: "Studio Belleville", type: "Partenaire · salle de concert · 20e", adresse: "28 rue de Belleville, 75020",
    horaires: "Jeu.–sam. · 19 h – 2 h", distance: "350 m · 4 min à pied", lat: 48.8722, lng: 2.3786, scraps: ["alta", "seb"], total: 5,
  },

  badges: [
    { id: "premier", nom: "1er scrap", icone: "scan", debloque: true },
    { id: "belleville", nom: "Belleville", icone: "position", debloque: true },
    { id: "holo", nom: "Holo", icone: "etoile", debloque: true },
    { id: "concerts", nom: "Concerts", icone: "note", collection: "concerts" },
    { id: "expos", nom: "Expos et culture", icone: "collection", collection: "expos" },
    { id: "marches", nom: "Marchés et food", icone: "couvert", collection: "marches" },
    { id: "messages", nom: "Messages politiques", icone: "megaphone", collection: "messages" },
    { id: "street", nom: "Street art", icone: "bombe", collection: "street" },
    { id: "theatre", nom: "Théâtre", icone: "masque", collection: "theatre" },
    { id: "cinema", nom: "Cinéma", icone: "pellicule", collection: "cinema" },
    { id: "fetes", nom: "Soirées", icone: "verre", collection: "fetes" },
    { id: "sport", nom: "Sport", icone: "ballon", collection: "sport" },
    { id: "vintage", nom: "Brocantes", icone: "cintre", collection: "vintage" },
    { id: "typo", nom: "Typo", icone: "lettre", collection: "typo" },
    { id: "disparues", nom: "Disparues", icone: "fantome", collection: "disparues" },
    { id: "cinquante", nom: "50 scraps", icone: "mur", objectif: 50 },
  ],

  /* Scrapbook : positions en px sur un plan de 402 px de large.
   * notes : les éléments posés par la personne (titres, étiquettes, flèches…). */
  mur: {
    fond: "papier",
    fondImage: null,
    voile: 0,
    /* w = taille du texte en px pour les éléments écrits, largeur en px pour les autres */
    notes: [
      { id: "n1", type: "titre", texte: "Belleville", x: 20, y: 4, w: 34, rot: -2, devant: true },
      { id: "n2", type: "etiquette", texte: "Automne 2026", x: 232, y: 196, w: 12, rot: 3, devant: true },
    ],
    /* La page est beaucoup plus grande que l'écran : en vue d'ensemble on voit
     * tout ce qu'il reste à remplir. */
    /* Les neuf premiers scraps sont posés petits et éparpillés sur toute la
     * hauteur : en arrivant, on voit surtout la place qui reste. Un carnet
     * déjà bien rempli donnerait l'impression qu'il n'y a plus rien à faire,
     * alors que l'app sert justement à ressortir. */
    hauteur: 1600,
    items: [
      { id: "alta", x: 28, y: 74, w: 78, rot: -5, scotch: [["hg", "transparent"], ["hd", "transparent"]] },
      { id: "rose", x: 214, y: 46, w: 64, rot: 3, scotch: [["hd", "kraft"]] },
      { id: "presence", x: 316, y: 180, w: 56, rot: 6, scotch: [["hg", "noir"]] },
      { id: "ozkan", x: 42, y: 338, w: 62, rot: -2, scotch: [["hg", "papier"]], dechire: [[0, 0], [1, 0], [1, 0.55], [0.82, 0.62], [0.9, 0.7], [0.68, 0.78], [0.76, 0.86], [0.55, 1], [0, 1]] },
      { id: "sanbimu", x: 196, y: 288, w: 86, rot: 2, scotch: [["hd", "kraft"]] },
      { id: "skeleton", x: 128, y: 524, w: 54, rot: -7, scotch: [["hg", "transparent"]] },
      { id: "flea", x: 286, y: 462, w: 70, rot: 4, scotch: [["hg", "kraft"], ["hd", "kraft"]] },
      { id: "viudas", x: 36, y: 686, w: 66, rot: 5, scotch: [["hd", "papier"]] },
      { id: "white", x: 232, y: 742, w: 60, rot: -3, scotch: [["hg", "papier"]] },
    ],
  },

  /* Vitrine du profil : plan de 370 px de large. */
  vitrine: [
    { id: "alta", x: 14, y: 28, w: 104, rot: -3 },
    { id: "skeleton", x: 136, y: 18, w: 92, rot: 2 },
    { id: "rose", x: 246, y: 40, w: 100, rot: 4 },
  ],
  miseEnAvant: "seb",

  personnes: [
    { pseudo: "@marius.b", initiales: "MA", scraps: 62, quartier: "Ménilmontant", suivi: true },
    { pseudo: "@lsa.colle", initiales: "LS", scraps: 18, quartier: "Belleville", suivi: false },
    { pseudo: "@tom_affiches", initiales: "TO", scraps: 104, quartier: "11e", suivi: true },
    { pseudo: "@nk.paris", initiales: "NK", scraps: 9, quartier: "19e", suivi: false },
    { pseudo: "@juju.scrap", initiales: "JU", scraps: 33, quartier: "20e", suivi: true },
    { pseudo: "@ab.collage", initiales: "AB", scraps: 51, quartier: "10e", suivi: false },
    { pseudo: "@rem.r", initiales: "RE", scraps: 27, quartier: "20e", suivi: false },
  ],

  reglages: {
    murPublic: false, profilRecherche: true, montrerQuartier: false, montrerRang: true,
    rappelHebdo: true, rareProche: false, presqueComplete: true, nouvelAbonne: true, silenceNuit: true,
    positionPrecise: false, rayon: 500,
    profondeur: true,
  },
};

/* ═════════ Une carte bien vivante
 *
 * À côté des affiches écrites à la main ci-dessus, on en sème une centaine
 * d'autres dans tout l'est parisien : c'est ce qui donne l'impression d'une
 * app déjà utilisée par beaucoup de monde, et c'est ce qui rend les filtres
 * démonstratifs (sans ça, filtrer ne change presque rien à l'écran).
 *
 * Le tirage est pseudo-aléatoire mais TOUJOURS LE MÊME : la carte ne change
 * pas d'un rechargement à l'autre, sinon on ne retrouverait jamais un scrap
 * repéré la veille.
 */
(function semerLesAffiches() {
  const D = window.DONNEES;
  // générateur déterministe (mulberry32) : même graine, même carte
  let graine = 20261117;
  const alea = () => {
    graine |= 0; graine = (graine + 0x6D2B79F5) | 0;
    let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const dans = (liste) => liste[Math.floor(alea() * liste.length)];

  const rues = [
    "Rue de Belleville", "Rue Dénoyez", "Rue Julien-Lacroix", "Rue Ramponeau", "Rue des Couronnes",
    "Rue de la Mare", "Rue des Pyrénées", "Rue du Jourdain", "Rue de Ménilmontant", "Rue Oberkampf",
    "Boulevard de la Villette", "Rue Rébeval", "Rue Botzaris", "Avenue Simon-Bolivar", "Rue de Tourtille",
    "Place des Fêtes", "Rue Piat", "Rue des Envierges", "Rue Sorbier", "Rue de la Chine",
    "Rue Bisson", "Rue Lesage", "Rue Vilin", "Passage Plantin", "Rue Henri-Chevreau",
  ];
  const titres = {
    concerts: ["Concert au sous-sol", "Release party", "Carte blanche — trio", "Scène ouverte", "Concert de soutien", "Nuit jazz", "Plateau punk"],
    expos: ["Expo photo", "Vernissage", "Carte blanche — gravure", "Expo collective", "Résidence ouverte", "Accrochage d'atelier"],
    marches: ["Marché du quartier", "Cantine solidaire", "Food truck du samedi", "Marché des producteurs", "Brunch associatif"],
    messages: ["Tract collé", "Appel à rassemblement", "Affiche syndicale", "Collage féministe", "Affiche de soutien", "Appel au don"],
    street: ["Collage", "Pochoir", "Fresque en cours", "Mur libre", "Sticker géant", "Affiche lacérée"],
    theatre: ["Saison du théâtre", "Compagnie en tournée", "Impro du mardi", "Danse contemporaine", "Lecture publique"],
    cinema: ["Ciné-club", "Séance en plein air", "Rétrospective", "Court-métrage local", "Documentaire et débat"],
    fetes: ["Soirée au club", "Fête de quartier", "After du dimanche", "Bal populaire", "Carnaval de rue"],
    sport: ["Tournoi du gymnase", "Cours d'essai", "Course du quartier", "Club de boxe", "Rando urbaine"],
    vintage: ["Vide-grenier", "Friperie éphémère", "Puces du quartier", "Troc de disques"],
    typo: ["Affiche typographique", "Lettrage peint", "Sérigraphie", "Affiche de festival"],
    disparues: ["Mur recouvert", "Affiche arrachée", "Trace de colle", "Panneau repeint"],
  };
  const poids = {
    concerts: 14, expos: 12, street: 14, messages: 11, fetes: 10, marches: 9,
    cinema: 8, theatre: 7, typo: 7, sport: 6, vintage: 5, disparues: 3,
  };
  const roue = [];
  Object.entries(poids).forEach(([k, n]) => { for (let i = 0; i < n; i++) roue.push(k); });

  const [clat, clng] = D.centre;
  for (let i = 0; i < 112; i++) {
    // plus dense près du centre : on tire un rayon au carré
    const r = Math.pow(alea(), 0.62) * 0.0135;
    const a = alea() * Math.PI * 2;
    const lat = clat + r * Math.cos(a);
    const lng = clng + (r * Math.sin(a)) / Math.cos((clat * Math.PI) / 180);
    const col = dans(roue);
    const rang = alea();
    D.cibles.push({
      id: "s" + i,
      titre: dans(titres[col]),
      collection: col,
      lat: +lat.toFixed(5),
      lng: +lng.toFixed(5),
      adresse: dans(rues),
      nouveau: alea() < 0.17,
      // une partie est déjà dans la collection : la carte montre ce qui est fait
      fait: alea() < 0.24,
      // beaucoup d'affiches déjà très vues, quelques-unes presque vierges
      scans: rang < 0.12 ? 1 + Math.floor(alea() * 9) : 10 + Math.floor(Math.pow(alea(), 2) * 480),
    });
  }
})();
