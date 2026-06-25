# opleidingindezorg.nl — clickable prototype

Clickable HTML/CSS/JS prototype for the regional BBL care-education
platform **opleidingindezorg.nl** (Amstelland & Meerlanden). Built as a
1-to-1 convertible framework for a WordPress custom theme.

Built by Online Marketing Amsterdam (OMA), May 2026. This is OMA's
project README; OMA maintains the prototype, the WordPress developer
converts it.

## Viewing the prototype

Pages use **root-absolute paths** (`/css/...`, `/zorgorganisaties/...`),
just like the final WordPress site. Double-clicking an `.html` file
therefore does not resolve the links; serve the folder via a local
static server:

```bash
cd 03-prototype
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser. Click through;
everything works: mega menu, mobile menu, footer toggle, FAQ accordion,
form validation, scroll animations.

## What is in here

32 pages, fully cross-linked:

- **Home** (`index.html`)
- **Werken & Leren** — overview + 3 BBL levels + 3 info pages
  (toelatingseisen, salaris, FAQ)
- **Zorgorganisaties** — overview with filter bar + 6 organisation
  detail pages
- **Scholen** — overview + how-it-works + open days
- **Over ons** — overview + collaboration + participants + contact
- **Keuzehulp** — wizard inline on the page (no iframe); the floating
  widget links to it
- **Solliciteren** — form + confirmation page
- **Legal** — privacy, cookies, disclaimer, accessibility

## Structure

```
03-prototype/
├── index.html              Home
├── css/                    tokens, global, components, animations, nav, footer, widget, cookie
│   └── pages/              per-page stylesheets (incl. keuzehulp.css, loaded only on /keuzehulp/)
├── js/                     nav, animations, footer, faq, filter, forms, widget, cookie, keuzehulp-ui (vanilla)
├── assets/                 logos and images (logos in /logos/, page images in /images/)
├── _partials/              canonical header, footer, widget, cookie, rotate-notice + build reference (not pages)
└── [sections]/             every page as a folder with index.html
```

`_partials/` is **not** part of the WordPress build — it is the source
for `header.php`, `footer.php` and the build reference document.

## Tech

Pure HTML5 / CSS3 / vanilla JavaScript. No frameworks, no build tools.
The only external runtime dependency is Google Fonts (DM Sans + DM
Serif Display) via CDN. The Keuzehulp wizard sits inline on
`/keuzehulp/` (12 screens + apply modal); an external wizard developer
later hooks their engine into the markup.

## WordPress conversion

Every page carries machine-readable comment blocks that mark the
WordPress structure:

- `<!-- WP TEMPLATE: ...php -->` — which template file
- `<!-- WP TEMPLATE PART: header.php / footer.php / nav.php -->`
- `<!-- ACF: fieldname (type) -->` — editable fields (one reference
  implementation; see `ACF-FIELDS.md` for the full editability
  inventory and the developer choice between ACF / native blocks /
  patterns / `theme.json`)
- `<!-- WP_LOOP: start / end -->` — repeating content
- `<!-- CPT: organisaties -->` — the custom post type for organisations

The header and footer are identical on every page, ready to lift into
`header.php` and `footer.php`. The 6 organisation pages share one
template (`single-organisaties.php`); the overview becomes `archive.php`.

For the WordPress developer:
- **`DEVELOPER-HANDOVER.md`** — full handover document, including the
  roles-and-scope section.
- **`WIZARD-HANDOVER.md`** — the Keuzehulp wizard markup contract.
- **`ACF-FIELDS.md`** — complete editability inventory and ACF
  reference implementation.
- **`IMAGE-MANIFEST.md`** — the 19 photos OMA delivers separately,
  plus the existing 7 organisation logos.
- **`_partials/BUILD-INSTRUCTIONS.md`** — reference page skeleton and
  conventions.

## Outstanding content items (TODOs in the code)

Searchable with `grep -rn "TODO" .` Summary:

- **Salary figures** — indicative; to be confirmed against the current
  VVT collective labour agreement (cao VVT).
- **Organisation texts** — the "Wie zijn wij?" intros are drafted from
  each organisation's official website and need their confirmation.
  Employment benefits and locations are still example copy.
- **Sigra** — not a care employer, but a regional collaboration
  network. No detail page; only a logo plus short partner note on
  `/over-ons/deelnemers/`.
- **Cordaan** — not present on the site (no detail page, no mega menu,
  no footer). If Cordaan joins later: add a new `organisaties` post.
- **Filter bar** — visual only in the prototype; wire to a `WP_Query`
  with a `tax_query` (`org_type` / `bbl_niveau` / `werkplek`).
- **Open dagen** — example dates and locations; final agenda to be
  supplied via the `open_dagen` CPT.
- **Contact details** — the contact-page details are placeholder.
- **Legal pages** — privacy, cookies, disclaimer and toegankelijkheid
  contain plausible but not legally reviewed copy.

## Quality status

Verified: 32 pages return HTTP 200, no broken internal links, the
header is byte-identical on every page (the footer has two intentional
variants: standard, and a lighter version without the call-to-action
row on `/keuzehulp/`, `/solliciteren/` and the bevestiging page), the
mega menus are complete, the application form has validation and the
`?org=` pre-fill, the FAQ accordion works, and there are no external
runtime dependencies beyond Google Fonts.
