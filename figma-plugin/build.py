"""Assemble figma-plugin/code.js : affiches (base64) + src/*.js dans l'ordre des noms.
Usage : python3 figma-plugin/build.py   (depuis la racine du dépôt)"""
import base64, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
meta = json.loads((root / "assets/affiches/affiches.json").read_text())
img = {k: {"r": v["ratio"], "b64": base64.b64encode((root / v["fichier"]).read_bytes()).decode()} for k, v in meta.items()}
parts = [p.read_text() for p in sorted((root / "figma-plugin/src").glob("*.js"))]
(root / "figma-plugin/code.js").write_text("const IMG = " + json.dumps(img) + ";\n" + "\n".join(parts))
print("code.js généré à partir de", len(parts), "fichiers")
