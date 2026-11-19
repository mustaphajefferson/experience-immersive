# Densité de l'interface — SCRAP

*Analyse de ce qu'on voit à l'arrivée sur chaque écran, et de ce qui peut se replier. Rien n'est enlevé : tout reste accessible en un geste.*

**Mis à jour le 19.11.2026 : tout ce qui est marqué ✅ est en ligne.** Les quatre mécaniques sont écrites, les neuf écrans sont faits. Ce qui reste est en bas.

Coût en temps de code, pour une personne :
**XS** moins de 30 min · **S** 1 h · **M** 2 à 3 h · **L** une demi-journée · **XL** une journée ou plus.

---

## 1. Le constat

Trois habitudes reviennent sur presque tous les écrans.

**a. Les listes de choix sont posées à plat, en entier.**
12 collections (12, 14, 19.2), 16 éléments à ajouter (24.1), 12 fonds + 10 couleurs (25), 8 scotchs (26), 5 déchirures (27), 6 filtres + 4 dispositions (28, 29), 10 couleurs + 4 épaisseurs (24.3). À chaque fois la liste complète, alors qu'on n'en touche qu'une.

**b. Tous les outils sont montrés avant qu'on ait décidé de s'en servir.**
Le scrapbook affiche ses 7 outils en permanence, y compris quand on est simplement en train de regarder sa page.

**c. L'aide reste après avoir servi.**
Astuce du scrapbook, consigne du scanner, « page remplie à 42 % », « Un doigt promène la page… » : ces phrases sont justes la première fois et deviennent du bruit ensuite.

Le point commun : **l'app montre ce qu'elle sait faire au lieu de montrer ce qu'on est en train de faire.** C'est exactement l'inverse du premier principe du design system — *l'affiche d'abord*.

**Compté, écran par écran** (nombre d'éléments touchables visibles à l'arrivée, hors contenu) :

| Écran | Avant | Après | |
|---|---|---|---|
| 24 Scrapbook | 19 | **10** | ✅ |
| 19.2 Identifier le scrap | 29 | **12** | ✅ |
| 14 Filtres de la carte | 20 | **8** | ✅ |
| 28 Ma collection | 16 | **8** | ✅ |
| 29 Sélection | 16 | **8** | ✅ |
| 25 Fond | 34 | **26** | ✅ |
| 24.1 Ajouter | 27 | **19** | ✅ |
| 34 Vitrine | 6 | **4** | ✅ |
| 12 Collections de départ | 14 | 15 | ✅ (fermé sur un compte neuf) |
| 35 Profil | 12 | 13 | ✅ (4 barres cachées derrière une ligne) |
| 26 Scotch · 27 Déchirer | 19 / 18 | 20 / 19 | palettes laissées telles quelles |

*Mesuré sur le site, écran par écran, en comptant les boutons, champs et curseurs visibles à l'arrivée, hors contenu et hors replis fermés. Les trois derniers gagnent une ligne de repli au lieu d'en perdre : ils rangent plus qu'ils n'ajoutent, mais le compte brut ne le voit pas.*

---

## 2. Quatre mécaniques, à écrire une fois et à réutiliser

Rien de tout ça n'est un nouveau composant visuel : tout se dessine avec ce qui existe déjà (filet 1 px, rayon 0, chevron 24 px, puce, feuille).

### A. Le repli — `repli(titre, valeur, contenu)`
Une ligne de titre avec la valeur courante à droite et un chevron. Fermée par défaut, elle s'ouvre **sur place**, sans quitter l'écran. Pour les blocs secondaires d'une page qui défile : tags, teinte, badges, répartition par rareté.
Exactement la `ligne` qui existe déjà, avec un chevron qui pivote et une hauteur animée. **Coût : S**, une seule fois.

### B. La feuille de choix — déjà là (écran 14)
Un bouton qui porte le **choix courant**, et qui ouvre la liste complète par-dessus. Pour les listes longues où un seul choix est actif : collection d'un scrap, tri d'une collection, filtre de la carte.
Règle : **le bouton dit où on en est** (« Tri · Derniers »), pas ce qu'il ouvre (« Filtres »). **Coût : XS** par usage, la feuille existe.

### C. Le tiroir d'outils — scrapbook
La barre des 7 outils devient **un seul bouton**. On touche, elle monte. On choisit un outil, le panneau de cet outil prend sa place. « OK » referme tout et la page redevient nue.
C'est le changement le plus visible de la liste, et celui qui sert le plus le pitch : on filme une page de scrapbook, pas une barre d'outils. **Coût : M**.

### D. Le retrait automatique
Les commandes de zoom et les astuces apparaissent au premier geste et s'effacent après 2 s d'immobilité. Rien n'est supprimé, rien n'est caché derrière un bouton : c'est l'écran qui se range tout seul.
Déjà à moitié en place (`note-ensemble` apparaît en vue d'ensemble). **Coût : S**.

---

## 3. Écran par écran

### 24 · Le scrapbook — le cas d'école

**Aujourd'hui, avant d'avoir rien fait :** nom du carnet + sous-titre + partager, barre de 3 carnets + bouton « nouveau », 3 commandes de zoom + le pourcentage, une astuce de trois propositions, 7 outils, 4 onglets. **19 cibles pour une page qu'on vient juste regarder.**

**Ce qui reste :** le nom du carnet (qui devient lui-même le bouton d'ouverture de la liste des carnets), partager, un bouton **Composer**, les 4 onglets.

**Ce qui se replie :**
1. **Les 7 outils → un bouton Composer** (tiroir C). Vue / Disposition disparaissent comme choix explicite : on est en Vue tant qu'on n'a pas ouvert le tiroir, et ouvrir le tiroir passe en Disposition. Le mode devient une conséquence du geste au lieu d'être une question posée à l'arrivée. **M**
2. **La barre de carnets → le titre.** `Belleville ▾` ouvre la liste des carnets en feuille, avec « Nouveau carnet » en bas. On gagne une rangée entière et le titre redevient un titre. **S**
3. **Les commandes de zoom → retrait automatique** (mécanique D). **S**
4. **L'astuce → une seule fois.** Elle s'affiche à la première ouverture du carnet, puis plus jamais (un drapeau dans `ETAT`). **XS**
5. **« Page remplie à 42 % » → dans la feuille des carnets**, à côté de chaque carnet. C'est une information de carnet, pas une information de page.

### 25 · Fond — l'écran le plus chargé de l'app

**Aujourd'hui :** 12 matières + « ta photo » + 10 pastilles de couleur + « sans teinte » + OK + 7 outils = **32 cibles** sur deux rangées qui défilent.

**Ce qui se replie :**
1. **La teinte dans un repli** (mécanique A) : `Teinte · aucune ▾`. Neuf fois sur dix on choisit une matière et on s'arrête là. **XS**
2. **Les matières en deux temps :** les 6 les plus utilisées visibles, puis `Voir les 6 autres`. À arbitrer — la rangée défile déjà horizontalement, le gain est moindre qu'il n'y paraît. **S**

### 19.2 · Identifier le scrap

**Aujourd'hui :** 2 champs, **12 puces de collection**, 8 tags + « + Tag », un interrupteur Holo, valider. 27 cibles, juste après le moment le plus fort de l'app — on vient de capturer.

**Ce qui se replie :**
1. **Collection → une feuille** (mécanique B) : on affiche les **3 collections de départ**, plus un bouton `Autre collection ▾`. `collectionsOrdonnees()` fait déjà le tri, on n'affiche que le début. **S**
2. **Tags → un repli fermé** `Tags · aucun ▾`. Un scrap se range très bien sans tag ; qui veut en mettre ouvre. **XS**
3. **Holo → dans le même repli.** C'est un détail d'état, pas une décision de capture. **XS**

Résultat : titre, lieu, trois collections, valider. L'écran redevient **une question à la fois**.

### 14 · Filtres de la carte

**Aujourd'hui :** 13 puces de collection sur une rangée qui défile, 2 puces d'état, un curseur, un interrupteur, réinitialiser, valider.

**Ce qui se replie :** les collections passent en feuille de choix (`Collection · Toutes ▾`). Garder visibles : le rayon, « seulement ce qui me manque », l'état. **S**

### 28 · Ma collection

**Aujourd'hui :** 6 filtres + 4 dispositions + une ligne « Mes collections », au-dessus de la grille.

**Ce qui se replie :** les 6 filtres deviennent **un bouton qui porte le tri courant** (`Derniers ▾`) et les 4 dispositions **un seul bouton qui porte l'icône de la disposition active** et ouvre les quatre au toucher. Une rangée de deux boutons au lieu de dix. **S**
Même traitement sur **29 (Sélection)**, qui répète la même rangée.

### 26 · Scotch · 27 · Déchirer · 24.1 · Ajouter

Ces trois panneaux souffrent du même mal : la palette entière. Deux corrections, les mêmes partout :
1. **Le dernier choix d'abord.** Le scotch utilisé la dernière fois, la déchirure utilisée la dernière fois, en tête de rangée. `ETAT.mur.scotchType` et `dechireType` existent déjà, ils ne servent qu'à marquer le choix — ils peuvent aussi le remonter.
2. **24.1 : regrouper les 16 éléments en 3 familles** — *Écrire* (titre, sous-titre, étiquette, date), *Papiers* (post-it, bulle, ticket), *Marquer* (flèches, étoile, ruban, punaise, trombone, gommette, souligner, entourer). Trois puces, puis la famille s'ouvre. **S**
3. **27 : Annuler / Recoller** passent dans un repli ou disparaissent au profit du geste de retour. **XS**

### 12 · Collections de départ

13 cartes d'un coup, au premier lancement, alors que le texte dit « trois au maximum ». Montrer les **3 collections proches** et replier les 9 autres derrière `Voir les 9 autres ▾`. La contrainte devient lisible au lieu d'être contredite par l'écran. **XS**

### 35 · Profil

Bannière, avatar, badge, nom, méta, bio, abonnés, 3 compteurs, 4 barres de rareté, 2 colonnes, 4 badges, 2 boutons de pied, 4 onglets.

**Ce qui se replie :** la **répartition par rareté** dans un repli (`Ce qu'il y a dans sa collection ▾`), et les **badges** limités à 4 avec `Voir les 12 badges`. Le haut du profil — photo, nom, vitrine, scrap mis en avant — reste intact : c'est ce qu'on vient voir. **S**

### 19 · Le scanner

Moins grave, mais : la puce **Auto** dans l'en-tête et la **consigne** en bas disent la même chose. Garder la consigne les trois premières secondes, puis l'effacer ; déplacer Auto dans un appui long sur le déclencheur, ou le laisser (c'est un réglage qu'on cherche quand ça rate). **XS**

### 34 · Vitrine

Les deux curseurs Taille et Rotation sont affichés en permanence, même sans scrap sélectionné. Ils n'apparaissent qu'une fois un scrap touché — c'est déjà presque le cas (`sel`), à rendre franc. **XS**

---

## 4. Ce que je ne replierais pas

- **Le bouton rouge « Capturer un scrap ».** C'est le sujet de l'app, il doit rester le seul aplat rouge de l'écran.
- **Les 4 onglets.** On peut toujours rentrer : c'est une décision de la fiche.
- **Le verso d'un scrap (22).** Ses 7 lignes sont le contenu, pas des options.
- **Les réglages (41 à 47).** Déjà en listes groupées, c'est le bon modèle.
- **Les écrans de récompense (32, 33, 51).** Ils sont chargés exprès, et on les regarde.
- **Le bouton DEV et le coin de démonstration.** Ils doivent rester trouvables pendant la soutenance.

**Une règle à tenir :** tout ce qu'on replie doit rester **à un seul geste**, et ce geste doit être répétable devant un jury sans hésiter. Un repli qui demande de chercher où on a rangé l'outil est pire que la barre d'outils actuelle.

---

## 5. Ce qui est fait, ce qui reste

**Fait et en ligne (19.11)** — les quatre mécaniques, puis les neuf écrans : scrapbook, 19.2, 14, 28, 29, 25, 24.1, 12, 34, 35. Deux choses vues sur le prototype au passage et corrigées : « Composer » était un aplat noir (la charte l'interdit, il est rouge), et en arrivant droit sur `#/24` la page partait à l'échelle zéro, le carnet restait blanc.

**Ce qui reste, par ordre de ce que ça rapporte :**

1. **26 Scotch et 27 Déchirer : le dernier choix en tête de rangée.** `ETAT.mur.scotchType` et `dechireType` existent déjà, ils ne servent qu'à marquer le choix — ils peuvent aussi le remonter. **XS**
2. **25 Fond : les 6 matières les plus utilisées, puis « Voir les 6 autres ».** À arbitrer : la rangée défile déjà, et la matière est le sujet de l'outil. **S**
3. **19 Scanner : effacer la consigne après trois secondes.** Elle dit la même chose que la puce Auto. **XS**
4. **35 Profil : limiter les badges à 4 avec « Voir les 12 badges ».** **XS**
5. **27 : Annuler / Recoller dans un repli**, ou remplacés par le geste de retour. **XS**

**À vérifier sur un vrai téléphone avant la soutenance :** que le tiroir s'ouvre du premier coup (la zone de touche fait 28 px de haut), et que le repli s'anime bien sur Safari iOS — il s'appuie sur `grid-template-rows`, animable depuis Safari 16.4.
