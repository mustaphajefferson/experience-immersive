/* SCRAP — réglages du prototype.
 *
 * CLÉ CARTO (fond de carte)
 * -------------------------
 * CARTO demande maintenant une clé pour ses tuiles : sans elle, la carte
 * répond « API key required » et reste grise. La clé ci-dessous est celle
 * reçue par mail. C'est une clé de fond de carte : elle est faite pour
 * vivre dans le code d'une page web (le navigateur doit l'envoyer à chaque
 * tuile), donc elle est forcément visible. Elle ne donne accès à rien
 * d'autre qu'aux tuiles.
 *
 * À faire une fois sur carto.com, quand le site sera en ligne : limiter la
 * clé au domaine du prototype (mustaphajefferson.github.io), pour que
 * personne d'autre ne consomme les 5 000 000 requêtes par mois.
 *
 * Pour changer de clé : remplacer la chaîne ci-dessous, c'est tout.
 */
window.CONFIG = {
  cartoCle: "cb1_5aux_1_2e5a52b26e68a5f0fd32671e",

  /* Styles de tuiles essayés dans l'ordre. Si le premier refuse (clé
   * expirée, quota dépassé), la carte bascule toute seule sur le suivant,
   * et en dernier recours sur OpenStreetMap, qui ne demande pas de clé.
   * Voyager est exactement l'adresse donnée dans le mail, donc celle dont on
   * est sûr. Si tu préfères un plan plus clair et plus vide, mets « Positron »
   * en premier dans la liste : c'est le même service et la même clé. */
  fondsCarte: [
    { nom: "CARTO Voyager", url: "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key={cle}" },
    { nom: "CARTO Positron", url: "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key={cle}" },
    { nom: "OpenStreetMap", url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", sansRetine: true },
  ],

  /* Scanner : détection des contours de l'affiche (écran 19). */
  scan: {
    auto: true,          // capture toute seule dès que le cadre est stable
    stabiliteMs: 900,    // durée pendant laquelle le cadre doit rester immobile
    surfaceMin: 0.1,     // part de l'image que l'affiche doit occuper
    analysesParSec: 12,
  },

  /* Effet de profondeur lié au gyroscope.
   * repos : amplitude de la houle qui anime les couches tant que le capteur
   * n'est pas branché (0 pour que tout reste parfaitement plat). */
  profondeur: { amplitude: 1, actif: true, repos: 0.26 },
};
