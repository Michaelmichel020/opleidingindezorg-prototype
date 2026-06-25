# Image manifest — opleidingindezorg.nl

This document lists every image asset that belongs to the prototype: the
**19 atmosphere/situation photos** to be delivered by the photographer,
the **7 organisation logos** already on disk, and the **videos** that
arrive separately. Every placeholder in the HTML maps to one of these
entries.

The format and storage path are firm so a delivered file drops into
place without rename. The editing mechanism in WordPress (an ACF image
field, a block image, an attachment via the media library, etc.) is
the WordPress developer's call — see `DEVELOPER-HANDOVER.md` §0.

All images: JPG or WebP, sRGB, on-disk paths relative to the repo root.

---

## Atmosphere / situation photos — 19 (to be supplied)

### Werken & Leren

| # | Filename | Target path | Page | Section | Aspect | Min size |
|---|---|---|---|---|---|---|
| 1 | `niveau-2-helpende-werk.jpg` | `assets/images/` | `/werken-en-leren/niveau-2/` | "Wat doet een Helpende Zorg en Welzijn?" | 4:3 landscape | 2000 × 1500 |
| 2 | `niveau-2-starten.jpg` | `assets/images/` | `/werken-en-leren/niveau-2/` | "Kun jij starten met niveau 2?" | 4:3 landscape | 2000 × 1500 |
| 3 | `niveau-3-verzorgende-werk.jpg` | `assets/images/` | `/werken-en-leren/niveau-3/` | "Wat doet een Verzorgende IG?" | 4:3 landscape | 2000 × 1500 |
| 4 | `niveau-3-starten.jpg` | `assets/images/` | `/werken-en-leren/niveau-3/` | "Kun jij starten met niveau 3?" | 4:3 landscape | 2000 × 1500 |
| 5 | `niveau-4-mbo-verpleegkundige-werk.jpg` | `assets/images/` | `/werken-en-leren/niveau-4/` | "Wat doet een mbo-Verpleegkundige?" | 4:3 landscape | 2000 × 1500 |
| 6 | `niveau-4-starten.jpg` | `assets/images/` | `/werken-en-leren/niveau-4/` | "Kun jij starten met niveau 4?" | 4:3 landscape | 2000 × 1500 |
| 7 | `toelatingseisen-wat-handig.jpg` | `assets/images/` | `/werken-en-leren/toelatingseisen/` | "Wat is handig om te hebben?" | 3:4 or 4:5 portrait | 1600 × 2000 (landscape acceptable, crop centre) |
| 8 | `toelatingseisen-route.jpg` | `assets/images/` | `/werken-en-leren/toelatingseisen/` | "Er is bijna altijd een route" | 4:3 landscape | 2000 × 1500 |
| 9 | `salaris-vergoedingen.jpg` | `assets/images/` | `/werken-en-leren/salaris/` | "Vergoedingen en arbeidsvoorwaarden" (`salaris_illustratie`) | 3:4 or 4:5 portrait | 1600 × 2000 (landscape acceptable, crop centre) |

### Over ons

| # | Filename | Target path | Page | Section | Aspect | Min size |
|---|---|---|---|---|---|---|
| 10 | `over-ons-regio.jpg` | `assets/images/` | `/over-ons/` | "Een regio, een gezamenlijke opdracht" | 4:3 landscape | 2000 × 1500 |
| 11 | `samenwerking-hero.jpg` | `assets/images/` | `/over-ons/samenwerking/` | hero (`hero_illustratie`) | 4:3 landscape | 2000 × 1500 |
| 12 | `samenwerking-aanleiding.jpg` | `assets/images/` | `/over-ons/samenwerking/` | "De aanleiding" (`aanleiding_illustratie`) | 4:3 landscape | 2000 × 1500 |
| 13 | `deelnemers-hero.jpg` | `assets/images/` | `/over-ons/deelnemers/` | hero (`hero_illustratie`) | 4:3 landscape | 2000 × 1500 |

### Zorgorganisaties — hero per detail page

All 4:3 landscape, min 2000 × 1500, in folder `assets/images/orgs/`.
Maps to the organisation post's `org_hero_foto` field (or its equivalent
in the chosen mechanism).

| # | Filename | Target path | Page |
|---|---|---|---|
| 14 | `amstelring-hero.jpg` | `assets/images/orgs/` | `/zorgorganisaties/amstelring/` |
| 15 | `brentano-hero.jpg` | `assets/images/orgs/` | `/zorgorganisaties/brentano/` |
| 16 | `pcsoh-hero.jpg` | `assets/images/orgs/` | `/zorgorganisaties/pcsoh/` |
| 17 | `zonnehuisgroep-amstelland-hero.jpg` | `assets/images/orgs/` | `/zorgorganisaties/zonnehuisgroep-amstelland/` |
| 18 | `zorgcentra-meerlanden-hero.jpg` | `assets/images/orgs/` | `/zorgorganisaties/zorgcentra-meerlanden/` |
| 19 | `zorggroep-aelsmeer-hero.jpg` | `assets/images/orgs/` | `/zorgorganisaties/zorggroep-aelsmeer/` |

Totals: 19 photos, 17 landscape (4:3), 2 portrait-leaning (#7 and #9).
For the two portrait slots, a landscape 4:3 is acceptable; it crops
centre to fit the tall text column.

---

## Organisation logos — 7 (already on disk)

In `assets/images/logos/`. Wired into the org-tile and org-card markup
via the `.logo-mount` component with an `<img>` element and a text
fallback. The `onerror="this.remove()"` attribute exposes the text
fallback if a file is renamed or removed.

| Organisation | Filename | Format |
|---|---|---|
| Amstelring | `amstelring.svg` | SVG, transparent |
| Brentano | `brentano.svg` | SVG, transparent |
| PCSOH | `pcsoh.jpg` | JPEG, **no transparency** — see open issue below |
| Zonnehuisgroep Amstelland | `zonnehuisgroep-amstelland.png` | PNG (palette + tRNS), transparent |
| Zorgcentra Meerlanden | `zorgcentra-meerlanden.png` | PNG (RGBA), transparent |
| Zorggroep Aelsmeer | `logo-ZG-Aelsmeer-FC.svg` | SVG, transparent |
| Sigra (partner, no employer) | `sigra.svg` | SVG, transparent |

**Open issue — PCSOH:** `pcsoh.jpg` has no alpha channel; on the
off-white logo card it shows a visible rectangular background. Awaiting
a transparent replacement (SVG or PNG) from PCSOH. Do not change the
existing references in markup; once the replacement file arrives,
swap the `src` extension only.

---

## Videos — delivered separately by the video producer

Videos are not in the manifest because the photographer is not
producing them. They will arrive as URLs (or files) from the video
producer and bind to existing URL fields. The placeholders for these
sit alongside the photos in the markup, with their own annotation
format (see `<!-- VIDEO: ... -->` comments above each
`video-placeholder` div).

| Video | Bound to | Page(s) |
|---|---|---|
| Compilation video (all organisations) | `hero_video_url` | `/` (home hero) |
| "Wat is BBL?" explainer | `bbl_video_url` | `/` ("Wat is BBL?" section) |
| Werken & Leren overview hero video | `hero_video_url` | `/werken-en-leren/` |
| Niveau-2 / -3 / -4 level video (3 ×) | `hero_video_url` | `/werken-en-leren/niveau-2|3|4/` |
| Scholen hero video | `hero_video_url` | `/scholen/` |
| Over ons hero video | `hero_video_url` | `/over-ons/` |
| Per-organisation testimonial (6 ×) | `org_hero_video_url` | each `/zorgorganisaties/{slug}/` |
| "Maak kennis met de collega's" verhaal videos (3 per org × 6 = 18) | repeater per org | each `/zorgorganisaties/{slug}/` |

Until the videos arrive, the placeholders remain visible as styled
gradient blocks with a play icon and a `(Video volgt)` label — same
mechanism as the photo placeholders.

---

## Wiring

- Photos: each placeholder div carries an `<!-- IMAGE: ... -->`
  HTML comment directly above it that names the manifest filename and
  aspect ratio. The WordPress developer reads the comment when wiring
  the page template to the chosen storage mechanism.
- Videos: each video placeholder carries a `<!-- VIDEO: ... -->`
  HTML comment naming the field that binds to the URL.
- Logo image references: live as `<img src="/assets/images/logos/...">`
  inside `.logo-mount` containers; no annotation needed.

Cross-references: `DEVELOPER-HANDOVER.md` outstanding-items section
points here; `ACF-FIELDS.md` lists the matching field names for each
image where ACF is the chosen mechanism.
