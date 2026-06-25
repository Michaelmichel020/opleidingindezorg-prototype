# Wizard Handover — Keuzehulp

This document is the single reference for the Keuzehulp wizard. It is meant
for both the WordPress developer (who lifts the static prototype into a
custom theme) and the external wizard developer (who hangs the real
matching / scoring engine off this frontend).

The wizard is built into the prototype as **inline HTML/CSS/JS**. There is
no iframe. The WordPress side delivers the markup; the wizard developer
delivers the logic. Their seam is the markup contract in section 3.

---

## 1. Where the wizard lives

- **Standalone page:** `/keuzehulp/`. The wizard is the page's main content
  (a hero, the wizard, a short note about meervoudige sollicitaties below).
- **Floating widget:** the float on every page (top-right launcher → "Hulp
  nodig?") **no longer contains the wizard**. Its "Hulp bij het kiezen"
  entry is a plain `<a href="/keuzehulp/">` link.

There is exactly **one** wizard instance, on `/keuzehulp/`.

## 2. What is in this repo (frontend)

| Part | File | Notes |
|---|---|---|
| Inline markup, 12 screens + apply modal | `keuzehulp/index.html` (the `.kh-wizard` block in `<main>`) | Lift into the WordPress template verbatim. See section 3 for the contract. |
| Component styling | `css/pages/keuzehulp.css` | Token-driven (DM Sans, DM Serif Display, teal palette). Loaded only on the keuzehulp template. |
| Presentation demo JS | `js/keuzehulp-ui.js` | Wires up screen transitions, single/multi-select highlighting, conditional reveals, the per-screen Next-button validation, the loading → result transition, and the apply modal. **Does no scoring, no matching, no data persistence.** |

## 3. The markup contract

These hooks are the agreement between the frontend and the wizard developer.
They must not change without coordination. The WordPress developer should treat
them as read-only when porting the markup to a WordPress template.

### 3.1 Screen IDs

The wizard has twelve screens. Each is a `<section class="kh-screen"
data-screen="…">`. Exactly one screen carries `.is-active` at a time.

```
start → naam → 1 → 2 → 3 → contact → 4 → 5 → 6 → loading → result → bedankt
```

`data-screen` IDs are literal: `start`, `naam`, `1`, `2`, `3`, `contact`,
`4`, `5`, `6`, `loading`, `result`, `bedankt`.

### 3.2 Option keys (`data-value`)

Choice cards are `<button class="kh-option" data-value="…" aria-pressed="false">`.
The values are:

| Screen | Question | Options (`data-value`) |
|---|---|---|
| 1 | Dicht bij huis werken? | `ja`, `nee` |
| 2 | Type organisatie | `klein`, `middelgroot`, `groot`, `maakt-niet-uit` |
| 3 | Werkplek (multi) | `verpleeghuis`, `thuiszorg`, `revalidatie` |
| 4 | Heb je een diploma? | `ja`, `nee` |
| 4b | Hoogste niveau (when 4 = ja) | `vmbo-basis`, `vmbo-t`, `mbo2`, `mbo3`, `havo`, `anders` |
| 5 | Situatie | `school`, `werk-buiten-zorg`, `werk-in-zorg`, `herintreder`, `weet-niet` |
| 6 | Motivatie (multi) | `mensen`, `afwisseling`, `doorgroeien`, `samenwerken`, `dichtbij`, `anders` |

A choice group is multi-select when its `.kh-options` parent carries
`data-multi="true"`.

### 3.3 Conditional blocks

- `[data-conditional="postcode"]` — postcode input on screen 1, revealed
  when the visitor picks `data-value="ja"`. Toggled via the class
  `.is-visible`. The input is `.kh-input--postcode` and the demo JS
  formats it as `1234 AB` on input.
- `[data-conditional="niveau"]` — niveau-grid on screen 4, revealed when
  the visitor picks `data-value="ja"`.

### 3.4 Diploma notes on screen 4

Two info notes live on screen 4 and toggle each other via the `hidden`
attribute:

- `[data-note="default"]` — visible until the visitor answers.
- `[data-note="nee"]` — visible when the visitor picks `data-value="nee"`.

When the visitor picks `data-value="ja"`, both notes are hidden and the
niveau-grid (3.3) is shown.

### 3.5 Personalisation

Inline spans `<span data-name-token>[Voornaam]</span>` are replaced with
the entered first name as soon as the visitor leaves the `naam` screen.

### 3.6 Apply modal

The modal is `class="kh-modal"`, lives as a sibling of the screens inside
the `.kh-wizard`. It opens from a result card's
`<button data-action="apply" data-org="…">`.

- Form inputs the modal pre-fills:
  - `[data-modal-field="voornaam"]`
  - `[data-modal-field="email"]`
  - `[data-modal-field="telefoon"]`
- Organisation checkboxes inside the modal: `[data-modal-org="org-1"]`
  through `[data-modal-org="org-6"]`. On open, the chosen org is checked,
  the rest are cleared.
- Submit goes to the `bedankt` screen.

### 3.7 Action verbs

Buttons inside the wizard carry one of:

- `data-action="start"` — Start screen → `naam`.
- `data-action="next"` — Next button on every other interview screen.
- `data-action="prev"` — Back button (hidden on `start`, `loading`,
  `result`, `bedankt`).
- `data-action="apply"` — opens the apply modal (on result cards).
- `data-action="goto"` with `data-target="…"` — explicit jump.

### 3.8 Validation hook

Per-screen validation toggles the native `disabled` attribute **plus** a
`.is-disabled` class on the Next/Start CTA. The wizard developer either
replaces this with their own validator or keeps the demo behaviour and
overrides only the rules that need to differ.

## 4. What `keuzehulp-ui.js` does (and why it can be replaced)

The demo script:

1. Walks the FLOW array and shows the matching `.kh-screen.is-active`.
2. Highlights `.kh-option` selections (single or multi by group).
3. Toggles the conditional blocks (3.3) and notes (3.4) on screen 1 and 4.
4. Updates the progress bar above screens 1 to 6.
5. Validates each screen and toggles the Next button.
6. Auto-advances `loading` to `result` after 1.8 s.
7. Reveals the result cards with a stagger.
8. Drives the apply modal: pre-fill, open/close, submit → `bedankt`.

The script does **no scoring, no matching, no persistence**. The wizard
developer either:

- **Replaces** the script with the real engine. Same DOM contract: read
  `data-value` selections, decide which screen to show next, populate the
  `result` screen with real organisations, fire the apply modal with real
  data on submit.
- **Wraps / overrides** the demo: keep `keuzehulp-ui.js` for transitions
  and animations, but intercept `data-action="next"` to inject real
  routing, and rewrite the result screen on `goTo('result')`.

## 5. Result-screen placeholders

The static markup ships placeholders the engine fills at runtime:

- `[Voornaam]` (in `data-name-token` spans) — visitor's first name.
- `[Klein / Middelgroot / Groot]` (`.kh-rcard__size`) — organisation size.
- `[Naam zorgorganisatie]` (`.kh-rcard__name`) — organisation name.
- `[Korte tagline …]` (`.kh-rcard__tagline`) — short positioning line.
- `[Match-reden 1/2/3]` (`.kh-rcard__tag`) — match reasons as teal pills.
- `Logo` in `.kh-rcard__logo` and `.kh-overige__logo` — real org logo
  (img or CSS background).
- `href="#"` on the "Bekijk de organisatie" buttons and overige org-cards
  — wire to the real permalinks.
- `data-org="org-1"` … `org-6` on the result-card apply buttons — replace
  with the real `organisaties` post slugs (the same slugs the
  `?org=` pre-fill on `/solliciteren/` already uses).

## 6. Two embed contexts (one of them is now retired)

The wizard markup supports an optional compact-embed mode via
`data-embed="widget"` on the `.kh-wizard` root. This was used when the
float still hosted the wizard. The float now links out (section 1), so
`data-embed="widget"` is currently unused. The CSS hook remains in
`css/pages/keuzehulp.css` if a future surface (smaller paneel, sidebar)
needs the compact look.

## 7. Things the WordPress side must do

- Render `keuzehulp/index.html`'s `.kh-wizard` block from a dedicated page
  template (`page-keuzehulp.php`) verbatim.
- Enqueue `css/pages/keuzehulp.css` only on that template.
- Enqueue `js/keuzehulp-ui.js` only on that template — and either keep
  it, or let the wizard developer dequeue/override it later.
- Do not refactor the markup, do not rename classes, do not drop
  attributes from the contract in section 3.

## 8. Things the WordPress side does **not** do

- Build any wizard logic, scoring, or persistence — that is the wizard
  developer's job.
- Wire up the wizard to any backend (post types, ACF, REST). The match
  engine handles its own data; the only post-type touchpoint is the
  result screen pulling organisation references, which the engine
  resolves at the API level.
- Build an iframe or a separate hosted app — the wizard is inline.
