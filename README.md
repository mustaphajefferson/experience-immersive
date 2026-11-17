# SCRAP — Expérience immersive

Projet de Workshop 2 (LISAA, Mastère Direction Artistique) : une app qui fait sortir les gens découvrir leur quartier, en transformant les affiches de la ville en collections à compléter.

**À lire en premier : [docs/fiche-reference.md](docs/fiche-reference.md)**, la source de vérité du projet (concept, parcours, design system, décisions).

## Contenu

| Dossier | Contenu |
|---|---|
| `docs/` | Fiche de référence |
| `design/tokens.json` | Couleurs, typographie, grille, espacements, grille de fond |
| `assets/affiches/` | Les 9 affiches du moodboard utilisées dans les maquettes |
| `figma-plugin/` | Plugin Figma v4 : sections 09 et 10 du design system et les 50 écrans numérotés |

## Plugin Figma

1. `python3 figma-plugin/build.py` reconstruit `figma-plugin/code.js` à partir de `src/*.js` et des affiches.
2. Dans Figma : clic droit › Plugins › Development › Import plugin from manifest… › `figma-plugin/manifest.json`.

## Site prototype (SCRAP)

L'application complète, pensée pour le téléphone : 51 écrans (01 à 50, plus 19.1 « Identifier le scrap »), tous les boutons reliés.
C'est la référence du projet : les changements se font ici (vibe coding), plus dans Figma.

- Compte démo d'Inès déjà rempli (15 scraps, collections, scrapbook, vitrine).
- Vraie caméra (ou photo de la galerie) : la capture devient un scrap, on lui donne titre, collection et tags.
- Vraie carte de Belleville (Leaflet, fond OpenStreetMap / CARTO en gris).
- Scrapbook : déplacer, scotcher, déchirer au doigt, changer de fond.
- Menu caché : appui long tout en haut de l'écran (ou touche M) pour sauter à un écran ou réinitialiser la démo.

```bash
python3 site/tools/build.py            # génère site/css/tokens.css et copie les affiches
python3 -m http.server -d site 8000    # puis ouvrir http://localhost:8000
```

Déployé sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur `main`.

## À venir

- Le plugin Figma lira les mêmes tokens que le site.
