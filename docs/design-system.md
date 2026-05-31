# GhostMode Design System

GhostMode should feel like observing your digital shadow in real time: dark, quiet, precise, and alive with telemetry.

## 1. Color Palette

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Void | `void` | `#05060b` | App background |
| Deep | `deep` | `#080b13` | Secondary backgrounds |
| Panel | `panel` | `#0d121f` | Glass cards |
| Cyan | `cyan` | `#35e9ff` | Live state, identity, primary actions |
| Blue | `blue` | `#4586ff` | Applications, neutral telemetry |
| Purple | `purple` | `#9b5cff` | Tracking entities, secondary actions |
| Pink | `pink` | `#ff4d9d` | High exposure, alerts |
| Amber | `amber` | `#ffb84d` | Permission warnings |
| Danger | `danger` | `#ff4d6d` | Critical risk |
| Success | `success` | `#38e88b` | Safe exposure |

## 2. Typography

- `font-display`: headings, scores, and large measurements.
- `font-sans`: readable body copy.
- `font-mono`: labels, timestamps, statuses, filters, and metadata.
- Use `.telemetry-label` for uppercase observability labels.

## 3. Spacing

- Base grid gap: `gap-4` / `16px`.
- Card padding: `p-4` for compact panels, `p-5` for primary panels.
- Section spacing: `mb-6`.
- Controls: `h-10` or `h-11`.

## 4. Cards

- Use `GlassPanel` for every dashboard surface.
- Use `variant="raised"` for dominant cards.
- Use `interactive` only when the whole card is actionable.
- Keep one focal visualization per screen.

## 5. Buttons

- `CyberButton variant="primary"`: main action.
- `secondary`: graph and filter actions.
- `danger`: destructive or critical actions.
- `ghost`: utilities and low-priority actions.

## 6. Risk Badges

- Low: cyan.
- Medium: amber.
- High: pink.
- Critical: glowing pink or danger red.

## 7. Glow Effects

- Use glow as a status signal, not decoration everywhere.
- Cyan means live or active.
- Purple means tracked relationships.
- Pink and danger red mean elevated exposure.

## 8. Animation

- Entrances: `fadeUp`, 320-450ms.
- Lists: `staggerContainer`, 80ms between items.
- Live indicators: `StatusDot` with a slow pulse.
- Charts: animate path length or fill once; keep looping movement subtle.
- Respect clarity: no large continuous transforms on reading surfaces.

## 9. Tailwind Theme

The Tailwind theme in `tailwind.config.ts` exposes colors, fonts, glows, radii, spacing, and `gm-pulse` / `gm-scan` animations.

## 10. Dashboard Rules

- Lead with one live observability surface.
- Pair large metrics with a short plain-language interpretation.
- Keep cards aligned to the 16px grid.
- Use mono text for machine state and sans text for explanations.
- Reserve red for meaningful risk.
- Every animated element should communicate activity, severity, or causality.
