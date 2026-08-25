# rp-recipe-card



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type      | Default |
| ------------- | -------------- | ----------- | --------- | ------- |
| `favorite`    | `favorite`     |             | `boolean` | `false` |
| `imageUrl`    | `image-url`    |             | `string`  | `''`    |
| `recipeId`    | `recipe-id`    |             | `string`  | `''`    |
| `recipeTitle` | `recipe-title` |             | `string`  | `''`    |
| `subtitle`    | `subtitle`     |             | `string`  | `''`    |


## Events

| Event                    | Description | Type                                                    |
| ------------------------ | ----------- | ------------------------------------------------------- |
| `recipe-favorite-toggle` |             | `CustomEvent<{ recipeId: string; favorite: boolean; }>` |
| `recipe-select`          |             | `CustomEvent<{ recipeId: string; }>`                    |


## Slots

| Slot        | Description |
| ----------- | ----------- |
| `"actions"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
