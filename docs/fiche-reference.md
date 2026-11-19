# Fiche de référence — SCRAP (Expérience immersive)

*À lire au début de chaque nouvelle conversation. C'est la source de vérité du projet : si une décision change, on met cette fiche à jour.*

Dernière mise à jour : 19.11.2026 (v13 : l'interface se range — tiroir d'outils, replis, feuilles de choix)

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
- **Il y a plusieurs carnets.** Celui du quartier, en cours, et ceux qu'on a rapportés d'ailleurs — une ville, une période, une matière de papier. Changer de carnet tourne une page.
- Elles se regroupent en **collections** (12 au total : concerts, expos, marchés, messages politiques, street art, théâtre, cinéma, soirées, sport, brocantes, typo, affiches disparues). On en choisit trois au départ ; la carte aide à trouver celles qui manquent.
- **La profondeur est une matière de l'app entière.** L'inclinaison ne fait pas *sortir* les couches de l'écran : elle **creuse**. On regarde *dans* la carte, pas dessus. Tant que le capteur n'est pas branché, tout ce qui tourne en boucle tourne de toute façon tout seul : l'app est vivante téléphone posé.
- **Certaines affiches de la rue sont vivantes.** Un collectif publie la version animée en même temps que le papier ; SCRAP la reconnaît au scan et la joue. **L'app n'édite pas ces affiches, elle les lit** — c'est le point de bascule du concept : une affiche qui ferait la publicité de l'application ne serait plus une affiche trouvée, ce serait un panneau. Rien sur ces affiches ne renvoie à SCRAP.
- **La rareté** se lit sur le numéro de capture : mythique (5 premiers), rare (20 premiers), peu vue (60 premiers), commune.
- Progression : profil personnalisable, vitrine d'affiches, badges.
- **Objectif principal :** faire sortir les gens.

**Cible :** principalement des jeunes qui collectionnent déjà et jouent à Pokémon GO. En secondaire, des habitués des sorties culturelles.
**Persona :** Inès, 22 ans, étudiante en design, Belleville / 11e (hypothèse, pas de vrais entretiens à ce stade).
**Références :** Pokémon GO, Flash Invaders, Soundmap, Ingress Prime.

## 3. Écrans (ordre du parcours, numérotation de référence)

**A. Lancement et inscription**
- **01 Accueil, d'un seul tenant** · 03/04/05 Découverte · 06 Caméra · 07 Position · **07.1 Mouvement** · 08 Créer un compte · 09 Se connecter · 10 Mot de passe oublié · 11 Pseudo et avatar · 12 Collections de départ (**3 proches ; les 9 autres repliées**)

**B. Carte et capture**
- 13 Carte d'accueil · 14 Filtres (**collection en feuille de choix**) · 15 Recherche · 16 Scrap repéré · **17 Itinéraire et boussole de capture** · 18 Carte vide
- 19 Scanner (mode sombre, contours suivis en direct, capture automatique) · **19.1 Vérifier le scan** · **19.2 Identifier le scrap** (**3 collections + « Autre… » ; tags et holo repliés**) · **19.3 Affiche vivante**
- 20 Capture échouée · 21 Scrap capturé — recto · 22 Verso · 23 Détail de l'événement

**C. Scrapbook**
- 24 Mon scrapbook : **le nom du carnet ouvre la liste des carnets**, **un bouton Composer** ouvre le tiroir d'outils, 900 px de marge, dézoom jusqu'à 12 %, quatre **rangements animés**, commandes de zoom **à retrait automatique**.
- **24.1 Ajouter un élément** (**3 familles : Écrire, Papiers, Marquer**) · **24.2 Partager** · **24.3 Dessiner** · **24.4 Photo d'un mur**
- 25 Fond (12 motifs + photo ; **teinte repliée**) · 26 Scotch · 27 Déchirer (5 types)

**D. Collections**
- 28 Ma collection (**tri et disposition en deux boutons**) · 29 Sélection · 30 Mes collections
- 31 Fiche d'une collection · 32 Collection complète — **on tire la languette du pack** · 33 Badge débloqué

**E. Profil et partage**
- 34 Vitrine (**curseurs repliés tant qu'aucun scrap n'est touché**) · 35 Profil vu par les autres (**répartition par rareté repliée**) · 36 Choisir un badge · 37 Modifier le profil · **38 Amis** · 39 Partager un scrap · 40 Lieu partenaire · **51 Passage de relais**

**F. Réglages** — 41 à 47 · **G. Erreurs** — 48 à 50

## 4. Design system

**Principes :** l'affiche d'abord · une seule couleur d'accent, un seul rôle · la grille, rien que la grille · **l'écran montre ce qu'on fait, pas ce qu'il sait faire**.

**Écran :** iPhone 17, 402 × 874. Grille de 4 colonnes, marges 16, gouttières 8, colonnes de 86,5. Base 4.

**Couleurs (tokens sémantiques, valeur claire / sombre)**

| Token | Clair | Sombre | Usage |
|---|---|---|---|
| fond/principal | #FFFFFF | #111111 | Fond des écrans |
| fond/secondaire | #F1F1EE | #1C1C1B | Zones neutres, affiche en chargement |
| fond/inverse | #111111 | #FFFFFF | Barre de notification, toast, tampon encré |
| texte/principal | #111111 | #FFFFFF | Titres, texte |
| texte/secondaire | #6B6B67 | #9A9A96 | Lieu, date, compteurs |
| texte/inverse | #FFFFFF | #111111 | Sur fond inverse |
| trait/defaut | #DCDCD8 | #2B2B29 | Filets de séparation |
| trait/fort | #111111 | #FFFFFF | Contours, icônes, repère actif |
| accent/capture | **#FF0000** | #FF0000 | Tout ce qui agit et tout ce qui est choisi |
| accent/sur-accent | #FFFFFF | #FFFFFF | Texte et icône sur l'accent |

**Le rouge est la couleur de ce qui agit et de ce qui est choisi, en aplat.** Deux règles : **plus aucun bouton plein noir**, et **plus aucun fond noir à liseré rouge**. Le noir reste pour le texte, les contours, les barres de notification et les toasts, le tampon encré, et les écrans sombres du scanner.

**Typographie (Inter)** — Titre/XL 40/40 −3 % · Titre/L 28/30 −2 % · Titre/M 20/24 −1 % · Texte/Corps 16/22 −0,5 % · Texte/Petit 14/19 · Texte/Label 15/20 Medium · Texte/Méta 11/14 Medium capitales +4 % · Chiffre/Capture 64/56 Semi Bold −5 %.

**Formes :** rayon 0 partout, filets de 1 px, aucune ombre. Seuls le déclencheur et ma position sont ronds.
**L'affiche est intouchable :** format d'origine, jamais recadrée ni déformée ; pas d'ombre, de cadre, de filtre ni de texte par-dessus. **Seule exception : une affiche vivante**, parce que son auteur a lui-même publié la version qui bouge.
**Icônes :** 24 px, trait de 1,5, extrémités carrées.

**09 — Grille de fond** · **10 — Scrap** (tampon, 12 fonds + photo + teinte, 10 encres, 8 scotchs, 5 déchirures, 16 éléments, pas de cadres, logo SCRAP + carré rouge) · **11 — Profondeur, étoiles et photos de profil** (`.boite-prof`, étoiles à quatre branches, photo de profil = bout de scrap dans un petit cadre : filet · coins photo · scotch · polaroid · bord noir).

**12 — Les affiches vivantes :**
- **Elles ne suivent pas la charte de l'app, et c'est volontaire.** Chacune a sa propre identité, comme n'importe quelle affiche de rue. La seule contrainte : être lisible en grand, avoir des zones séparables, et tenir en vecteur.
- **« COLLE FRAÎCHE »** — papier cassé, typo noire, un personnage au feutre rouge qui danse, une tache de colle au trait. *Elle porte encore la mention SCRAP : à retirer si on veut appliquer le principe jusqu'au bout.*
- **« TERRAIN VAGUE »** — jaune et noir, une grille de briques décalées qui saignent hors format, de la typo lourde blanche sur des bandeaux noirs. Aucune mention de l'app.
- **Chacune a son animation**, tirée de sa propre grammaire : la première se **dessine** (tracé au feutre, membres qui dansent) ; la seconde s'**assemble** (rangées qui arrivent en alternance, bandeaux qui se déroulent, typo qui se pose, astérisque qui tourne). Dans les deux cas : une vie en veille, une parallaxe à l'inclinaison, et une réaction au toucher.
- **Générées** par `design/affiche/generer-affiche.py`. Texte vectorisé : les fichiers d'impression ne dépendent d'aucune police, et chaque élément porte un identifiant. **C'est le même fichier qui s'imprime et qui s'anime** — il ne peut pas y avoir d'écart entre le papier collé et ce que l'app affiche.
- **Reconnaissance :** l'image redressée est réduite à une grille de 8 × 11 ; on garde la luminosité et la « rougeur » de chaque case, on normalise, on compare à chaque empreinte connue, à l'endroit comme à l'envers. **Pas de réseau, pas de serveur, pas de modèle** — trente lignes de JavaScript.
- **Mesuré :** chaque affiche reste au-dessus de **0,65** même recadrée de 7 %, sombre ou floue ; les deux ne se confondent jamais entre elles (0,05) ; les 35 affiches ordinaires plafonnent à **0,39**. Seuil à **0,48**.

**13 — Les mécaniques de rangement.** Quatre, écrites une fois et réutilisées partout. Elles n'enlèvent rien : ce qui ne sert pas à l'arrivée est rangé, et revient en un geste.
- **Le repli** (`repli()` dans `noyau.js`) — une ligne de titre, la valeur courante à droite, un chevron. Fermé à l'arrivée, il s'ouvre **sur place**, sans redessiner l'écran. Pour les blocs secondaires d'une page qui défile.
- **La feuille de choix** (`boutonChoix()` + `ouvrirFeuille()`) — un bouton qui porte le **choix courant**, et qui ouvre la liste complète par-dessus l'écran. Règle : le bouton dit **où on en est** (« Tri · Derniers »), pas ce qu'il ouvre.
- **Le tiroir d'outils** du scrapbook — voir les décisions ci-dessous.
- **Le retrait automatique** — les commandes de zoom apparaissent au premier geste sur la page et s'effacent après deux secondes d'immobilité. L'astuce du scrapbook ne s'affiche qu'à la première ouverture.

## 5. Décisions prises

- **Nom : SCRAP.** Verbe : **capturer**.
- **Pas de thème** (pêcheur, guetteur…).
- **L'accent est rouge (#FF0000)**, couleur de l'action et de la sélection, en aplat. L'export Figma l'appelle encore « Bleu capture » : à renommer.
- **Les pins de la carte** sont de petites affiches plantées sur une pointe ; déjà capturée = coche rouge et retrait. À l'arrivée, **ils tombent du plus proche au plus lointain**.
- **La recherche ne montre que ce qui manque.**
- **On peut toujours rentrer** : la barre du bas reste sur le profil et les réglages.
- **Le scan est automatique** ; capture au bouton toujours possible.
- **On vérifie avant d'identifier** (19.1 puis 19.2) — sauf pour une affiche vivante, qui va droit en 19.3 : pendant une démo, la magie ne doit pas attendre un écran de contrôle.
- **La profondeur va vers l'intérieur, pas vers l'extérieur.**
- **La carte exclusive a une fenêtre découpée dans le foil**, décor thématisé concerts ; les autres collections reprennent le motif de leur badge.
- **Tout tourne tout seul** : le gyroscope ajoute la profondeur, il ne la déclenche pas.
- **Fin de collection : on tire la languette.** Elle résiste, craque par crans, cède passé le bout, revient si on lâche avant. La pochette se soulève pendant que la carte monte derrière elle.
- **Il y a plusieurs carnets.** `ETAT.carnets` les porte, `ETAT.mur` pointe sur celui qui est ouvert. Belleville est en cours ; Barcelone 2025 et Londres 2024 sont terminés, posés par un générateur à graine fixe. Changer de carnet **tourne une page**. Un scrap d'un carnet rapporté s'ouvre en lecture seule.
- **L'app n'édite pas les affiches vivantes, elle les reconnaît.** C'est la décision la plus structurante de la v12 : ces affiches doivent ressembler à ce qu'on croise sur un mur, pas à une campagne de l'application.
- **Le bouton de démonstration** (coin bas-gauche du scanner, 52 px, point rouge quand il est armé) n'impose pas une affiche : il **enlève le seuil**. C'est toujours la plus ressemblante qui est jouée — on ne joue pas une soutenance aux dés, mais on ne triche pas non plus sur quelle affiche c'est.
- **Badges** : des sceaux, pas des pictos. Fond rouge quand le badge est choisi.
- **Le lieu partenaire ne promet plus de contrepartie.**
- **Une lampe (torche) sur le scanner**, quand le téléphone la donne au navigateur.
- **Un bouton DEV sur l'accueil**, volontairement hors charte. À retirer avant la soutenance si on montre l'app comme un produit fini.
- **La boussole de capture** (17) : flèche, distance, onde qui bat de plus en plus vite, au rythme de la vibration.
- **Le passage de relais** (51) : deux téléphones côte à côte, le scrap garde le nom de celui qui l'a donné, et c'est une affiche **de son carnet à lui**.
- **Chaque colleur a son propre carnet** : affiches, rareté, badges, vitrine, fond, photo.
- **La photo de profil est un bout de scrap**, dans un petit cadre. On ne montre pas de visages.
- **Les gestes de papier** : le coin qui se lève, le tampon qui frappe, l'affiche qui bascule après le scan, le scotch qui s'étire, la déchirure qui se découpe.
- **La réalité augmentée en direct reste abandonnée** (pas de WebXR sur Safari iOS). La photo d'un vrai mur et les affiches vivantes la remplacent.
- Fondation Vuitton, La Boule Noire, etc. sont des **exemples**, pas de vrais partenaires.
- Pas de personnage ni de mascotte dans l'app. Le personnage au feutre appartient à l'affiche, pas à l'interface.

**Décisions de la v13 — ranger l'interface :**
- **Le scrapbook a un tiroir d'outils.** Fermé, il ne reste qu'un bouton **Composer** : on filme une page de scrapbook, pas une barre d'outils. **Le mode n'est plus une question posée à l'arrivée** — tiroir fermé on regarde, tiroir ouvert on range. `ETAT.ctx.tiroir` remplace `ETAT.ctx.murMode`, et les puces « Vue » et « Disposition » disparaissent au profit de **Ranger** et **Terminé**. Un seul « Terminé » dans tout l'écran.
- **Composer est rouge**, parce que c'est ce qui agit sur cet écran, et c'est le seul rouge de la page.
- **La barre des carnets rentre dans le titre** : `Belleville ▾` ouvre la liste en feuille, « Nouveau carnet » en bas. On gagne une rangée, et le titre redevient un titre.
- **Une liste de choix longue se range derrière son choix courant**, jamais posée à plat : collection d'un scrap (19.2), collection de la carte (14), tri et disposition de la collection (28, 29).
- **Un bloc d'options secondaire se replie** : tags et holo (19.2), teinte (25), collections de départ au-delà des trois proches (12), curseurs de la vitrine (34), répartition par rareté (35).
- **Les seize éléments du scrapbook sont rangés en trois familles** : Écrire, Papiers, Marquer.
- **Tout ce qui est replié reste à un seul geste**, et ce geste doit être répétable devant un jury sans hésiter. Un repli qu'il faut chercher est pire que la barre d'outils d'avant.

## 6. Fichiers

- **Figma :** fichier « experience-immersive ». Connecteur limité à 6 appels par mois : il sert à lire, pas à écrire.
- **Plugin Figma v4 (`figma-plugin/`)**.
- **Google Doc « experience immersive »** : dossier partagé.
- **Dépôt GitHub `experience-immersive`** : plugin, tokens, affiches, affiches vivantes, site prototype (`site/`, déployé par `.github/workflows/pages.yml`).

## 7. Méthode de travail

- **Une conversation par chantier**, dans ce projet. Première phrase : « Lis la fiche de référence, on travaille sur … ».
- **Retours regroupés** en une seule liste numérotée par écran.
- **Le code du dépôt fait foi :** on modifie l'existant, on ne régénère pas tout.
- **Le site prototype (`site/`) est la référence.** Vibe coding : l'équipe donne les changements, Claude modifie le site et pousse sur `main`, GitHub Pages se met à jour.
- Site : 58 écrans. Compte démo d'Inès (**22 scraps**, 16 collés dans son carnet de Belleville) plus deux carnets terminés.
- **35 affiches** dans `assets/affiches/`, ratios dans `affiches.json` ; les 13 qui ne sont pas chez Inès sont dans `D.catalogue`.
- **Concerts reste volontairement à 7 sur 8.** C'est ce qui permet de jouer la dernière capture, l'ouverture du pack et le badge pendant une démo. Ne jamais ajouter un scrap « concerts » au compte d'Inès.
- **Les affiches à imprimer** sont dans `design/affiche/impression/` (PDF vectoriel et PNG 300 dpi, A4, s'agrandissent en A3 sans perte). Pour les régénérer : `python3 design/affiche/generer-affiche.py` depuis la racine — le script réécrit aussi la liste des empreintes dans `site/js/config.js`. **Si on retouche une affiche sans relancer le script, l'app ne la reconnaît plus.**
- **Pour en ajouter une troisième :** composer une nouvelle fonction dans le générateur, l'ajouter à `AFFICHES` (id, titre, par, lieu, collection, thèmes), relancer, puis écrire son animation en CSS sous son propre identifiant racine. Rien d'autre à toucher.
- **Pour la démo :** imprimer sur du papier **mat** (le brillant renvoie la lumière et gêne la détection des contours), bien à plat, lumière correcte. Le bouton discret est là en secours.
- **Les pistes immersives** sont dans « pistes-immersives ». **La liste d'animations** et ce qui reste à faire sont dans « animations-transitions ». **L'analyse de densité** et ce qui reste à ranger sont dans « densite-interface ».
- **Clé du fond de carte :** CARTO, dans `site/js/config.js`. **À faire une fois :** la limiter au domaine `mustaphajefferson.github.io`.
- **Fichiers du site :** `config.js` (clés, réglages, liste des affiches vivantes), `data.js` (compte démo, catalogue, carnets, personnes, semis de la carte), `noyau.js` (**composants, dont `repli()`, `boutonChoix()` et `ouvrirFeuille()`**), `effets.js` (inclinaison, étoiles, FLIP, page qui se tourne, pluie d'étoiles, chargement des affiches), `carte.js`, `mur.js`, `camera.js` (contours, redressement, reconnaissance des affiches vivantes), `ecrans.js`, `app.js`.
