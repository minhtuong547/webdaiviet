# Phase 2B — security, live QA, and backup status

Updated 2026-10-20. Status: `PHASE2B_PARTIAL`. Credentials, Steam IDs, and player values are intentionally omitted.

## Root cause and runtime verification

- Port `3100` was owned by a `next start` process launched from this project. Its `.next` manifests included the App Router handlers, but the server failed loading webpack chunk `./887.js` after the default `.next` output had been overwritten by another build. Requests returned framework 404/500 responses before reaching IslePilot. No other process was stopped.
- Added optional `NEXT_DIST_DIR` support to `next.config.ts`; QA built to `.next-phase2-qa` and ran on `127.0.0.1:3187`, leaving ports 3000/8080 and the old 3100 process untouched.
- Fresh isolated production build compiled all route handlers. HTTP checks returned: `/` 200; `/api/islepilot/server` 200 with a validated, whitelisted real server snapshot; `/api/islepilot/players` 200 with online display-name/species fields only; legacy `/api/server` 200 with the same filtered snapshot; `/api/islepilot/leaderboard`, `/events`, and `/killfeed` 403 `MISSING_SCOPE`; `/spawn-zones` 404 `NOT_FOUND`; `/api/config` 200; `/api/auth/steam` 503 `CONTRACT_PENDING`.
- These upstream 403s are passed through without bypass or fabricated data. The spawn-zones 404 is upstream `NOT_FOUND`; it does not establish whether the contract is absent or access-restricted.
- Rebuilt production output in `.next-phase2-qa` and started only the owned QA process on `127.0.0.1:3187`; ports 3000, 3100, and 8080 were not stopped or claimed. Fresh HTTP results: `/` 200; server 200; players 200; leaderboard 403; public config 200; Steam auth 503 (disabled). All discovered CSS/JS assets returned 200. Server response keys were only the BFF envelope (`state`, `data`, `requestId`); no private ID, Discord ID, wallet, ban, API key, or admin marker appeared in server/players payloads.

## Module status

| Module | Status | Notes |
|---|---|---|
| Server status | `LIVE_VERIFIED` | Real upstream response, validated and publicly filtered. |
| Online players | `LIVE_VERIFIED` | Real `/players`; BFF returns only online display name/species and count; no IDs, Discord, wallet, bans, or vitals. |
| Leaderboard | `MISSING_SCOPE` | Real upstream 403; UI keeps an explicit unavailable state. |
| Events and killfeed | `MISSING_SCOPE` | Real upstream 403; no bypass or placeholder data. |
| Spawn zones | `CONTRACT_PENDING` | Upstream 404. |
| Steam login / player dashboard | `CONTRACT_PENDING` | Steam is configured in local environment, but OpenID callback/nonce verification and account ownership checks are not implemented. Login route stays disabled with 503; no player-specific route is exposed. |
| Writes/admin | `DISABLED` | Public config reports disabled; no write actions are implemented or proxied. |
| Portal API | `CONTRACT_PENDING` | Missing verified portal origin, session/CSRF contract, and schemas. |
| 3D editor | `ASSET_RIGHTS_PENDING` | No authorized model source/rights verified. |
| GitHub publish | `CONTRACT_PENDING` | Local repository has no commits; `git ls-remote --heads origin` returned no heads. Push not performed because Navbar Codex work is uncommitted in the same initial source tree and cannot safely be excluded from a clean first commit without risking an incomplete baseline. |

## Security and tests

- `/api/islepilot/[resource]` is an explicit allowlist; arbitrary upstream paths and admin resources are not client-selectable. Only `GET` is implemented.
- Both public server endpoints whitelist output fields. Player responses fail closed for non-online entries and expose only display name, species, and online state. Automated tests cover sensitive-field removal, unsupported shapes, read-only endpoint registry, and signed-session tampering/expiry.
- `npm run check` passed (ESLint, TypeScript, 7/7 tests, isolated optimized build). `npm audit --omit=dev` now reports 0 findings after a compatible PostCSS override from 8.4.31 to 8.5.31; Next remains 15.5.28. Full `npm audit` reports 5 high findings, all the `braces` stack exhaustion advisory (`<=3.0.3`) in dev chain `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`; npm offers only a breaking downgrade to `eslint-config-next@14.2.35`. Registry currently has no braces 3.x patched release, so the dev finding remains open. No forced downgrade or framework-major upgrade was applied. No Next API usage changed; no migration-related breaking changes were introduced.
- Browser QA was not completed: `node_repl js` execution tool required by the available browser skill is not exposed in this session (tool discovery returned none). Do not interpret asset/API HTTP checks as visual/hydration/console QA. Owner manual QA: open `http://127.0.0.1:3187` at widths 1920, 1440, 430, and 390px; verify navigation/layout and player/error states, inspect DevTools Console for hydration/runtime errors and Network for API/CSS/JS 2xx; directly open `/api/islepilot/server`, `/api/islepilot/players`, and `/api/islepilot/leaderboard`. QA server has been stopped after HTTP checks.
- Remote URL is configured and remote branches were empty at verification. Local Git is a new, uncommitted repository on `main`; no commit/push was made. Navbar Codex's untracked `src/components/navigation/*`, `src/app/navbar-preview/*`, `.next-navbar-qa/`, and `.qa-navbar-cdp.mjs` were left untouched and unstaged. Because there is no existing commit baseline and source overlaps the same initial repository, making a first commit that omits this parallel work risks producing an incomplete backup. Owner should coordinate a stable Navbar checkpoint, then create/push the dedicated WIP branch `feature/phase2-live-api` after secret scanning.

## Files touched in recovery

`next.config.ts`, `src/app/api/server/route.ts`, `src/app/api/islepilot/[resource]/route.ts`, `src/app/api/config/route.ts`, `src/lib/api/islepilot-schemas.ts`, `src/app/page.tsx`, `tests/islepilot.test.ts`, `package.json`, `package-lock.json`, `.gitignore`, and this report. Navbar-specific files were not modified by this task.

## Remaining blockers

1. Grant/confirm IslePilot read scopes or entitlement for leaderboard, events, and killfeed; clarify the spawn-zones 404 contract.
2. Complete and verify Steam OpenID ownership/session flow before enabling login or player-specific data.
3. Complete browser desktop/mobile and console QA using an available supported browser runtime.
4. Complete supported browser desktop/mobile QA.
5. Eliminate the remaining dev-only `braces` finding when a compatible patch is available or after reviewing a safe maintained replacement.
6. Coordinate Navbar checkpoint and push a reviewed WIP backup on `feature/phase2-live-api`; remote currently has no branch heads and must be rechecked immediately before push.
7. Enable IslePilot scopes for leaderboard, events, and killfeed; complete Steam OpenID and ownership implementation before enabling account features.
