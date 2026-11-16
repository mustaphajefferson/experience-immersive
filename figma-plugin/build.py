"""Assemble figma-plugin/code.js : affiches (base64) + src/logic.js.
Usage : python3 figma-plugin/build.py   (depuis la racine du dépôt)"""
import base64, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
meta = json.loads((root / "assets/affiches/affiches.json").read_text())
img = {k: {"r": v["ratio"], "b64": base64.b64encode((root / v["fichier"]).read_bytes()).decode()} for k, v in meta.items()}
logic = (root / "figma-plugin/src/logic.js").read_text()
(root / "figma-plugin/code.js").write_text("const IMG = " + json.dumps(img) + ";\n" + logic)
print("code.js généré")
