PLUGIN FIGMA — SCRAP, MAQUETTES v4
Basé sur « DESIGN SYSTEM — Affiches » (v1.0) et les wireframes v3 corrigés.

INSTALLATION
1. Dézipper le dossier figma-plugin.
2. Ouvrir le fichier « experience-immersive » dans Figma, sur la page du design system.
3. Clic droit sur le canvas > Plugins > Development > Import plugin from manifest…
   Choisir figma-plugin/manifest.json.
   (Si la v3 est déjà importée, la v4 la remplace : même identifiant.)

LANCEMENT
Clic droit > Plugins > Development > SCRAP — maquettes v4 :
- « Tout générer (sections 09 et 10 + 50 écrans) »
- « Design system seul (09 Grille de fond, 10 Scrap) »
- « Écrans seuls »

Tout est créé à droite de l'existant ; rien n'est supprimé ni modifié.
Si « Fond / Grille » (créé par la v3) existe déjà sur la page, il est réutilisé
et la section 09 n'est pas recréée. Même chose pour les fonds du scrapbook (section 10).

CE QUI EST CRÉÉ
- « DESIGN SYSTEM — 09 Grille de fond » (si absente)
- « DESIGN SYSTEM — 10 Scrap » : vocabulaire, logo, tampon, fonds du scrapbook,
  scotch, déchirure (composants « Fond / Scrapbook — Papier / Béton / Liège / Noir »)
- « SCRAP — maquettes v4 (écrans 01 à 50) » : 52 frames numérotées
  (01.1 à 01.3 pour le lancement animé, puis 02 à 50), rangées par section A à G.

LIEN AVEC VOTRE DESIGN SYSTEM
Les variables de couleur (fond/principal, accent/capture…) et les styles de texte
(Titre/XL, Texte/Méta…) du fichier sont retrouvés par leur nom et appliqués.
Le message de fin indique combien ont été liés.

MODIFIER LE PLUGIN
Le code est dans figma-plugin/src/ (un fichier par partie). Après une modification :
  python3 figma-plugin/build.py
