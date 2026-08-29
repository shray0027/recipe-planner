# Recipe Finder & Meal Planner

A SvelteKit recipe app that uses TheMealDB for discovery, browser storage for user data, and published Stencil Web Components for shared UI.

## Features

- Search, browse, and filter recipes from TheMealDB.
- View ingredients and cooking instructions.
- Create, edit, validate, and delete personal recipes.
- Save and remove favorite recipes.
- Plan favorite or personal recipes for each day of the week.

## Tech stack

- Svelte 5 and SvelteKit
- Tailwind CSS
- Stencil Web Components from [`@shray0027/recipe-ui`](https://www.npmjs.com/package/@shray0027/recipe-ui)
- TheMealDB API

## Setup

From the repository root, install the web app dependencies:

```sh
npm --prefix apps/web ci
```

Start the development server:

```sh
npm run dev:web
```

Build and type-check the app:

```sh
npm run check
npm --prefix apps/web run build
```

## Assumptions

- TheMealDB is available from the browser at runtime.
- Personal recipes, favorites, and meal plans are stored in `localStorage`, so they are specific to one browser and device.
- The meal planner offers personal recipes and favorite recipes, ensuring planned API recipes can be loaded again later.

## Deployment

### GitHub Pages

The repository includes a workflow that builds and deploys on every push to `main`. Enable GitHub Pages with **GitHub Actions** as the source, then push the repository to GitHub.

### Vercel

Import the repository into Vercel and set `apps/web` as the project root directory. Use `npm run build` as the build command and `build` as the output directory. The included `vercel.json` rewrites direct client-side route visits, such as `/recipes/52772`, to the app entry point.

## Links

- Stencil library: [`@shray0027/recipe-ui`](https://www.npmjs.com/package/@shray0027/recipe-ui)
- GitHub repository: [shray0027/svelte-recipe-app](https://github.com/shray0027/svelte-recipe-app)
- GitHub Pages deployment: `https://shray0027.github.io/svelte-recipe-app/` after the configured deployment workflow has run successfully.
