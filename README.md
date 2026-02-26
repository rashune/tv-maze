# TVMaze Dashboard

A responsive Vue 3 dashboard that:

- groups shows by genre
- sorts each genre row by rating (desc)
- supports show detail navigation
- supports name search

## Data Source

Default base URL is TVMaze API (`https://api.tvmaze.com`).

Shows are fetched from `${baseUrl}/shows` (for example: `https://api.tvmaze.com/shows`).

You can override the base URL with:

```bash
VITE_BASE_URL=https://api.tvmaze.com
```

## Requirements

- Node.js: `v22.20.0`
- npm: `10.9.3`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Tech

- Vue 3 + TypeScript + Vite
- Vue Router for dashboard/detail navigation
- Vitest + Vue Test Utils for unit tests

## Architecture

- `services/` isolates fetch + cache + mapping logic from UI concerns.
- In-memory caching in the service layer.
- `utils/` keeps deterministic grouping/sorting/search logic testable.
- grouping and rating sort are mapped as separate steps in the dashboard computed flow for readability and composability.
- uses a reusable scroll container with toggleable arrows and scrollbar visibility.
- vertical scrollable container is not tested as it was not needed.
- reusable `useShows` composable for shared show fetching/loading/error state across dashboard and detail views.
- reusable route scroll memory via `useRouteScrollMemory` so returning from detail restores dashboard vertical position.
- scroll-to-top button that appears after scrolling beyond one viewport.
- detail poster image strategy:
  - mobile/tablet: medium image
  - desktop: original image
  - implemented via reusable `useResponsiveImageSource` composable.

## Navigation UX

- dashboard vertical scroll position is saved before route leave and restored when returning from detail pages.
- this is implemented via a reusable composable (`useRouteScrollMemory`) so other routes can adopt the same pattern.
- for further development, the same idea can be applied to preserve horizontal scroll state per genre row.

## Design System (Atoms -> Molecules)

- uses shared design tokens + SCSS atoms for consistent styling.
- `styles/atoms/` contains low-level reusable mixins (layout, typography, surface, media, forms, buttons).
- `styles/molecules/` composes those atoms into higher-level patterns.
- `styles/molecules/_card.scss` surfaces the card pattern as a molecule, consumed in `ShowCard.vue` via class-based includes.
- other repeated component patterns can be promoted to molecules the same way to keep styles readable and composable.
