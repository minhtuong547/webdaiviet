# Phase 4 Public Pages Report

Status: `PHASE4_READY_FOR_REVIEW`

Date: 2026-10-20

## Completed

- Redesigned `/` as the primary public experience, with a refined responsive presentation driven by verified server and online-player data.
- Kept `Máy chủ` and `Người chơi` out of the desktop and mobile navbar. Both now remain reachable only through clear, working links on the home page.
- Added `/may-chu` and `/nguoi-choi`, including App Router loading and error states. Their data passes through the existing approved public server/player field mappers only.
- Kept real source status visible: an unavailable or scope-restricted upstream response is rendered as its actual state, never as replacement data.
- Added regression tests for the public mappers, `MISSING_SCOPE`, the navbar availability contract, and placeholder-link prevention.
- Did not alter the protected API registry, session handling, Steam authentication behavior, write operations, or Phase 2 privacy filtering.

## Availability

`/` is the sole navbar navigation route. Garage, Shop, Live Map, Leaderboard, Skin Editor, Donate, and Launcher remain visibly unavailable because no verified route, contract, payment URL, or launcher download is present. No `href="#"` links are used.

## Verification

- A clean isolated QA workspace was installed with `npm ci`, because an existing user-owned Next process on port 3000 locked the root workspace native Next binary. The user process was left untouched.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 11 of 11 tests.
- `npm run build`: passed with the optimized production build.
- `npm run secretlint`: passed.
- `npm audit --omit=dev --json`: 0 production vulnerabilities.
- Full `npm audit --json`: 5 known high development-only findings in the existing `eslint-config-next` -> `@next/eslint-plugin-next` -> `fast-glob` -> `micromatch` -> `braces` chain (`GHSA-vfj7-8cjw-p6xm`). The only offered automated resolution is a breaking downgrade to `eslint-config-next@14.2.35`; it was not applied.
- Production browser QA at `http://localhost:3214`: verified home-to-server/player navigation, mobile drawer state, hard refresh of both public routes, loading data state, and the absence of `Máy chủ`/`Người chơi` in both navbar variants.
- Desktop and mobile tests at 390, 430, 768, 1280, 1440, and 1920 pixels found no horizontal overflow. No console errors, unexpected failed requests, or HTTP error responses occurred.

## Screenshots

- [Home desktop](screenshots/phase4-home-desktop.png)
- [Home mobile](screenshots/phase4-home-mobile.png)
- [Server desktop](screenshots/phase4-server-desktop.png)
- [Server mobile](screenshots/phase4-server-mobile.png)
- [Players desktop](screenshots/phase4-players-desktop.png)
- [Players mobile](screenshots/phase4-players-mobile.png)
