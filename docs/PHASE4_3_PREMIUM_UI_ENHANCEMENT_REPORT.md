# Phase 4.3 Premium UI Enhancement Report

**Status:** `PHASE4_3_PARTIAL`

**Branch:** `feature/phase2-live-api`
**Baseline:** `ffa72ed`
**Implementation commit (local only):** `9d4aa91 feat(home): enhance premium portal UI`

## Delivered

- Preserved the Phase 4.2 cinematic forest hero, premium navbar, local visual asset, brand palette, and public read-only API flow.
- Added hero depth with a restrained grain layer, editorial frame, compact server HUD, and verified-status treatment. The server name has a native tooltip and the HUD/status strip use only the existing public server snapshot.
- Enriched the server strip with a state indicator, last-update label, conditional max slots, and a non-deceptive pending skeleton when server data is unavailable. No fallback player/server values were introduced.
- Reworked the feature area into a responsive bento composition. All nine navigation-config destinations remain data-driven; unavailable destinations are inert status cards and no fake route or `href="#"` was added.
- Added a public player-roster presentation using only existing approved fields: player name, species, and online status. Its badge now reflects the verified player-feed state rather than unconditionally indicating a live feed.
- Added the local interactive showcase, `Một thế giới. Nhiều trải nghiệm.`, with informational tabs only. It does not create routes, simulate a game feature, or expose unavailable functionality.
- Added a real `/may-chu` CTA and a clearly unavailable Discord state. Launcher, Steam login, Discord, Garage, Shop, Live Map, Skin Editor, Leaderboard, and Donate remain unavailable unless their existing route/config says otherwise.
- Added regression coverage for the preserved forest asset, honest unavailable states, conditional server data, bento layout, and non-routing showcase tabs.

## Security And Data Boundaries

- No API route, authentication code, session code, navigation config, or Phase 2 personal-data mapper was changed.
- No write operation, Steam authorization flow, `MISSING_SCOPE` bypass, mock data, or new API contract was introduced.
- The homepage continues to consume `getPublicCommunityData()` and existing safe public mapper output only.

## Browser QA

Production build QA ran at `http://localhost:3214` against the exact implementation code.

- Verified the local forest hero image loads at desktop and mobile.
- Verified all three unavailable hero actions are disabled.
- Verified no placeholder anchor exists, the showcase changes local tab content only, and the primary CTA reaches `/may-chu`.
- Verified hard refresh at `/`, zero console errors, zero failed requests, and zero HTTP errors.
- Verified no horizontal overflow at 390, 430, 768, 1280, 1440, and 1920 px.
- Verified the bento footer/status layout after correcting its dense-card spacing.

Evidence is stored in `docs/screenshots/`:

- `phase4-3-home-full-desktop.png`
- `phase4-3-home-hero-desktop.png`
- `phase4-3-home-bento-desktop.png`
- `phase4-3-home-community-desktop.png`
- `phase4-3-home-showcase-desktop.png`
- `phase4-3-home-cta-desktop.png`
- `phase4-3-home-hero-mobile.png`
- `phase4-3-home-full-mobile.png`

## Validation

Validation ran after a clean `npm ci` in an isolated workspace containing the exact working-tree source, preserving the user's root dependency state.

| Check | Result |
| --- | --- |
| `npm ci` | Passed |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed, 12/12 |
| `npm run build` | Passed |
| `npm run secretlint` | Passed |
| `npm audit --omit=dev --audit-level=high` | Passed, 0 vulnerabilities |
| `git diff --check` and cached diff check | Passed |
| Full `npm audit --audit-level=high` | Blocked, 5 high dev-toolchain findings |

## Release Gate

The only unmet requirement is a clean full dependency audit. It reports the existing development-only chain `eslint-config-next@15.5.28 -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces@3.0.3` (five high findings). `braces@3.0.3` is the latest published version, and the audit tool's sole remediation is `npm audit fix --force`, which proposes a major downgrade to `eslint-config-next@14.2.35`.

That forced platform downgrade is outside this UI-only scope and could destabilize the current Next 15 toolchain. No dependency change was made, production dependencies audit clean, and the implementation commit has **not** been pushed. `.playwright-mcp/` was not modified or staged. Resolve or formally accept the existing development-toolchain audit finding before pushing this phase for review.
