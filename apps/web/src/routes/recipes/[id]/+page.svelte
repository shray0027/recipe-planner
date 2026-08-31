<script lang="ts">
import { resolve } from '$app/paths';
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
    void goto(resolve('/'));
}

onMount(() => void loadRecipe());
</script>

<svelte:head>
    <title>{recipe ? `${recipe.title} | Recipe planner` : 'Recipe details | Recipe planner'}</title>
</svelte:head>

{#if loading}
    <p class="mt-9 rounded-2xl bg-white p-6 text-stone-700">Loading recipe…</p>
{:else if error || !recipe}
    <section class="mt-9 rounded-2xl border border-rose-200 bg-white p-6">
        <h1 class="mb-3 text-3xl font-extrabold text-recipe-900">Recipe unavailable</h1>
        <p>{error}</p>
        <a class="mt-4 inline-block font-bold text-recipe-700" href={resolve('/')}>Back to recipes</a>
    </section>
{:else}
    <section class="py-6 pb-10">
        <a class="mb-6 inline-block font-bold text-recipe-700" href={resolve('/')}>← Back to recipes</a>
        <div class="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(260px,420px)]">
            <div>
                <p class="mb-2 text-xs font-extrabold tracking-widest text-recipe-600 uppercase">{recipe.source === 'local' ? 'My recipe' : 'Recipe'}</p>
                <h1 class="mb-2 text-4xl leading-none font-extrabold tracking-tight text-recipe-900 sm:text-6xl">{recipe.title}</h1>
                <p class="text-lg text-stone-600">{recipe.category}{recipe.area ? ` · ${recipe.area}` : ''}</p>
                <div class="mt-6 flex flex-wrap gap-2.5">
                    <rp-favorite-button
                        use:setElementProps={{ favorite, recipeTitle: recipe.title }}
                        onfavorite-toggle={(event: CustomEvent<{ favorite: boolean }>) => setFavorite(event.detail.favorite)}
                    ></rp-favorite-button>
                    {#if recipe.source === 'local'}
                        <a class="min-h-10 rounded-lg border border-recipe-600 bg-white px-3 py-2 font-bold text-recipe-700" href={resolve('/recipes/[id]/edit', { id: recipe.id })}>Edit recipe</a>
                        <button class="min-h-10 rounded-lg border border-rose-200 bg-white px-3 py-2 font-bold text-rose-800" type="button" onclick={deleteRecipe}>Delete recipe</button>
                    {/if}
                </div>
            </div>
            {#if recipe.imageUrl}
                <img class="aspect-4/3 w-full rounded-2xl object-cover" src={recipe.imageUrl} alt={recipe.title} />
            {/if}
        </div>
    </section>

    <div class="grid gap-8 pb-12 lg:grid-cols-[minmax(220px,.7fr)_minmax(0,1.3fr)]">
        <rp-recipe-list
            use:setElementProps={{
                heading: 'Ingredients',
                items: recipe.ingredients.map((ingredient) => `${ingredient.measure ? `${ingredient.measure} ` : ''}${ingredient.name}`)
            }}
        ></rp-recipe-list>
        <rp-recipe-list
            use:setElementProps={{ heading: 'Instructions', items: recipe.instructions, ordered: true }}
        ></rp-recipe-list>
    </div>
{/if}
