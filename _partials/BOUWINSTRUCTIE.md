# Bouwinstructie — pagina-skelet opleidingindezorg.nl

Elke `.html`-pagina volgt exact dit skelet. De header en footer worden
**letterlijk** gekopieerd uit `_partials/header.html` en `_partials/footer.html`.

## Padconventie

Alle paden zijn **root-absoluut** (`/css/...`, `/js/...`, `/keuzehulp/`).
Dit matcht de WordPress-doelsituatie. Het prototype wordt lokaal bekeken via
een statische server (zie `/README.md`), niet via dubbelklik.

## Skelet

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Paginatitel] — Opleiding in de Zorg</title>
  <meta name="description" content="[unieke omschrijving, 120-155 tekens]">

  <!-- WP_OPTION: site_title | wordt 'Opleiding in de Zorg' -->
  <!-- WP TEMPLATE: [bestandsnaam].php -->

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">

  <!-- CSS -->
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/global.css">
  <link rel="stylesheet" href="/css/components.css">
  <link rel="stylesheet" href="/css/animations.css">
  <link rel="stylesheet" href="/css/nav.css">
  <link rel="stylesheet" href="/css/footer.css">
  <link rel="stylesheet" href="/css/widget.css">
  <link rel="stylesheet" href="/css/cookie.css">
  <link rel="stylesheet" href="/css/pages/[PAGINA].css">
  <!-- ALLEEN op /keuzehulp/: <link rel="stylesheet" href="/css/pages/keuzehulp.css"> -->
</head>
<body data-page="[slug]">

  <!-- >>> KOPIEER HIER DE VOLLEDIGE INHOUD VAN _partials/header.html <<< -->

  <main id="main">
    ... pagina-secties ...
  </main>

  <!-- >>> KOPIEER HIER DE VOLLEDIGE INHOUD VAN _partials/footer.html <<< -->

  <!-- >>> KOPIEER HIER DE VOLLEDIGE INHOUD VAN _partials/widget.html <<< -->
  <!-- >>> KOPIEER HIER DE VOLLEDIGE INHOUD VAN _partials/cookie.html <<< -->
  <!-- >>> KOPIEER HIER DE VOLLEDIGE INHOUD VAN _partials/rotate-notice.html <<< -->

  <!-- Scripts: alle pagina's laden dezelfde set. Elk script doet
       niets als de bijbehorende elementen ontbreken (veilige guards). -->
  <script src="/js/nav.js"></script>
  <script src="/js/animations.js"></script>
  <script src="/js/footer.js"></script>
  <script src="/js/faq.js"></script>
  <script src="/js/filter.js"></script>
  <script src="/js/forms.js"></script>
  <script src="/js/widget.js"></script>
  <script src="/js/cookie.js"></script>
  <!-- ALLEEN op /keuzehulp/: <script src="/js/keuzehulp-ui.js"></script> -->
</body>
</html>
```

## Welke page-CSS per sectie

| Sectie | page-CSS |
|--------|----------|
| Home | `/css/pages/home.css` |
| Werken & Leren + alle subpagina's + BBL-niveaus | `/css/pages/werken-leren.css` |
| Zorgorganisaties overzicht | `/css/pages/organisaties.css` |
| Organisatie-detailpagina's | `/css/pages/org-detail.css` |
| Keuzehulp | `/css/pages/keuzehulp.css` |
| Solliciteren, bevestiging, contact | `/css/pages/formulieren.css` |
| Scholen, Over ons, legal | `/css/pages/home.css` (generiek, hero--compact + .prose) |

## Conventies

- Alle tekst is **Nederlands**.
- Geen em-dashes in de zichtbare tekst. Gebruik koppelteken `-` of komma.
- Elke pagina opent met een hero (`hero--home` op de homepage,
  `hero--compact` op subpagina's) en eindigt met een `cta-banner`.
- Subpagina's tonen bovenaan een `.breadcrumb`.
- Voeg scroll-reveals toe met `class="reveal"` (of `reveal--left/right/scale`,
  of `reveal--stagger` op een grid-wrapper).
- WordPress-comments meeschrijven: `<!-- WP TEMPLATE: ... -->`,
  `<!-- ACF: veld (type) -->`, `<!-- WP_LOOP: start/end -->`,
  `<!-- TEMPLATE_PART: components/....php -->`.
- Onduidelijk? Maak de logische keuze en plaats `<!-- TODO: ... -->`.
- Interne links zijn root-absoluut en eindigen op `/` (mapindex).

## Herbruikbare icoon-snippets (inline SVG, currentColor)

```html
<!-- pijl rechts -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- check -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- plus (FAQ-icoon) -->
<svg class="faq__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
<!-- play -->
<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
<!-- euro -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 8a6 6 0 1 0 0 8M5 11h10M5 14h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
<!-- gebouw / werk -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21V5l8-3v19M12 21h8V9l-8-2M8 8v.01M8 12v.01M8 16v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- school / boek -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7l9-4 9 4-9 4-9-4zM7 10v6c0 1 2 3 5 3s5-2 5-3v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- hart / zorg -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21C5 16 3 12 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 12 19 16 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
<!-- locatie -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>
```
