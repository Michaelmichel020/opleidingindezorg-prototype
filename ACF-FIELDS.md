# ACF Fields Reference — opleidingindezorg.nl

Every Advanced Custom Fields (ACF) field used across the prototype, grouped by
field group / template. Field **names** are kept exactly as they appear in the
HTML comments (`<!-- ACF: ... -->`) so the markup and the field keys line up.
Several field names are Dutch; keep them as-is, they are keys, not labels.

Field types refer to standard ACF field types. Suggested admin labels are in
English; set them as you like in the ACF UI.

---

## Group 1 — Site Options (ACF Options page)

Site-wide values. Best placed on an ACF Options page so they are editable
without touching a specific post.

| Field name | Type | Description |
|---|---|---|
| `site_logo` | Image | Site logo, shown in the header. Falls back to the inline SVG logo if empty. Used in `header.php` / `nav.php`. |
| `keuzehulp_wizard_url` | URL | Source URL of the embedded Keuzehulp wizard iframe on `/keuzehulp/`. Currently hardcoded; see TODO. Recommended as an option so the URL can change without a code edit. |

---

## Group 2 — Hero Fields

Attach to: `front-page.php`, and the `werken-leren`, `bbl-niveau`,
`solliciteren`, `contact` page templates, plus generic `page.php` pages that
have a hero.

| Field name | Type | Description |
|---|---|---|
| `hero_title` | Text | Main hero heading (H1) of the page. |
| `hero_subtitle` | Textarea | Hero intro paragraph below the title. Plain text, recommend a max of ~200 characters. |
| `hero_video_url` | URL | Link to the hero video. On the home page this is the compilation video of all organisations; on a `bbl-niveau` page it is the level-specific video. Optional; if empty, the video placeholder is shown. |

Note: a few subpages annotate the intro field as `hero_intro` (Textarea)
instead of `hero_subtitle`. Treat them as the same field; standardise on
`hero_subtitle` when you build the ACF group.

---

## Group 3 — Archive Intro

Attach to: the `organisaties` post type archive (`archive.php`). In ACF, an
archive has no post to attach to, so place these on an ACF Options (sub)page
or use the archive's options screen.

| Field name | Type | Description |
|---|---|---|
| `archive_title` | Text | Heading of the zorgorganisaties overview page. |
| `archive_intro` | Textarea | Intro paragraph of the zorgorganisaties overview page. |

---

## Group 4 — Organisation Fields

Attach to: the `organisaties` custom post type. Used by
`single-organisaties.php` (detail page) and looped on `archive.php` (overview)
and on the home page organisation grid.

| Field name | Type | Description |
|---|---|---|
| `org_naam` | Text | Organisation name. |
| `org_logo` | Image | Organisation logo. Falls back to a text placeholder if empty. |
| `org_tagline` | Text | Short tagline / one-line positioning of the organisation. |
| `org_video_url` | URL | Link to the organisation-specific video. Optional; falls back to the video placeholder. |
| `org_beschrijving` | WYSIWYG | "Wie zijn wij?" description. Keep it short, max ~100 words. |
| `org_type` | Select | Organisation size. One of: `klein`, `middelgroot`, `groot`. Also drives the `org_type` taxonomy term. |
| `org_niveaus` | Checkbox | BBL levels the organisation offers. Choices: `niveau_2`, `niveau_3`, `niveau_4`. |
| `org_werkplek` | Checkbox | Workplace types. Choices: `verpleeghuis`, `thuiszorg`, `revalidatie`. |
| `org_adres` | Text | Main address of the organisation. |
| `org_telefoon` | Text | Phone number of the organisation. |
| `org_locaties` | Repeater | Work locations. Sub-fields: `naam` (Text), `adres` (Text), `lat` (Text/Number), `lng` (Text/Number). Drives the location list and the map placeholder. |
| `org_arbeidsvoorwaarden` | Repeater | Employment benefits, 3-4 rows. Sub-fields: `icoon` (Text or Select, icon key), `tekst` (Text, the benefit description). |
| `org_url` | URL | Permalink to the organisation detail page. In WordPress this is the post permalink (`get_permalink()`), not a stored ACF field; it appears in loop annotations for clarity. |

### Related taxonomies (register in `functions.php`)

These taxonomies power the overview filter. The matching `org_*` fields above
can be synced to them, or the taxonomies can be the single source of truth.

| Taxonomy | Terms |
|---|---|
| `org_type` | `klein`, `middelgroot`, `groot` |
| `bbl_niveau` | `niveau-2`, `niveau-3`, `niveau-4` |
| `werkplek` | `verpleeghuis`, `thuiszorg`, `revalidatie` |

---

## Field usage per template

| Template | ACF fields used |
|---|---|
| `header.php` / `nav.php` (all pages) | `site_logo` |
| `front-page.php` (Home) | `hero_title`, `hero_subtitle`, `hero_video_url`; `organisaties` loop (`org_naam`, `org_logo`, `org_url`) |
| `page.php` (generic: scholen, over-ons, samenwerking, deelnemers, legal pages) | `hero_title`, `hero_subtitle` |
| `page.php` template `werken-leren` | `hero_title`, `hero_subtitle`, `hero_video_url` |
| `page.php` template `bbl-niveau` (niveau 2/3/4) | `hero_title`, `hero_subtitle`, `hero_video_url` (level-specific) |
| `archive.php` (organisaties overview) | `archive_title`, `archive_intro`; `organisaties` loop (`org_naam`, `org_logo`, `org_type`, `org_tagline`, `org_niveaus`, `org_werkplek`, `org_url`) |
| `single-organisaties.php` | all `org_*` fields |
| `page.php` template `solliciteren` | `hero_title`, `hero_subtitle` (the form itself: Contact Form 7 / Gravity Forms, not ACF) |
| `page.php` template `contact` | `hero_title`, `hero_subtitle` (the form itself: Contact Form 7 / Gravity Forms) |
| `page.php` template `keuzehulp-full` | `keuzehulp_wizard_url` (Options) |

---

## Notes

- The application and contact forms are **not** ACF. In WordPress, build them
  with Contact Form 7 or Gravity Forms. The prototype form uses
  `method="get"` with a redirect to the confirmation page purely to make the
  flow clickable; replace it with the plugin's submission handling.
- The `?org=<slug>` URL parameter on the application form pre-selects an
  organisation checkbox (`js/forms.js`). When wiring up the real form, keep
  the organisation slugs identical to the `organisaties` post slugs.
- The home page and overview organisation listings are query loops over the
  `organisaties` post type. The HTML shows 8 hardcoded examples between
  `<!-- WP_LOOP: start -->` and `<!-- WP_LOOP: end -->`; replace with
  `while ( have_posts() ) : the_post();`.
