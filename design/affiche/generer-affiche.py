#!/usr/bin/env python3
"""Génère « COLLE FRAÎCHE », l'affiche SCRAP.

Une seule source pour deux usages :
  - le fichier d'impression (A4, texte vectorisé, aucune dépendance de police) ;
  - l'affiche vivante de l'app, qui est LE MÊME SVG, injecté dans la page et
    animé par CSS. Chaque élément porte un identifiant pour pouvoir être
    bougé séparément : les lettres, les membres du personnage, la tache, la
    date, le bandeau.

Usage, depuis la racine du dépôt :
    python3 design/affiche/generer-affiche.py
"""

import math
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

RACINE = Path(__file__).resolve().parents[2]
POLICES = Path("/usr/share/fonts/opentype/inter")
W, H = 1000, 1414                      # proportions A4
PAPIER, NOIR, ROUGE = "#F1EFE6", "#111111", "#FF0000"

_cache = {}


def police(nom):
    if nom not in _cache:
        f = TTFont(POLICES / f"{nom}.otf")
        _cache[nom] = (f, f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm)
    return _cache[nom]


def largeur_naturelle(texte, nom, suite=0.0):
    f, gs, cm, upm = police(nom)
    total = 0
    for i, c in enumerate(texte):
        g = cm.get(ord(c))
        if g is None:
            continue
        total += gs[g].width / upm
        if i < len(texte) - 1:
            total += suite
    return total


def lettres(texte, nom, taille, x, y, suite=0.0, prefixe="l"):
    """Chaque lettre devient un <path> à elle, pour pouvoir l'animer seule."""
    f, gs, cm, upm = police(nom)
    out, pos, n = [], x, 0
    for c in texte:
        g = cm.get(ord(c))
        if g is None:
            continue
        if c != " ":
            stylo = SVGPathPen(gs)
            gs[g].draw(stylo)
            d = stylo.getCommands()
            if d:
                k = taille / upm
                out.append(
                    f'<path id="{prefixe}{n}" class="lettre" style="--i:{n}" d="{d}" '
                    f'transform="translate({pos:.1f} {y:.1f}) scale({k:.5f} {-k:.5f})"/>'
                )
                n += 1
        pos += gs[g].width / upm * taille + suite * taille
    return "\n".join(out), pos - x


def ligne_ajustee(texte, nom, cible, x, y, suite=0.0, prefixe="l"):
    """Une ligne calée exactement sur une largeur : on choisit le corps."""
    nat = largeur_naturelle(texte, nom, suite)
    return lettres(texte, nom, cible / nat, x, y, suite, prefixe)


def bloc(lignes, nom, taille, x, y, interligne, suite=0.0):
    out = []
    for i, t in enumerate(lignes):
        d, _ = lettres(t, nom, taille, x, y + i * interligne, suite, prefixe=f"p{i}_")
        out.append(f'<g class="ligne-pied" style="--i:{i}">{d}</g>')
    return "\n".join(out)


def blob(cx, cy, r, lobes=5, amp=.17, phase=.4, aplat=1.06, n=72):
    """Une tache fermée et lisse : un rayon modulé, puis un lissage
    Catmull-Rom. C'est plus juste qu'une courbe dessinée à la main — et
    surtout, ça se redessine à l'identique."""
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = r * (1 + amp * math.sin(lobes * a + phase) + amp * .38 * math.sin((lobes * 2 + 1) * a + phase * 1.7))
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a) * aplat))
    d = f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(n):
        p0, p1, p2, p3 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d + "Z"


# ───────── Composition
M = 62
COL_DATE = 104          # la colonne de droite, réservée aux chiffres
UTILE = W - 2 * M - COL_DATE
parts = []

# Le papier
parts.append(f'''<g id="a-fond">
  <rect width="{W}" height="{H}" fill="{PAPIER}"/>
</g>''')

# Repères de coupe aux quatre coins
r = 30
parts.append(f'''<g id="a-reperes" stroke="{NOIR}" stroke-width="2" fill="none">
  <path d="M{M} {M-r+10}v{r}M{M-r+10} {M}h{r}"/>
  <path d="M{W-M} {M-r+10}v{r}M{W-M+r-10} {M}h-{r}"/>
  <path d="M{M} {H-M+r-10}v-{r}M{M-r+10} {H-M}h{r}"/>
  <path d="M{W-M} {H-M+r-10}v-{r}M{W-M+r-10} {H-M}h-{r}"/>
</g>''')

# La ligne de tête, et le filet rouge dessous
d, largeur_meta = lettres("SCRAP · AFFICHE VIVANTE · BELLEVILLE", "Inter-SemiBold", 21, M, 100, suite=0.14, prefixe="m")
parts.append(f'''<g id="a-meta">
  <g fill="{NOIR}">{d}</g>
  <rect id="m-filet" x="{M}" y="118" width="{UTILE:.0f}" height="4" fill="{ROUGE}"/>
</g>''')

# Les deux mots, calés sur la largeur utile
d1, _ = ligne_ajustee("COLLE", "InterDisplay-Black", UTILE, M, 560, suite=-0.035, prefixe="A")
d2, _ = ligne_ajustee("FRAÎCHE", "InterDisplay-Black", UTILE, M, 772, suite=-0.035, prefixe="B")
parts.append(f'<g id="a-mot1" fill="{NOIR}">{d1}</g>')
parts.append(f'<g id="a-mot2" fill="{NOIR}">{d2}</g>')

# La tache de colle : un trait fermé posé PAR-DESSUS le premier mot.
# C'est un contour, pas un aplat : la typo continue de se lire à travers.
parts.append(f'''<g id="a-tache" fill="none" stroke="{NOIR}" stroke-width="16" stroke-linejoin="round">
  <path id="t-contour" pathLength="1" d="{blob(718, 312, 124, lobes=5, amp=.16, phase=.9)}"/>
  <path id="t-goutte" pathLength="1" d="{blob(772, 614, 27, lobes=4, amp=.2, phase=2.1)}"/>
</g>''')

# Le personnage : un seul feutre rouge, six morceaux pour pouvoir le faire
# danser. Les articulations sont placées pour que chaque membre tourne autour
# de son point d'attache sans se décrocher du corps.
parts.append(f'''<g id="a-figure" fill="none" stroke="{ROUGE}" stroke-width="25" stroke-linecap="round" stroke-linejoin="round">
  <circle id="f-tete" pathLength="1" cx="398" cy="392" r="58"/>
  <path id="f-corps" pathLength="1" d="M398 450c-6 60-12 118-14 180"/>
  <path id="f-brasG" pathLength="1" d="M392 512c-44-2-88-20-124-52-20-18-32-42-36-70"/>
  <path id="f-brasD" pathLength="1" d="M396 524c50 2 100 18 142 52 22 18 34 42 38 72"/>
  <path id="f-jambeG" pathLength="1" d="M384 630c-22 58-52 110-90 156-14 16-22 34-24 56"/>
  <path id="f-jambeD" pathLength="1" d="M386 632c26 58 60 110 104 156 14 16 20 34 20 56"/>
</g>''')

# La date, debout contre le bord droit, par-dessus tout le reste
date = []
for i, c in enumerate("28·11·26"):
    dd, larg = lettres(c, "Inter-Bold", 42, 0, 0, prefixe=f"d{i}_")
    date.append(f'<g class="chiffre" style="--i:{i}" transform="translate({W-M-COL_DATE/2-larg/2+12:.1f} {210+i*72})">{dd}</g>')
parts.append(f'<g id="a-date" fill="{NOIR}">' + "\n".join(date) + "</g>")

# Une ligne au milieu, là où la page respire
dph, largeph = lettres("CE QUI EST COLLÉ CE SOIR AURA DISPARU DEMAIN", "Inter-Medium", 27, M, 946, suite=0.012, prefixe="ph")
parts.append(f'''<g id="a-phrase">
  <g fill="{NOIR}">{dph}</g>
  <rect id="ph-filet" x="{M}" y="964" width="{largeph:.0f}" height="3" fill="{ROUGE}"/>
</g>''')

# Le pied de page, et « ENTRÉE LIBRE » entouré au feutre
LIGNES = [
    "NUIT DE COLLAGE ET DE CONCERTS",
    "28 RUE DE BELLEVILLE · PARIS 20e",
    "21 H → 5 H · ENTRÉE LIBRE",
    "AFFICHE ÉDITÉE PAR SCRAP · TIRAGE 200",
]
TAILLE_PIED, INTER_PIED, Y_PIED = 25, 44, 1104
parts.append(f'<g id="a-pied" fill="{NOIR}">{bloc(LIGNES, "Inter-Medium", TAILLE_PIED, M, Y_PIED, INTER_PIED, suite=0.02)}</g>')

# on entoure exactement « ENTRÉE LIBRE », là où il tombe vraiment
avant = largeur_naturelle("21 H → 5 H · ", "Inter-Medium", 0.02) * TAILLE_PIED
mot = largeur_naturelle("ENTRÉE LIBRE", "Inter-Medium", 0.02) * TAILLE_PIED
cx = M + avant + mot / 2 + 12
cy = Y_PIED + 2 * INTER_PIED - TAILLE_PIED * 0.34
rx, ry = mot / 2 + 26, TAILLE_PIED * 0.95
parts.append(f'''<g id="a-entoure" fill="none" stroke="{ROUGE}" stroke-width="6" stroke-linecap="round">
  <path id="e-cercle" pathLength="1" d="M{cx-rx:.0f} {cy-6:.0f}c6-{ry:.0f} {rx*0.75:.0f}-{ry*1.25:.0f} {rx:.0f}-{ry*1.2:.0f}
    s{rx*0.95:.0f} {ry*0.2:.0f} {rx*0.98:.0f} {ry*1.05:.0f}s-{rx*0.6:.0f} {ry*1.15:.0f}-{rx*1.08:.0f} {ry*1.1:.0f}
    s-{rx*1.02:.0f}-{ry*0.35:.0f}-{rx*0.88:.0f}-{ry*1.05:.0f}"/>
</g>''')

# La marque, en bas à droite
dm, largem = lettres("SCRAP", "Inter-SemiBold", 46, 0, 0, suite=-0.01, prefixe="s")
parts.append(f'''<g id="a-marque" transform="translate({W-M-largem-34:.1f} 1262)">
  <g fill="{NOIR}">{dm}</g>
  <rect x="{largem+12:.1f}" y="-32" width="26" height="26" fill="{ROUGE}"/>
</g>''')

# Le bandeau du bas : ce qu'il faut faire de cette affiche
motif, largeb = lettres("SCANNE-MOI AVEC SCRAP   ·   ", "Inter-SemiBold", 24, 0, 0, suite=0.1, prefixe="b")
bande = []
x = -largeb
while x < W + largeb:
    bande.append(f'<g class="defile-mot" transform="translate({x:.1f} 0)">{motif}</g>')
    x += largeb
parts.append(f'''<g id="a-bande">
  <rect x="0" y="{H-96}" width="{W}" height="96" fill="{ROUGE}"/>
  <g fill="{PAPIER}" transform="translate(0 {H-36})" clip-path="url(#coupe-bande)"
     style="--course:{largeb:.1f}px">{"".join(bande)}</g>
</g>''')

# Quelques carrés semés : ce sont eux qui donnent le rythme en petit
carres = [(150, 262, 14), (930, 836, 12), (118, 1016, 18), (690, 1008, 12), (330, 180, 10), (868, 1146, 15)]
parts.append('<g id="a-points" fill="%s">%s</g>' % (
    NOIR, "".join(f'<rect class="grain-carre" style="--i:{i}" x="{x}" y="{y}" width="{s}" height="{s}"/>'
                  for i, (x, y, s) in enumerate(carres))))

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
  id="affiche-scrap" role="img" aria-label="COLLE FRAÎCHE — affiche SCRAP">
  <defs>
    <pattern id="grainp" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="{PAPIER}"/><rect width="1" height="1" fill="#D8D4C6"/>
      <rect x="2" y="2" width="1" height="1" fill="#E4E0D2"/></pattern>
    <clipPath id="coupe-bande"><rect x="0" y="{-48}" width="{W}" height="96"/></clipPath>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#grainp)"/>
{chr(10).join(parts)}
</svg>
'''
sortie = RACINE / "assets" / "affiches" / "scrap-live.svg"
sortie.write_text(svg, encoding="utf-8")
print("écrit :", sortie.relative_to(RACINE), f"({len(svg)//1024} Ko)")


# ───────── L'empreinte visuelle
# C'est elle qui permet à l'app de reconnaître CETTE affiche-là parmi toutes
# celles qu'on peut scanner. On réduit l'affiche à une grille de 8 × 11, on
# en garde la luminosité et la « rougeur » de chaque case, et on normalise :
# ni la lumière de la rue, ni le flou, ni un cadrage approximatif ne changent
# le résultat. Deux affiches différentes, elles, ne se ressemblent pas du tout.
import subprocess
import tempfile

GX, GY = 8, 11


def empreinte_du_svg(chemin):
    from PIL import Image
    with tempfile.NamedTemporaryFile(suffix=".png") as t:
        subprocess.run(["rsvg-convert", "-w", "480", str(chemin), "-o", t.name], check=True)
        im = Image.open(t.name).convert("RGB").resize((GX * 4, GY * 4), Image.LANCZOS).resize((GX, GY), Image.BOX)
    px = list(im.getdata())
    lum = [0.299 * r + 0.587 * g + 0.114 * b for r, g, b in px]
    rouge = [r - (g + b) / 2 for r, g, b in px]

    def norme(v):
        m = sum(v) / len(v)
        e = (sum((x - m) ** 2 for x in v) / len(v)) ** .5 or 1
        return [round((x - m) / e, 4) for x in v]
    return norme(lum) + norme(rouge)


emp = empreinte_du_svg(sortie)
conf = RACINE / "site" / "js" / "config.js"
txt = conf.read_text(encoding="utf-8")
bloc_emp = "    empreinte: [" + ", ".join(str(x) for x in emp) + "],"
avant, reste = txt.split("/* EMPREINTE-DEBUT */")
_, apres = reste.split("/* EMPREINTE-FIN */")
conf.write_text(f"{avant}/* EMPREINTE-DEBUT */\n{bloc_emp}\n    /* EMPREINTE-FIN */{apres}", encoding="utf-8")
print("empreinte posée dans site/js/config.js :", len(emp), "valeurs")
