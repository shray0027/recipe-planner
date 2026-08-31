# Recipe Finder & Meal Planner

A Svelte 5 and SvelteKit application for discovering recipes, saving personal recipes, managing favorites, and planning meals for the week. Shared UI is delivered through a separately published Stencil component library.

## Features

- Search, browse, and filter recipes from TheMealDB.
- View recipe details, ingredients, and cooking instructions.
- Create, edit, validate, and delete personal recipes.
- Save and remove favorite recipes.
- Assign favorite or personal recipes to days in a weekly meal plan.
- Use published Stencil Web Components for recipe cards, form controls, favorite controls, meal slots, and recipe lists.

## Project structure

- `apps/web` — SvelteKit application with Tailwind CSS.
- `packages/recipe-ui` — Stencil component-library source for `@shray0027/recipe-ui`.

## Setup

Use Node.js 22 or later.

Install the application and component-library dependencies:

```sh
npm --prefix apps/web ci
npm --prefix packages/recipe-ui ci
```

Start the SvelteKit app:

```sh
npm run dev:web
```

Start the Stencil component library in watch mode (optional):

```sh
npm run dev:ui
```

Run checks and production builds:

```sh
npm run check
npm run build
```

## Assumptions

- TheMealDB is available in the browser at runtime.
- Personal recipes, favorites, and meal plans are stored in `localStorage`; they are specific to a browser and device.
- The weekly planner offers personal recipes and favorites, so planned recipes remain available to load later.

## Stencil library

The web app consumes the published npm package rather than importing from the local Stencil source.

- npm: [`@shray0027/recipe-ui`](https://www.npmjs.com/package/@shray0027/recipe-ui)
- Components: `rp-recipe-card`, `rp-meal-slot`, `rp-select`, `rp-search-input`, `rp-text-input`, `rp-favorite-button`, and `rp-recipe-list`.

## Deployment

GitHub Pages is configured through `.github/workflows/deploy-pages.yml`. Enable GitHub Pages with **GitHub Actions** as the source and push `main` to deploy it.

For Vercel, import the repository, select `apps/web` as the project root, use `npm run build`, and publish the `build` directory. The included `vercel.json` supports direct visits to client-side routes.

## Links

- GitHub repository: [shray0027/recipe-planner](https://github.com/shray0027/recipe-planner)
- Stencil package: [@shray0027/recipe-ui](https://www.npmjs.com/package/@shray0027/recipe-ui)
- GitHub Pages URL after deployment: `https://shray0027.github.io/recipe-planner/`
