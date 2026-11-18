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
   * repos      : amplitude de la houle qui anime les couches tant que le
   *              capteur n'est pas branché (0 pour que tout reste plat) ;
   * portee     : inclinaison, en degrés, qui pousse l'effet à fond ;
   * recentrage : vitesse à laquelle la position neutre suit la façon dont on
   *              tient le téléphone (0 = neutre figé à la première mesure,
   *              ce qui met l'effet en butée dès qu'on redresse l'appareil). */
  profondeur: { amplitude: 1, actif: true, repos: 0.26, portee: 20, recentrage: 0.012 },

  /* L'affiche vivante.
   * Une affiche éditée par SCRAP (design/affiche/) que l'app reconnaît au
   * scan et qui s'anime au lieu d'être une simple image. L'empreinte est
   * posée automatiquement par design/affiche/generer-affiche.py : ne pas la
   * modifier à la main.
   * seuil : au-dessus, on considère que c'est elle. 0,55 laisse une marge
   * énorme — l'affiche elle-même retombe rarement sous 0,75, même mal
   * cadrée, et les autres affiches ne dépassent pas 0,30. */
  afficheVivante: {
    fichier: "assets/affiches/scrap-live.svg",
    titre: "Colle fraîche",
    lieu: "28 rue de Belleville",
    seuil: 0.55,
    grille: [8, 11],
/* EMPREINTE-DEBUT */
    empreinte: [0.6953, 0.6499, 0.609, 0.6499, 0.6788, 0.7931, 0.8423, 0.8587, 0.8853, 0.8649, 0.8505, 0.8853, 0.5579, 0.2533, 0.2761, 0.7564, 0.8792, 0.6868, 0.482, 0.2875, 0.1472, 0.7792, -0.0021, 0.7588, -0.8244, -1.2149, -2.0057, -1.7929, -1.0677, -1.5866, -0.863, 0.7178, 0.4109, -0.509, -0.6116, -1.0919, -1.2566, -0.8774, -0.7774, 0.7769, -0.8099, -1.9526, -2.0258, -2.5455, -1.9737, -2.068, -1.1025, 0.736, 0.8587, 0.8936, 0.3941, 0.6233, 0.609, 0.8587, 0.8178, 0.8383, 0.6953, 0.5438, 0.5824, 0.5415, 0.5499, 0.5005, 0.8649, 0.8792, 0.6541, 0.4579, 0.4394, 0.4231, 0.8383, 0.8792, 0.8587, 0.8587, 0.7094, 0.3985, 0.2305, 0.5274, 0.7383, 0.8936, 0.3434, 0.6297, -1.4411, -1.4555, -1.4698, -1.5249, -1.4555, -1.4675, -1.4863, -1.4411, -0.3971, -0.3289, -0.3289, -0.3289, -0.3191, -0.3289, -0.3679, -0.4458, -0.4264, -0.4264, -0.4069, -0.4264, -0.4264, -0.4361, -0.4458, -0.4458, -0.4458, -0.4069, 0.0318, 0.373, -0.4653, -0.4556, -0.4848, -0.4556, -0.5141, -0.1144, 1.065, 0.7824, -0.5238, -0.5336, -0.5238, -0.4556, -0.4556, -0.5043, -0.3094, 1.0943, 0.4217, -0.5043, -0.4946, -0.4458, -0.4848, -0.5433, 0.4314, 0.7141, -0.4458, -0.5336, -0.5043, -0.4458, -0.4458, -0.4653, 0.256, -0.1047, -0.0852, -0.4458, -0.4458, -0.4458, -0.3971, -0.3581, -0.3484, -0.3484, -0.3386, -0.3484, -0.4264, -0.4458, -0.4458, -0.4361, -0.2996, -0.4166, -0.4458, -0.4458, -0.4458, -0.4458, -0.4653, -0.2996, -0.1827, -0.2801, -0.4556, -0.4653, -0.4751, -0.2801, 2.9464, 2.9658, 2.9853, 3.0536, 2.9658, 2.9756, 3.0633, 2.9464],
    /* EMPREINTE-FIN */
  },

  /* Boussole de capture (écran 17).
   * marcheSimulee : quand le téléphone ne bouge pas (test assis, démo devant
   * un jury), la distance se rapproche toute seule à vitesse de marche, pour
   * que la montée en cadence soit visible. Dès que la vraie position bouge,
   * c'est elle qui commande. À mettre à false pour une vraie sortie. */
  boussole: { marcheSimulee: true, vitesse: 1.25 },
};
