# Fiche de référence — SCRAP (Expérience immersive)

*À lire au début de chaque nouvelle conversation. C'est la source de vérité du projet : si une décision change, on met cette fiche à jour.*

Dernière mise à jour : 17.11.2026 (v5 : scan automatique, profondeur au gyroscope, rareté, scrapbook zoomable, 12 collections)

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
- **La rareté** se lit sur le numéro de capture : mythique (5 premiers), rare (20 premiers), peu vue (60 premiers), commune. Plus un scrap est rare, plus sa page réagit : le décor derrière la carte bouge avec l'inclinaison du téléphone (gyroscope), le halo et les rayons s'intensifient. L'affiche, elle, n'est jamais touchée.
- Progression : profil personnalisable, vitrine d'affiches, badges (sceaux au cadre perforé, un motif dessiné par badge).
- **Objectif principal :** faire sortir les gens.

**Cible :** principalement des jeunes qui collectionnent déjà et jouent à Pokémon GO. En secondaire, des habitués des sorties culturelles.
**Persona :** Inès, 22 ans, étudiante en design, Belleville / 11e (hypothèse, pas de vrais entretiens à ce stade).
**Références :** Pokémon GO, Flash Invaders, Soundmap, Ingress Prime.

## 3. Écrans — maquettes v4 (ordre du parcours, numérotation de référence)

Le parcours d'Inès (les 11 premiers écrans dessinés) est inclus : 13, 19, 21, 22, 24, 28, 29, 34, 35, 36, 30.

**A. Lancement et inscription**
- 01 Lancement animé (3,4 s, toucher pour passer) : huit affiches se collent l'une sur l'autre, elles tombent, et SCRAP se relève lettre par lettre dessous
- 02 Bienvenue · 03 Découverte 1 — Sors · 04 Découverte 2 — Capture · 05 Découverte 3 — Colle
- 06 Accès à la caméra · 07 Accès à la position
- 08 Créer un compte · 09 Se connecter · 10 Mot de passe oublié · 11 Pseudo et avatar · 12 Collections de départ (3 max)

**B. Carte et capture**
- 13 Carte d'accueil · 14 Filtres de la carte · 15 Recherche · 16 Scrap repéré (avant capture) · 17 Itinéraire à pied · 18 Carte vide
- 19 Scanner (mode sombre, contours suivis en direct, capture automatique) · **19.1 Vérifier le scan** (« Ce scan te plaît ? » Garder / Reprendre) · **19.2 Identifier le scrap** (titre, lieu, collection, tags)
- 20 Capture échouée · 21 Scrap capturé — recto · 22 Scrap capturé — verso · 23 Détail de l'événement

**C. Scrapbook**
- 24 Mon scrapbook, deux modes : **Vue** (pincer pour zoomer, glisser pour se promener, rien ne bouge) et **Disposition** (déplacer, redimensionner, tourner, mettre devant, retirer)
- 25 Personnaliser — fond (8 fonds) · 26 Personnaliser — scotch · 27 Personnaliser — déchirer

**D. Collections**
- 28 Ma collection (filtres Derniers · Plus rares · Favoris · Lieu · **État** · Thème ; 4 dispositions : Mosaïque · Serré · Liste · En grand) · 29 Sélection · 30 Mes collections
- 31 Fiche d'une collection · 32 Collection complète — scrap exclusif · 33 Badge débloqué

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

L'accent sert uniquement pour : le déclencheur et le cadre du scanner, le bouton « Scanner une affiche » (un seul par écran), le numéro de scan, la pastille « nouveau », ma position sur la carte. Il n'est jamais utilisé en fond, pour un état actif, en dégradé ou en transparence.

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
- marqueur carte ;
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
- **Fonds du scrapbook** (au choix) : Papier (défaut, fond/secondaire), Quadrillé (la grille 09), Béton, Liège, Noir. Trame de points 2 px tous les 24 px, repères « + » tous les 96 px.
- **Scotch** : transparent, kraft, papier, noir. 52 × 16 px, deux bouts maximum par scrap, sur le scrapbook et la vitrine uniquement.
- **Déchirure** : sur le scrapbook seulement. Le morceau arraché reste dans la collection : on ne perd jamais un scrap.
- **Logo** : « SCRAP » en Inter Semi Bold, suivi d'un carré rouge (le point de capture, seul accent du logo).

## 5. Décisions prises

- **Nom : SCRAP.** On capture des scraps. Verbe : **capturer** (« choper » refusé).
- **Pas de thème** (pêcheur, guetteur…) : on garde le concept tel quel.

- **L'accent est rouge (#FF0000).** L'export l'appelle encore « Bleu capture » : il faudra renommer.
- **Les pins de la carte** remplacent les marqueurs carrés : une petite affiche plantée sur une pointe, avec l'icône de sa collection dedans. Contour noir pour tous ; seule la pastille rouge « nouveau » est en accent, et elle respire doucement.
- **Le scan est automatique** (écran 19) : les contours de l'affiche sont suivis en direct et la photo part toute seule dès que le cadre ne bouge plus, comme dans Notes. L'image est redressée (perspective corrigée) avant d'être proposée. La capture au bouton reste possible : chip « Auto » en haut à droite.
- **On vérifie avant d'identifier** : après la capture, l'écran 19.1 montre l'affiche seule sur fond noir et demande « Ce scan te plaît ? » — Garder ou Reprendre. L'identification (titre, lieu, collection, tags) vient après, en 19.2.
- **Holo :** l'état holographique est signalé par une étiquette « État · Holo » et une mention dans la légende, pas par un effet sur l'image (règle « affiche intouchable »).
- **Badges** : des sceaux, pas des pictos. Carré de 64 px, cadre double dont un filet perforé façon timbre, repères aux quatre côtés, et un motif dessiné pour chaque badge (le « 1 » du premier scrap, les collines de Belleville, le losange de l'holo, la note des concerts, le cadre des expos, l'auvent des marchés, le mégaphone des messages, la bombe du street art, le fantôme des disparues, le « 50 »). Fond noir quand le badge est choisi, gris et cadenas quand il est verrouillé.
- Le filtre « Date » est remplacé par **« État »**.
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
- Site : 52 écrans (01 à 50, plus **19.1 Vérifier le scan** et **19.2 Identifier le scrap**). Compte démo d'Inès pré-rempli (15 scraps), vraie caméra avec détection des contours, vraie carte de Belleville, scrapbook zoomable. Menu caché : appui long en haut de l'écran, avec « Réinitialiser la démo ».
- **Clé du fond de carte :** CARTO demande désormais une clé, sinon la carte répond « API key required ». La clé est dans `site/js/config.js`, avec les trois fonds essayés dans l'ordre (Voyager, Positron, puis OpenStreetMap sans clé si tout échoue). C'est une clé de fond de carte, faite pour vivre dans le code d'une page web. **À faire une fois :** sur carto.com, la limiter au domaine `mustaphajefferson.github.io`.
- **Fichiers du site :** `config.js` (clé et réglages), `data.js` (compte démo), `noyau.js` (composants, badges), `effets.js` (profondeur gyroscope, compteurs, révélations, rareté), `carte.js` (Leaflet et pins), `mur.js` (scrapbook et vitrine), `camera.js` (détection des contours et redressement), `ecrans.js` (les 52 écrans), `app.js` (navigation et actions).
