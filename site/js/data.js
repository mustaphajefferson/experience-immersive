/* Données du prototype.
 *
 * Lieux, dates, numéros de scan et thèmes repris du plugin Figma (figma-plugin/src/logic.js).
 * Tout est fictif : la fiche (§5) précise que les noms cités sont des exemples.
 *
 * À confirmer :
 * - « seb » passe de N° 003 à N° 007 : le plugin donnait deux fois le N° 003 (avec « alta »).
 * - titres et artistes des affiches autres qu'« alta » sont provisoires (nom de fichier).
 * - pos : position du marqueur sur la carte, en % de la zone.
 */
window.DONNEES = {
  affiches: {
    alta: {
      titre: "Alta Fidelidad", artiste: "Alta Fidelidad Sound Rooms", fichier: "alta.jpg", ratio: 0.7549,
      num: "003", lieu: "Rue de Belleville, 20e", quartier: "Belleville", date: "12.11.2026 · 21:04",
      theme: "Concert · Musique", holo: true, favori: true, scans: 128, collection: "concerts", pos: [45, 40],
    },
    seb: {
      titre: "Seb", artiste: "Seb", fichier: "seb.jpg", ratio: 0.7077,
      num: "007", lieu: "Rue de Belleville", quartier: "Belleville", date: "12.11.2026 · 09:30",
      theme: "Message politique", holo: true, nouveau: true, scans: 96, collection: "messages", pos: [52, 30],
    },
    ozkan: {
      titre: "Ozkan", artiste: "Ozkan", fichier: "ozkan.jpg", ratio: 0.707,
      num: "017", lieu: "Ménilmontant", quartier: "Ménilmontant", date: "11.11.2026 · 08:12",
      theme: "Exposition", scans: 41, collection: "culture", pos: [71, 55],
    },
    sanbimu: {
      titre: "Sanbimu", artiste: "Sanbimu", fichier: "sanbimu.jpg", ratio: 0.7503,
      num: "041", lieu: "Canal Saint-Martin", quartier: "Saint-Martin", date: "09.11.2026 · 18:40",
      theme: "Concert", scans: 74, collection: "concerts", pos: [25, 62],
    },
    skeleton: {
      titre: "Skeleton", artiste: "Skeleton", fichier: "skeleton.jpg", ratio: 0.5924,
      num: "002", lieu: "Place des Fêtes", quartier: "Fêtes", date: "08.11.2026 · 23:15",
      theme: "Concert · Électro", holo: true, scans: 210, collection: "concerts", pos: [63, 24],
    },
    habitat: {
      titre: "Habitat", artiste: "Habitat", fichier: "habitat.jpg", ratio: 0.8141,
      num: "058", lieu: "Rue des Pyrénées", quartier: "Pyrénées", date: "06.11.2026 · 14:02",
      theme: "Restauration", scans: 19, collection: "restaurants", pos: [33, 46],
    },
    white: {
      titre: "White", artiste: "White", fichier: "white.jpg", ratio: 0.7077,
      num: "064", lieu: "Jourdain", quartier: "Jourdain", date: "05.11.2026 · 10:47",
      theme: "Art urbain", favori: true, scans: 33, collection: "culture", pos: [80, 36],
    },
    presence: {
      titre: "Présence", artiste: "Présence", fichier: "presence.jpg", ratio: 0.707,
      num: "112", lieu: "Belleville", quartier: "Belleville", date: "03.11.2026 · 19:30",
      theme: "Message politique", scans: 12, collection: "messages", pos: [40, 22],
    },
    different: {
      titre: "Different", artiste: "Different", fichier: "different.jpg", ratio: 0.7063,
      num: "089", lieu: "Couronnes", quartier: "Couronnes", date: "02.11.2026 · 12:20",
      theme: "Art urbain", scans: 58, collection: "culture", pos: [22, 30],
    },
  },

  collections: [
    { id: "concerts", nom: "Concerts", total: 5 },
    { id: "culture", nom: "Culture et musique", total: 6 },
    { id: "messages", nom: "Messages politiques", total: 4 },
    { id: "restaurants", nom: "Restaurants", total: 8 },
  ],
};
