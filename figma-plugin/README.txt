PLUGIN FIGMA — MAQUETTES DU PARCOURS D'INÈS (v3)
Basé sur vos exports : « DESIGN SYSTEM — Affiches » (v1.0) et « Wireframes — parcours d'Inès (v3) ».

INSTALLATION
1. Dézipper le dossier figma-plugin-v3.
2. Ouvrir le fichier « experience-immersive » dans Figma, sur la page où se trouve votre design system.
3. Clic droit sur le canvas > Plugins > Development > Import plugin from manifest…
   Choisir figma-plugin-v3/manifest.json.

LANCEMENT
Clic droit > Plugins > Development > Expérience immersive — Maquettes d'Inès :
- « Tout générer (grille de fond + maquettes) » : à utiliser en premier.
- « Design system : 09 Grille de fond seule »
- « Maquettes seules » : réutilise le composant « Fond / Grille » s'il existe déjà sur la page.

CE QUI EST CRÉÉ (à droite de l'existant, rien n'est supprimé ni modifié)
- « DESIGN SYSTEM — 09 Grille de fond » : nouvelle section au format de votre design system
  (règles, composant « Fond / Grille », schéma des colonnes, tokens).
  Vous pouvez la glisser sous la section 08 de votre frame design system.
- « Maquettes — parcours d'Inès » : les 11 étapes, en 402 × 874 (iPhone 17).

LIEN AVEC VOTRE DESIGN SYSTEM
Le plugin cherche dans le fichier les variables de couleur (fond/principal, texte/secondaire,
accent/capture…) et les styles de texte (Titre/XL, Texte/Méta…) par leur nom, et les applique.
Le message de fin indique combien ont été liés. Si un token n'est pas trouvé, la valeur
de l'export est utilisée telle quelle.

À SAVOIR
- La couleur de capture est rouge (#FF0000) dans l'export, alors que les libellés disent « Bleu ».
  Le plugin suit la valeur réelle ; si la variable accent/capture est liée, c'est elle qui décide.
- Les badges n'existent pas encore dans le design system : le plugin en propose un format
  (carré 64 px, contour, icône au trait, noir quand choisi).
