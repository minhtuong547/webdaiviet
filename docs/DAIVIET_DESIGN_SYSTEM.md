# DAI VIET Design System

The source of truth for shared visual styles is `src/styles/tokens.css`,
`src/styles/theme.css`, and the reusable components in `src/components/ui/`.

**New DAI VIET pages MUST reuse existing design tokens and shared UI components before introducing new styles.**

## Tokens

Import `src/app/globals.css` once from the root layout. It imports the shared
tokens, global foundation, and utility classes. Components should consume
semantic variables instead of repeating literal colors or dimensions.

| Purpose | Tokens |
| --- | --- |
| Brand | `--dv-color-primary`, `--dv-color-primary-hover`, `--dv-color-primary-muted` |
| Surfaces | `--dv-color-background`, `--dv-color-surface`, `--dv-color-surface-elevated`, `--dv-color-surface-soft` |
| Text | `--dv-color-text`, `--dv-color-text-secondary`, `--dv-color-text-supporting`, `--dv-color-text-disabled` |
| Status | `--dv-color-online`, `--dv-color-warning`, `--dv-color-danger` |
| Borders and effects | `--dv-color-border`, `--dv-color-border-subtle`, `--dv-shadow-card`, `--dv-shadow-action`, `--dv-focus-ring` |
| Type | `--dv-font-sans`, `--dv-font-display`, `--dv-font-mono`, `--dv-text-*` |
| Spacing and shape | `--dv-space-*`, `--dv-radius-*` |
| Layout and motion | `--dv-container`, `--dv-nav-height`, `--dv-ticker-height`, `--dv-z-*`, `--dv-motion-*` |

Primary brand color is `--dv-color-primary: #ffbdbd`. Change it in
`src/styles/tokens.css` to update components that use the semantic brand token.
Do not duplicate it into page styles.

## Typography and spacing

- Inter is the body and supporting UI typeface; Be Vietnam Pro is used for
  display/brand headings; IBM Plex Mono is reserved for compact labels and
  data annotations.
- The spacing scale follows the inspected Figma values: 4, 6, 10, 12, 14, 16,
  24, 28, 36, 48, 64, and 72 px.
- Card and button radii use the shared `--dv-radius-*` scale. Avoid adding
  one-off radii to repeated components.

The current responsive conventions are component-owned media queries at
approximately 1100/1040 px (navigation and desktop columns), 800/760 px
(tablet composition), and 640/520/480 px (compact/mobile layout). Use CSS Grid
or Flexbox to reflow content; do not rely on fixed page-wide absolute
positioning. No breakpoint variables are used because CSS custom properties
cannot be used in media-query conditions consistently.

## Shared components

- `Button`: primary, secondary, and ghost actions; supports native disabled
  state and button attributes.
- `Card`: default, elevated, and quiet surfaces; use one card per framed tool or
  repeated item rather than wrapping whole page sections in cards.
- `Badge`: neutral, online, warning, and unavailable states.
- `StatusIndicator`: accessible status dot with visible label.
- `ProgressBar`: clamps numeric values and renders an empty track plus
  “Chưa có dữ liệu” when a verified value is absent.
- `Skeleton`: shared loading placeholder for future data-driven panels.

Example:

```tsx
<Card variant="elevated" className={styles.playerCard}>
  <h2>Garage Dino</h2>
  <Badge variant="unavailable">Chưa có dữ liệu</Badge>
  <Button variant="secondary" disabled>
    Chưa khả dụng
  </Button>
</Card>
```

For a Garage or Shop page, import these components and the same tokens. Put
page-specific layout in a colocated CSS Module such as
`src/app/garage/page.module.css`; do not copy `PortalHome.module.css`. Add a
shared primitive only when more than one real surface needs the same behavior
or style. Keep global CSS limited to font setup, tokens, resets, and shared
foundation rules.

## Accessibility and state

- Use native anchors only for existing routes and native buttons for actions.
- Keep unavailable actions visibly disabled; never use `href="#"` as a
  placeholder.
- Preserve `:focus-visible` styling and meaningful accessible names.
- Respect `prefers-reduced-motion` for animated elements.
- Keep missing, stale, or unauthorized data distinct from valid zero values.
- Never promote an API read-success state to a claim about game-server runtime
  health unless an explicit verified runtime status is available.
