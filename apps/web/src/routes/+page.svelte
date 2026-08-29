<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { recipeApi } from '$lib/recipes/recipe-api';
	import { recipeStore } from '$lib/recipes/store';
	import type { Recipe } from '$lib/recipes/types';
	import { setElementProps } from '$lib/web-components';

	let query = $state('');
	let category = $state('');
	let area = $state('');
	let recipes = $state<Recipe[]>([]);
	let categories = $state<string[]>([]);
	let areas = $state<string[]>([]);
	let favoriteIds = $state<string[]>([]);
	let loading = $state(true);
	let error = $state('');

	function matchesFilters(recipe: Recipe) {
		const search = query.trim().toLowerCase();
		return (
			(!search || recipe.title.toLowerCase().includes(search)) &&
			(!category || recipe.category === category) &&
			(!area || recipe.area === area)
		);
	}

	async function loadRecipes() {
		loading = true;
		error = '';
		try {
			const filters = { query, category, area };
			const apiRecipes = query.trim()
				? await recipeApi.searchRecipes(filters)
				: await recipeApi.browseRecipes(filters);
			const localRecipes = recipeStore.getUserRecipes().filter(matchesFilters);
			recipes = [...localRecipes, ...apiRecipes];
			favoriteIds = recipeStore.getFavoriteIds();
		} catch {
			error = 'Recipes could not be loaded. Please try again.';
			recipes = [];
		} finally {
			loading = false;
		}
	}

	async function loadFilterOptions() {
		try {
			[categories, areas] = await Promise.all([recipeApi.getCategories(), recipeApi.getAreas()]);
		} catch {
			// Search and browse still work if the filter options cannot load.
		}
	}

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		void loadRecipes();
	}

	function clearFilters() {
		query = '';
		category = '';
		area = '';
		void loadRecipes();
	}

	function toggleFavorite(recipeId: string) {
		recipeStore.toggleFavorite(recipeId);
		favoriteIds = recipeStore.getFavoriteIds();
	}

	function openRecipe(recipeId: string) {
		void goto(`${base}/recipes/${recipeId}`);
	}

	onMount(() => {
		void loadFilterOptions();
		void loadRecipes();
	});
</script>

<svelte:head>
	<title>Discover recipes | Recipe planner</title>
</svelte:head>

<section class="max-w-2xl py-12">
	<p class="mb-2 text-xs font-extrabold tracking-widest text-recipe-600 uppercase">Cook with confidence</p>
	<h1 class="mb-3 text-5xl leading-none font-extrabold tracking-tight text-recipe-900 sm:text-6xl">Find your next favorite recipe.</h1>
	<p class="text-lg text-stone-600">Search TheMealDB recipes, save the ones you love, and plan your week.</p>
</section>

<form class="grid items-end gap-4 rounded-2xl bg-white p-5 shadow-sm lg:grid-cols-[2fr_1fr_1fr_auto]" onsubmit={submitSearch}>
	<rp-search-input
		use:setElementProps={{ label: 'Search recipes', placeholder: 'Try chicken, pasta, or curry', value: query }}
		onvalue-change={(event: CustomEvent<{ value: string }>) => (query = event.detail.value)}
	></rp-search-input>
	<rp-select
		use:setElementProps={{ label: 'Category', placeholder: 'All categories', options: categories, value: category }}
		onvalue-change={(event: CustomEvent<{ value: string }>) => (category = event.detail.value)}
	></rp-select>
	<rp-select
		use:setElementProps={{ label: 'Cuisine', placeholder: 'All cuisines', options: areas, value: area }}
		onvalue-change={(event: CustomEvent<{ value: string }>) => (area = event.detail.value)}
	></rp-select>
	<div class="flex gap-2">
		<button class="min-h-10 rounded-lg bg-recipe-600 px-3 font-bold text-white" type="submit">Search</button>
		<button class="min-h-10 rounded-lg border border-recipe-600 bg-white px-3 font-bold text-recipe-700" type="button" onclick={clearFilters}>Clear</button>
	</div>
</form>

<section class="py-12" aria-live="polite">
	<div class="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="mb-2 text-xs font-extrabold tracking-widest text-recipe-600 uppercase">Recipe discovery</p>
			<h2 class="text-3xl font-extrabold text-recipe-900">{loading ? 'Finding recipes…' : `${recipes.length} recipes`}</h2>
		</div>
		<a class="font-bold text-recipe-700" href={`${base}/recipes/new`}>Create your own recipe</a>
	</div>

	{#if error}
		{@render feedback(error, 'Try again', () => void loadRecipes(), true)}
	{:else if !loading && recipes.length === 0}
		{@render feedback('No recipes match those filters.', 'Clear filters', clearFilters)}
	{:else if !loading}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
			{#each recipes as recipe (recipe.id)}
				<rp-recipe-card
					use:setElementProps={{
						recipeId: recipe.id,
						recipeTitle: recipe.title,
						imageUrl: recipe.imageUrl,
						subtitle: `${recipe.category}${recipe.area ? ` · ${recipe.area}` : ''}`,
						favorite: favoriteIds.includes(recipe.id)
					}}
					onrecipe-select={(event: CustomEvent<{ recipeId: string }>) => openRecipe(event.detail.recipeId)}
					onrecipe-favorite-toggle={(event: CustomEvent<{ recipeId: string; favorite: boolean }>) =>
						toggleFavorite(event.detail.recipeId)}
				>
					{#if recipe.source === 'local'}
						<span slot="actions">My recipe</span>
					{/if}
				</rp-recipe-card>
			{/each}
		</div>
	{/if}
</section>

{#snippet feedback(message: string, actionLabel: string, action: () => void, isError = false)}
	<div class={`rounded-xl bg-white p-6 ${isError ? 'border border-rose-200' : ''}`}>
		<p class="mb-4 text-stone-700">{message}</p>
		<button class="min-h-10 rounded-lg bg-recipe-600 px-3 font-bold text-white" type="button" onclick={action}>{actionLabel}</button>
	</div>
{/snippet}
