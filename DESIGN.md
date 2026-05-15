# ProShop Design System

> Design system: Catalog Utility
> Format: Create React App + React Bootstrap + CSS custom properties
> Last updated: 2026-05-16

---

## 1. Color Palette

Use semantic CSS variables in `frontend/src/index.css`. Components should refer to
tokens, not raw hex values, when new UI is added or existing CSS is touched.

```css
:root {
  --color-background: #f7f8fa;
  --color-foreground: #111827;
  --color-surface: #ffffff;
  --color-surface-alt: #f5f7fb;
  --color-primary: #1f6feb;
  --color-primary-foreground: #ffffff;
  --color-accent: #0f766e;
  --color-muted: #6b7280;
  --color-border: #e4e7ec;
  --color-border-strong: #d8dde8;
  --color-danger: #dc2626;
  --color-warning: #b45309;
  --color-success: #15803d;
  --color-ring: #1f6feb;
}
```

| Role | Token | Usage |
| --- | --- | --- |
| Page background | `--color-background` | Main app background behind content |
| Primary text | `--color-foreground` | Product names, prices, headings |
| Surface | `--color-surface` | Cards, toolbars, panels, form controls |
| Alternate surface | `--color-surface-alt` | Chips, subtle empty/loading backgrounds |
| Primary action | `--color-primary` | Links, primary buttons, active pagination |
| Accent | `--color-accent` | Success-adjacent commerce accents, sparingly |
| Muted text | `--color-muted` | Metadata, helper text, inactive labels |
| Border | `--color-border` | Default dividers and card borders |
| Strong border | `--color-border-strong` | Inputs and secondary controls |
| Danger | `--color-danger` | Delete, validation errors, admin danger actions |
| Warning | `--color-warning` | Stock warnings, payment review notices |
| Success | `--color-success` | Paid, delivered, saved, in-stock states |
| Focus ring | `--color-ring` | Keyboard focus and visible control focus |

Dark mode strategy: no dark mode until explicitly implemented. If added later,
use CSS variables on `.dark`; do not add hardcoded `dark:*` style equivalents.

## 2. Typography

Font family: **Manrope**. It is intentionally not Inter because ProShop should
feel like a practical catalog tool, not a generic AI-generated dashboard.

Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Recommended import:

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
```

Mono font: **JetBrains Mono**, fallback `SFMono-Regular, Consolas, monospace`.
Use mono only for admin IDs, order numbers, logs, and debugging data.

| Step | Size | Line-height | Letter-spacing | Weight | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 40px | 1.15 | 0 | 700 | Rare campaign or featured product title |
| H1 | 32px | 1.2 | 0 | 700 | Page title |
| H2 | 24px | 1.25 | 0 | 600 | Section header |
| H3 | 20px | 1.35 | 0 | 600 | Card or panel header |
| H4 | 16px | 1.4 | 0 | 600 | Form group or sidebar subhead |
| Body | 16px | 1.6 | 0 | 400 | Primary content |
| Small | 14px | 1.5 | 0 | 400 | Secondary text, product metadata |
| Caption | 12px | 1.4 | 0 | 600 | Labels, badges, table metadata |
| Mono | 14px | 1.6 | 0 | 400 | IDs, SKUs, order numbers |

Do not scale font size with viewport width. Keep headings compact inside
catalog panels, product cards, admin tables, and toolbars.

## 3. Spacing Scale

Strict multiples of 8px only. Do not introduce arbitrary values such as 6px,
10px, 14px, 18px, 20px, or 22px in new styles.

```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 48px;
--space-6: 64px;
--space-7: 96px;
```

Usage:

| Token | Usage |
| --- | --- |
| `--space-1` | Icon gaps, compact inline gaps, badge padding |
| `--space-2` | Button/input padding, card internal gaps |
| `--space-3` | Card padding, toolbar gaps, form group gaps |
| `--space-4` | Page section padding, admin panel spacing |
| `--space-5` | Major section separation |
| `--space-6` | Top-level page blocks on desktop |
| `--space-7` | Rare hero or campaign spacing only |

## 4. Border Radius Scale

```css
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

Usage:

| Token | Usage |
| --- | --- |
| `--radius-none` | Tables, image edges that align to a container |
| `--radius-sm` | Badges, small inline controls |
| `--radius-md` | Buttons, inputs, product cards, catalog panels |
| `--radius-lg` | Modals, dropdowns, large empty states |
| `--radius-xl` | Rare high-emphasis panels only |
| `--radius-full` | Pills, avatar circles, toggle handles |

Default card radius is 8px. Do not make ecommerce cards look like oversized
rounded landing-page tiles.

## 5. Elevation / Shadow Approach

**Philosophy:** restrained light UI with depth from borders, background contrast,
and very subtle shadows only where they clarify layering.

```css
--shadow-none: none;
--shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.04);
--shadow-md: 0 8px 24px rgba(16, 24, 40, 0.08);
```

Elevation levels:

| Level | Surface | Shadow | Usage |
| --- | --- | --- | --- |
| 0 | `--color-background` | `--shadow-none` | Main page |
| 1 | `--color-surface` | `--shadow-sm` | Cards, catalog toolbar, sidebar panels |
| 2 | `--color-surface` | `--shadow-md` | Dropdowns, modals, popovers |

Never use heavy shadow presets for normal cards. Product imagery and content
hierarchy should do most of the visual work.

## 6. Component Patterns

### Cards

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: var(--radius-md);
box-shadow: var(--shadow-sm);
padding: var(--space-2);
```

Product cards must keep a stable image area, clamp long titles, align price
treatment across rows, and avoid nested card containers.

### Buttons

```css
primary:
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 8px 16px;

secondary:
  background: var(--color-surface);
  color: var(--color-foreground);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: 8px 16px;

ghost:
  background: transparent;
  color: var(--color-muted);
  border: 1px solid transparent;
```

Primary buttons are for checkout, add to cart, save changes, create product,
and other task-completing actions. Secondary buttons are for navigation and
lower-risk actions. Danger buttons are only for destructive admin actions.

### Inputs

```css
background: var(--color-surface);
border: 1px solid var(--color-border-strong);
border-radius: var(--radius-md);
color: var(--color-foreground);
padding: 8px 16px;
```

Every input needs a visible label or accessible label. Validation messages live
near the field they describe and use `--color-danger`.

### Badges / Chips

```css
background: var(--color-surface-alt);
border: 1px solid var(--color-border-strong);
border-radius: var(--radius-full);
color: var(--color-muted);
font-size: 12px;
font-weight: 600;
padding: 8px 16px;
```

Use badges for order status, paid/delivered labels, role labels, stock state,
and lightweight catalog shortcuts. Do not use badges as decorative filler.

### Tables

Admin tables should prioritize scanning: compact row height, clear column
headers, visible actions, no decorative backgrounds per cell. Use status badges
instead of colored entire rows.

### Messages

Continue using the existing `Message` component for API errors and notices.
Error copy should name what failed and the next available action when possible.

## 7. Interactive States

Every interactive element must define these states. If a component cannot
support one of them, document the reason in the component code review.

| Element | Default | Hover | Focus | Active | Loading | Empty / Disabled | Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | Normal surface, clear label | Slight background shift, no layout movement | 2px ring using `--color-ring`, offset 2px | Pressed color shift | Spinner or text lock, opacity 0.7, `cursor: wait` | Opacity 0.5, `cursor: not-allowed`, no click | Danger styling for destructive failures |
| Input | Surface with strong border | Border shifts to `--color-primary` | 2px ring, visible label retained | N/A | Disabled while submitting when needed | Muted surface, value still readable | Border and message use `--color-danger` |
| Card | Surface, border, stable media area | Border or title color shift, no card jump | Outline ring when card/link receives focus | N/A | Skeleton media/text blocks | Empty state replaces list/grid | Error state appears in containing section |
| Link | Primary or inherited text | Underline or color shift | 2px ring or visible outline | Darker primary | N/A | N/A | N/A |
| Badge | Semantic background | No hover unless clickable | Ring if clickable | N/A | N/A | Muted style for inactive state | Danger/warning/success token |
| Table row action | Icon/text button | Background shift | Ring on control | Pressed color shift | Row action disabled while saving | Disabled action remains visible | Inline error or message component |

Loading states:

- Page-level data loads may use existing `Loader`.
- Catalog and admin lists should prefer skeleton blocks when the layout is known.
- Action-triggered loading should keep the control width stable.

Empty states:

- Every list, grid, and table must have a designed empty state.
- Empty state content: title, short explanation, and optional primary CTA.
- Search empty states should include the search term and a path back to browsing.

Error states:

- API errors should stay inside the workflow region that failed.
- Do not replace the entire app shell with an error unless routing failed.
- Admin errors should preserve entered form data where possible.

## 8. Animation / Transitions

Animation should clarify state, not decorate the page.

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease-out;
```

Use:

- Hover color shifts: 150ms.
- Modal/dropdown fade: 200ms.
- Skeleton shimmer: 1.5s only for loading placeholders.
- Button active state: immediate or 150ms.

Never use random parallax, decorative floating elements, or transitions longer
than 300ms.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 9. Accessibility

Contrast:

- Body text on page or cards: WCAG AA, minimum 4.5:1.
- Large text and UI component boundaries: minimum 3:1.
- Placeholder text must not be the only label.

Keyboard:

- All links, buttons, form fields, pagination, and admin row actions must be
  reachable by keyboard.
- Focus must be visible and never removed without replacement.
- Modals must trap focus and return focus to the trigger when closed.

ARIA:

- Decorative icons use `aria-hidden="true"`.
- Icon-only buttons require `aria-label`.
- Dynamic errors use `aria-live="polite"` unless urgent.
- Forms use native labels whenever possible.

Touch:

- Mobile touch targets must be at least 44px by 44px.
- Adjacent destructive and primary actions need enough spacing to avoid mistakes.

## 10. Implementation Format

Current project stack:

```text
Frontend:         Create React App, React 16, React Bootstrap
Routing:          react-router-dom v5
State:            Redux + redux-thunk
Styling:          frontend/src/index.css plus Bootstrap classes
Icons:            Avoid new icon dependency unless explicitly approved
Token system:     CSS custom properties in frontend/src/index.css
```

Implementation rules:

- Extend existing React Bootstrap patterns before introducing new component
  libraries.
- API calls must remain in Redux actions, not React components.
- CSS variables should be defined once near the top of `frontend/src/index.css`.
- New CSS class names should describe product UI concepts, not visual accidents.
- Do not introduce Tailwind, shadcn/ui, or a design-token build pipeline unless
  that migration is the explicit task.

## 11. Anti-AI-slop Guards (mandatory)

### Layout & composition

- **NO 2-column comparison blocks.** Forbidden patterns: «Without us / With us»,
  «Before / After», «Old way / New way» side-by-side. Use single-column
  storytelling or 3-card grid instead. If comparison is unavoidable —
  use a table, not two columns.
- **ASCII wireframe first.** Before generating UI code: produce an ASCII
  wireframe of the page layout (HERO / sections / cards / footer).
  Then generate code that matches the wireframe EXACTLY. Do not invent
  additional sections.
- **Generous spacing between sections.** Padding between major sections:
  minimum 48px on desktop, 32px on mobile. Section internal padding:
  minimum 24px. Never 12-16px between sections.

### Visual style

- **NO gradients on backgrounds, buttons, or hero blocks.** Use solid
  colors only — clean white / gray / black / metallic palette from
  DESIGN.md tokens. Single exception: skeleton loader shimmer animation.
- **Cards: subtle elevation, NEVER heavy borders.** Use 1px border at
  10% opacity (`border: 1px solid color-mix(in srgb, var(--border) 10%, transparent)`)
  or no border with background contrast. Forbidden: `border: 2px+`,
  `border: 3px solid black`, double borders.
- **shadcn/ui MUST be customized.** Do not ship default shadcn theme
  (slate / zinc / gray out-of-box). Use TweakCN.com to generate
  brand-aligned theme, export as CSS variables, paste into globals.css.

### UX-first thinking

- **User journey before visual style.** Before generating any page —
  answer: (1) Who is on this page? (2) What are they trying to do?
  (3) Where is the primary CTA? (4) What is the next logical step?
  Visual decisions follow user journey, not the other way around.
- **Primary CTA must be above the fold.** Hero with full-screen height
  pushing content below fold = anti-pattern. Hero takes max 60vh,
  primary CTA visible without scroll on 1366×768 desktop.
- **Contrast ≥ 4.5:1 for body text always.** No light-gray text on
  white because «it looks aesthetic in screenshots». UX > screenshot
  beauty.

### Magic phrase (put first in system prompt)

> «Be a human designer so it doesn't look like AI. With design taste.»

