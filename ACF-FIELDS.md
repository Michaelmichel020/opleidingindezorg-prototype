# Editability inventory — opleidingindezorg.nl

This document is **two things at once**:

1. **A complete inventory of which content must be editable** by a
   non-technical administrator from wp-admin, without touching theme files
   (the client acceptance criterion).
2. **One reference implementation** showing how that editability can be
   delivered with Advanced Custom Fields. The WordPress developer may
   achieve the same editability with native blocks, block patterns,
   `theme.json`, custom blocks, or any combination they judge best for this
   codebase. The field tables below remain as the reference; the inline
   `<!-- ACF: ... -->` comments in the HTML serve the same role.

So: the **list of what must be editable** (sections below + per-page
inventory) is firm. The **mechanism** is the developer's call. ACF field
**names** in this document are kept exactly as they appear in the HTML
comments so the markup and the field keys line up if ACF is chosen; several
names are Dutch and are keys, not labels.

`hero_subtitle` is the **canonical** name for the hero intro field. A few
HTML comments on Werken & Leren pages used `hero_intro` historically; those
have been normalised to `hero_subtitle` in this round. The two names refer
to the same field.

For long-form prose where editorial structure matters (legal pages, the
longer body sections on Wie zijn wij?, salaris explanations, etc.), the
reference implementation favours the **block editor / `the_content()`**
over a per-paragraph field stack. Those pages are called out per-page below.

---

## Group 1 — Site Options

Site-wide values. Reference implementation: ACF Options page so they are
editable without touching a specific post. Equivalent: theme.json /
customizer / `site_logo()` for the logo.

| Field name | Type | Description |
|---|---|---|
| `site_logo` | Image | Site logo, shown in the header. Falls back to the inline SVG logo if empty. Used in `header.php` / `nav.php`. |
| `region_plaats` | Repeater | The eight place-name chips in the home region-band. Sub-field: `plaats` (Text). Low-churn; live as a Site Option. Annotated above the region-band chips list on the home page. |

The Keuzehulp wizard is inline markup on `/keuzehulp/` (see
`DEVELOPER-HANDOVER.md` §7 and `WIZARD-HANDOVER.md`). It needs no field.

---

## Group 2 — Hero fields

Attach to: `front-page.php`, the `werken-leren`, `bbl-niveau`,
`solliciteren`, `contact` page templates, plus generic `page.php` pages
that have a hero.

| Field name | Type | Description |
|---|---|---|
| `hero_title` | Text | Main hero heading (H1) of the page. |
| `hero_subtitle` | Textarea | Hero intro paragraph below the title. Plain text, ~200 characters. Canonical name (was `hero_intro` historically on some W&L pages). |
| `hero_video_url` | URL | Hero video link. Home: compilation video of all organisations. Werken & Leren overview, `bbl-niveau` pages, Scholen and Over ons: page-specific video. Optional; the placeholder shows if empty. |
| `bbl_video_url` | URL | Home-only second video — the "Wat is BBL?" explainer in the section below the hero. Optional; placeholder if empty. |
| `hero_callout_titel` | Text | Toelatingseisen-only: title of the callout box beside the hero text (`/werken-en-leren/toelatingseisen/`). |
| `hero_callout_tekst` | Textarea | Toelatingseisen-only: body of the same callout box. |
| `hero_illustratie` | Image | Hero photo for Over ons / Samenwerking / Deelnemers when no video is set. |
| `aanleiding_illustratie` | Image | Photo for the "De aanleiding" section on `/over-ons/samenwerking/`. |
| `niveau_illustratie` | Image | Photo above the per-niveau toelatingseisen lists on `/werken-en-leren/toelatingseisen/`. |
| `salaris_illustratie` | Image | Photo for the closing "Geen studieschuld" section on `/werken-en-leren/salaris/`. |

The full image identities (filename, aspect, min size, target path) live in
`IMAGE-MANIFEST.md`. The fields above are the reference storage; the
developer may use a block image instead.

---

## Group 3 — Archive intro

Attach to: the `organisaties` post type archive (`archive.php`). In ACF, an
archive has no post to attach to; place these on an ACF Options sub-page
or use the archive's options screen.

| Field name | Type | Description |
|---|---|---|
| `archive_title` | Text | Heading of the zorgorganisaties overview page. |
| `archive_intro` | Textarea | Intro paragraph of the zorgorganisaties overview page. |

---

## Group 4 — Organisation fields

Attach to: the `organisaties` custom post type. Used by
`single-organisaties.php` (detail page), looped on `archive.php` (overview)
and on the home page organisation grid.

| Field name | Type | Description |
|---|---|---|
| `org_naam` | Text | Organisation name. |
| `org_logo` | Image | Organisation logo. Falls back to a text placeholder if empty (see `.logo-mount` markup). |
| `org_tagline` | Text | Short tagline / one-line positioning of the organisation. |
| `org_hero_media_type` | Select | Hero media beside the title: `foto` or `video`. Decides which of the two fields below is used. |
| `org_hero_foto` | Image | Hero photo, used when `org_hero_media_type` is `foto`. |
| `org_hero_video_url` | URL | Hero video link, used when `org_hero_media_type` is `video`. Falls back to the placeholder if empty. |
| `org_beschrijving` | WYSIWYG | "Wie zijn wij?" description. Shown full-width (no image beside it). Keep it short, max ~100 words. |
| `org_type` | Select | Organisation size. One of: `klein`, `middelgroot`, `groot`. Also drives the `org_type` taxonomy term. |
| `org_niveaus` | Checkbox | BBL levels the organisation offers. Choices: `niveau_2`, `niveau_3`, `niveau_4`. |
| `org_werkplek` | Checkbox | Workplace types. Choices: `verpleeghuis`, `thuiszorg`, `revalidatie`. |
| `org_adres` | Text | Main address of the organisation. |
| `org_telefoon` | Text | Phone number of the organisation. |
| `org_cijfers` | Repeater | "[Org] in cijfers" block. Five rows (medewerkers, cliënten, locaties, wijkteams, dagbesteding) per organisation. Sub-fields: `num` (Text), `label` (Text). |
| `org_locaties` | Repeater | Work locations. Sub-fields: `naam` (Text), `adres` (Text). Rendered as a plain list (no map); show the section only when there are 2+ rows. |
| `org_arbeidsvoorwaarden` | Repeater | Per-organisation employment benefits, 3-4 rows. Sub-fields: `icoon` (Text or Select, icon key), `tekst` (Text, the benefit description). |
| `org_url` | URL | Permalink to the organisation detail page. In WordPress this is the post permalink (`get_permalink()`), not a stored ACF field; it appears in loop annotations for clarity. |

### Related taxonomies (register in `functions.php`)

These taxonomies power the overview filter. The matching `org_*` fields
above can be synced to them, or the taxonomies can be the single source of
truth.

| Taxonomy | Terms |
|---|---|
| `org_type` | `klein`, `middelgroot`, `groot` |
| `bbl_niveau` | `niveau-2`, `niveau-3`, `niveau-4` |
| `werkplek` | `verpleeghuis`, `thuiszorg`, `revalidatie` |

---

## Group 5 — Open dag fields

Attach to: the `open_dagen` custom post type. One post per open day or
information evening; looped on `/scholen/open-dagen/`. The admin manages
these through the dedicated "Open dagen" admin screen (see
DEVELOPER-HANDOVER 3.2).

| Field name | Type | Description |
|---|---|---|
| `datum` | Date | Date of the open day. Drives the date label on the card. |
| `tijd` | Text | Time range, e.g. "Zaterdag 10.00 - 14.00 uur". |
| `locatie` | Text | Place name / town, shown as a tag. |
| `organisatie` | Post Object / Relationship | The hosting organisation; links to an `organisaties` post. Shown as a tag. |
| `beschrijving` | Textarea | Short description of the open day. |
| `meer_info_url` | URL | Target of the "Meer informatie" button. Rendered as `<a target="_blank" rel="noopener">`, opens in a new tab. If empty, keep the button inert. |

---

## Group 6 — Werken & Leren / Salaris page fields

Attach to: the `werken-leren` template (`/werken-en-leren/salaris/` in
particular).

| Field name | Type | Description |
|---|---|---|
| `salaris_n2` | Text | Indicative monthly salary, BBL niveau 2 (e.g. "€ 2.541"). |
| `salaris_n3` | Text | Indicative monthly salary, BBL niveau 3. |
| `salaris_n4` | Text | Indicative monthly salary, BBL niveau 4. |
| `vergoedingen` | Repeater | Six financial vergoedingen-pillars (reiskosten, vakantiegeld, eindejaarsuitkering, opleiding+boeken, doorbetaling lesdag, pensioen). Sub-fields: `icoon` (Text/Select, icon key), `titel` (Text), `tekst` (Text). |
| `arbeidsvoorwaarden_regio` | Repeater | Six regional employment conditions (betaalde lesdag, studietijd, werkbegeleiding, jaarcontract, leendevice, geen terugbetaling). Sub-fields as above. |

The salary cards also carry a per-niveau **note** below the amount
(currently a single sentence with the FWG-disclaimer). Reference: pair
each `salaris_n*` with a sibling `salaris_n*_note` Textarea, or model the
three cards as a 3-row Repeater (`niveau`, `bedrag`, `note`). Either
satisfies editability.

---

## Group 7 — Scholen overview

Attach to: the `/scholen/` page (or a `scholen` page template if one is
created).

| Field name | Type | Description |
|---|---|---|
| `school_logo` | Image | Per-school logo inside the school-card loop (ROCvA, Nova College, SVOZ). |
| `school_naam` | Text | School name. |
| `school_tekst` | Textarea | One-paragraph description. |
| `school_open_dagen_url` | URL | External link to the school's open-days page. |

Reference implementation: a 3-row Repeater `scholen` (logo, naam, tekst,
url) on the page, or a custom block per school.

---

## Per-page editability — what must be editable

This is the central inventory for the client acceptance check.

### Home (`/`, `front-page.php`)
- Hero: `hero_title`, `hero_subtitle`, `hero_video_url`, plus 4 trust-pill
  labels — reference: ACF Repeater `trust_pills (icon, text)`.
- Region-band: subtitle (Text) + `region_plaats` repeater (Site Option) for
  the eight chips.
- "Wat is BBL?": section eyebrow, h2, `bbl_video_url`, plus 3 pillars
  (titel + tekst each) — reference: Repeater `bbl_pillars`.
- "Alle zorgorganisaties, één platform": eyebrow, h2, subtitle; the tiles
  come from the `organisaties` CPT loop.
- "Het proces" 4 steps: section eyebrow, h2, plus 4 steps (titel + tekst)
  — reference: Repeater `process_steps` or a block pattern that fills the
  same shape.
- CTA banner: title, body, two button labels.

### Werken & Leren overview (`/werken-en-leren/`, template `werken-leren`)
- Hero fields (`hero_title`, `hero_subtitle`, `hero_video_url`).
- "Kies je opleiding" section: eyebrow, h2, subtitle, plus three
  niveau-tiles (titel + tekst each).
- Toelatings-callout section: h2 + lead paragraph.
- Salaris-grid section: h2, lead, plus the three salaris cards (re-uses
  `salaris_n2/n3/n4` references — same data as on /salaris/).
- "Goed om te weten over BBL" pillars at the bottom: same `vergoedingen`
  repeater referenced on /salaris/, or a separate Repeater
  `info_pillars`.
- CTA banner.

### Niveau 2 / 3 / 4 (`/werken-en-leren/niveau-2|3|4/`, template `bbl-niveau`)
- Hero fields (`hero_title`, `hero_subtitle`, `hero_video_url`).
- "Wat doet een [functie]?" section: h2 + body (2 paragraphs) — reference:
  WYSIWYG `niveau_wat_doet`.
- "Kun jij starten?" section: h2 + subtitle + Repeater `niveau_eisen
  (tekst)` for the bullet list (4 items).
- "Wat verdien je?" section: h2 + salaris-card (uses `salaris_n*`) +
  "meer dan salaris" callout (title + body — reference: `salaris_extras_titel`,
  `salaris_extras_tekst` or a per-niveau short Textarea).
- "Jouw route" section: h2 + subtitle + growth-path (3 nodes — already
  driven by the existing organisations / niveaus data) + body paragraph.
- "Deze organisaties bieden niveau N aan": h2 + subtitle + CPT loop.

### Toelatingseisen (`/werken-en-leren/toelatingseisen/`)
- Hero fields + `hero_callout_titel`, `hero_callout_tekst`,
  `niveau_illustratie`.
- "Per niveau / Wat is handig om te hebben?" section: eyebrow, h2,
  subtitle, plus the three niveau-h3 blocks with their eisen-list items.
  Reference: Repeater `toelatingseisen_blokken (niveau_titel, eisen-list
  (item))`.
- "Er is bijna altijd een route" section: h2 + 2 body paragraphs —
  reference: WYSIWYG.

### Salaris (`/werken-en-leren/salaris/`)
- Hero fields.
- Salaris-grid (`salaris_n2/n3/n4` + per-card note).
- Vergoedingen pillars (`vergoedingen` repeater).
- Regional arbeidsvoorwaarden (`arbeidsvoorwaarden_regio` repeater).
- "Geen studieschuld" closing section: h2 + 2 body paragraphs + callout
  (title + text) + `salaris_illustratie`. Reference: WYSIWYG for the body,
  + the callout via `closing_callout_titel/tekst`.

### FAQ (`/werken-en-leren/faq/`)
- Hero fields.
- Three column headers (Algemeen / Salaris en arbeidsvoorwaarden /
  Aanmelden en starten).
- 26 FAQ items (question + answer each). Reference: Repeater `faq_items
  (kolom, vraag, antwoord)` so the column header drives the rendering. The
  JSON-LD `FAQPage` schema at the top of the page should be generated from
  the same data so the two copies cannot drift.

### Zorgorganisaties overview (`/zorgorganisaties/`, `archive.php`)
- `archive_title`, `archive_intro`.
- Dark-strip CTA above the filter: title + button label.
- Filter labels are template chrome (select options).
- "Over de schaalgrootte" explanation paragraph below the filter:
  reference: Textarea `filter_help_text`.
- Org cards driven by the CPT loop.

### Organisation detail pages (6 ×, `single-organisaties.php`)
- All `org_*` fields (§Group 4 above), including the new `org_cijfers`
  repeater.
- The seven fixed `<h2>` section titles ("Wie zijn wij?",
  "[Org] in cijfers", "BBL-niveaus die we aanbieden", "Waar je aan de
  slag gaat", "Maak kennis met de collega's bij [Org]", "Wat we je
  bieden", "Andere zorgorganisaties") plus their subtitles are template
  text — reference: keep them in the template, or, if any one of them
  needs to be edited per organisation, add a sibling `org_section_titles`
  repeater. Default reference: template-text, since these labels are
  shared across all six orgs by intent.
- "BBL-niveaus die we aanbieden" intro paragraph: derived from
  `org_niveaus` (Reference: short generated sentence "Bij {org_naam} kun
  je een BBL-opleiding volgen op niveau {2, 3 en 4}." or stored as
  `org_niveaus_intro` Textarea if the wording varies per organisation).
- The three verhaal-cards in "Maak kennis met de collega's": Reference:
  Repeater `org_verhalen (titel, video_url)` on the org CPT.

### Scholen overview (`/scholen/`)
- Hero fields + `school_logo` per card (see Group 7).
- "Drie scholen" section: eyebrow, h2, subtitle.
- Three school cards (see Group 7).
- "Verder lezen" cards-block at the bottom (Het proces, Open dagen):
  titles + descriptions + arrow labels — reference: Repeater
  `verder_lezen_cards (label, titel, tekst, url)`, or a block pattern.

### Hoe werkt het (`/scholen/hoe-werkt-het/`)
- Hero fields.
- Four process steps (Aanmelden, Kennismaken, Match, Aan de slag).
  Reference: Repeater `process_steps (titel, tekst)`.
- Voorwerktraject-callout (title + body — reference:
  `voorwerktraject_titel`, `voorwerktraject_tekst`).
- "De rol van de school" trio of cards (titel + tekst each) — reference:
  Repeater `school_rol_cards`.

### Open dagen (`/scholen/open-dagen/`)
- Hero fields.
- Page intro paragraph above the agenda toolbar — reference: Textarea
  `page_intro`.
- Agenda cards come from the `open_dagen` CPT (Group 5).
- Empty-state copy ("Geen open dagen gepland"): template fallback text.

### Over ons (`/over-ons/`)
- Hero fields + `hero_video_url`.
- "Een regio, een gezamenlijke opdracht": eyebrow + h2 + 2 paragraphs
  (Reference: WYSIWYG `over_ons_regio`) + `over-ons-regio.jpg`.
- "In cijfers" three stats: `data-count` derived (organisation count
  from `wp_count_posts('organisaties')->publish`; the other two are
  editorial Text fields `stat_2_num/label`, `stat_3_num/label`).
- "Geen concurrenten, maar partners": eyebrow + h2 + body — reference:
  WYSIWYG `partners_body`.
- CTA banner.

### Samenwerking (`/over-ons/samenwerking/`)
- Hero fields + `hero_illustratie`, `aanleiding_illustratie`.
- "Waarom samenwerken": eyebrow + h2 + body — Reference: WYSIWYG.
- "De aanleiding" subsection h3 + body.
- "Dashboard-zin" block: Text.

### Deelnemers (`/over-ons/deelnemers/`)
- Hero fields + `hero_illustratie`.
- "Deelnemende organisaties": eyebrow + intro paragraph (Textarea) +
  CPT loop.
- "In samenwerking met / Sigra" partner section: eyebrow + h2 + 2
  paragraphs — Reference: WYSIWYG `sigra_block` (or a dedicated
  "partner" CPT if more partners get added later).

### Contact (`/over-ons/contact/`, template `contact`)
- Hero fields.
- Contactgegevens block: organisation name, e-mail, phone, postal
  address — Reference: each as its own Text field, or a single
  WYSIWYG `contact_block`.
- "Voor professionals" block: h3 + intro + 2 prof-block cards
  (zorgorganisaties + opleidingsinstituten) with name + role + contact —
  Reference: Repeater `professional_contacts (label, naam, rol,
  email/telefoon)`.
- The form itself: **Gravity Forms** instance (not ACF).

### Bedankt pages (`/over-ons/contact/bedankt/`, `/solliciteren/bevestiging/`)
- Confirmation hero (h1 + lead) and a "wat gebeurt er nu" block (h3 +
  3-step ordered list). Reference: each as a short Text + a Repeater
  `next_steps (tekst)`, or a single WYSIWYG block.

### Keuzehulp (`/keuzehulp/`, template `keuzehulp`)
- Hero fields.
- The "Let op" note below the wizard ("kies je voor meerdere organisaties
  …"): Reference: Textarea `meerdere_orgs_notice`.
- The wizard itself is inline markup; see `WIZARD-HANDOVER.md`.

### Solliciteren (`/solliciteren/`, template `solliciteren`)
- Hero fields.
- "Direct solliciteren" intro paragraph: Textarea.
- "Wat gebeurt er na je sollicitatie" ordered list (3 items):
  Reference: Repeater `next_steps`.
- Multi-org notice below the form: Textarea.
- The form itself: **Gravity Forms**.

### Legal pages (`/privacy/`, `/cookies/`, `/disclaimer/`, `/toegankelijkheid/`)
- Per OMA decision: **no field stack**. The body is one long-form legal
  document the admin edits via the WordPress **block editor / `the_content()`**.
  Reference: keep the `page.php` template; render the title and the
  content; do not add per-paragraph fields.

### 404 (`/404.html`, `404.php`)
- h1 ("Pagina niet gevonden") and one lead paragraph: render from
  template strings, or expose as two Site Options. Editorial; not
  customer-managed.

---

## Forms — Gravity Forms (not ACF)

Four Gravity Forms instances. See `DEVELOPER-HANDOVER.md` §0 for the
fixed contract (slug parameter, redirect targets).

| Where | Redirects to | Field set (reference) |
|---|---|---|
| `/solliciteren/` (Direct Solliciteren) | `/solliciteren/bevestiging/` | voornaam, achternaam, e-mail, telefoon, organisatie-checkboxes (slugs match `organisaties` post slugs), `?org=` pre-fill |
| `/over-ons/contact/` (Contact) | `/over-ons/contact/bedankt/` | naam, e-mail, telefoon, vraag, AVG-checkbox |
| `_partials/widget.html` widget__view "vraag" | `/over-ons/contact/bedankt/` | naam, e-mail, vraag, AVG-checkbox |
| `_partials/widget.html` widget__view "solliciteren" | `/solliciteren/bevestiging/` | voornaam, achternaam, e-mail, telefoon, organisatie-select |

---

## Notes

- The application and contact forms are **not** ACF. In WordPress, build
  them with Gravity Forms (above).
- The `?org=<slug>` URL parameter on the application form pre-selects an
  organisation checkbox (`js/forms.js`). When wiring up the real form,
  keep the organisation slugs identical to the `organisaties` post slugs.
- The home page and overview organisation listings are query loops over
  the `organisaties` post type. The HTML shows several hard-coded
  examples between `<!-- WP_LOOP: start -->` and `<!-- WP_LOOP: end -->`;
  replace with `while ( have_posts() ) : the_post();`.
- The organisation **count** is never a stored field. Where a number of
  organisations is shown — the overview result count and the over-ons
  "In cijfers" stat — derive it from the live post count
  (`$query->found_posts` / `wp_count_posts('organisaties')->publish`) so
  it updates automatically when an organisation is added or removed.
- The PCSOH logo (`assets/images/logos/pcsoh.jpg`) is a JPEG without
  transparency and shows a visible rectangle on the off-white logo card.
  Awaiting a transparent replacement from PCSOH; do not change the
  existing `<img>` references in markup. Logging here so the WordPress
  developer is aware.

---

## Cross-references

- `DEVELOPER-HANDOVER.md` §0 — roles and scope, fixed-vs-open table.
- `WIZARD-HANDOVER.md` — Keuzehulp wizard markup contract.
- `IMAGE-MANIFEST.md` — 19 photo identities and target paths.
- `_partials/BUILD-INSTRUCTIONS.md` — reference page skeleton.
