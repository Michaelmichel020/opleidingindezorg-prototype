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

The prototype is 33 fully linked pages. It is meant to be converted 1:1 into a
WordPress custom theme by a PHP developer.

### Tech stack

- Pure HTML5 / CSS3 / vanilla JavaScript. No frameworks, no build tools.
- One CSS file per concern + `tokens.css` + `global.css`.
- Vanilla JS for the mega menu, scroll animations, FAQ accordion, footer
  toggle, and form behaviour.
- Google Fonts via a CDN `<link>` in `<head>`.
- The only third-party runtime dependency is Google Fonts. The Keuzehulp runs
  as an embedded iframe (see section 7).

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
├── werken-en-leren/                Werken & Leren section
│   ├── index.html                 page.php (template: werken-leren)
│   ├── niveau-2|3|4/index.html     page.php (template: bbl-niveau)
│   └── bbl-vs-bol|toelatingseisen|salaris|faq/index.html   page.php
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
│   └── pages/                      one stylesheet per page type
├── js/
│   ├── nav.js                      mega menu, hamburger, sticky header
│   ├── animations.js               IntersectionObserver reveals, parallax, counter
│   ├── footer.js                   footer expand/collapse
│   ├── faq.js                      accordion
│   ├── filter.js                   org + open-dagen view-toggle, result count
│   └── forms.js                    validation, character counter, URL pre-fill
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
- **Remove / hide** — set the post to Draft or Trash (see section 10 for the
  Cordaan launch case).

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
- **Site options** — `site_logo` and the Keuzehulp wizard URL, best placed on
  an ACF Options page so they are editable site-wide.

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
| `keuzehulp-full` template | wizard URL (recommended as an ACF option) |

---

## 5. CSS architecture

Load order matters. Enqueue in `functions.php` in this order:

1. `tokens.css` — CSS custom properties (colors, spacing, radius, shadows). No
   rules, only `:root` variables.
2. `global.css` — reset, base, typography scale, layout utilities.
3. `components.css` — all reusable components.
4. `animations.css` — scroll-reveal classes + reduced-motion handling.
5. `nav.css`, `footer.css`.
6. The matching `css/pages/*.css` for the current template.

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

---

## 6. JavaScript

Six small vanilla scripts, all loaded on every page. Each script guards itself:
if its target elements are not on the page, it does nothing. Load all six
before `</body>`:

| Script | Responsibility |
|---|---|
| `nav.js` | mega menu (hover intent + click), hamburger drawer, sticky header, active-section state |
| `animations.js` | IntersectionObserver scroll reveals, stagger, number counter, parallax |
| `footer.js` | footer expand/collapse |
| `faq.js` | accordion (one panel open at a time, animated max-height) |
| `filter.js` | grid/list view toggle for the organisation overview (`#org-grid`) and the open-dagen agenda (`#agenda-grid`); the organisation result count; the org filter dropdowns are a visual placeholder |
| `forms.js` | form validation, textarea character counter, `?org=` pre-fill, hidden source field |

In WordPress, enqueue these with `wp_enqueue_script` in the footer. No
dependencies, no jQuery.

The form filter on the organisaties overview is intentionally **not
functional** in the prototype. Wire it up to a `WP_Query` with a `tax_query`
on `org_type`, `bbl_niveau`, and `werkplek`.

---

## 7. Keuzehulp wizard integration

`/keuzehulp/` embeds an external application via an iframe. The iframe sits in
a contained, rounded panel (`.keuzehulp-embed`) in the normal page flow, so it
scrolls with the page; a normal hero and CTA banner surround it.

```html
<iframe src="https://opleidingindezorg-wireframes.netlify.app/"
        class="keuzehulp-frame" title="Keuzehulp"
        loading="lazy"></iframe>
```

Notes:
- The embedded app is separate and hosted separately. It is not part of this
  theme.
- Make the iframe `src` editable in WordPress (an ACF option, suggested name
  `keuzehulp_wizard_url`, or a theme constant) so the URL can change without a
  code edit.
- The application form pre-fills the selected organisation from a URL
  parameter: links such as `/solliciteren/?org=amstelring` tick the matching
  checkbox. This is handled in `js/forms.js`; keep the `?org=` slug contract
  intact when wiring up the real form.

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
| Sigra | Sigra is included as an organisation, but it is a regional collaboration network, not a care employer: you cannot apply or follow a BBL programme there. Its detail page keeps the standard layout, but the BBL-levels, employment-benefits and apply sections do not apply and are flagged with inline TODOs. Decide before launch how to present Sigra. |
| Cordaan | May need to be hidden at launch, see "Hiding Cordaan at launch" below. |
| Level 4 organisations | The set of organisations offering BBL level 4 needs confirmation. |
| Filter bar | Visual only in the prototype. Connect to `WP_Query` `tax_query` (`org_type` / `bbl_niveau` / `werkplek`). |
| Open days | Open days are a custom post type (`open_dagen`); the admin adds them via the "Open dagen" admin screen. Example dates/locations used, final agenda to be supplied. The "Meer informatie" button stays inert until each event's `meer_info_url` field is filled (it opens in a new tab). |
| Organisation count | The organisation total is shown as a count in two places: the overview result count (`#org-count`) and the over-ons "In cijfers" stat. Neither is hardcoded copy; each must be wired to the live `organisaties` post count (`$query->found_posts` / `wp_count_posts('organisaties')->publish`) so it updates by itself when an organisation is added or removed. |
| Contact details | The contact details on the contact page are placeholder. |
| Legal pages | privacy, cookies, disclaimer, toegankelijkheid contain plausible but not legally reviewed text. |
| Keuzehulp URL | Make the wizard iframe URL manageable in WordPress (ACF option or constant). |
| Org work locations | Detail pages show work locations as a plain list (name + address), rendered only when an organisation has more than one location. No map. Provide the real location data per organisation. |
| Org hero media | Each detail page hero shows either a photo or a video, the admin's choice per organisation. Prototype uses a placeholder. Supply the real photo or video per organisation. |
| Forms | There are two forms: Direct Solliciteren and Contact. Build them in WordPress with Gravity Forms. Each form redirects to a dedicated thank-you page so submissions can be tracked as conversions: solliciteren goes to /solliciteren/bevestiging/, contact goes to /over-ons/contact/bedankt/. |

---

## 10. Hiding Cordaan at launch

Cordaan may not have its BBL programme ready when the site goes live. The site
is built with Cordaan fully included; if it must be hidden at launch, here is
every place Cordaan appears:

1. **Detail page** `zorgorganisaties/cordaan/index.html` — in WordPress, set the
   `organisaties` post for Cordaan to **Draft** or **Private**. Loop-driven
   listings (the organisaties archive, the home page grid, the
   `over-ons/deelnemers` grid) then drop Cordaan automatically.
2. **Hand-built lists** that are not loop-driven and must be edited by hand to
   remove Cordaan:
   - the "Zorgorganisaties" mega menu in `nav.php` (header)
   - the organisations column in `footer.php`
   - the organisation checkboxes on the application form (`/solliciteren/`)

When Cordaan's programme is ready, set the post back to Published and restore
the hand-built references.

---

## 11. Quality status of the prototype

Verified before handover:

- All 33 pages return HTTP 200; no broken internal links.
- Header and footer are functionally identical on every page.
- All four mega menus present and consistent on every page.
- Application form: validation, `?org=` pre-fill, and redirect to the
  confirmation page all work.
- FAQ accordion, footer toggle, mobile drawer, sticky header, scroll
  animations all work.
- `prefers-reduced-motion` is respected.
- No external runtime dependencies beyond Google Fonts and the Keuzehulp
  iframe.
