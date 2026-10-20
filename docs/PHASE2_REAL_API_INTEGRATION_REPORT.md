# Phase 2B — security, live QA, and backup status

## Phase 2C — CI repair and Navbar handoff preparation

Updated 2026-10-20. Status: `PHASE2C_PARTIAL` pending a successful GitHub Actions run and browser QA.

- CI root cause: `npx --yes secretlint "**/*"` had no repository config, so Secretlint stopped with `secretlint config is not found` before the production audit. Added `.secretlintrc.json` using `@secretlint/secretlint-rule-preset-recommend` and pinned `secretlint` plus its preset to `13.0.7` in `package.json`/lockfile. CI invokes the lockfile-installed `npm run secretlint`; `.secretlintignore` excludes Git metadata, dependencies, Next output, coverage, and build artifacts. A synthetic Slack-token-shaped fixture was rejected by Secretlint; fixture contents were not emitted.
- Local isolated validation from a clean source archive: `npm ci`, Secretlint, lint, typecheck, 7/7 tests, production build, and `npm audit --omit=dev` all passed. The build emits an existing Autoprefixer warning for `end` alignment. Root-worktree `npm ci` could not replace a locked SWC binary (EPERM); no process was stopped. Validation therefore used a separate temporary clean copy, not the Navbar worktree.
- Production audit remains 0 vulnerabilities. Full audit remains 5 high findings, all GHSA-vfj7-8cjw-p6xm (`braces <=3.0.3`) via `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`; the only npm-suggested remediation downgrades `eslint-config-next` to 14.2.35 as a major change. No downgrade/force fix was applied. Restricting lint tooling to trusted CI inputs limits exposure but does not remove the advisory.
- Live API contracts are unchanged: IslePilot server and players are 200 with public-field filtering; leaderboard/events/killfeed remain `MISSING_SCOPE` (403); Steam auth remains disabled (`CONTRACT_PENDING`). No mock data or bypass was introduced.
- Browser QA remains `PENDING`: no supported in-app browser automation runtime is available in this session. Manual checklist: launch fresh production output; at 1920/1440/430/390 px verify layout, nav, no horizontal overflow; directly navigate/refresh `/`; inspect console for hydration/runtime errors and Network for CSS/JS and API state responses; confirm player/server data and explicit missing-scope/disabled states. HTTP/API checks do not count as visual or hydration QA.
- Navbar work remains protected and unintegrated. Preserve `src/components/navigation/*`, `src/app/navbar-preview/*`, and all untracked Navbar artifacts. Integration readiness checklist: obtain explicit component/CSS handoff and preview QA; review component dependencies and responsive/accessibility behavior; compare the incoming diff; agree an isolated commit/checkpoint; only then integrate into the root layout and rerun full responsive/browser QA. Do not stage or commit the parallel work as part of Phase 2C.
- GitHub Actions passed: [run 39415600642](https://github.com/minhtuong547/webdaiviet/actions/runs/39415600642), commit `5da09b734821df13060675ea5dbe68f7ff2f5745` (`feature/phase2-live-api`). All workflow steps, including Secretlint and `npm audit --omit=dev`, succeeded. Browser QA and remaining API/auth scopes are still pending; this is not a production-ready claim.

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
| GitHub publish | `CONTRACT_PENDING` | Initial WIP commit was created on `feature/phase2-live-api` after confirming remote had no heads. Navbar-specific source/preview/automation remains untracked and was excluded from the commit. Push outcome is recorded below. |

## Security and tests

- `/api/islepilot/[resource]` is an explicit allowlist; arbitrary upstream paths and admin resources are not client-selectable. Only `GET` is implemented.
- Both public server endpoints whitelist output fields. Player responses fail closed for non-online entries and expose only display name, species, and online state. Automated tests cover sensitive-field removal, unsupported shapes, read-only endpoint registry, and signed-session tampering/expiry.
- `npm run check` passed (ESLint, TypeScript, 7/7 tests, isolated optimized build). `npm audit --omit=dev` now reports 0 findings after a compatible PostCSS override from 8.4.31 to 8.5.31; Next remains 15.5.28. Full `npm audit` reports 5 high findings, all the `braces` stack exhaustion advisory (`<=3.0.3`) in dev chain `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`; npm offers only a breaking downgrade to `eslint-config-next@14.2.35`. Registry currently has no braces 3.x patched release, so the dev finding remains open. No forced downgrade or framework-major upgrade was applied. No Next API usage changed; no migration-related breaking changes were introduced.
- Browser QA was not completed: `node_repl js` execution tool required by the available browser skill is not exposed in this session (tool discovery returned none). Do not interpret asset/API HTTP checks as visual/hydration/console QA. Owner manual QA: open `http://127.0.0.1:3187` at widths 1920, 1440, 430, and 390px; verify navigation/layout and player/error states, inspect DevTools Console for hydration/runtime errors and Network for API/CSS/JS 2xx; directly open `/api/islepilot/server`, `/api/islepilot/players`, and `/api/islepilot/leaderboard`. QA server has been stopped after HTTP checks.
- Remote URL is configured and had no branch heads immediately before publication. WIP branch `feature/phase2-live-api` was pushed successfully to `https://github.com/minhtuong547/webdaiviet/tree/feature/phase2-live-api`; HEAD is `838f5bf7f3a6d0e477621042e0fc5b12e7dcb36b`. Navbar Codex's `src/components/navigation/*`, `src/app/navbar-preview/*`, `.next-navbar-qa/`, `.qa-navbar-cdp.mjs`, and `.playwright-mcp/` were left untouched and unstaged. They remain untracked locally.

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
