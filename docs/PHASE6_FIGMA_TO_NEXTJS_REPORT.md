# Phase 6 — Figma to Next.js

Status: `PHASE6_FIGMA_IMPLEMENTATION_PARTIAL`

## Figma source and inspection

- Approved source: file `yf8BCREMpyRwGIGoICqr23`, owner-approved node `62:1735`.
- Guest Desktop 1440: `62:1736`; Player Desktop 1440: `62:2051`.
- Guest Mobile 390: `62:2421`; Player Mobile 390: `62:2724`.
- Figma remote MCP was installed in Codex and OAuth authentication succeeded.
- The available MCP response exposed the Guest Desktop frame (`62:1736`), its
  1440 px width, core colors, typography, spacing/radii, and asset metadata.
  The remaining approved frames and full component/interaction specs were not
  retrievable in this implementation session. Pixel parity is therefore not
  claimed.
- Inspected token values include brand action `#ffbdbd`, default surface
  `#17141c`, elevated surface `#211c26`, border `#39313f`, primary text
  `#f8f6f8`, secondary text `#aaa3b0`, Be Vietnam Pro, IBM Plex Mono, Inter,
  and 4–72 px spacing values.

## Implemented

- Replaced the Phase 4.4 marketing-style home with a portal composition using a
  compact welcome, a single disabled Steam action, garage previews, verified
  server data, read-only public roster, quick access states, and a shared
  footer.
- The page calls the existing `getPublicCommunityData()` server-side and
  renders only the existing safe server/player mapper output. It does not add
  endpoints, scopes, writes, or browser-visible API credentials.
- A server-side `dv_session` check reduces a valid HMAC session immediately to
  the non-identifying `guest` or `player` view mode. It requires
  `STEAM_AUTH_ENABLED=true`, passes no Steam ID into React, and makes the home
  route dynamic per request. IslePilot retains its existing explicit 30-second
  upstream fetch cache.
- Steam configuration endpoints now share the session validator's 32-character
  secret requirement, so a short secret cannot be advertised as configured.
- The server badge now says `API đã xác minh`; a successful read is not
  represented as proof that the game server runtime is online.
- Garage, Shop, map, leaderboard, skin editor, Donate, and Launcher remain
  disabled until the relevant route, contract, permission, payment provider, or
  download is verified.
- The 44 px Donate ticker is neutral, route-configurable, has a pause control,
  and respects reduced motion. No donation names or amounts are fabricated.
- Added reusable tokens, global foundations, and typed Button, Card, Badge,
  StatusIndicator, ProgressBar, and Skeleton primitives. See
  [DAIVIET_DESIGN_SYSTEM.md](DAIVIET_DESIGN_SYSTEM.md).
- Added responsive CSS modules for the portal, ticker, and footer. The Guest
  view does not render private Dino metrics. `DinoStatus` is an unconnected
  reusable component with optional values and no seeded mock values.

## Security and blockers

- Phase 2 IslePilot allowlists and public field filtering were not changed.
- Steam login remains disabled: the current Steam route returns
  `CONTRACT_PENDING`, and the existing session helper does not establish a
  verified OpenID callback/ownership flow by itself. The repository has no
  production issuer for `dv_session`; normal production traffic therefore
  remains Guest-only. The Player branch can only activate if a separately
  verified issuer has already created a valid signed session.
- The Player Desktop/Mobile composition is not connected to a verified Steam
  login or real authorized player-data contract. An isolated QA fixture was
  used only to exercise the non-identifying Player composition: it used a
  temporary test secret and signed test cookie outside the repository,
  performed no Player API request, exposed no Steam ID, and added no
  production route, issuer, or fake session mechanism.
- Figma artwork metadata includes concept-generated assets whose publication
  rights are not confirmed. No Figma-hosted artwork was copied to `public/`.
  The corresponding art-led frames do not yet have cleared visual equivalents.
- `docs/screenshots/` lists only browser captures actually produced in this
  run. The Player fixture captures demonstrate responsive composition and
  privacy behavior only; they are not evidence of a production-authenticated
  Player flow or approved player-data integration.

## Validation

An isolated clean QA copy was used because the root worktree dependency tree
is incomplete and may be in use. `.env.local` was copied only into that
ephemeral QA directory for real read-only API verification; no values were
printed, committed, or copied back.

| Check | Result |
| --- | --- |
| `npm ci` | Passed in isolated QA copy |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed, 19/19 |
| `npm run build` | Passed |
| `npm run secretlint` | Passed |
| `npm audit --omit=dev` | Passed, 0 production vulnerabilities |
| `git diff --check` | Passed |
| Full `npm audit` | 5 high dev-only findings in the existing `eslint-config-next` → `braces` chain; the offered remediation is a breaking downgrade and was not applied |

Production-output browser QA at 1920, 1440, 1280, 768, 430, and 390 px found
no horizontal overflow, no console errors, no page errors, and no failed
network requests. At 390 px the mobile drawer toggled from `false` to `true`,
the ticker pause control toggled from `false` to `true`, and a hard refresh
preserved the correct page title. The API response rendered real, filtered
server/player data in the Guest screenshots.

Screenshots:

- [Guest desktop 1440 full page](screenshots/phase6-guest-1440-full.png)
- [Guest mobile 390 full page](screenshots/phase6-guest-390-full.png)
- [Guest desktop viewport](screenshots/phase6-guest-1440.png)
- [Guest mobile viewport](screenshots/phase6-guest-390.png)
- [Player fixture desktop 1440](screenshots/phase6-player-1440-fixture.png)
- [Player fixture mobile 390](screenshots/phase6-player-390-fixture.png)

Player fixture QA ran against an isolated local server with an explicit
temporary test session only. At 1440 and 390 px it rendered
`data-viewer-mode="player"`, preserved the generic Player heading, contained
no fixture Steam ID, and produced no console errors, page errors, failed
requests, or horizontal overflow. The fixture process and its test-only
credentials are not repository artifacts and cannot create a production
session.

## Figma comparison

The inspected Guest 1440 hierarchy is represented: navigation, ticker,
compact welcome, disabled Steam identity control, server-status card, garage
and skin previews, quick access, community roster, and footer. Applied Figma
token values are documented above. Differences are intentional and recorded:

- No unlicensed Figma concept artwork is published.
- Real public counts, roster records, and missing capacity replace Figma mock
  numbers.
- Player 1440/390 have isolated composition/privacy QA captures, but no
  production-authenticated comparison: the repository has neither a verified
  Steam issuer nor an authorized player-data contract.

## Git publication

- Implementation commit: `8b84732` (`feat(home): implement phase 6 portal foundation`).
- Target branch: `feature/phase2-live-api`; no force push, deployment, or
  merge to `main` was performed.

This phase remains `PARTIAL` while the approved Player frames, verified Steam
auth, asset rights, and full frame-level visual comparisons are unresolved.
