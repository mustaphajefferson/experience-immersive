# Fiche de référence — SCRAP (Expérience immersive)

*À lire au début de chaque nouvelle conversation. C'est la source de vérité du projet : si une décision change, on met cette fiche à jour.*

Dernière mise à jour : 17.11.2026 (v8 : la page posée sur une table, le scotch où on veut, dix encres, nouveaux papiers et éléments, relief permanent, lampe du scanner, bouton de démo)

---

## 1. Cadre

- **Cours :** Workshop 2 « Expériences immersives », LISAA, Mastère Direction Artistique, 5e année, 35 h. Projet en binôme.
- **Thème :** la ville en réalité augmentée, piste culture et art urbain.
- **Livrables :** prototype, vidéo de 60 à 90 s, dossier PDF, pitch de 5 min.
- **Évaluation (sur 20) :** originalité, UX, narration, prototype, réflexion critique, présentation.

## 2. Concept

**SCRAP** — « Ta ville en morceaux. » *(accroche à valider)*

**Une app qui fait sortir les gens découvrir leur quartier, en transformant les affiches de la ville en collections à compléter.** On va dans la rue pour capturer des **scraps**.

| Avant | Maintenant |
|---|---|
| Une affiche scannée | **Un scrap** |
| Scanner une affiche | **Capturer un scrap** (« choper » refusé) |
| Mur virtuel | **Scrapbook** (onglet « Scrapbook ») |
| N° 003 · 3e personne | **Scrap N° 003** · 3e à l'avoir capturé |
| Ajouter au mur | **Coller sur mon scrapbook** |
| Mur public du profil | **Vitrine** |

- On capture une affiche dans la rue : elle devient un scrap, avec son numéro (« Scrap N° 003 » = 3e personne à l'avoir capturé).
- Les scraps se collent sur un **scrapbook** personnel, façon moodboard : déplacer, scotcher, déchirer, changer le fond.
- Elles se regroupent en **collections** (12 au total : concerts, expos, marchés, messages politiques, street art, théâtre, cinéma, soirées, sport, brocantes, typo, affiches disparues). On en choisit trois au départ ; la carte aide à trouver celles qui manquent.
- **Le relief** est une matière de l'app entière, pas un effet d'un écran : l'inclinaison du téléphone est mesurée une fois pour toutes et toutes les couches de tous les écrans la suivent. L'autorisation est demandée dès l'accueil (écran 07.1), à côté de la caméra, et se coupe dans les réglages. **Tant que le capteur n'est pas branché, une houle très lente anime les couches** : on voit que l'app vit sans avoir à trouver le bouton « Activer la 3D », et le capteur prend le relais dès qu'il est autorisé.
- **La rareté** se lit sur le numéro de capture : mythique (5 premiers), rare (20 premiers), peu vue (60 premiers), commune. Plus un scrap est rare, plus sa page réagit : le décor derrière la carte bouge avec l'inclinaison du téléphone (gyroscope), le halo et les rayons s'intensifient. L'affiche, elle, n'est jamais touchée.
- Progression : profil personnalisable, vitrine d'affiches, badges (sceaux au cadre perforé, un motif dessiné par badge).
- **Objectif principal :** faire sortir les gens.

**Cible :** principalement des jeunes qui collectionnent déjà et jouent à Pokémon GO. En secondaire, des habitués des sorties culturelles.
**Persona :** Inès, 22 ans, étudiante en design, Belleville / 11e (hypothèse, pas de vrais entretiens à ce stade).
**Références :** Pokémon GO, Flash Invaders, Soundmap, Ingress Prime.

## 3. Écrans — v7 (ordre du parcours, numérotation de référence)

Le parcours d'Inès (les 11 premiers écrans dessinés) est inclus : 13, 19, 21, 22, 24, 28, 29, 34, 35, 36, 30.

**A. Lancement et inscription**
- **01 Accueil, d'un seul tenant** (il n'y a plus d'écran 02 : c'est cette couture-là qui se voyait). Les affiches arrivent une à une et se rangent en quatre rangées ; dès qu'on fait défiler, les rangées sortent par les côtés en sens contraire et le nom, l'accroche et le bouton montent à leur place.
- 03 Découverte 1 — Sors · 04 Découverte 2 — Capture · 05 Découverte 3 — Colle
- 06 Accès à la caméra · 07 Accès à la position · **07.1 Accès au mouvement** (le relief, démontré avec trois affiches qui bougent)
- 08 Créer un compte · 09 Se connecter · 10 Mot de passe oublié · 11 Pseudo et avatar · 12 Collections de départ (3 max)

**B. Carte et capture**
- 13 Carte d'accueil · 14 Filtres de la carte · 15 Recherche · 16 Scrap repéré (avant capture) · 17 Itinéraire à pied · 18 Carte vide
- 19 Scanner (mode sombre, contours suivis en direct, capture automatique) · **19.1 Vérifier le scan** (« Ce scan te plaît ? » Garder / Reprendre) · **19.2 Identifier le scrap** (titre, lieu, collection, tags)
- 20 Capture échouée · 21 Scrap capturé — recto · 22 Scrap capturé — verso · 23 Détail de l'événement

**C. Scrapbook**
- 24 Mon scrapbook. **Le carnet s'ouvre** en arrivant : deux couvertures qui s'écartent, puis plus aucune bordure de livre, juste la page. Deux modes : **Vue** (se promener, zoomer ; toucher un scrap l'ouvre en grand) et **Disposition** (premier toucher = sélection, deuxième = ouvre en grand ; seul le scrap sélectionné se déplace, donc un glissement n'attrape jamais une affiche par surprise). La page a **900 px de marge de tous les côtés** et se dézoome jusqu'à une vignette (12 %) : la feuille est posée sur une table, on voit son bord et son ombre, et on peut s'en éloigner vraiment loin. Quand rien n'est sélectionné, le panneau propose quatre **rangements tout faits** (grille, colonne, mosaïque, éparpillé).
- **24.1 Ajouter un élément** : grand titre, sous-titre, étiquette, date, flèche, flèche double, soulignement, entourage, étoile, ruban, punaise. Les annotations dessinées se tracent toutes seules en arrivant, comme si on venait de les faire au feutre.
- **24.2 Partager mon scrapbook** : la page devient une image — story, carré, **sur un mur** (posée sur la photo d'un vrai mur), page entière
- **24.3 Dessiner** : tracer à la main sur la page (dix encres, quatre épaisseurs jusqu'au marqueur). Le calque de dessin couvre toute la planche : un trait qui sort de la page n'est plus coupé.
- **24.4 Photo d'un mur** : on photographie un vrai mur, et l'export « Sur un mur » pose la page dessus
- 25 Personnaliser — fond (**12 motifs** + **ta propre photo**, avec un voile réglable, et une **teinte** à passer par-dessus le papier) · 26 Personnaliser — scotch · 27 Personnaliser — déchirer (**5 types** : un coin, un bord, en deux, arrachée, sur mesure)

**D. Collections**
- 28 Ma collection (filtres Derniers · Plus rares · Favoris · Lieu · **État** · Thème ; 4 dispositions : Mosaïque · Serré · Liste · En grand) · 29 Sélection · 30 Mes collections
- 31 Fiche d'une collection · 32 Collection complète — **ouverture d'un pack** puis le scrap exclusif holographique · 33 Badge débloqué

**E. Profil et partage**
- 34 Placer sur ma vitrine · 35 Profil vu par les autres · 36 Choisir un badge · 37 Modifier le profil · 38 Abonnés et abonnements · 39 Partager un scrap · 40 Lieu partenaire

**F. Réglages**
- 41 Réglages · 42 Confidentialité · 43 Notifications · 44 Position · 45 Compte · 46 Aide et mentions · 47 Vie privée

**G. États d'erreur**
- 48 Pas de connexion · 49 Caméra coupée · 50 Erreur de chargement

## 4. Design system (export « DESIGN SYSTEM — Affiches », v1.0)

**Principes :** l'affiche d'abord · une seule couleur d'accent, un seul rôle · la grille, rien que la grille.

**Écran :** iPhone 17, 402 × 874. Grille de 4 colonnes, marges 16, gouttières 8, colonnes de 86,5. Base 4. Une affiche fait 2 colonnes (181 px) dans la collection et 4 colonnes en plein écran.

**Couleurs (tokens sémantiques, valeur claire / sombre)**

| Token | Clair | Sombre | Usage |
|---|---|---|---|
| fond/principal | #FFFFFF | #111111 | Fond des écrans |
| fond/secondaire | #F1F1EE | #1C1C1B | Zones neutres, affiche en chargement |
| fond/inverse | #111111 | #FFFFFF | Bouton principal, puce active, notification |
| texte/principal | #111111 | #FFFFFF | Titres, texte |
| texte/secondaire | #6B6B67 | #9A9A96 | Lieu, date, compteurs |
| texte/inverse | #FFFFFF | #111111 | Sur fond inverse |
| trait/defaut | #DCDCD8 | #2B2B29 | Filets de séparation |
| trait/fort | #111111 | #FFFFFF | Contours, icônes, repère actif |
| accent/capture | **#FF0000** | #FF0000 | Capture et sa trace uniquement |
| accent/sur-accent | #FFFFFF | #FFFFFF | Texte et icône sur l'accent |

**L'accent a deux rôles depuis la v7 :** la capture (déclencheur et cadre du scanner, bouton « Scanner une affiche », numéro de scan, pastille « nouveau », ma position sur la carte) **et ce qui est actif** — un point rouge de 5 px dans le coin des puces et des dispositions sélectionnées, le liseré des puces actives, la barre de l'onglet courant, les coches, les interrupteurs allumés, le contour des cartes et des vignettes choisies, les jauges de progression, le bouton Filtres quand un filtre est posé. Règle : **en détail, jamais en aplat** — les fonds pleins restent noirs.

**Typographie (Inter)**

| Style | Police | Taille / interligne | Interlettrage |
|---|---|---|---|
| Titre/XL | Semi Bold | 40 / 40 | −3 % |
| Titre/L | Semi Bold | 28 / 30 | −2 % |
| Titre/M | Semi Bold | 20 / 24 | −1 % |
| Texte/Corps | Regular | 16 / 22 | −0,5 % |
| Texte/Petit | Regular | 14 / 19 | 0 |
| Texte/Label | Medium | 15 / 20 | −0,5 % |
| Texte/Méta | Medium, CAPITALES | 11 / 14 | +4 % |
| Chiffre/Capture | Semi Bold | 64 / 56 | −5 % (seul texte en accent) |

**Formes :** rayon 0 partout, filets de 1 px, aucune ombre, aucun effet. Seuls le déclencheur et ma position sont ronds.
**L'affiche est intouchable :** format d'origine, jamais recadrée ni déformée ; pas d'ombre, de cadre, de filtre ni de texte par-dessus ; posée sur du blanc (ou du noir en plein écran) ; légende dessous (numéro, lieu, date).
**Icônes :** 24 px, trait de 1,5, extrémités carrées. Scan, carte, mur, collection, profil, recherche, position, fermer, retour, plus, valider, partager.
**Composants :**
- bouton (principal noir, secondaire en contour, capture en accent, lien souligné) ;
- déclencheur ;
- puce (active = noir) ;
- étiquette (catégorie en contour, numéro en accent) ;
- pastille 8 × 8 ;
- pin de carte (tête carrée, icône de la collection, pointe) ;
- champ de recherche (filet sous le texte) ;
- notification (barre noire) ;
- ligne de collection ;
- en-tête (titre et action, ou retour, titre centré et icône) ;
- onglets (actif = texte noir et filet de 2 px) ;
- carte affiche (coche noire en mode sélection).

**09 — Grille de fond (ajoutée) :**
- Un composant « Fond / Grille », premier calque de chaque écran clair. Il est absent sous la carte et sur le scanner.
- Lignes verticales sur les marges et au milieu des gouttières, chaque colonne divisée en 4.
- Une ligne horizontale tous les 24 px, une ligne marquée tous les 96 px.
- Trait à 5 % de texte/principal, lignes marquées à 9 %, repères « + » de 9 px à 50 % de texte/secondaire.
- Elle passe toujours derrière : affiches, boutons et barres ont un fond plein.

**10 — Scrap (ajoutée) :**
- **Tampon** : un par scrap, à droite de la légende, jamais sur l'image. Il porte la date de capture et l'arrondissement. Contour = scrap capturé ; plein (fond/inverse) = collection complète. Incliné de 6°, double filet, Texte/Méta, jamais en accent.
- **Fonds du scrapbook** (au choix) : Papier (défaut, fond/secondaire), Quadrillé (la grille 09), Millimétré, Kraft, Béton, Liège, Journal, Noir, **Calque, Seyès, Carton, Ardoise**, ou une photo personnelle avec un voile réglable. Trame de points 2 px tous les 24 px, repères « + » tous les 96 px. Une **teinte** (la même palette que les encres, à 50 %) se pose par-dessus la matière : douze papiers et dix teintes font cent vingt pages différentes.
- **Encres** : dix couleurs (noir, rouge, blanc, bleu stylo, vert, jaune, rose fluo, violet, terre, gris) pour **tout ce qu'on pose** et pour le dessin. Sur un papier coloré, le texte bascule au noir ou au blanc selon ce qui se lit.
- **Scotch** : transparent, kraft, papier, noir, **rubalise, rayé, fluo, doré**. Longueur proportionnelle au scrap, deux bouts maximum, sur le scrapbook et la vitrine uniquement. **Il se pose là où le doigt touche** et s'incline tout seul selon le bord (diagonale dans un coin, dans le sens du bord ailleurs) ; toucher un bout l'enlève.
- **Déchirure** : sur le scrapbook seulement. Cinq types au choix (un coin, un bord, en deux, arrachée, sur mesure au doigt). Le bord n'est pas un zigzag régulier : il est construit par déplacement du milieu, avec de grandes ondulations et de petites dents par-dessus, et un liseré de papier blanc derrière pour l'épaisseur. Le morceau arraché reste dans la collection : on ne perd jamais un scrap.
- **Éléments à poser** (section 11) : grand titre, sous-titre, étiquette, date, **post-it, bulle, ticket**, flèche, flèche double, soulignement, entourage, étoile, ruban, punaise, **trombone, gommette**. Ils se déplacent, se redimensionnent, se tournent et changent d'encre comme les scraps. Post-it, bulle et ticket portent un texte qui suit leur taille.
- **Cadres** : aucun, filet, épais, passe-partout, polaroïd, noir, **coins photo, bois**.
- **Logo** : « SCRAP » en Inter Semi Bold, suivi d'un carré rouge (le point de capture, seul accent du logo).

## 5. Décisions prises

- **Nom : SCRAP.** On capture des scraps. Verbe : **capturer** (« choper » refusé).
- **Pas de thème** (pêcheur, guetteur…) : on garde le concept tel quel.

- **L'accent est rouge (#FF0000).** L'export l'appelle encore « Bleu capture » : il faudra renommer.
- **Les pins de la carte** remplacent les marqueurs carrés : une petite affiche plantée sur une pointe, avec l'icône de sa collection dedans. Une affiche **déjà capturée** porte une coche rouge et passe en retrait : d'un coup d'œil on voit ce qui reste à faire.
- **La recherche ne montre que ce qui manque.** On y cherche quoi aller capturer, trié par distance, avec la même vignette que le bandeau de la carte. Les scraps déjà capturés sont dans l'onglet Collection, qui est fait pour ça.
- **On peut toujours rentrer :** la barre du bas reste sur le profil et les réglages, et le retour d'un écran sans historique ramène à la carte.
- **Le scan est automatique** (écran 19) : les contours de l'affiche sont suivis en direct et la photo part toute seule dès que le cadre ne bouge plus, comme dans Notes. L'image est redressée (perspective corrigée) avant d'être proposée. La capture au bouton reste possible : chip « Auto » en haut à droite.
- **On vérifie avant d'identifier** : après la capture, l'écran 19.1 montre l'affiche seule sur fond noir et demande « Ce scan te plaît ? » — Garder ou Reprendre. L'identification (titre, lieu, collection, tags) vient après, en 19.2.
- **Holo :** l'état holographique est signalé par une étiquette « État · Holo » et une mention dans la légende, pas par un effet sur l'image (règle « affiche intouchable »).
- **Le relief au gyroscope** s'applique à toute l'app, pas à un écran : une seule mesure, posée en variables CSS sur la racine du document (`--px`, `--py`), dont héritent toutes les couches. L'autorisation est demandée à l'accueil (07.1) et se coupe dans Réglages › Affichage.
- **La carte exclusive garde le gyroscope, pas le film par-dessus.** Le voile arc-en-ciel posé sur toute la surface faisait calque collé, détaché de la carte : il est devenu un liseré sur la tranche, et le reflet reste à l'intérieur de la carte au lieu de déborder.
- **Le verso d'un scrap est dimensionné en part de la carte** (unités `cqw`) : la composition est la même sur un scrap étroit et sur une grande affiche, les lignes occupent toute la hauteur et plus rien ne se chevauche en bas. Le numéro de capture et les étiquettes flottantes passent **devant** la carte.
- **L'holographie est réservée à ce que SCRAP fabrique lui-même** : la carte exclusive de fin de collection. Pas d'arc-en-ciel en aplat — trois couches qui ne se voient presque pas à plat et qui prennent vie dès qu'on penche : un **guillochage gravé** (fines diagonales blanches, une sur trois en rouge), un **reflet net** qui balaie la carte, un **liseré prismatique** concentré sur les bords. La carte garde cet effet quand on la rouvre depuis le scrapbook, pas seulement le jour où on la gagne. La règle « l'affiche est intouchable » ne concerne que les vraies affiches de la rue ; pour un scrap marqué Holo, l'effet passe en halo derrière l'affiche, jamais dessus.
- **Observer une affiche, c'est une composition** : le nom de la collection à la verticale dans la gouttière gauche, le numéro en rouge en haut à droite, la date en bas, une règle graduée, deux repères rouges, un viseur en retrait et de la poussière de papier. Tout cela se décale à des profondeurs différentes quand on penche — c'est ce qui rend le relief visible, l'affiche elle-même bougeant à peine.
- **Cadres** (scrapbook seulement) : aucun, filet, épais, passe-partout, polaroïd, noir, coins photo, bois. Posés **autour** de l'affiche, comme un vrai cadre sur un vrai mur : l'affiche n'est ni recadrée ni recouverte. Les coins photo sont la seule exception admise : quatre triangles sur les angles, comme dans un album.
- **Dessin à la main** sur la page, dix encres, quatre épaisseurs. Deux doigts continuent de zoomer.
- **La page est une feuille posée sur une table.** La matière du papier n'habille plus toute la zone mais la page elle-même, avec son ombre ; autour, une table neutre. Sans ça, en s'éloignant beaucoup, on ne savait plus où la page commençait.
- **Fin de collection : on ouvre un pack.** Une pochette noire scellée, une languette, puis la carte qui sort. C'est l'objet le plus précieux de l'app, il lui fallait un geste.
- **L'export du scrapbook** redessine la page dans un canvas (fonds, teinte, scraps, scotch, cadres, déchirures, éléments posés, dessins), avec une signature SCRAP et le pseudo en bas. Trois formats : story, carré, page entière. **Il part du contenu réel, pas des bords de la page** : ce qui déborde dans les marges est dedans, plus rien n'est coupé.
- **La réalité augmentée en direct est abandonnée.** Sans reconnaissance de surface (WebXR n'existe pas sur Safari iOS), la page flottait sans jamais tenir au mur. À la place : on **photographie** un vrai mur, et l'export pose le scrapbook dessus, avec son ombre. Le résultat est une image qu'on poste ; c'est ce qu'on voulait montrer, sans promettre une technologie qu'un navigateur ne sait pas tenir.
- **Badges** : des sceaux, pas des pictos. Carré de 64 px, cadre double dont un filet perforé façon timbre, repères aux quatre côtés, et un motif dessiné pour chaque badge (le « 1 » du premier scrap, les collines de Belleville, le losange de l'holo, la note des concerts, le cadre des expos, l'auvent des marchés, le mégaphone des messages, la bombe du street art, le fantôme des disparues, le « 50 »). Fond noir quand le badge est choisi, gris et cadenas quand il est verrouillé.
- Le filtre « Date » est remplacé par **« État »**.
- **Le lieu partenaire ne promet plus de contrepartie** : la ligne « capture les 5 scraps du lieu, une entrée offerte » est retirée. Un partenariat qu'on n'a pas ne se montre pas dans un prototype.
- **Une lampe (torche) sur le scanner**, quand le téléphone la donne au navigateur : une affiche collée le soir est presque toujours dans le noir. Quand ce n'est pas possible (Safari iOS ne l'expose pas encore), le bouton le dit au lieu de faire semblant.
- **Un bouton DEV sur l'accueil**, volontairement hors charte (liseré pointillé rouge) : reprendre la session, repartir de la démo d'Inès, ou partir d'un compte vierge. C'est le seul moyen de revoir l'ouverture du pack et le badge une fois qu'on les a vus. À retirer avant la soutenance si on montre l'app comme un produit fini.
- **Chaque passage d'écran a son sens** : on avance par la droite, on revient par la gauche, on change d'onglet par le bas ; la barre de l'onglet glisse depuis l'onglet quitté, et les listes se déposent élément par élément.
- Fondation Vuitton, La Boule Noire, etc. sont des **exemples**, pas de vrais partenaires.
- Pas de personnage ni de mascotte.

## 6. Fichiers

- **Figma :** fichier « experience-immersive », partagé avec le binôme. Le connecteur Figma (offre Starter) est limité à 6 appels par mois : il sert à lire, pas à écrire.
- **Plugin Figma v4 (dépôt, `figma-plugin/`) :** génère les sections 09 et 10 du design system et les 50 écrans. Il se relie aux variables et styles du fichier par leur nom, et réutilise les composants de fond s'ils existent déjà. La prochaine version repart de celle-ci.
- **Google Doc « experience immersive » :** dossier partagé (recherche, entretiens fictifs, benchmark, persona, parcours, storyboard).
- **Dépôt GitHub `experience-immersive` :** code du plugin, tokens, affiches, et le site prototype (`site/`, déployé sur GitHub Pages par `.github/workflows/pages.yml`).

## 7. Méthode de travail

- **Une conversation par chantier** (site prototype, dossier, vidéo, pitch), dans ce projet. Première phrase : « Lis la fiche de référence, on travaille sur … ».
- **Retours regroupés** en une seule liste numérotée par écran.
- **Le code du dépôt fait foi :** on modifie l'existant, on ne régénère pas tout.
- **Le site prototype (`site/`) est la référence** depuis le 17.11.2026. On travaille en vibe coding : l'équipe donne les changements, Claude modifie le site et pousse sur `main`, GitHub Pages se met à jour. Les maquettes Figma ne suivent plus automatiquement.
- Site : 56 écrans (01, 03 à 50, plus 07.1, 19.1, 19.2, 24.1, 24.2, 24.3 et 24.4 — l'ancien écran 02 a été fondu dans l'accueil). Compte démo d'Inès pré-rempli (15 scraps), vraie caméra avec détection des contours, vraie carte de Belleville, scrapbook zoomable. Menu caché : appui long en haut de l'écran, avec « Réinitialiser la démo ».
- **Les pistes immersives** (boussole de capture, mur qui se souvient, chaud-froid…) sont rassemblées dans le document « pistes-immersives » du projet. Rien n'est décidé : ce qui est retenu revient dans cette fiche avant d'être codé.
- **Clé du fond de carte :** CARTO demande désormais une clé, sinon la carte répond « API key required ». La clé est dans `site/js/config.js`, avec les trois fonds essayés dans l'ordre (Voyager, Positron, puis OpenStreetMap sans clé si tout échoue). C'est une clé de fond de carte, faite pour vivre dans le code d'une page web. **À faire une fois :** sur carto.com, la limiter au domaine `mustaphajefferson.github.io`.
- **Fichiers du site :** `config.js` (clé et réglages), `data.js` (compte démo et semis de la carte), `noyau.js` (composants, badges), `effets.js` (inclinaison globale, poussière, vol d'un scrap, compteurs, révélations, rareté), `carte.js` (Leaflet et pins), `mur.js` (scrapbook, déchirures, rangements, dessin, export), `camera.js` (détection des contours, redressement, photo d'un mur), `ecrans.js` (les 56 écrans), `app.js` (navigation et actions).
- **La carte est semée** : une vingtaine d'affiches écrites à la main, plus 112 tirées au sort autour de Belleville par un générateur à graine fixe (donc toujours les mêmes). C'est ce qui donne une app déjà vivante et ce qui rend les filtres démonstratifs.
