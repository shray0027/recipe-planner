# @shray0027/recipe-ui

Reusable recipe cards and meal-planner web components built with Stencil.

## Components

- `<rp-recipe-card>` displays a recipe and emits `recipe-select` and `recipe-favorite-toggle` events.
- `<rp-meal-slot>` displays a day in a weekly plan and emits `meal-slot-select` and `meal-slot-remove` events.
- `<rp-select>` displays a labelled select input and emits `value-change` with the selected value.
- `<rp-search-input>` displays a labelled search input and emits `value-change` as the query changes.
- `<rp-favorite-button>` displays a favorite toggle and emits `favorite-toggle`.

Both components use Shadow DOM. `rp-recipe-card` provides an `actions` slot and `rp-meal-slot` provides an `empty` slot.

## Install

```bash
npm install @shray0027/recipe-ui
```

Register the custom elements once in the browser:

```ts
import { defineCustomElements } from '@shray0027/recipe-ui/loader';

defineCustomElements();
```

## Release

```bash
npm run build
npm publish
```

Source: https://github.com/shray0027/svelte-recipe-app
