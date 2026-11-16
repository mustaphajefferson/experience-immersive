# Fiche de référence — Expérience immersive

*À lire au début de chaque nouvelle conversation. C'est la source de vérité du projet : si une décision change, on met cette fiche à jour.*

Dernière mise à jour : 17.11.2026

---

## 1. Cadre

- **Cours :** Workshop 2 « Expériences immersives », LISAA, Mastère Direction Artistique, 5e année, 35 h. Projet en binôme.
- **Thème :** la ville en réalité augmentée, piste culture et art urbain.
- **Livrables :** prototype, vidéo de 60 à 90 s, dossier PDF, pitch de 5 min.
- **Évaluation (sur 20) :** originalité, UX, narration, prototype, réflexion critique, présentation.

## 2. Concept

**Une app qui fait sortir les gens découvrir leur quartier, en transformant les affiches de la ville en collections à compléter.**

- On scanne une affiche dans la rue : elle rejoint sa collection, avec son numéro de scan (« N° 003 » = 3e personne à l'avoir scannée).
- Les affiches se posent sur un **mur virtuel** personnel (zoomer, déplacer, déchirer, tirer).
- Elles se regroupent en **collections** (concerts, culture et musique, messages politiques, restaurants…). La carte aide à trouver celles qui manquent.
- Progression : profil personnalisable, vitrine d'affiches, badges.
- **Objectif principal :** faire sortir les gens.

**Cible :** principalement des jeunes qui collectionnent déjà et jouent à Pokémon GO. En secondaire, des habitués des sorties culturelles.
**Persona :** Inès, 22 ans, étudiante en design, Belleville / 11e (hypothèse, pas de vrais entretiens à ce stade).
**Références :** Pokémon GO, Flash Invaders, Soundmap, Ingress Prime.

## 3. Parcours d'Inès — écrans (version validée)

| # | Écran | Contenu clé |
|---|-------|-------------|
| 1 | Carte d'accueil | Carte plein écran, champ de recherche, bouton profil, marqueurs d'affiches (pastille si nouvelle), ma position, aperçu de l'affiche la plus proche, bouton « Scanner une affiche », onglets Carte · Mur · Collection |
| 2 | Scanner | Mode sombre, caméra plein écran, cadre du scanner, déclencheur, bouton fermer |
| 3 | Affiche scannée (recto) | Affiche en grand, étiquette N° de scan, « 3e personne à la scanner », état (holo), titre, lieu et date, « ← Glisser pour retourner », bouton « Ajouter au mur » |
| 4 | Verso (par swipe) | Grand numéro « 003 », tableau Artiste / Lieu / Date / Thème / État / Collection, « Scannée par 128 personnes… », bouton « Ajouter au mur » |
| 5 | Mur virtuel | Plein écran, affiches posées, une sélectionnée, une déchirée, outils Zoomer / Déplacer / Déchirer / Tirer, « Valider » |
| 6 | Collection | « Ma collection », « Sélectionner », filtres Dernières · Plus rares · Favoris · Lieu · **État** · Thème, grille 2 colonnes avec légendes |
| 7 | Sélection | Coches sur les affiches, « Annuler », bouton « Ajouter la dernière au profil » |
| 8 | Placer sur le profil | Zone vitrine, affiche à placer, réglages taille et rotation, « Valider » |
| 9 | Profil vu par les autres | Avatar, pseudo, rang, compteurs, affiche mise en avant, mur public, badges, « Suivre » / « Partager » |
| 10 | Modifier un badge | Notification « Badge débloqué », grille de badges (débloqués / verrouillés avec progression), aperçu sur le profil, « Enregistrer » |
| 11 | Mes collections | Lignes de collection : progression, « Il manque X affiches », « Voir sur la carte », vignettes et emplacements vides |

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

## 5. Décisions prises

- **L'accent est rouge (#FF0000).** L'export l'appelle encore « Bleu capture » : il faudra renommer.
- **Holo :** l'état holographique est signalé par une étiquette « État · Holo » et une mention dans la légende, pas par un effet sur l'image (règle « affiche intouchable »).
- **Badges** (format proposé, à valider) : carré de 64 px, contour, icône au trait, fond noir quand choisi, contour gris et progression quand verrouillé.
- Le filtre « Date » est remplacé par **« État »**.
- Fondation Vuitton, La Boule Noire, etc. sont des **exemples**, pas de vrais partenaires.
- Pas de personnage ni de mascotte.

## 6. Fichiers

- **Figma :** fichier « experience-immersive », partagé avec le binôme. Le connecteur Figma (offre Starter) est limité à 6 appels par mois : il sert à lire, pas à écrire.
- **Plugin Figma v3 :** génère les 11 maquettes et la section 09. Il se relie aux variables et styles du fichier par leur nom.
- **Google Doc « experience immersive » :** dossier partagé (recherche, entretiens fictifs, benchmark, persona, parcours, storyboard).
- **Dépôt GitHub `experience-immersive` :** code du plugin, tokens, affiches, et le site prototype (`site/`, déployé sur GitHub Pages par `.github/workflows/pages.yml`).

## 7. Méthode de travail

- **Une conversation par chantier** (site prototype, dossier, vidéo, pitch), dans ce projet. Première phrase : « Lis la fiche de référence, on travaille sur … ».
- **Retours regroupés** en une seule liste numérotée par écran.
- **Le code du dépôt fait foi :** on modifie l'existant, on ne régénère pas tout.
- Le site prototype devient la référence. Le plugin Figma est généré à partir des mêmes tokens.
