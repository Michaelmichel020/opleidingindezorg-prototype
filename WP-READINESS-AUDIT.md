# WordPress readiness audit — opleidingindezorg.nl

Phase A research report. **No changes were made to the site or other docs in
this phase.** This document inventories where the prototype stands against the
client acceptance criterion:

> A non-technical administrator must be able to edit every visible text, every
> image, and the organisation and open-day data from wp-admin, without
> touching theme files.

The report is methodology-neutral: it says **which content should be editable
and where the prototype is currently silent about that**, not how the WordPress
developer should solve it. ACF is one valid implementation, native blocks /
block patterns / `theme.json` / custom blocks are equally valid.

---

## 1. Executive summary

| Metric | Value |
|---|---|
| Public pages audited | **31** (1 home + 7 W&L + 7 org + 3 scholen + 5 over-ons + 1 keuzehulp + 2 solliciteren + 4 legal + 1 `404.html`) |
| Pages returning HTTP 200 live | **31 / 31** |
| Broken internal links | **0** |
| Inline `<!-- ACF: ... -->` annotations across all pages | **85** |
| Visible text blocks across all pages (h1-h6, p, li, summary, button) | **771** |
| Visible blocks **not** preceded by an ACF annotation | **704** |
| Of those, blocks that are clearly editable content (real "content at risk") | **see §4 — approx. 250-300** |
| Media placeholders (`media-placeholder` + `video-placeholder`) | **45** |
| Forms (page-level) | **2** |
| Widget-level forms (vraag + solliciteren views) | **2** |
| Hard-coded numeric counts that should be dynamic | **2** (`data-count="6"` and `data-count="3"` in `/over-ons/`; one is correctly noted as "wire to live count" elsewhere) |
| Fields annotated in HTML but missing from `ACF-FIELDS.md` | **9 + 1 obsolete** |
| Manifest photos (19) referenced anywhere in the markup | **0** |
| Directory `assets/images/orgs/` exists | **No** |
| PCSOH logo format | `pcsoh.jpg` (no transparency — visible on the off-white card) |

**Bottom line:** every page renders, every link resolves, the canonical
header/footer/widget/cookie partials are byte-identical site-wide, the
Keuzehulp wizard contract is intact, and the form pipelines (slugs +
redirects) are consistent. **The gap is editability annotation.** Most page
templates have only `hero_title` + `hero_subtitle`/`hero_intro` annotated.
The rest of the visible content — section headings, body paragraphs,
pillars, FAQ items, salaris cards, "meer dan salaris" callouts, the regional
arbeidsvoorwaarden block, the deelnemers narrative, the Sigra partner blurb,
process steps, niveau-tile descriptions, callouts, "what's next" texts on
bedankt pages — has no annotation and would, in a naive port, land as theme
markup. That fails the acceptance criterion.

---

## 2. Methodology

- For each public page (`/review/` and `/sitemap/` skipped per briefing 4.1):
  the canonical header, footer, floating widget, cookie notice, rotate notice,
  and the inline keuzehulp wizard markup are stripped. Only `<main>` content
  is analysed for editability questions.
- "Visible text block" = any `<h1>-<h6>`, `<p>`, `<li>`, `<summary>`,
  `<button>` or `<figcaption>` whose stripped inner text is non-empty.
  Breadcrumb and visually-hidden blocks are excluded.
- "Annotated" = a `<!-- ACF: ... -->` comment occurs within ~400 characters
  before the block in the same page. This is a heuristic; some blocks are
  annotated at section-header level and govern several children below.
- Cross-reference: every `<!-- ACF: fieldname ... -->` inline comment site-wide
  is compared with the field list in `ACF-FIELDS.md`.
- Live sweep: `curl` against `https://opleidingindezorg-klikbaar-wireframe.netlify.app{path}`
  for each page; all returned 200.
- Internal link integrity: every root-absolute `href` in HTML compared
  against the set of existing page paths; 0 mismatches.

---

## 3. Per-page findings

Numbers below: **vis** = visible text blocks (raw); **acf** = inline ACF
annotations on the page; **ph** = media/video placeholders inside `<main>`;
**forms** = `<form action>` elements; **hero** = hero variant.

| Path | WP template | Hero | vis | acf | ph | forms |
|---|---|---|---:|---:|---:|---:|
| `/` | `front-page.php` | hero--home | 31 | 4 | 2 | 0 |
| `/werken-en-leren/` | `page.php` (werken-leren) | hero--compact | 32 | 3 | 1 | 0 |
| `/werken-en-leren/niveau-2/` | `page.php` (bbl-niveau) | hero--compact | 24 | 3 | 3 | 0 |
| `/werken-en-leren/niveau-3/` | `page.php` (bbl-niveau) | hero--compact | 24 | 3 | 3 | 0 |
| `/werken-en-leren/niveau-4/` | `page.php` (bbl-niveau) | hero--compact | 25 | 3 | 3 | 0 |
| `/werken-en-leren/toelatingseisen/` | `page.php` (werken-leren) | hero--compact | 23 | 4 | 2 | 0 |
| `/werken-en-leren/salaris/` | `page.php` (werken-leren) | hero--compact | 42 | 3 | 1 | 0 |
| `/werken-en-leren/faq/` | `page.php` (werken-leren) | hero--compact | 31 | 2 | 0 | 0 |
| `/zorgorganisaties/` | `archive.php` | hero--compact | 17 | 3 | 0 | 0 |
| `/zorgorganisaties/amstelring/` | `single-organisaties.php` | org hero | 46 | 5 | 4 | 0 |
| `/zorgorganisaties/brentano/` | `single-organisaties.php` | org hero | 46 | 5 | 4 | 0 |
| `/zorgorganisaties/pcsoh/` | `single-organisaties.php` | org hero | 48 | 5 | 4 | 0 |
| `/zorgorganisaties/zonnehuisgroep-amstelland/` | `single-organisaties.php` | org hero | 46 | 5 | 4 | 0 |
| `/zorgorganisaties/zorgcentra-meerlanden/` | `single-organisaties.php` | org hero | 46 | 5 | 4 | 0 |
| `/zorgorganisaties/zorggroep-aelsmeer/` | `single-organisaties.php` | org hero | 44 | 5 | 4 | 0 |
| `/scholen/` | `page.php` | hero--compact | 20 | 6 | 1 | 0 |
| `/scholen/hoe-werkt-het/` | `page.php` | hero--compact | 16 | 2 | 0 | 0 |
| `/scholen/open-dagen/` | `page.php` | hero--compact | 26 | 2 | 0 | 0 |
| `/over-ons/` | `page.php` | hero--compact | 17 | 3 | 2 | 0 |
| `/over-ons/samenwerking/` | `page.php` | hero--compact | 15 | 4 | 2 | 0 |
| `/over-ons/deelnemers/` | `page.php` | hero--compact | 8 | 3 | 1 | 0 |
| `/over-ons/contact/` | `page.php` (contact) | hero--compact | 20 | 2 | 0 | 1 |
| `/over-ons/contact/bedankt/` | `page.php` | none | 2 | 0 | 0 | 0 |
| `/keuzehulp/` | `page.php` (keuzehulp) | hero--compact | 8 | 2 | 0 | 0 |
| `/solliciteren/` | `page.php` (solliciteren) | hero--compact | 7 | 3 | 0 | 1 |
| `/solliciteren/bevestiging/` | `page.php` | none | 5 | 0 | 0 | 0 |
| `/privacy/` | `page.php` | hero--compact | 35 | 0 | 0 | 0 |
| `/cookies/` | `page.php` | hero--compact | 22 | 0 | 0 | 0 |
| `/disclaimer/` | `page.php` | hero--compact | 20 | 0 | 0 | 0 |
| `/toegankelijkheid/` | `page.php` | hero--compact | 23 | 0 | 0 | 0 |
| `/404.html` | `404.php` | hero--compact | 2 | 0 | 0 | 0 |

Three pages (`bedankt`, `bevestiging`, `404`) have zero hero by design.
The two widget-level Gravity Forms (vraag + solliciteren) inside
`_partials/widget.html` are not counted in the "forms" column because they
sit in the floating widget partial, not in `<main>`.

---

## 4. Content at risk of being hardcoded (type-c gaps)

This is the central finding. Listed per page; only the items that are clearly
**page-specific editable content** are called out. Generic CTA labels
("Vorige", "Volgende", "Direct Solliciteren"), navigation labels, and the
breadcrumb labels are treated as template chrome and not listed.

### 4.1 Home (`/`)

Currently annotated: `hero_title`, `hero_subtitle`, `hero_video_url`,
`bbl_video_url`. Not annotated:

- The four hero **trust pills** ("Salaris vanaf dag 1", "Drie dagen praktijk,
  één dag school", "Niet leeftijdsgebonden", "Ook zonder diploma welkom voor
  een gesprek") — short copy, but editorial.
- The **region-band** subtitle ("Werken en leren dicht bij huis, in de hele
  regio.") and the **eight place-name chips** (Aalsmeer … Zwanenburg).
- The **"Wat is BBL?"** section: section-eyebrow, h2, the three pillar titles
  + texts ("Werken én leren", "Salaris vanaf dag 1", "Een echte opleiding").
- The **"Alle zorgorganisaties, één platform"** section subtitle.
- The **"Het proces"** section title and the four step titles + descriptions
  (Aanmelden, Kennismaken, Match, Aan de slag).
- The **CTA banner** above the footer (title + copy + button labels).

### 4.2 Werken & Leren overview (`/werken-en-leren/`)

Currently annotated: `hero_title`, `hero_subtitle`, `hero_video_url`. Not annotated:

- The **"Kies je opleiding"** section: eyebrow, h2, subtitle, and the three
  niveau-tile titles + texts.
- The **toelatings-call-out** section ("Kun jij starten met een BBL-opleiding?")
  with its lead paragraph.
- The **salaris-grid** section: h2, lead, the three salaris-card amounts and
  notes. (See also §4.5 — same data appears on the salaris page.)
- The **"Goed om te weten over BBL"** pillars at the bottom.
- The CTA banner section.

### 4.3 Niveau 2/3/4 (`/werken-en-leren/niveau-2|3|4/`)

Currently annotated: `hero_title`, `hero_intro`, `hero_video_url`. Not annotated
(same pattern on all three pages):

- "Wat doet een [functie]?" h2 + the two-paragraph body.
- "Kun jij starten met niveau N?" h2 + subtitle + the bullet eisen-list (4
  items each).
- "Wat verdien je als [functie]?" h2 + salaris-card amount + note + the new
  **"meer dan salaris" callout** (lead + body) — added in a recent round, no
  field exists for it.
- "Jouw route na/rond/naar niveau N" h2 + subtitle + the growth-path nodes
  + the body paragraph.
- "Deze organisaties bieden niveau N aan" h2 + subtitle (the 6 org-tiles
  are loop-driven via the `organisaties` CPT, but the heading is content).

### 4.4 Toelatingseisen (`/werken-en-leren/toelatingseisen/`)

Currently annotated: `hero_title`, `hero_intro`, `hero_callout_titel`,
`hero_callout_tekst`, `niveau_illustratie`. Not annotated:

- The **section eyebrow + h2 + subtitle** for "Per niveau" / "Wat is handig
  om te hebben?".
- The three `<h3>` niveau-blocks (BBL Niveau 2 / 3 / 4) with their
  `eisen-list` items (4 per niveau = 12 list items of policy copy that the
  project group wrote).
- The **"Er is bijna altijd een route"** section (h2 + two body paragraphs).

### 4.5 Salaris (`/werken-en-leren/salaris/`) — largest cluster

Currently annotated: `hero_title`, `hero_intro`, `salaris_illustratie`. The
inline HTML comments also mention `salaris_n2`, `salaris_n3`, `salaris_n4`,
`vergoedingen` (repeater), and `arbeidsvoorwaarden_regio` (repeater) — none
of which exist in `ACF-FIELDS.md`. Not annotated visibly:

- The **three salaris-cards** (n2 €2.541, n3 €2.663, n4 €2.982) with their
  individual notes — currently hardcoded copy with the FWG-disclaimer.
- The **six "Vergoedingen en arbeidsvoorwaarden" pillars** (Reiskosten,
  Vakantiegeld, Eindejaarsuitkering, Opleiding+boeken, Doorbetaling lesdag,
  Pensioen) — h3 title + p text for each.
- The **six "Wat we als regio samen hebben geregeld" pillars** (Betaalde
  lesdag, Studietijd onder werktijd, Vaste werkbegeleiding, Jaarcontract,
  Leendevice, Geen terugbetaling) — h3 + p each.
- Each section's **eyebrow + h2 + subtitle**.
- The closing **"Geen studieschuld, wel inkomen"** section (h2 + two body
  paragraphs + callout title + callout text).

That's ~ 30 distinct editable text fragments on this single page, all
hardcoded.

### 4.6 FAQ (`/werken-en-leren/faq/`)

Currently annotated: `hero_title`, `hero_intro`. Not annotated:

- The three **column headers** (Algemeen, Salaris en arbeidsvoorwaarden,
  Aanmelden en starten).
- All **26 FAQ items**: question (in the `<button class="faq__trigger">`)
  + answer paragraph each. The matching JSON-LD `FAQPage` schema is
  duplicated separately at the top of the page; both copies must move
  together when edited.

### 4.7 Zorgorganisaties overview (`/zorgorganisaties/`)

Currently annotated: `archive_title`, `archive_intro`, and per-card
`org_naam` / `org_logo` / `org_url` / `org_tagline` / `org_type` in the
WP_LOOP. Not annotated:

- The **dark-strip CTA** ("Weet je niet welke bij je past? Laat de
  Keuzehulp je helpen.") with its button label.
- The **filter labels** themselves are select option labels (template chrome).
- The **"Over de schaalgrootte"** explanation paragraph (klein <500 / mid
  500-1000 / groot >1000 — referenced as policy by the project group).

### 4.8 Org detail pages (6 ×)

Annotated: `org_naam`, `org_tagline`, `org_beschrijving`, `org_logo`,
`org_hero_media_type`. The repeaters `org_locaties` and
`org_arbeidsvoorwaarden` are documented in `ACF-FIELDS.md` and loop-rendered.
Not annotated:

- The **fixed section h2s** (5 per page: "Wie zijn wij?", "[Org] in cijfers",
  "BBL-niveaus die we aanbieden", "Waar je aan de slag gaat", "Maak kennis
  met de collega's bij [Org]", "Wat we je bieden", "Andere zorgorganisaties").
- The **"In cijfers"** block: five `cijfer__num` + `cijfer__label` pairs.
  On 5 of 6 orgs these are placeholder values ("…"); on PCSOH the real
  numbers are filled. Either way the CPT model needs a field for this.
- The **"BBL-niveaus die we aanbieden"** intro paragraph (e.g. "Bij PCSOH
  kun je een BBL-opleiding volgen op niveau 2, 3 en 4.") and the three
  niveau-item titles + texts (Niveau 2 - Helpende … etc.).
- The **"Maak kennis"** subtitle line and the three verhaal-card titles.
- The **"Andere zorgorganisaties"** subtitle.

### 4.9 Scholen overview (`/scholen/`)

Annotated: `hero_title`, `hero_subtitle`, `hero_video_url`, `school_logo` (used
inside the school-card loop). Not annotated:

- The **section eyebrow + h2 + subtitle** for "Drie scholen / De
  MBO-instellingen waarmee onze zorgorganisaties samenwerken".
- The **three school cards** (ROCvA, Nova College, SVOZ): each has a title,
  description paragraph, and a CTA label ("Open dagen ROCvA" etc.).
- The bottom **"Verder lezen"** card-block (Het proces, Open dagen) — titles
  + descriptions + arrow labels.

### 4.10 Hoe werkt het (`/scholen/hoe-werkt-het/`)

Annotated: `hero_title`, `hero_subtitle`. Not annotated:

- The **four process steps** (Aanmelden, Kennismaken, Match, Aan de slag):
  title + description each.
- The **voorwerktraject callout** under the steps (title + body — recently
  added).
- The **"De rol van de school"** trio of cards at the bottom (Theorie/
  examinering, Praktijkbegeleiding, Afstemming op de regio).

### 4.11 Open dagen (`/scholen/open-dagen/`)

Annotated: `hero_title`, `hero_subtitle`. The cards in the agenda-grid are
fed by the `open_dagen` CPT (its fields are correctly documented). Not
annotated:

- The **page intro paragraph** above the agenda toolbar.
- The **fallback "geen open dagen"** placeholder block (currently rendered).

### 4.12 Over ons (`/over-ons/`)

Annotated: `hero_title`, `hero_subtitle`, `hero_video_url`. Not annotated:

- The **"Een regio, een gezamenlijke opdracht"** section: eyebrow + h2 +
  two body paragraphs.
- The **"In cijfers"** block (3 stats): each stat label ("Zorgorganisaties
  die samen opleiden", "BBL-niveaus", "Niveaus die werk en leren combineren").
- The **"Geen concurrenten, maar partners"** section: eyebrow + h2 + body.
- The **CTA banner** at the bottom.

### 4.13 Samenwerking (`/over-ons/samenwerking/`)

Annotated: `hero_title`, `hero_subtitle`, `hero_illustratie`,
`aanleiding_illustratie`. Not annotated:

- The **"Waarom samenwerken"** eyebrow + h2 + body paragraphs.
- The **"De aanleiding"** subsection h3 + body.
- The **dashboard-zin** block.

### 4.14 Deelnemers (`/over-ons/deelnemers/`)

Annotated: `hero_title`, `hero_subtitle`, `hero_illustratie`. The org-tiles
are CPT-loop-driven. Not annotated:

- The **"Deelnemende organisaties"** section eyebrow + body intro.
- The **Sigra partner section**: eyebrow + h2 + body paragraphs explaining
  why Sigra is on the page as partner, not employer.

### 4.15 Contact (`/over-ons/contact/`)

Annotated: `hero_title`, `hero_subtitle`. The contact form is Gravity Forms
(per briefing 3.2 — fixed). Not annotated:

- The **contactgegevens block** ("Opleiding in de zorg" + email + phone +
  postal address — all placeholder values).
- The **"Voor professionals" block** (h3 + intro + 2 prof-block cards for
  zorgorganisaties + opleidingsinstituten — each with name + role + contact).

### 4.16 Bedankt-pages (`/over-ons/contact/bedankt/`, `/solliciteren/bevestiging/`)

Both have no inline ACF annotations. Not annotated:

- The full **confirmation hero** (h1 + lead) and the **"wat gebeurt er nu"**
  block (h3 + ordered list of 3 steps on each page).

### 4.17 Keuzehulp (`/keuzehulp/`)

Annotated: `hero_title`, `hero_subtitle`. The inline wizard markup is the
contract with the external wizard developer (read-only per briefing 3.1).
Not annotated:

- The **"Let op" note** below the wizard ("kies je voor meerdere
  organisaties, dan neemt elke organisatie apart contact met je op").

### 4.18 Solliciteren (`/solliciteren/`)

Annotated: `hero_title`, `hero_subtitle`, plus a `pre-fill` doc note. Form
is Gravity Forms (fixed). Not annotated:

- The **"Direct solliciteren"** intro paragraph.
- The **"Wat gebeurt er na je sollicitatie"** ordered list (3 items).
- The **multi-org notice** ("elke aangevinkte organisatie neemt apart
  contact op").

### 4.19 Legal pages (`/privacy/`, `/cookies/`, `/disclaimer/`, `/toegankelijkheid/`)

Zero inline ACF annotations. Each page is a long-form legal document
(20-35 visible blocks each) with h1 + h2 sections, paragraphs and lists.
In practice this is usually a Gutenberg-edited page (single `the_content()`
in the template) rather than per-field ACF. Either approach satisfies the
acceptance criterion **provided** the prototype's structural markup is
preserved when the WordPress page is filled.

### 4.20 404 (`/404.html`)

`<h1>` ("Pagina niet gevonden") and one lead paragraph. Editable in WordPress
via the 404 template strings (theme i18n) or a 404 page in wp-admin —
either fine.

---

## 5. Documentation inconsistencies

### 5.1 Fields annotated in HTML but missing from `ACF-FIELDS.md`

| Field | Type (from HTML comment) | Annotated in | In ACF-FIELDS.md? |
|---|---|---|---|
| `bbl_video_url` | url | `/` | **No** |
| `hero_callout_titel` | text | `/werken-en-leren/toelatingseisen/` | **No** |
| `hero_callout_tekst` | textarea | `/werken-en-leren/toelatingseisen/` | **No** |
| `niveau_illustratie` | image | `/werken-en-leren/toelatingseisen/` | **No** |
| `salaris_illustratie` | image | `/werken-en-leren/salaris/` | **No** |
| `salaris_n2` / `n3` / `n4` | text | `/werken-en-leren/salaris/` (comment) | **No** |
| `vergoedingen` | repeater (titel, tekst) | `/werken-en-leren/salaris/` (comment) | **No** |
| `arbeidsvoorwaarden_regio` | repeater (icoon, titel, tekst) | `/werken-en-leren/salaris/` (comment) | **No** |
| `hero_illustratie` | image | `/over-ons/`, `/samenwerking/`, `/deelnemers/` | **No** |
| `aanleiding_illustratie` | image | `/over-ons/samenwerking/` | **No** |
| `school_logo` | image | `/scholen/` (loop) | **No** |

Plus `region_plaats` is suggested in `DEVELOPER-HANDOVER.md` §12.3 (as a
repeater on an ACF Options page for the home region-band chips) but does not
appear in `ACF-FIELDS.md`.

### 5.2 Fields in `ACF-FIELDS.md` that no longer apply

| Field | Issue |
|---|---|
| `keuzehulp_wizard_url` | Listed as Site Option for the wizard iframe URL. Removed in an earlier round — the wizard is now inline markup, no URL field needed. The doc still includes a note saying so; the table still lists the field. |

### 5.3 Naming inconsistency: `hero_subtitle` vs. `hero_intro`

Both names occur in HTML comments. Pages using `hero_subtitle`: home,
keuzehulp, over-ons (3), scholen (3), contact, solliciteren. Pages using
`hero_intro`: all Werken & Leren pages (overview, niveau 2/3/4, salaris,
toelatingseisen, faq). `ACF-FIELDS.md` mentions both and recommends
standardising on `hero_subtitle` — the prototype is still mixed. The
WordPress developer needs one canonical name.

### 5.4 `DEVELOPER-HANDOVER.md` references in current state

The handover doc still implies that some content is "templated, not field"
in places where the field should be added (e.g. niveau-pillar texts on the
W&L overview). The "Editorial decisions" section 13 lists copy that must
not regress — but those phrases are themselves currently un-annotated and
therefore vulnerable to exactly the regression the section warns about.

---

## 6. Placeholder inventory

Total 45 in-`<main>` placeholders:

- 17 in `media-placeholder` (photo slots)
- 28 in `video-placeholder` (which includes the 18 verhaal-card video tiles
  on org detail pages, 3 hero videos, 3 niveau hero videos, and a few others)

The 19-photo IMAGE-MANIFEST (briefing §5 B4) is **not yet referenced anywhere
in the HTML** — every placeholder is currently a generic `<div
class="media-placeholder"><span>Foto of illustratie</span></div>` without a
named target. Manifest-to-placeholder mapping required in Phase B (B4).

**Folder gap:** `assets/images/orgs/` does not exist yet. The 6 org-hero
manifest entries (manifest #14-#19) point there.

**Format flag:** `assets/images/logos/pcsoh.jpg` is the only JPG among the
seven org logos. On the off-white logo card it renders with a visible white
rectangle (no transparency channel). Already flagged to OMA, replacement
to be requested.

Detailed per-page placeholder mapping (heading they sit under → manifest
entry where known):

| Page | Section heading above | Manifest # | Type |
|---|---|---|---|
| `/` | Home compilation video | (video) | video-placeholder--hero |
| `/` | "Werken en leren tegelijk, zo werkt het" (bbl_video_url) | (video) | video-placeholder |
| `/werken-en-leren/` | Hero video | (video) | video-placeholder--hero |
| `/werken-en-leren/niveau-2/` | Hero video (level-specific) | (video) | video-placeholder--hero |
| `/werken-en-leren/niveau-2/` | "Wat doet een Helpende Zorg en Welzijn?" | **#1** | media-placeholder |
| `/werken-en-leren/niveau-2/` | "Kun jij starten met niveau 2?" | **#2** | media-placeholder |
| `/werken-en-leren/niveau-3/` | Hero video | (video) | video-placeholder--hero |
| `/werken-en-leren/niveau-3/` | "Wat doet een Verzorgende IG?" | **#3** | media-placeholder |
| `/werken-en-leren/niveau-3/` | "Kun jij starten met niveau 3?" | **#4** | media-placeholder |
| `/werken-en-leren/niveau-4/` | Hero video | (video) | video-placeholder--hero |
| `/werken-en-leren/niveau-4/` | "Wat doet een mbo-Verpleegkundige?" | **#5** | media-placeholder |
| `/werken-en-leren/niveau-4/` | "Kun jij starten met niveau 4?" | **#6** | media-placeholder |
| `/werken-en-leren/toelatingseisen/` | "Wat is handig om te hebben?" | **#7** | media-placeholder |
| `/werken-en-leren/toelatingseisen/` | "Er is bijna altijd een route" | **#8** | media-placeholder |
| `/werken-en-leren/salaris/` | "Vergoedingen en arbeidsvoorwaarden" (salaris_illustratie) | **#9** | media-placeholder |
| `/over-ons/` | "Een regio, een gezamenlijke opdracht" | **#10** | media-placeholder |
| `/over-ons/` | "Een platform. Een regio." (hero_video_url) | (video) | video-placeholder--hero |
| `/over-ons/samenwerking/` | hero (hero_illustratie) | **#11** | media-placeholder |
| `/over-ons/samenwerking/` | aanleiding (aanleiding_illustratie) | **#12** | media-placeholder |
| `/over-ons/deelnemers/` | hero (hero_illustratie) | **#13** | media-placeholder |
| `/scholen/` | hero video | (video) | video-placeholder--hero |
| `/zorgorganisaties/amstelring/` | hero (org_hero_video_url / org_hero_foto) | **#14** | video-placeholder--hero (toggles to photo) |
| `/zorgorganisaties/amstelring/` | "Maak kennis met de collega's bij Amstelring" (×3) | (video) | verhaal-card video-placeholder |
| ... same for brentano (#15), pcsoh (#16), zonnehuisgroep-amstelland (#17), zorgcentra-meerlanden (#18), zorggroep-aelsmeer (#19) | | | |

---

## 7. Hard-coded values that should be dynamic

- `/over-ons/` "In cijfers" block: `data-count="6"` for "Zorgorganisaties
  die samen opleiden". A WP comment above the counter already notes
  "WP: data-count = the published organisaties count … so this figure
  updates by itself" — but the number is currently hard-coded. The
  WordPress build needs to bind it to `wp_count_posts('organisaties')->publish`.
- `/zorgorganisaties/` overview `#org-count` paragraph — currently empty
  with a WP comment `<!-- WP: echo $org_query->found_posts . ' organisaties' -->`.
  Implementation is foreseen; verify on build.
- `/over-ons/` "In cijfers": `data-count="3"` (BBL-niveaus) and `data-count="2"`
  (Niveaus die werk en leren combineren) — both content-static, fine to
  remain literal but should be editable.

---

## 8. SEO presence

All 30 indexable pages carry `<title>`, meta description, canonical, Open
Graph (og:* set), Twitter card tags, and at least one `application/ld+json`
block (EducationalOrganization site-wide + BreadcrumbList per page +
FAQPage on the two FAQ pages).

`/404.html` deliberately has none of these (and a `noindex` directive). Correct.

In WordPress this is Yoast SEO's domain; the prototype's tags show the
intended values. Two assets still need real values: a real 1200x630
`/assets/og-image.jpg`, and the `EducationalOrganization` `sameAs` profiles.

---

## 9. Technical sanity

- All 31 pages return HTTP 200 on the live deploy.
- All canonical partials (header, footer, widget) are byte-identical site-wide
  (verified in an earlier audit; nothing has changed since).
- No broken internal links across `href="/..."` references.
- The Keuzehulp wizard markup contract (`data-screen`, `data-value`, modal
  data-* attrs) is intact on `/keuzehulp/` and untouched in this audit.
- The footer-CTA suppression on `/keuzehulp/`, `/solliciteren/` and the
  bevestiging page is correctly documented in `DEVELOPER-HANDOVER.md` §12.1.
- `pcsoh.jpg` aside, the org logo strategy with `<img onerror="this.remove()">`
  + text fallback works and is visible on the live site.

---

## 10. Open questions for OMA

1. **Editability strategy decision.** The acceptance criterion is firm; the
   *means* is open per briefing 5/B2. Should the WordPress developer be told
   ACF is the default route for page-level content (the current
   `ACF-FIELDS.md` reference implementation), or should the doc more
   strongly signal that native blocks + block patterns are equally good?
   This affects the tone of B2.
2. **`hero_subtitle` vs `hero_intro`.** Which one becomes canonical? My
   recommendation in B5 is `hero_subtitle` (matches `ACF-FIELDS.md` note),
   but it requires either renaming the HTML comments on the W&L pages or
   adding a doc note that both names map to the same ACF field. Confirm.
2. **Legal pages.** Are the four legal pages intended to be `the_content()`
   (single Gutenberg block) or individually fielded? Suggest the former
   for these long-form documents — they are written legalese, not template
   copy. Confirm so B5 doesn't add a useless field stack.
3. **Niveau pillar / process-step components.** The home process (4 steps)
   and the niveau growth-paths repeat the same "title + body" shape across
   pages. Should each instance get its own per-page repeater, or should
   these be shared block patterns? Reference implementation only — confirm
   if the doc should pick one.
4. **`region_plaats` repeater.** Currently no comment in the HTML;
   `DEVELOPER-HANDOVER.md` §12.3 mentions it as a *possible* later option.
   Should B5 add it to `ACF-FIELDS.md` as a recommended field, or leave it
   as "consider later"?
5. **Org "In cijfers".** The five `cijfer__num` + `cijfer__label` pairs per
   org detail page need a model. Reference implementation: a repeater
   `org_cijfers (num, label)` on the org CPT. Confirm the field name before
   B5 adds it.
6. **PCSOH logo.** Replacement (transparent SVG or PNG) — same as the
   earlier flag; still open.
7. **`bbl_video_url` field.** Annotated only on the home page "Wat is BBL?"
   pillar block. Is it a Site Option or a home-only field? B5 needs to know.

---

## 11. Suggested Phase B priorities (preliminary, awaiting "go")

If Fase B starts, the briefing's B1-B5 ordering is sensible. Notes from this
audit that may shape B5 specifically:

- B5 must add at minimum: `bbl_video_url`, `hero_callout_titel`,
  `hero_callout_tekst`, `niveau_illustratie`, `salaris_illustratie`,
  `salaris_n2/n3/n4`, `vergoedingen` (repeater), `arbeidsvoorwaarden_regio`
  (repeater), `hero_illustratie`, `aanleiding_illustratie`, `school_logo`,
  plus a field family for the niveau-page "meer dan salaris" callout, the
  org `org_cijfers` repeater, the home process repeater, and the niveau
  pillar/route content.
- The `hero_subtitle` vs `hero_intro` decision (question 1 above) drives
  whether B5 also rewrites HTML comments or only the doc.
- The IMAGE-MANIFEST (B4) and the placeholder annotations both depend on
  this audit's §6 placeholder list — that mapping is now ready.

---

*Phase A complete. No site or other doc files were modified in this phase;
the only commits since `b179a91` are `fb79803` (.gitignore for the briefing
file) and this report.*
