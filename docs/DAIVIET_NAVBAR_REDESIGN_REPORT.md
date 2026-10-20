# DAI VIET Navbar Redesign Report

Status: `NAVBAR_PARTIAL`

## Delivered

- `src/components/navigation/DaiVietNavbar.tsx`: standalone client navbar with active route state, desktop dropdowns, mobile drawer and accordion menus.
- `src/components/navigation/DaiVietNavbar.module.css`: encapsulated dark-luxury/pastel-pink responsive design, focus states, reduced-motion support and overflow-safe breakpoints.
- `src/components/navigation/navigation.config.ts`: centralized navigation contract. Existing home is the only user-facing page route currently present; every other missing page or unverified action is represented by `href: null` and an explicit status.
- `src/app/navbar-preview/page.tsx` and `page.module.css`: private preview surface at `/navbar-preview`. It is not included in public navigation.

## Route mapping

| Item | Current mapping | State |
| --- | --- | --- |
| Trang chủ | `/` | Available |
| Garage Dino / Garage Skin | No page route in current App Router | Sắp ra mắt |
| Shop Dino / Shop Skin | API contracts exist, no page route | Sắp ra mắt |
| Bản đồ trực tiếp | No page route in current App Router | Chưa có route |
| Bảng Xếp Hạng | API endpoint exists, no page route | Chưa có route |
| Chỉnh sửa Skin | No page route; skin apply is not enabled here | Sắp ra mắt |
| Donate | No verified payment URL | Chưa có cổng thanh toán |
| Tải Launcher | No verified owner URL | Sắp ra mắt |

Steam account controls are omitted because the existing Steam auth endpoint is not configured for a working login flow.

## Interaction and accessibility

- Garage and Shop open on desktop hover or click, close on outside click and Escape, and support Arrow Up/Down keyboard entry.
- Dropdowns use `role="menu"`, `role="menuitem"`, `aria-haspopup`, `aria-expanded`, visible focus states and route-change cleanup.
- Mobile uses a touch-friendly drawer with accordion sections and an Escape close path.
- Unavailable actions are non-navigating controls with explicit status text; no fake download, payment, skin apply or backend route was added.
- `prefers-reduced-motion` disables transition-heavy effects.

## Browser QA

Verified in an isolated Chrome session against the production preview build:

- Desktop default, Garage dropdown and Shop dropdown screenshots were captured.
- Mobile drawer screenshot was captured at 390px.
- Document width matched the viewport at 390px, 430px, 768px, 1280px, 1440px and 1920px.
- No browser runtime exceptions were observed in that pass.
- `npm run typecheck`, `npm run lint` and the isolated production build passed before the last focus/inert/accordion refinements.

The final CSS/accessibility refinements were made after that production build. The final mobile accordion screenshots and a rerun of the build/browser checks could not be completed because the shared `node_modules` tree became incomplete while the parallel backend session was active (`next/dist/bin/next`, local TypeScript, and `lucide-react` files were missing). The dev server then reported `lucide-react` module resolution errors. The shared dependency tree was left untouched. Treat the current status as partial until dependencies are restored and those checks are rerun.

Screenshots captured: [desktop default](screenshots/navbar-desktop.png), [Garage open](screenshots/navbar-garage-open.png), [Shop open](screenshots/navbar-shop-open.png), and [mobile drawer](screenshots/navbar-mobile-open.png). Mobile accordion expanded-state screenshots are still required.

The final integration point is the root layout: import `DaiVietNavbar` and render it above `{children}` after the parallel API/auth work confirms `src/app/layout.tsx` is safe to modify. This task intentionally leaves that file unchanged.
