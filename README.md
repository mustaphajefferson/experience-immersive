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

L'application complète, pensée pour le téléphone : 56 écrans, tous les boutons reliés.
C'est la référence du projet : les changements se font ici (vibe coding), plus dans Figma.

- Compte démo d'Inès déjà rempli (15 scraps, collections, scrapbook, vitrine).
- **Scan automatique** : la caméra suit les contours de l'affiche en direct et la photo se prend toute seule dès que le cadre ne bouge plus, comme dans Notes. L'image est redressée, puis on choisit de la garder ou de la reprendre, et enfin on l'identifie (titre, collection, tags).
- **Relief** : l'inclinaison du téléphone est mesurée une fois pour toute l'app, et toutes les couches la suivent. L'autorisation se demande à l'accueil, et se coupe dans les réglages.
- Vraie carte de Belleville (Leaflet, fond CARTO en gris, ~130 affiches semées, coche rouge sur celles déjà capturées). La clé CARTO est dans `site/js/config.js`.
- **Scrapbook** : le carnet s'ouvre en arrivant. On s'y promène librement dans tous les sens, sans jamais attraper une affiche par mégarde. Rangements tout faits, éléments à poser (titres, flèches, soulignements animés), dessin à la main, cadres autour des affiches, 8 fonds + sa propre photo, 5 types de déchirure, export en image — y compris posée sur la photo d'un vrai mur.
- **Fin de collection** : on ouvre un pack, et on récupère une carte exclusive holographique qui réagit à l'inclinaison.
- Menu caché : appui long tout en haut de l'écran (ou touche M) pour sauter à un écran ou réinitialiser la démo.

```bash
python3 site/tools/build.py            # génère site/css/tokens.css et copie les affiches
python3 -m http.server -d site 8000    # puis ouvrir http://localhost:8000
```

Déployé sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur `main`.

## À venir

- Le plugin Figma lira les mêmes tokens que le site.
