# Build instructions — reference page skeleton, opleidingindezorg.nl

This is the **reference page skeleton** OMA used to build the prototype.
Every `.html` page in the repo follows it. The header, footer, widget,
cookie notice and rotate notice are copied verbatim from the matching
file under `_partials/`.

For the WordPress developer this document is a reference, not a
prescription: the goal is that the resulting WordPress markup carries
the same component hooks (classes, IDs, `data-*` attributes) that the
JS and the editorial layer depend on. How the developer produces that
markup — template files, block patterns, custom blocks, or a hybrid —
is open.

## Path convention

All paths are **root-absolute** (`/css/...`, `/js/...`, `/keuzehulp/`).
This matches the WordPress target. The prototype is viewed locally via
a static server (see `/README.md`), not by opening files directly.

## Skeleton

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Page title] — Opleiding in de Zorg</title>
  <meta name="description" content="[unique description, 120-155 characters]">

  <!-- WP_OPTION: site_title | resolves to 'Opleiding in de Zorg' -->
  <!-- WP TEMPLATE: [filename].php -->

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
  <link rel="stylesheet" href="/css/pages/[PAGE].css">
  <!-- ONLY on /keuzehulp/: <link rel="stylesheet" href="/css/pages/keuzehulp.css"> -->
</head>
<body data-page="[slug]">

  <!-- >>> COPY HERE THE FULL CONTENTS OF _partials/header.html <<< -->

  <main id="main">
    ... page sections ...
  </main>

  <!-- >>> COPY HERE THE FULL CONTENTS OF _partials/footer.html <<< -->

  <!-- >>> COPY HERE THE FULL CONTENTS OF _partials/widget.html <<< -->
  <!-- >>> COPY HERE THE FULL CONTENTS OF _partials/cookie.html <<< -->
  <!-- >>> COPY HERE THE FULL CONTENTS OF _partials/rotate-notice.html <<< -->

  <!-- Scripts: every page loads the same set. Each script does
       nothing if its target elements are absent (safe guards). -->
  <script src="/js/nav.js"></script>
  <script src="/js/animations.js"></script>
  <script src="/js/footer.js"></script>
  <script src="/js/faq.js"></script>
  <script src="/js/filter.js"></script>
  <script src="/js/forms.js"></script>
  <script src="/js/widget.js"></script>
  <script src="/js/cookie.js"></script>
  <!-- ONLY on /keuzehulp/: <script src="/js/keuzehulp-ui.js"></script> -->
</body>
</html>
```

## Page-CSS per section

| Section | Page CSS |
|--------|----------|
| Home | `/css/pages/home.css` |
| Werken & Leren + all subpages + BBL levels | `/css/pages/werken-leren.css` |
| Zorgorganisaties overview | `/css/pages/organisaties.css` |
| Organisation detail pages | `/css/pages/org-detail.css` |
| Keuzehulp | `/css/pages/keuzehulp.css` |
| Solliciteren, bevestiging, contact | `/css/pages/formulieren.css` |
| Scholen, Over ons, legal | `/css/pages/home.css` (generic; hero--compact + .prose) |

## Conventions used by the prototype

- All visible content is **Dutch** (client copy).
- No em-dashes in visible text. Use a hyphen `-` or a comma.
- Each page opens with a hero (`hero--home` on the home page,
  `hero--compact` on subpages) and ends with a `cta-banner`. Three
  pages skip the hero deliberately: the two conversion confirmation
  pages and `/404.html`.
- Subpages show a `.breadcrumb` at the top.
- Scroll reveals via `class="reveal"` (or `reveal--left/right/scale`,
  or `reveal--stagger` on a grid wrapper).
- WordPress comments are written inline:
  `<!-- WP TEMPLATE: ... -->`, `<!-- ACF: field (type) -->`,
  `<!-- WP_LOOP: start/end -->`,
  `<!-- TEMPLATE_PART: components/....php -->`.
  The `ACF` comments are one reference implementation — see
  `ACF-FIELDS.md` and `DEVELOPER-HANDOVER.md §0` for the rationale.
- Unclear? Make the logical choice and add a `<!-- TODO: ... -->`.
- Internal links are root-absolute and end in `/` (folder index).

## Reusable icon snippets (inline SVG, currentColor)

```html
<!-- arrow right -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- check -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- plus (FAQ icon) -->
<svg class="faq__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
<!-- play -->
<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
<!-- euro -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 8a6 6 0 1 0 0 8M5 11h10M5 14h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
<!-- building / workplace -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 21V5l8-3v19M12 21h8V9l-8-2M8 8v.01M8 12v.01M8 16v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- school / book -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7l9-4 9 4-9 4-9-4zM7 10v6c0 1 2 3 5 3s5-2 5-3v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<!-- heart / care -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21C5 16 3 12 3 8.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 2.5C21 12 19 16 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
<!-- location pin -->
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>
```
