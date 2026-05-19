# opleidingindezorg.nl — klikbaar prototype

Klikbaar HTML/CSS/JS-prototype voor het regionale BBL-zorgopleidingsplatform
**opleidingindezorg.nl** (Amstelland & Meerlanden). Bedoeld als 1-op-1
omzetbaar framework naar een WordPress custom theme.

Gebouwd door Online Marketing Amsterdam, mei 2026.

## Het prototype bekijken

De pagina's gebruiken **root-absolute paden** (`/css/...`, `/zorgorganisaties/...`),
net als de uiteindelijke WordPress-site. Dubbelklikken op een `.html` werkt
daarom niet, je serveert de map via een lokale webserver:

```bash
cd 03-prototype
python3 -m http.server 8000
```

Open daarna **http://localhost:8000** in je browser. Klik door, alles werkt:
mega menu, mobiel menu, footer uitklappen, FAQ-accordion, formuliervalidatie,
scroll-animaties.

## Wat zit erin

33 pagina's, volledig onderling gelinkt:

- **Home** (`index.html`)
- **Werken & Leren** — overzicht + 3 BBL-niveaus + 4 informatiepagina's
- **Zorgorganisaties** — overzicht met filterbar + 8 organisatie-detailpagina's
- **Scholen** — overzicht + proces + open dagen
- **Over ons** — overzicht + samenwerking + deelnemers + contact
- **Keuzehulp** — wizard via iframe-embed
- **Solliciteren** — formulier + bevestigingspagina
- **Legal** — privacy, cookies, disclaimer, toegankelijkheid

## Structuur

```
03-prototype/
├── index.html              Home
├── css/                    tokens, global, components, animations, nav, footer
│   └── pages/              pagina-specifieke stylesheets
├── js/                     nav, animations, footer, faq, filter, forms (vanilla)
├── assets/logo/            logo-SVG's
├── _partials/              canonieke header + footer + bouwinstructie (geen pagina's)
└── [secties]/              alle pagina's als map met index.html
```

`_partials/` hoort niet in de WordPress-build, het is de bron voor `header.php`
en `footer.php` plus de bouwinstructie.

## Tech

Pure HTML5 / CSS3 / vanilla JavaScript. Geen frameworks, geen build-tools.
Enige externe afhankelijkheid: Google Fonts (DM Sans + DM Serif Display) via CDN.
De Keuzehulp draait als iframe vanaf de bestaande wizard-app.

## WordPress-omzetting

Elke pagina bevat commentaarblokken die de WordPress-structuur aangeven:

- `<!-- WP TEMPLATE: ...php -->` — welk template-bestand
- `<!-- WP TEMPLATE PART: header.php / footer.php / nav.php -->`
- `<!-- ACF: veldnaam (type) -->` — bewerkbare velden via Advanced Custom Fields
- `<!-- WP_LOOP: start / end -->` — herhalende content
- `<!-- CPT: organisaties -->` — het custom post type voor de 8 organisaties

De header en footer zijn op alle pagina's identiek, klaar om `header.php` en
`footer.php` van te maken. De 8 organisatiepagina's volgen één template
(`single-organisaties.php`), het overzicht wordt `archive.php`.

## Openstaande punten (TODO's in de code)

Doorzoekbaar met `grep -rn "TODO" .` Samengevat:

- **Salarisbedragen** — indicatief ingevuld, laten bevestigen op de actuele cao VVT.
- **Organisatieteksten** — de "Wie zijn wij?"-teksten zijn geschreven op basis
  van de officiële sites van de organisaties, laten bevestigen door de
  organisaties zelf. Arbeidsvoorwaarden en locaties zijn nog voorbeeldcopy.
- **Sigra** — Sigra is de 8e organisatie maar een regionaal samenwerkingsverband,
  geen zorgwerkgever. De niet-kloppende secties op de Sigra-pagina zijn in de
  code gemarkeerd. Beslis voor livegang hoe Sigra wordt gepresenteerd.
- **Cordaan** — mogelijk verborgen bij livegang, zie DEVELOPER-HANDOVER.md.
- **Niveau 4** — organisatie-selectie laten bevestigen.
- **Filterbar** — in het prototype visueel; in WordPress koppelen aan `WP_Query`
  met `tax_query` (org_type / bbl_niveau / werkplek).
- **Open dagen** — voorbeelddata en -locaties, definitieve agenda aanleveren.
- **Contactgegevens** — de contactgegevens op de contactpagina zijn voorbeeld.
- **Legal-pagina's** — privacy, cookies, disclaimer en toegankelijkheid bevatten
  plausibele maar niet-juridisch-gecontroleerde tekst.

## Kwaliteitscheck

Geverifieerd: 33 pagina's geven HTTP 200, geen kapotte interne links, identieke
header/footer overal, mega menu's compleet, sollicitatieformulier met validatie
en `?org=`-pre-fill, FAQ-accordion, geen externe dependencies buiten Google Fonts.
