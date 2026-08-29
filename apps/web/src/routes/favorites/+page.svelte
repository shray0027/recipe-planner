<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { loadRecipesById } from '$lib/recipes/recipe-loader';
	import { recipeStore } from '$lib/recipes/store';
	import type { Recipe } from '$lib/recipes/types';
	import { setElementProps } from '$lib/web-components';

	let recipes = $state<Recipe[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function loadFavorites() {
		loading = true;
		error = '';
		try {
			recipes = await loadRecipesById(recipeStore.getFavoriteIds());
		} catch {
			error = 'Favorites could not be loaded. Please try again.';
		} finally {
			loading = false;
		}
	}

	function setFavorite(recipeId: string, favorite: boolean) {
		recipeStore.setFavorite(recipeId, favorite);
		if (!favorite) recipes = recipes.filter((recipe) => recipe.id !== recipeId);
	}

	function openRecipe(recipeId: string) {
		void goto(`${base}/recipes/${recipeId}`);
	}

	onMount(() => void loadFavorites());
</script>

<svelte:head>
	<title>Favorites | Recipe planner</title>
</svelte:head>

<section class="py-8" aria-live="polite">
	<p class="mb-2 text-xs font-extrabold tracking-widest text-recipe-600 uppercase">Your collection</p>
	<h1 class="mb-2 text-4xl font-extrabold text-recipe-900">Favorite recipes</h1>
	<p class="mb-8 text-stone-600">Keep your go-to recipes in one place.</p>

	{#if loading}
		<p class="rounded-xl bg-white p-6 text-stone-700">Loading favorites…</p>
	{:else if error}
		{@render feedback(error, 'Try again', () => void loadFavorites())}
	{:else if recipes.length === 0}
		{@render feedback('You have not saved any recipes yet.', 'Discover recipes', () => void goto(`${base}/`))}
	{:else}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
			{#each recipes as recipe (recipe.id)}
				<rp-recipe-card
					use:setElementProps={{
						recipeId: recipe.id,
						recipeTitle: recipe.title,
						imageUrl: recipe.imageUrl,
						subtitle: `${recipe.category}${recipe.area ? ` · ${recipe.area}` : ''}`,
						favorite: true
					}}
					onrecipe-select={(event: CustomEvent<{ recipeId: string }>) => openRecipe(event.detail.recipeId)}
					onrecipe-favorite-toggle={(event: CustomEvent<{ recipeId: string; favorite: boolean }>) =>
						setFavorite(event.detail.recipeId, event.detail.favorite)}
				></rp-recipe-card>
			{/each}
		</div>
	{/if}
</section>

{#snippet feedback(message: string, actionLabel: string, action: () => void)}
	<div class="rounded-xl bg-white p-6">
		<p class="mb-4 text-stone-700">{message}</p>
		<button class="rounded-lg bg-recipe-600 px-3 py-2 font-bold text-white" type="button" onclick={action}>{actionLabel}</button>
	</div>
{/snippet}
