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

  collections: [
    { id: "concerts", nom: "Concerts", total: 8, icone: "note", zone: "Belleville", recompense: "Badge Concerts et un scrap exclusif" },
    { id: "expos", nom: "Expos et culture", total: 9, icone: "etoile", zone: "Est parisien", recompense: "Badge Expos" },
    { id: "marches", nom: "Marchés et food", total: 6, icone: "couvert", zone: "Belleville", recompense: "Badge Marchés" },
    { id: "messages", nom: "Messages politiques", total: 10, icone: "megaphone", zone: "20e", recompense: "Badge Messages" },
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
    { id: "cinquante", nom: "50 scraps", icone: "mur", objectif: 50 },
  ],

  /* Scrapbook : positions en px sur un plan de 402 px de large. */
  mur: {
    fond: "papier",
    hauteur: 760,
    items: [
      { id: "alta", x: 22, y: 34, w: 122, rot: -3, scotch: [["hg", "transparent"], ["hd", "transparent"]] },
      { id: "rose", x: 162, y: 22, w: 104, rot: 2, scotch: [["hd", "kraft"]] },
      { id: "presence", x: 286, y: 44, w: 92, rot: 4, scotch: [["hg", "noir"]] },
      { id: "ozkan", x: 26, y: 232, w: 100, rot: 0, scotch: [["hg", "papier"]], dechire: [[0, 0], [1, 0], [1, 0.55], [0.82, 0.62], [0.9, 0.7], [0.68, 0.78], [0.76, 0.86], [0.55, 1], [0, 1]] },
      { id: "sanbimu", x: 140, y: 214, w: 146, rot: -1, scotch: [["hd", "kraft"]] },
      { id: "skeleton", x: 300, y: 236, w: 84, rot: 3, scotch: [["hg", "transparent"]] },
      { id: "flea", x: 30, y: 430, w: 112, rot: 2, scotch: [["hg", "kraft"], ["hd", "kraft"]] },
      { id: "viudas", x: 170, y: 446, w: 104, rot: -4, scotch: [["hd", "papier"]] },
      { id: "white", x: 292, y: 420, w: 88, rot: 1, scotch: [["hg", "papier"]] },
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
  },
};
