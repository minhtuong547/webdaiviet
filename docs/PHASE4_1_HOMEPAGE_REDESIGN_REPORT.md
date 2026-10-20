# Phase 4.1 Homepage Redesign Report

Status: `PHASE4_1_HOMEPAGE_READY_FOR_REVIEW`

Date: 2026-10-20

Implementation commit: `86ee0d6` (`feat(home): create cinematic survival portal`)

## Visual Redesign

- Replaced the Phase 4 content-only hero with a cinematic survival composition: direct gameplay-oriented copy, an original local survival-scene SVG, and an inset live server widget.
- The live widget now separates `PLAYERS ONLINE` from `MAX SLOTS`. A population bar appears only when both verified values exist; otherwise the UI explicitly states that slots are not public.
- Rebuilt the community area as an activity composition with a compact, two-column player list. It only renders approved display name, species, and online status fields.
- Replaced uniform cards with a nine-item asymmetric bento ecosystem. All items inherit their real unavailable state from navigation configuration and create no non-working route or download link.
- Added editorial community positioning and a final CTA that only links to `/may-chu` and `/nguoi-choi`.
- Removed obsolete home-page CSS and created [HomePage.module.css](../src/components/home/HomePage.module.css). The new original artwork is [dai-viet-survival-scene.svg](../public/art/dai-viet-survival-scene.svg).

## Asset Decision

The repository has no verified licensed dinosaur, environment, video, or image asset. No third-party game artwork was used. The image-generation runtime was unavailable in this session, so the permitted CSS/SVG alternative was used: a new local, generic survival illustration with no The Isle source material.

## Before And After

- Before: [Phase 4 desktop home](screenshots/phase4-home-desktop.png)
- After: [desktop hero](screenshots/phase4-1-home-hero-desktop.png)
- After: [full desktop homepage](screenshots/phase4-1-home-full-desktop.png)
- After: [community composition](screenshots/phase4-1-home-community-desktop.png)
- After: [ecosystem bento grid](screenshots/phase4-1-home-features-desktop.png)
- After: [mobile hero](screenshots/phase4-1-home-hero-mobile.png)
- After: [full mobile homepage](screenshots/phase4-1-home-full-mobile.png)

## Visual QA

- Directly inspected desktop hero, full homepage, community, and feature sections at 1440 pixels wide.
- Directly inspected mobile hero and full homepage at 390 by 844 pixels after compacting the hero facts and artwork height.
- Confirmed no horizontal overflow at 1920, 1440, 1280, 768, 430, and 390 pixels.
- Confirmed hierarchy, data legibility, CTA sizing, section rhythm, feature-card variation, and mobile composition. No overlap or clipped text was observed.
- CSS transitions are intentionally restrained and disabled for reduced-motion preferences. No client animation library or Three.js dependency was added.

## Regressions

- Navbar source and structure were not changed. Browser QA confirms Home remains active, the mobile drawer works, and `Máy chủ`/`Người chơi` remain absent from desktop and mobile navbar navigation.
- Home CTAs lead to the working `/may-chu` and `/nguoi-choi` routes. The 9 ecosystem items render no anchors, and no `href="#"` links exist.
- API/auth/security modules were untouched. The home page continues to use `getPublicCommunityData()` and its Phase 2 public mappers; no mock values, writes, Steam auth activation, or scope bypasses were added.
- Added a regression test that enforces the `PLAYERS ONLINE` / `MAX SLOTS` distinction and checks the explicit absent-max-slots path.

## Verification

- Clean isolated QA workspace: `npm ci` had already completed for the Phase 4 environment. The root workspace still has a user-owned Next process locking its SWC binary, so all checks were run against the clean isolated copy without stopping that process.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 12 of 12 tests.
- `npm run build`: passed, optimized production output.
- `npm run secretlint`: passed.
- `npm audit --omit=dev --json`: 0 production vulnerabilities.
- Production browser QA at `http://localhost:3214`: no console errors, unexpected failed requests, or HTTP error responses.

## Remaining Issues

- Discord and Launcher URLs are not verified, so the CTA deliberately does not expose either action.
- Full development dependency audit retains the previously documented 5 high findings in the `eslint-config-next` / `braces` chain; production audit remains clean. No breaking downgrade was applied.
- No production deployment or merge to `main` was performed.
