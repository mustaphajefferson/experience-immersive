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

L'application complète, pensée pour le téléphone : 52 écrans (01 à 50, plus 19.1 « Vérifier le scan » et 19.2 « Identifier le scrap »), tous les boutons reliés.
C'est la référence du projet : les changements se font ici (vibe coding), plus dans Figma.

- Compte démo d'Inès déjà rempli (15 scraps, collections, scrapbook, vitrine).
- **Scan automatique** : la caméra suit les contours de l'affiche en direct et la photo se prend toute seule dès que le cadre ne bouge plus, comme dans Notes. L'image est redressée, puis on choisit de la garder ou de la reprendre, et enfin on l'identifie (titre, collection, tags).
- **Profondeur** : sur la page d'un scrap, le décor derrière la carte suit l'inclinaison du téléphone (gyroscope). L'effet est d'autant plus marqué que le scrap est rare.
- Vraie carte de Belleville (Leaflet, fond CARTO en gris, pins par collection). La clé CARTO est dans `site/js/config.js`.
- Scrapbook : pincer pour zoomer et se promener sans rien déplacer, puis mode Disposition pour déplacer, redimensionner et tourner. Vue d'ensemble pour voir tout ce qu'il reste à remplir. 8 fonds, 4 scotchs, déchirure au doigt.
- Menu caché : appui long tout en haut de l'écran (ou touche M) pour sauter à un écran ou réinitialiser la démo.

```bash
python3 site/tools/build.py            # génère site/css/tokens.css et copie les affiches
python3 -m http.server -d site 8000    # puis ouvrir http://localhost:8000
```

Déployé sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur `main`.

## À venir

- Le plugin Figma lira les mêmes tokens que le site.
