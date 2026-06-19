# Developer Handover — opleidingindezorg.nl

Prepared for the WordPress developer (Rain).

This document explains how to turn the static prototype in this folder into a
WordPress custom theme. The prototype is a complete, clickable HTML/CSS/JS
build of the website. All page content is in Dutch (client content); all
developer-facing comments in the code are in English.

---

## 1. Project overview

**opleidingindezorg.nl** is a regional BBL care-education platform for the
Amstelland & Meerlanden region (greater Amsterdam / Hoofddorp / Aalsmeer).
Care organisations across the region jointly offer BBL programmes (work and study at the
same time). Candidates are matched to the right organisation through the site.

- **Primary audience:** young people (16-25) and career changers who want to
  work in care.
- **Secondary audience:** HR staff at the participating organisations, MBO
  institutions, and other stakeholders.
- **Conversion goals:** the Keuzehulp (a guidance wizard) and the Direct
  Solliciteren (direct application) form.

The prototype is 32 fully linked pages. It is meant to be converted 1:1 into a
WordPress custom theme by a PHP developer.

### Tech stack

- Pure HTML5 / CSS3 / vanilla JavaScript. No frameworks, no build tools.
- One CSS file per concern + `tokens.css` + `global.css`.
- Vanilla JS for the mega menu, scroll animations, FAQ accordion, footer
  toggle, form behaviour, floating help widget, cookie notice, and the
  Keuzehulp wizard demo.
- Google Fonts via a CDN `<link>` in `<head>`.
- The only third-party runtime dependency is Google Fonts. The Keuzehulp
  wizard is built inline as a self-contained HTML/CSS/JS component (see
  section 7); the wizard-engine that drives the matching is delivered by
  an external developer and overlays this markup.

### Viewing the prototype

Pages use **root-absolute paths** (`/css/...`, `/zorgorganisaties/...`), just
like the final WordPress site, so opening a file directly with `file://` will
not resolve links. Serve the folder with a static server:

```bash
cd 03-prototype
python3 -m http.server 8000
# open http://localhost:8000
```

---

## 2. File structure

```
03-prototype/
├── index.html                     Home (front-page.php)
├── 404.html                        not-found page (404.php)
├── robots.txt                      crawl rules (WordPress/Yoast handles this)
├── sitemap.xml                     URL list (WordPress/Yoast generates this)
├── werken-en-leren/                Werken & Leren section
│   ├── index.html                 page.php (template: werken-leren)
│   ├── niveau-2|3|4/index.html     page.php (template: bbl-niveau)
│   └── toelatingseisen|salaris|faq/index.html   page.php
├── zorgorganisaties/
│   ├── index.html                 archive.php (post type: organisaties)
│   └── <org-slug>/index.html       single-organisaties.php
├── scholen/                        page.php
├── over-ons/                       page.php (contact = template: contact)
├── keuzehulp/index.html            page.php (template: keuzehulp-full)
├── solliciteren/
│   ├── index.html                  page.php (template: solliciteren)
│   └── bevestiging/index.html      page.php (confirmation page)
├── privacy|cookies|disclaimer|toegankelijkheid/index.html   page.php
├── css/
│   ├── tokens.css                  design tokens (load first)
│   ├── global.css                  reset, base, typography, utilities
│   ├── components.css              buttons, cards, forms, badges, steps, etc.
│   ├── animations.css              scroll-reveal classes, parallax, counter
│   ├── nav.css                     navigation + mega menu + mobile drawer
│   ├── footer.css                  footer
│   ├── widget.css                  floating help widget
│   ├── cookie.css                  cookie notice
│   └── pages/                      one stylesheet per page type
│       └── keuzehulp.css           wizard component (loaded only on /keuzehulp/)
├── js/
│   ├── nav.js                      mega menu, hamburger, sticky header
│   ├── animations.js               IntersectionObserver reveals, parallax, counter
│   ├── footer.js                   footer expand/collapse
│   ├── faq.js                      accordion
│   ├── filter.js                   org filters + view-toggle, result count
│   ├── forms.js                    validation, character counter, URL pre-fill
│   ├── widget.js                   floating help widget (open/close, view-switch, intro bubble)
│   ├── cookie.js                   cookie notice (consent state, customise view)
│   └── keuzehulp-ui.js             wizard presentation interactivity (only loaded on /keuzehulp/)
├── assets/logo/                    logo SVGs (teal, white, icon)
├── _partials/                      build sources, NOT part of the WP theme
│   ├── header.html                 canonical header markup -> header.php / nav.php
│   ├── footer.html                 canonical footer markup -> footer.php
│   ├── widget.html                 floating help widget -> widget.php
│   ├── cookie.html                 cookie notice -> cookie.php
│   ├── rotate-notice.html          mobile landscape notice -> rotate-notice.php
│   └── BOUWINSTRUCTIE.md            page skeleton used during the build
├── README.md                       Dutch project readme (for OMA)
├── DEVELOPER-HANDOVER.md            this file
└── ACF-FIELDS.md                   full ACF field reference per template
```

`_partials/` is the build source for `header.php` and `footer.php`. It is not a
shippable part of the theme; do not deploy it.

The header and footer markup is **identical on every page**. Lift it once into
`header.php` / `nav.php` and `footer.php`.

---

## 3. WordPress setup

The HTML carries machine-readable comments that mark the WordPress structure.
Search the code for these prefixes:

- `<!-- WP TEMPLATE: ....php -->` — which theme template the page becomes
- `<!-- WP TEMPLATE PART: ....php -->` — header / footer / nav partials
- `<!-- TEMPLATE_PART: components/....php -->` — reusable components (`get_template_part`)
- `<!-- ACF: fieldname (type) -->` — an Advanced Custom Fields field
- `<!-- WP_LOOP: start / end -->` — where a query loop runs
- `<!-- WP_QUERY_FILTER: taxonomy ... -->` — filter inputs bound to a taxonomy
- `<!-- CPT: ... -->` and the `WORDPRESS CUSTOM POST TYPE` block — the custom post type
- `<!-- WP_MENU: ... -->` — a nav menu location to register
- `<!-- WP_OPTION: ... -->` — a site-wide option
- `<!-- TODO: ... -->` — content or work still outstanding (see section 8)

### 3.1 Templates to create

| Template file | Used by |
|---|---|
| `front-page.php` | Home |
| `404.php` | not-found page (`404.html` in the prototype) |
| `page.php` | generic subpages (scholen, over-ons, legal pages) |
| `header.php`, `nav.php`, `footer.php` | template parts, identical site-wide |
| `archive.php` | zorgorganisaties overview (post type `organisaties`) |
| `single-organisaties.php` | the organisation detail pages |
| Page Templates: `werken-leren`, `bbl-niveau`, `keuzehulp-full`, `solliciteren`, `contact` | registered via the Template Name header in dedicated `page-*.php` files |

The organisation detail pages all share **one** template
(`single-organisaties.php`); their differences come entirely from ACF field
values, not from markup.

### 3.2 Custom post type — managing the organisations

The care organisations are the part of the site the client edits most
often: an organisation joins, leaves, changes its description, swaps a photo
for a video. **This must be a first-class, self-contained task in wp-admin —
not page editing.**

Register one custom post type, `organisaties`, in `functions.php`:

```php
register_post_type( 'organisaties', [
    'public'        => true,
    'has_archive'   => true,        // -> archive.php (the overview page)
    'show_in_menu'  => true,        // its own top-level item in the admin sidebar
    'menu_icon'     => 'dashicons-groups',
    'menu_position' => 5,
    'labels'        => [ /* "Organisaties", "Nieuwe organisatie", etc. */ ],
    'supports'      => [ 'title' ], // title only; everything else is ACF
    'rewrite'       => [ 'slug' => 'zorgorganisaties' ],
] );
```

This gives the admin a dedicated **"Organisaties"** item in the wp-admin
sidebar. The whole lifecycle happens there:

- **Add** an organisation — "Nieuwe organisatie", fill in the ACF fields, Publish.
- **Edit** — open the organisation, change fields, Update.
- **Remove / hide** — set the post to Draft or Trash. The loop-driven
  listings (archive, home grid, "Andere zorgorganisaties" block, deelnemers
  grid) then drop the organisation automatically. The hand-built lists
  (mega menu, footer column, application-form checkboxes) need a manual
  edit. See section 10 for the current participant set.

The admin never touches the WordPress **page editor** or the Gutenberg block
canvas for an organisation. To make that explicit and prevent mistakes:

- Set `'supports' => [ 'title' ]` so the content/block editor is not even shown
  on the organisation edit screen — only the title field and the ACF fields.
- Keep **all** organisation content in ACF fields (section 3.3 / `ACF-FIELDS.md`),
  so the edit screen reads as a simple, labelled form.
- The detail-page layout lives entirely in `single-organisaties.php`. All
  organisations share that one template; their differences come only from ACF
  values. The admin changes data, never markup.

Each organisation is one `organisaties` post. The overview
(`archive.php`) loops them; each detail page is the `single` view; the home
page and the "Andere zorgorganisaties" block on every detail page loop the
same post type.

#### Taxonomies (overview + detail-page filter)

| Taxonomy | Terms |
|---|---|
| `org_type` | klein, middelgroot, groot |
| `bbl_niveau` | niveau-2, niveau-3, niveau-4 |
| `werkplek` | verpleeghuis, thuiszorg, revalidatie |

These power two filters: the organisations overview page (`archive.php`) and
the **"Andere zorgorganisaties"** block at the bottom of every detail page.
Register them with `show_admin_column => true` so the admin can also filter the
organisations list inside wp-admin.

#### Open dagen — a second custom post type

Open days and information evenings are event content the client adds and
removes often, so they get the same treatment as organisations: a custom post
type `open_dagen` with its own **"Open dagen"** item in the wp-admin sidebar.
The admin never edits the `/scholen/open-dagen/` page itself — they add an open
day, fill in the fields, Publish.

```php
register_post_type( 'open_dagen', [
    'public'       => true,
    'show_in_menu' => true,
    'menu_icon'    => 'dashicons-calendar-alt',
    'supports'     => [ 'title' ],   // title only; the rest is ACF
] );
```

Fields per open day (ACF, see `ACF-FIELDS.md`): `datum`, `tijd`, `locatie`,
`organisatie` (a relation to an `organisaties` post), `beschrijving` and
`meer_info_url`.

- **`meer_info_url`** drives the "Meer informatie" button on each card. Render
  it as `<a href="{meer_info_url}" target="_blank" rel="noopener">`. In the
  prototype the button is intentionally inert (it has no `href` and is marked
  `aria-disabled="true"`); wire it to the field.
- The overview at `/scholen/open-dagen/` has a **grid / list view toggle** the
  visitor controls. It is pure front-end: `js/filter.js` toggles
  `.org-grid--list` on the `#agenda-grid` element. Keep the toolbar markup; no
  server work needed.

### 3.3 ACF field groups

Create these ACF field groups (full field list with types in `ACF-FIELDS.md`):

- **Hero fields** — `hero_title`, `hero_subtitle`, `hero_video_url`. Attach to
  the relevant page templates. `hero_video_url` now also feeds the video in the
  scholen and over-ons heroes; `toelatingseisen` instead shows a callout beside
  the hero text (`hero_callout_titel`, `hero_callout_tekst`).
- **Archive intro** — `archive_title`, `archive_intro`. For the
  organisaties archive.
- **Organisation fields** — all `org_*` fields. Attach to the `organisaties`
  post type. This is the largest group and includes two repeaters
  (`org_locaties`, `org_arbeidsvoorwaarden`).
- **Open dag fields** — `datum`, `tijd`, `locatie`, `organisatie`,
  `beschrijving`, `meer_info_url`. Attach to the `open_dagen` post type.
- **Site options** — `site_logo`, best placed on an ACF Options page so it
  is editable site-wide. (The wizard no longer needs a `keuzehulp_wizard_url`
  option: it is inline markup — see section 7.)

### 3.4 Menu locations

Register two nav menu locations in `functions.php`:

| Location slug | Label | Used in |
|---|---|---|
| `primary` | Primary navigation | `nav.php` (desktop + mobile + mega menu) |
| `footer` | Footer navigation | `footer.php` |

Note: the mega menu has a richer structure than a standard WP menu (featured
panels with copy and CTAs). The simplest route is to keep the mega-menu markup
in `nav.php` as a hand-built template part, and use the registered `primary`
menu only for the mobile drawer. Discuss with OMA if a fully menu-driven mega
menu is required.

### 3.5 Site title option

`<!-- WP_OPTION: site_title -->` marks where the site title is printed. It
becomes `Opleiding in de Zorg` via `get_bloginfo('name')` or an ACF option.

---

## 4. ACF fields per template (summary)

Full reference with field types and descriptions is in **`ACF-FIELDS.md`**.
Summary:

| Template | Key ACF fields |
|---|---|
| `header.php` (all pages) | `site_logo` |
| `front-page.php` | `hero_title`, `hero_subtitle`, `hero_video_url` + `organisaties` loop |
| `page.php` (generic) | `hero_title`, `hero_subtitle` |
| `werken-leren` template | `hero_title`, `hero_subtitle`, `hero_video_url` |
| `bbl-niveau` template | `hero_title`, `hero_subtitle`, `hero_video_url` (level-specific) |
| `archive.php` | `archive_title`, `archive_intro` |
| `single-organisaties.php` | all `org_*` fields (see ACF-FIELDS.md) |
| `solliciteren` / `contact` templates | `hero_title`, `hero_subtitle` |
| `page.php` (scholen/open-dagen) | `hero_title`, `hero_subtitle` + `open_dagen` loop |
| `keuzehulp-full` template | none — the wizard is inline markup, see section 7 |

---

## 5. CSS architecture

Load order matters. Enqueue in `functions.php` in this order:

1. `tokens.css` — CSS custom properties (colors, spacing, radius, shadows). No
   rules, only `:root` variables.
2. `global.css` — reset, base, typography scale, layout utilities.
3. `components.css` — all reusable components.
4. `animations.css` — scroll-reveal classes + reduced-motion handling.
5. `nav.css`, `footer.css`.
6. `widget.css` — floating help widget (every page).
7. `cookie.css` — cookie notice (every page).
8. The matching `css/pages/*.css` for the current template.
   `css/pages/keuzehulp.css` is loaded **only** on the keuzehulp template.

Class naming is BEM-like (`block__element--modifier`). Class names are in a
mix of English and Dutch; **do not rename them** — the JS depends on several of
them.

### Responsive behaviour

- The layout is mobile-first; columns are added through `min-width` media
  queries. Section spacing graduates with the viewport (phone / tablet /
  desktop) and the phone spacing scale is tightened in `tokens.css` so
  pages stay short. The full desktop navigation appears at >=1024px;
  tablets use the mobile navigation drawer.
- On phone-sized screens held in **landscape**, a full-screen overlay
  (`.rotate-notice`, the `rotate-notice.php` template part) asks the visitor
  to rotate to portrait. It is pure CSS: an `orientation: landscape` media
  query bounded by `max-height` so tablets are not affected. No JavaScript.
- Section backgrounds use soft gradients; the mega menu columns cascade in,
  and buttons and cards have hover and press transitions. All motion is
  disabled under `prefers-reduced-motion`.

### SEO & social

Each page `<head>` carries, besides the title and meta description:
Open Graph + Twitter Card tags, a `rel="canonical"`, and JSON-LD schema
(`EducationalOrganization` site-wide, `BreadcrumbList` per page,
`FAQPage` on the two FAQ pages). `robots.txt` and `sitemap.xml` sit in
the root. The 404 page is `noindex` and has none of this.

In WordPress this is **Yoast SEO's** job: it generates the social tags,
canonicals, breadcrumb schema and the XML sitemap. The static tags show
the intended values. Two things still need a real value: the
`og:image` asset (`/assets/og-image.jpg`, 1200x630) and the
`EducationalOrganization` `sameAs` profiles.

---

## 6. JavaScript

Nine small vanilla scripts. Eight are loaded on every page; `keuzehulp-ui.js`
is loaded **only** on the `/keuzehulp/` page. Each script guards itself: if
its target elements are not on the page, it does nothing. Load before
`</body>`:

| Script | Loaded on | Responsibility |
|---|---|---|
| `nav.js` | every page | mega menu (hover intent + click), hamburger drawer, sticky header, active-section state |
| `animations.js` | every page | IntersectionObserver scroll reveals, stagger, number counter, parallax |
| `footer.js` | every page | footer expand/collapse |
| `faq.js` | every page | accordion (one panel open at a time, animated max-height) |
| `filter.js` | every page | grid/list view toggle (org overview `#org-grid` + open-dagen `#agenda-grid`); client-side organisation filters (type / niveau / werkplek) on the overview and the "Andere zorgorganisaties" block, with live result count and empty state |
| `forms.js` | every page | form validation, textarea character counter, `?org=` pre-fill, hidden source field |
| `widget.js` | every page | floating help widget: open/close, view-switching between the three choices, intro bubble |
| `cookie.js` | every page | cookie notice: consent state, customise view, persistence in localStorage |
| `keuzehulp-ui.js` | `/keuzehulp/` only | wizard presentation interactivity (see section 7); demo layer that the external wizard developer replaces or wraps |

In WordPress, enqueue these with `wp_enqueue_script` in the footer. No
dependencies, no jQuery. Enqueue `keuzehulp-ui.js` conditionally on the
keuzehulp template only.

The form filter on the organisaties overview is intentionally **not
functional** in the prototype. Wire it up to a `WP_Query` with a `tax_query`
on `org_type`, `bbl_niveau`, and `werkplek`.

---

## 7. Keuzehulp wizard integration

### 7.1 Where the wizard lives

The Keuzehulp wizard is **inline HTML**, built directly into the template
markup. There is **no iframe**.

- **Standalone page:** `/keuzehulp/` renders the wizard inline in the page
  flow (`<div class="kh-wizard">…12 screens + apply modal…</div>`). The hero
  above it and the keuzehulp-note below it are normal page content.
- **Floating widget:** the float (`_partials/widget.html`) **no longer
  contains the wizard**. Its "Hulp bij het kiezen" entry is a simple
  `<a href="/keuzehulp/">` link.

So: one wizard, one canonical place (`/keuzehulp/`), reached from the float
via a plain link.

### 7.2 What lives in this repo (yours) vs. what an external developer adds

This handover delivers the **frontend** of the wizard:

| Part | File | Yours to keep |
|---|---|---|
| Inline markup (12 screens, options, apply modal) | the body of `keuzehulp/index.html` (a `.kh-wizard` block) | Yes — render the same markup from the template, do not "clean up" or restructure it. |
| Styling | `css/pages/keuzehulp.css` | Yes — token-driven, no external assets. Enqueue on the keuzehulp template only. |
| Presentation demo JS | `js/keuzehulp-ui.js` | Optional — the external wizard developer either replaces this with the real engine, or wraps it. Enqueue conditionally on the keuzehulp template. |

The **wizard engine** (scoring, real matching, persistence, follow-up
e-mail / system integration) is delivered by an external developer, separate
from this WordPress theme. That developer overlays this frontend: they take
over the markup as a presentation contract and hang their own state engine
on it.

> **Looking for the full wizard reference?** A separate `WIZARD-HANDOVER.md`
> in the repo root spells out every screen ID, option key, conditional
> hook, and modal contract. Use this section for the integration overview;
> use that document when porting the markup or talking to the wizard
> developer.

### 7.3 The markup contract (do not touch)

These markup hooks are an agreement with the external wizard developer. They
must be preserved verbatim when the static HTML becomes the WordPress
template:

| Hook | Meaning |
|---|---|
| `class="kh-wizard"` | the wizard root element |
| `<section class="kh-screen" data-screen="…">` | one of 12 screens; `data-screen` IDs are: `start`, `naam`, `1`, `2`, `3`, `contact`, `4`, `5`, `6`, `loading`, `result`, `bedankt` |
| `<button class="kh-option" data-value="…" aria-pressed="…">` | a choice card; `data-value` is the option-key the engine reads |
| `<div class="kh-options" data-multi="true">` | a multi-select group (vs. single-select when `data-multi` is absent) |
| `[data-conditional="postcode"]`, `[data-conditional="niveau"]` | conditional blocks that appear after specific answers |
| `[data-note="default"]`, `[data-note="nee"]` | the diploma info notes on screen 4 |
| `class="kh-modal"` + `[data-action="apply"]` + `[data-modal-org]` | the apply modal triggered from a result card |
| `[data-name-token]` | inline span where the entered first name is injected |
| `[data-action="next" | "prev" | "start" | "apply"]` | the presentation action verbs |

Rain (WordPress) should treat this markup as **read-only**. Do not rename
classes, drop attributes, "clean up" duplicate-looking blocks, or refactor
the structure. The external developer relies on it.

### 7.4 What `keuzehulp-ui.js` does (and why it can be replaced)

`js/keuzehulp-ui.js` is a presentation demo: it wires up screen transitions,
single/multi-select highlighting, the conditional reveals, a progress bar,
per-screen Next-button validation, the loading → result transition, and the
apply modal. It does **no scoring, no matching, no data persistence**.

The external wizard developer either:

- replaces this script with the real engine (same DOM contract), or
- loads on top of it and overrides the bits they need.

Either way, Rain enqueues `keuzehulp-ui.js` on the keuzehulp template by
default; the wizard developer can dequeue it or override it later.

### 7.5 Direct sollicitatie pre-fill (unchanged)

The application form pre-fills the selected organisation from a URL
parameter: links such as `/solliciteren/?org=amstelring` tick the matching
checkbox. Handled in `js/forms.js`; keep the `?org=` slug contract intact
when wiring up the real form.

---

## 8. Brand: colors and fonts

All values live in `css/tokens.css` as CSS custom properties.

### Colors

| Token | Hex | Use |
|---|---|---|
| `--teal` | `#32AC98` | primary brand color |
| `--teal-dark` | `#1C7A6E` | hover / dark accent |
| `--teal-light` | `#A8E0D8` | light accent |
| `--teal-bg` | `#E8F7F5` | tinted backgrounds |
| `--teal-border` | `#C0E8E2` | tinted borders |
| `--warm` | `#F8F5F0` | page background |
| `--charcoal` | `#1C2B3A` | primary text, dark CTA, footer |
| `--mid` | `#4A6572` | secondary text |
| `--muted` | `#8AABBA` | placeholders, captions, labels |
| `--rule` | `#E0ECEA` | borders |
| `--white` | `#FFFFFF` | surfaces |
| `--off-white` | `#F4F4F4` | subtle surfaces |

### Fonts (Google Fonts)

- **DM Sans** — body text, UI, labels (`--font`).
- **DM Serif Display** — display headings (`--serif`).

Loaded via a single CDN `<link>` in `<head>`. If self-hosting is preferred for
performance or privacy, swap the `<link>` for locally hosted webfonts and keep
the `--font` / `--serif` token values.

---

## 9. Outstanding TODOs

Every item below is also marked inline with a `<!-- TODO: ... -->` comment.
Find them all with `grep -rn "TODO" .` These are content/decisions for OMA and
the client, not theme bugs.

| Area | What is needed |
|---|---|
| Salary figures | Indicative amounts used for BBL levels 2/3/4. Confirm against the current VVT collective labour agreement (cao VVT). Pages: werken-en-leren index, niveau-2/3/4, salaris. |
| Organisation copy | The "Wie zijn wij?" intro texts on the organisation detail pages were written from each organisation's official website and should still be confirmed by the organisations. Employment benefits and locations are still placeholder. |
| Filter bar | Works client-side in the prototype (`js/filter.js`, driven by `data-org-*` attributes on the cards). In WordPress replace it with a `WP_Query` `tax_query` (`org_type` / `bbl_niveau` / `werkplek`). |
| Social image | `og:image` points to `/assets/og-image.jpg`; supply a real 1200x630 share image. |
| Open days | Open days are a custom post type (`open_dagen`); the admin adds them via the "Open dagen" admin screen. Example dates/locations used, final agenda to be supplied. The "Meer informatie" button stays inert until each event's `meer_info_url` field is filled (it opens in a new tab). |
| Organisation count | The organisation total is shown as a count in two places: the overview result count (`#org-count`) and the over-ons "In cijfers" stat. Neither is hardcoded copy; each must be wired to the live `organisaties` post count (`$query->found_posts` / `wp_count_posts('organisaties')->publish`) so it updates by itself when an organisation is added or removed. |
| Contact details | The contact details on the contact page are placeholder. |
| Legal pages | privacy, cookies, disclaimer, toegankelijkheid contain plausible but not legally reviewed text. |
| Org work locations | Detail pages show work locations as a plain list (name + address), rendered only when an organisation has more than one location. No map. Provide the real location data per organisation. |
| Org hero media | Each detail page hero shows either a photo or a video, the admin's choice per organisation. Prototype uses a placeholder. Supply the real photo or video per organisation. |
| Forms | There are two forms: Direct Solliciteren and Contact. Build them in WordPress with Gravity Forms. Each form redirects to a dedicated thank-you page so submissions can be tracked as conversions: solliciteren goes to /solliciteren/bevestiging/, contact goes to /over-ons/contact/bedankt/. |

---

## 10. Participating organisations — what is and is not on the site

Six care organisations are first-class on the site, each as an
`organisaties` post with a full detail page:

- Amstelring
- Brentano
- PCSOH
- Zonnehuisgroep Amstelland
- Zorgcentra Meerlanden
- Zorggroep Aelsmeer

Two organisations that appear in the regional collaboration but **not** as
employers / BBL providers on this site:

- **Sigra** — a regional collaboration network, not a care employer. No
  detail page. Sigra appears only as a logo + short partner blurb on
  `/over-ons/deelnemers/`.
- **Cordaan** — fully removed from the prototype (no detail page, no mega
  menu entry, no footer link, no sitemap). If Cordaan joins later, add a
  new `organisaties` post; loop-driven listings pick it up automatically.

---

## 11. Quality status of the prototype

Verified before handover:

- All 32 pages return HTTP 200; no broken internal links.
- Header and footer are functionally identical on every page.
- All four mega menus present and consistent on every page.
- Application form: validation, `?org=` pre-fill, and redirect to the
  confirmation page all work.
- FAQ accordion, footer toggle, mobile drawer, sticky header, scroll
  animations all work.
- `prefers-reduced-motion` is respected.
- No external runtime dependencies beyond Google Fonts.

---

## 12. Site-wide layout decisions to preserve

These are deliberate choices the client signed off on. They look like
inconsistencies at a glance; do not "normalise" them.

### 12.1 Footer has two variants

The standard footer carries a CTA row above the link grid
(`<div class="footer__cta">…Klaar om te starten in de zorg?…</div>`).
Two pages drop that CTA row deliberately: **`/keuzehulp/`** and
**`/solliciteren/`**. Both pages already are the conversion; the CTA row
would push the visitor back to the same conversion, on the same page.

When you lift the footer into `footer.php`, render the CTA row
conditionally — hide it on `is_page('keuzehulp')` and `is_page('solliciteren')`
(and on the bevestiging confirmation page, also a conversion target).

### 12.2 "Voor professionals" lives in the footer only, not the mega menu

The mega menu Over ons only carries the candidate-facing links (Over ons,
Waarom samenwerken, Deelnemende organisaties, Contact, FAQ). The
"Voor professionals" links (Voor zorgorganisaties / Voor opleidingsinstituten)
sit only in the footer.

Reason from the client: the site is a candidate-facing recruitment site;
mixing a professionals path into the main navigation confused candidates.
The footer is the discreet place where stakeholders find their way in.

### 12.3 Home region-band — pill-chip component

The region band directly under the hero on the home page is a
self-contained markup component, not ACF-driven. It renders the eight
municipalities (Aalsmeer, Amstelveen, Badhoevedorp, Hoofddorp,
Nieuw-Vennep, Ouderkerk aan de Amstel, Uithoorn, Zwanenburg) as pill-chips
with a small pin icon each, under a centred serif title.

If the client wants the list of municipalities editable later, model it as
a repeater (`region_plaats` — Text) on an ACF Options page and loop the
chips. Markup and CSS hooks already in place: `.region-band__chips > li.region-chip`.

---

## 13. Editorial decisions from the review rounds

The visible copy on several pages was reworked through two review rounds
with the project group (May - June 2026). A few of these are
counter-intuitive enough that they tend to get "fixed" back. Do not undo:

- **Niveau 2 helpende copy** — rewritten from the previous "eerste gezicht"
  framing to a daily-care / observe-and-signal / collaborate framing.
- **Niveau 4 — mbo-Verpleegkundige** — the term `mbo-Verpleegkundige` is
  used consistently (mega menu, footer, h1, body, salaris card). It is not
  called "Verpleegkundige" without the prefix; it is not "the highest BBL
  level"; the word "specialist" is avoided (a separate registered title).
- **Diploma niveau 2 nuance** — diploma is required to enter the *opleiding*
  (Nova as basis: mbo 1, vmbo basis, or another accredited proof). Without
  a diploma the candidate is welcome for a *gesprek*; the route is decided
  together with the organisation and the school. Copy is phrased that way
  everywhere; do not regress to "no diploma needed".
- **Fulltime, not parttime** — the FAQ asks *Kan ik fulltime werken en
  leren?* (was: parttime). Answer: "Dat kan. Fulltime is 36 uur.
  Gebruikelijk bij BBL is 3 dagen praktijk en 1 dag school. Dit geldt bij
  alle deelnemende organisaties."
- **Voorwerktraject** — both the FAQ and the `/scholen/hoe-werkt-het/`
  process page mention that candidates can start earlier via a
  voorwerktraject. Keep the callout under the four steps.
- **Workplace types** — "verpleeghuis or thuiszorg" everywhere;
  "woonzorgcentrum" is deliberately not used.
- **BBL vs BOL** — there is no `/werken-en-leren/bbl-vs-bol/` page anymore.
  The difference is briefly mentioned in the FAQ. Do not reintroduce a
  comparison section on the Werken & Leren overview.

If any of these surface as questions during the build, route them through
OMA, not back-channel through the project group.
