<script lang="ts">
import {
    base
} from '$app/paths';
import {
    page
} from '$app/state';
import {
    goto
} from '$app/navigation';
import {
    onMount
} from 'svelte';
import {
    recipeApi
} from '$lib/recipes/recipe-api';
import {
    recipeStore
} from '$lib/recipes/store';
import {
    setElementProps
} from '$lib/web-components';
import type {
    Recipe
} from '$lib/recipes/types';

let recipe = $state < Recipe | null > (null);
let loading = $state(true);
let error = $state('');
let favorite = $state(false);

async function loadRecipe() {
    loading = true;
    error = '';
    const id = page.params.id;
    if (!id) {
        error = 'That recipe could not be found.';
        loading = false;
        return;
    }
    try {
        recipe = recipeStore.getUserRecipes().find((item) => item.id === id) ?? null;
        if (!recipe) recipe = await recipeApi.getRecipe(id);
        favorite = recipe ? recipeStore.getFavoriteIds().includes(recipe.id) : false;
        if (!recipe) error = 'That recipe could not be found.';
    } catch {
        error = 'Recipe details could not be loaded. Please try again.';
    } finally {
        loading = false;
    }
}

function setFavorite(nextFavorite: boolean) {
    if (!recipe) return;
    recipeStore.setFavorite(recipe.id, nextFavorite);
    favorite = nextFavorite;
}

function deleteRecipe() {
    if (!recipe || !confirm(`Delete ${recipe.title}?`)) return;
    recipeStore.deleteUserRecipe(recipe.id);
    void goto(`${base}/`);
}

onMount(() => void loadRecipe());
</script>

<svelte:head>
    <title>{recipe ? `${recipe.title} | Recipe planner` : 'Recipe details | Recipe planner'}</title>
    </svelte:head>

    {#if loading}
    <p class="message">Loading recipe…</p>
    {:else if error || !recipe}
    <section class="message error">
        <h1>Recipe unavailable</h1>
        <p>{error}</p>
        <a href={`${base}/`}>Back to recipes</a>
    </section>
    {:else}
    <section class="recipe-header">
        <a class="back" href={`${base}/`}>← Back to recipes</a>
        <div class="header-content">
            <div>
                <p class="eyebrow">{recipe.source === 'local' ? 'My recipe' : 'Recipe'}</p>
                <h1>{recipe.title}</h1>
                <p class="meta">{recipe.category}{recipe.area ? ` · ${recipe.area}` : ''}</p>
                <div class="actions">
                    <rp-favorite-button
                        use:setElementProps={{ favorite, recipeTitle: recipe.title }}
                        onfavorite-toggle={(event: CustomEvent<{ favorite: boolean }>) => setFavorite(event.detail.favorite)}
                    ></rp-favorite-button>
                    {#if recipe.source === 'local'}
                    <a class="edit" href={`${base}/recipes/${recipe.id}/edit`}>Edit recipe</a>
                    <button type="button" class="delete" onclick={deleteRecipe}>Delete recipe</button>
                    {/if}
                </div>
            </div>
            {#if recipe.imageUrl}
            <img src={recipe.imageUrl} alt={recipe.title} />
            {/if}
        </div>
    </section>

    <div class="details-grid">
        <section>
            <h2>Ingredients</h2>
            <ul class="ingredients">
                {#each recipe.ingredients as ingredient}
                <li>{ingredient.measure ? `${ingredient.measure} ` : ''}{ingredient.name}</li>
                {/each}
            </ul>
        </section>
        <section>
            <h2>Instructions</h2>
            <ol class="instructions">
                {#each recipe.instructions as instruction}
                <li>{instruction}</li>
                {/each}
            </ol>
        </section>
    </div>
    {/if}

<style>
.recipe-header {
    padding: 24px 0 40px;
}

.back {
    display: inline-block;
    margin-bottom: 24px;
    color: #355d3b;
    font-weight: 700;
}

.header-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 420px);
    gap: 40px;
    align-items: center;
}

.eyebrow {
    margin: 0 0 8px;
    color: #3f6b45;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

h1,
h2,
p {
    margin-top: 0;
}

h1 {
    margin-bottom: 10px;
    font-size: clamp(2.25rem, 6vw, 4rem);
    line-height: 1;
}

.meta {
    color: #5c6b5a;
    font-size: 1.05rem;
}

img {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 14px;
    object-fit: cover;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
}

.actions :is(button, .edit) {
    min-height: 42px;
    border: 1px solid #3f6b45;
    border-radius: 8px;
    padding: 9px 12px;
    color: #ffffff;
    background: #3f6b45;
    font: inherit;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
}

.actions .edit {
    color: #355d3b;
    background: #ffffff;
}

.actions .delete {
    color: #8d2538;
    border-color: #e7b6be;
    background: #ffffff;
}

.details-grid {
    display: grid;
    grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
    gap: 32px;
    padding-bottom: 48px;
}

.details-grid section,
.message {
    padding: 24px;
    border-radius: 14px;
    background: #ffffff;
}

h2 {
    margin-bottom: 16px;
}

.ingredients,
.instructions {
    margin: 0;
    padding-left: 22px;
}

.ingredients li,
.instructions li {
    margin-bottom: 12px;
    line-height: 1.55;
}

.message {
    margin-top: 36px;
}

.message.error {
    border: 1px solid #e7b6be;
}

@media (max-width: 700px) {

    .header-content,
    .details-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .header-content img {
        max-width: 560px;
    }
}
</style>
