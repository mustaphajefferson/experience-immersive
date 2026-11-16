#!/usr/bin/env python3
"""Prépare le site prototype.

- génère site/css/tokens.css à partir de design/tokens.json (source unique des tokens) ;
- copie les affiches de assets/affiches/ dans site/assets/affiches/.

Usage, depuis la racine du dépôt :
    python3 site/tools/build.py

Les deux sorties sont générées : elles ne sont pas versionnées (voir .gitignore)
et le workflow GitHub Pages les reconstruit à chaque déploiement.
"""

import json
import re
import shutil
import unicodedata
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
SITE = RACINE / "site"
TOKENS = json.loads((RACINE / "design" / "tokens.json").read_text(encoding="utf-8"))


def slug(texte: str) -> str:
    """« Titre/XL » -> « titre-xl » ; « Texte/Méta » -> « texte-meta »."""
    ascii_ = unicodedata.normalize("NFKD", texte).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_.lower()).strip("-")


def rgba(hexa: str, alpha: float) -> str:
    h = hexa.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return f"rgba({r}, {g}, {b}, {alpha})"


def css_tokens() -> str:
    t = TOKENS
    couleurs = t["couleurs"]
    lignes = ["/* Généré par site/tools/build.py depuis design/tokens.json. Ne pas éditer. */", ":root {"]

    # Couleurs : valeur claire (index 0) par défaut
    lignes += [f"  --{slug(nom)}: {val[0]};" for nom, val in couleurs.items()]

    # Grille de fond (règle « 09 — Grille de fond »)
    g = t["grilleDeFond"]
    texte = couleurs["texte/principal"][0]
    secondaire = couleurs["texte/secondaire"][0]
    lignes += [
        f"  --grille-module: {g['module']}px;",
        f"  --grille-trait: {rgba(texte, g['trait'])};",
        f"  --grille-trait-marque: {rgba(texte, g['traitMarque'])};",
        f"  --grille-repere: {rgba(secondaire, g['repere'])};",
    ]

    # Écran, marges et colonnes
    e = t["ecran"]
    colonne = (e["largeur"] - 2 * e["marge"] - 3 * e["gouttiere"]) / e["colonnes"]
    assert colonne == 86.5, f"colonne inattendue : {colonne}"
    lignes += [
        f"  --ecran-largeur: {e['largeur']}px;",
        f"  --ecran-hauteur: {e['hauteur']}px;",
        f"  --marge: {e['marge']}px;",
        f"  --gouttiere: {e['gouttiere']}px;",
        f"  --colonne: {colonne:g}px;",
    ]

    # Espacements, formes, police
    lignes += [f"  --espace-{v}: {v}px;" for v in t["espacements"]]
    lignes += [
        f"  --filet: {t['formes']['filet']}px;",
        f"  --rayon: {t['formes']['rayon']}px;",
        f'  --police: {t["typographie"]["famille"]}, system-ui, -apple-system, "Segoe UI", sans-serif;',
    ]
    lignes.append("}")

    # Thème sombre : valeur sombre (index 1), appliquée par data-theme="sombre"
    lignes.append('[data-theme="sombre"] {')
    lignes += [f"  --{slug(nom)}: {val[1]};" for nom, val in couleurs.items()]
    lignes.append("}")

    # Styles de texte : .t-titre-xl, .t-texte-meta, etc.
    for nom, s in t["typographie"].items():
        if not isinstance(s, dict):
            continue
        lignes += [
            f".t-{slug(nom)} {{",
            f"  font-weight: {s['graisse']};",
            f"  font-size: {s['taille']}px;",
            f"  line-height: {s['interligne']}px;",
            f"  letter-spacing: {s['interlettrage'] / 100:g}em;",
        ]
        if s.get("capitales"):
            lignes.append("  text-transform: uppercase;")
        lignes.append("}")

    lignes.append("")
    return "\n".join(lignes)


def main() -> None:
    (SITE / "css").mkdir(parents=True, exist_ok=True)
    (SITE / "css" / "tokens.css").write_text(css_tokens(), encoding="utf-8")

    cible = SITE / "assets" / "affiches"
    shutil.copytree(RACINE / "assets" / "affiches", cible, dirs_exist_ok=True)
    print(f"tokens.css généré ; affiches copiées dans {cible.relative_to(RACINE)}")


if __name__ == "__main__":
    main()
