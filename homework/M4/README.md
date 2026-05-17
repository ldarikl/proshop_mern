# M4 Design Homework Report

## Redesigned Pages

- [x] `/admin/featuredashboard` - redesigned required admin feature dashboard.
- [x] `/` / `HomeScreen.js` - redesigned product catalog home page.

## Tools Used

- React and React Bootstrap for the existing UI component foundation.
- Redux actions and reducers for API-driven feature flag state.
- `DESIGN.md` as the local design system source for color, typography,
  spacing, radius, elevation, components, and states.
- Jest + React Testing Library for dashboard behavior checks.

## Component Decisions

- Reused existing app patterns: `Message`, React Bootstrap form controls,
  `Table`, `Badge`, and Redux state selectors.
- Kept feature flag API access inside Redux actions instead of calling the API
  directly from the screen.
- Built custom CSS for the dashboard shell, summary stats, toolbar, table,
  loading skeleton, empty state, hover states, and focus states.
- Kept the dashboard toggle and traffic slider as local UI controls because the
  homework checklist verifies interaction feedback, not persistence.
- Kept the home page redesign lightweight: a catalog sidebar, product toolbar,
  stable product cards, empty/loading states, and pagination.

## Manual Verification Notes

- Admin route exists at `/admin/featuredashboard`.
- Admin dropdown links to `Feature Dashboard`.
- Dashboard displays feature flags from `features.json` through the backend API.
- Status badges show Enabled, Testing, and Disabled states.
- Toggle buttons update badge color/text in the UI.
- Traffic sliders update the visible percentage.
- Search by feature name and status filtering work.
- Loading skeleton, empty state, and error state are present.
- Keyboard-accessible labels are present for search, status filtering, toggles,
  and traffic sliders.
