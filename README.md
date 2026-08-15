# Plaquette commerciale SSB 2026 / 2027

Version HTML de la plaquette commerciale de **Sorbonne Sport Business**,
association étudiante de l'Université Paris 1 Panthéon-Sorbonne dédiée à
l'industrie du sport.

Huit pages A4, reprises à l'identique du PDF d'origine : mêmes photos, mêmes
logos, même palette, mêmes positions. Rien n'est généré ni réinterprété.

## Utilisation

Site statique, sans dépendance ni build. Ouvrir `index.html`, ou servir le
dossier :

```bash
python3 -m http.server 4173
```

- Flèches, Page précédente / suivante, Début / Fin pour naviguer.
- `#slide-4` dans l'URL ouvre directement une page.
- Le bouton imprimante (ou Cmd/Ctrl + P) exporte un PDF A4 conforme, à
  condition de choisir « Marges : aucune » et de décocher les en-têtes et
  pieds de page du navigateur.

## Structure

```
index.html            les 8 diapositives
assets/css/deck.css   jetons de la charte, mise en page A4, styles d'impression
assets/js/deck.js     navigation clavier, compteur, lien profond, impression
assets/fonts/         Roboto, Montserrat, Lato, Open Sans, Bitter (woff2)
assets/img/           photos et logos extraits du PDF d'origine
outils/               outils de vérification (hors production)
```

## Comment la mise en page est construite

Les coordonnées ne sont pas approximées à l'œil : elles ont été lues dans les
flux de contenu du PDF (opérateurs `cm` / `Do` / `re` pour les images et les
aplats, `Tf` / `Tm` pour la typographie), puis converties en `cqw`.

- `1 cqw` = 1 % de la largeur de la page = **5,955 pt**.
- Chaque `.slide` est un conteneur de requête au ratio A4 ; toutes les tailles
  internes sont en `cqw`, donc la page se met à l'échelle sans JavaScript et
  reste identique du mobile à l'impression.
- Chaque bloc de texte est positionné sur **sa ligne de base** relevée dans le
  PDF (`top`), le bloc étant remonté de l'ascendante de sa police via les
  jetons `--base-*` (mesurés dans le navigateur, voir `outils/metrics.html`).
- Les coupures de ligne sont explicites (`<br>` + `.t--nowrap`) pour reproduire
  exactement celles de la source, quelle que soit la taille d'affichage.

### Palette

| Rôle | Valeur |
|---|---|
| Navy (cadres, filets, aplats) | `#012859` |
| Navy des titres | `#062750` |
| Navy des labels et chapôs | `#003172` |
| Or | `#d2b256` |
| Crème | `#e9dcb4` |

### Polices

Roboto (titres), Montserrat (sous-titres et pieds de page), Lato (corps),
Open Sans (chiffres clés) sont auto-hébergées en woff2 : aucune requête
externe.

Les libellés dorés en italique (*Vision*, *Impact*, *Réseau*…) utilisent
**Sergio Trendy Italic** dans le PDF, une police Canva non redistribuable.
Elle est remplacée par **Bitter Bold Italic**. C'est le seul écart
typographique du document : pour rétablir la fidélité totale, déposer le woff2
de Sergio Trendy dans `assets/fonts/` et modifier la règle `@font-face`
correspondante dans `deck.css`.

## Écarts assumés par rapport au PDF

- Les pictogrammes (micro, trophée, graphique, bâtiment, calendrier, poignée
  de main, LinkedIn, Instagram, contact) sont redessinés en SVG : les bitmaps
  d'origine font 63 à 90 px et ne tiennent pas l'agrandissement.
- Coquilles de la source corrigées : « marquélesesprits » → « marqué les
  esprits », « carière quicompte » → « carrière qui compte », espacement de
  « David Trezeguet & Matias Patanian », et « David Khan » → **David Kahn**,
  orthographe retenue partout sur le site de l'association.
- Deux anomalies de la source sont **reproduites telles quelles** : le chiffre
  « 45k » de la page Vision n'a pas de libellé, et « +400 / Diplômes
  Disponibles » y est désaligné.

## Outils de vérification

Non nécessaires à l'affichage, utiles pour toute reprise de la mise en page :

- `outils/comparaison.html` — superpose le rendu HTML et le rendu du PDF en
  mode différence, page par page.
- `outils/audit.html` — apparie chaque ligne du PDF à la ligne rendue et liste
  les écarts de position et de largeur en `cqw`.
- `outils/metrics.html` — mesure les jetons `--base-*` des polices.

Les images de référence (`outils/ref/`) ne sont pas versionnées. Pour les
régénérer depuis le PDF d'origine :

```bash
pdftoppm -r 150 -png Plaquette_commerciale_SSB.pdf outils/ref/page
```
