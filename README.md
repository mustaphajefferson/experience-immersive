# Expérience immersive

Projet de Workshop 2 (LISAA, Mastère Direction Artistique) : une app qui fait sortir les gens découvrir leur quartier, en transformant les affiches de la ville en collections à compléter.

**À lire en premier : [docs/fiche-reference.md](docs/fiche-reference.md)**, la source de vérité du projet (concept, parcours, design system, décisions).

## Contenu

| Dossier | Contenu |
|---|---|
| `docs/` | Fiche de référence |
| `design/tokens.json` | Couleurs, typographie, grille, espacements, grille de fond |
| `assets/affiches/` | Les 9 affiches du moodboard utilisées dans les maquettes |
| `figma-plugin/` | Plugin Figma qui génère les 11 maquettes et la section « 09 — Grille de fond » |

## Plugin Figma

1. `python3 figma-plugin/build.py` reconstruit `figma-plugin/code.js` à partir de `src/logic.js` et des affiches.
2. Dans Figma : clic droit › Plugins › Development › Import plugin from manifest… › `figma-plugin/manifest.json`.

## Site prototype

Les 11 écrans du parcours d'Inès, en HTML, CSS et JavaScript sans dépendance. Les couleurs, la typographie et la grille viennent de `design/tokens.json`.

```bash
python3 site/tools/build.py            # génère site/css/tokens.css et copie les affiches
python3 -m http.server -d site 8000    # puis ouvrir http://localhost:8000
```

Le site est déployé sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur `main`. Réglage du dépôt : Settings › Pages › Source : « GitHub Actions ».

## À venir

- Le plugin Figma lira les mêmes tokens que le site.
