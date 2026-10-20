# Phase 4.2 Homepage Redesign Report

Status: `PHASE4_2_HOMEPAGE_READY_FOR_REVIEW`

Implementation commit: `d713faf` (`feat(home): rebuild cinematic landing page`)

## Before and after

The Phase 4.1 split hero, geometric mountain illustration, pink moon, oversized server panel, and duplicate statistics were removed. The homepage is now a full-width cinematic entry surface with a single compact IslePilot status strip, a concise 6+3 feature grid, and a compact public roster.

## Artwork source and rights

`public/art/dai-viet-forest-hero.jpg` is a CC0 1.0 forest photograph by Filip Varga, distributed via Wikimedia Commons as [Sun's rays in a dense forest (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Sun%27s_rays_in_a_dense_forest_(Unsplash).jpg). The Commons file identifies the image as a pre-5 June 2017 Unsplash upload under CC0. The local file is used only as a general survival-forest environment; no The Isle artwork, model, sprite, logo, or reference-site asset was copied.

## Delivered experience

- Full-bleed forest hero with dark readable overlay, DAI VIET branding, and responsive crop.
- Three compact launcher, Steam, and Discord controls remain disabled because no verified launcher URL, Steam auth flow, or official Discord URL is configured.
- Compact live strip uses the existing verified IslePilot server read. It renders online count dynamically, includes max slots only when returned, and shows the existing safe read-state text on failure.
- Six primary features and three utility features preserve `navigation.config.ts` availability. No unavailable feature is linked or given a fake arrow.
- Community roster displays only existing public player name, species, and online state. No Steam ID, Discord ID, administrative data, mock user, write operation, or `MISSING_SCOPE` bypass was introduced.
- The Premium Navbar and API/authentication implementation were not changed.

## Browser QA

Screenshots:

- `docs/screenshots/phase4-2-home-desktop.png`
- `docs/screenshots/phase4-2-home-desktop-full.png`
- `docs/screenshots/phase4-2-home-mobile.png`
- `docs/screenshots/phase4-2-home-mobile-full.png`

Production-build checks passed:

- Hero photo completed loading at 1440px and 390px; the old SVG was absent.
- Hero measured 700px at desktop and 650px at mobile. The next section is visible below the desktop hero.
- All three restricted hero actions were disabled; no home link used `href="#"`.
- Nine feature cards rendered, and the valid community link opened `/nguoi-choi`; refresh preserved that page.
- No horizontal overflow at 390, 430, 768, 1280, 1440, or 1920px.
- Console errors, failed requests, and HTTP errors: none during QA.

## Validation

Run in a clean isolated QA workspace after `npm ci` because the root workspace dependencies were unavailable while a user-owned process retained the native Next binary.

- `npm ci`: passed
- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: passed, 12/12
- `npm run build`: passed
- `npm audit --omit=dev`: 0 vulnerabilities
- `npm run secretlint`: passed
- `git diff --check`: passed before staging

## Remaining notes

No Phase 4.2 blocker remains. The supplied attachment directory did not contain the three visual comparison images described in the brief, so the rebuild followed the written requirements. A project-owned dinosaur artwork can be added later if a specific creature focal point is desired; the current CC0 forest artwork is sufficient for the approved cinematic environment without importing unlicensed game material.
