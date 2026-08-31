<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { loadRecipesById } from '$lib/recipes/recipe-loader';
	import { recipeStore } from '$lib/recipes/store';
	import { WEEK_DAYS, type MealPlan, type Recipe, type WeekDay } from '$lib/recipes/types';
	import { setElementProps } from '$lib/web-components';

	const emptyPlan: MealPlan = {
		Monday: null,
		Tuesday: null,
		Wednesday: null,
		Thursday: null,
		Friday: null,
		Saturday: null,
		Sunday: null
	};

	let mealPlan = $state<MealPlan>(emptyPlan);
	let recipes = $state<Recipe[]>([]);
	let selectedDay = $state<WeekDay | null>(null);
	let loading = $state(true);
	let error = $state('');
	let recipesById = $derived(new Map(recipes.map((recipe) => [recipe.id, recipe])));

	async function loadPlanner() {
		loading = true;
		error = '';
		mealPlan = recipeStore.getMealPlan();
		try {
			const plannedIds = WEEK_DAYS.map((day) => mealPlan[day]).filter((id): id is string => Boolean(id));
			const savedRecipes = await loadRecipesById([...recipeStore.getFavoriteIds(), ...plannedIds]);
			const localRecipes = recipeStore.getUserRecipes();
			recipes = [
				...new Map(
					[...localRecipes, ...savedRecipes].map((recipe): [string, Recipe] => [recipe.id, recipe])
				).values()
			];
		} catch {
			error = 'Your saved recipes could not be loaded. Please try again.';
			recipes = recipeStore.getUserRecipes();
		} finally {
			loading = false;
		}
	}

	function openPicker(day: WeekDay) {
		selectedDay = day;
	}

	function assignRecipe(recipeId: string) {
		if (!selectedDay) return;
		recipeStore.setMeal(selectedDay, recipeId);
		mealPlan = recipeStore.getMealPlan();
		selectedDay = null;
	}

	function removeMeal(day: WeekDay) {
		recipeStore.setMeal(day, null);
		mealPlan = recipeStore.getMealPlan();
		if (selectedDay === day) selectedDay = null;
	}

	onMount(() => void loadPlanner());
</script>

<svelte:head>
	<title>Weekly planner | Recipe planner</title>
</svelte:head>

<section class="py-8">
	<p class="mb-2 text-xs font-extrabold tracking-widest text-recipe-600 uppercase">Monday to Sunday</p>
	<h1 class="mb-2 text-4xl font-extrabold text-recipe-900">Weekly meal planner</h1>
	<p class="mb-8 text-stone-600">Choose a saved recipe for each day. Select a planned meal to change it.</p>

	{#if error}
		<div class="mb-6 rounded-xl border border-rose-200 bg-white p-5 text-rose-800">
			<p>{error}</p>
			<button class="mt-3 rounded-lg bg-recipe-600 px-3 py-2 font-bold text-white" type="button" onclick={() => void loadPlanner()}>Try again</button>
		</div>
	{/if}

	{#if selectedDay}
		<section class="mb-8 rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-start justify-between gap-4">
				<div>
					<h2 class="text-xl font-extrabold text-recipe-900">Choose a recipe for {selectedDay}</h2>
					<p class="mt-1 text-stone-600">Favorites and recipes you created are available to plan.</p>
				</div>
				<button class="font-bold text-recipe-700" type="button" onclick={() => (selectedDay = null)}>Cancel</button>
			</div>
			{#if recipes.length === 0}
				<p class="text-stone-700">Save a recipe first, then return here to add it to your plan.</p>
				<a class="mt-3 inline-block font-bold text-recipe-700" href={resolve('/')}>Discover recipes</a>
			{:else}
				<div class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
					{#each recipes as recipe (recipe.id)}
						<button class="overflow-hidden rounded-xl border border-recipe-300 bg-white text-left" type="button" onclick={() => assignRecipe(recipe.id)}>
							{#if recipe.imageUrl}<img class="h-28 w-full object-cover" src={recipe.imageUrl} alt="" />{/if}
							<span class="block p-3 font-bold text-recipe-900">{recipe.title}</span>
						</button>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	{#if loading}
		<p class="rounded-xl bg-white p-6 text-stone-700">Loading your meal plan…</p>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each WEEK_DAYS as day}
				{@const recipe = mealPlan[day] ? recipesById.get(mealPlan[day]) : undefined}
				<rp-meal-slot
					use:setElementProps={{
						day,
						recipeId: recipe?.id ?? '',
						recipeTitle: recipe?.title ?? '',
						imageUrl: recipe?.imageUrl ?? ''
					}}
					onmeal-slot-select={(event: CustomEvent<{ day: string }>) => openPicker(event.detail.day as WeekDay)}
					onmeal-slot-remove={(event: CustomEvent<{ day: string }>) => removeMeal(event.detail.day as WeekDay)}
				>
					<button slot="empty" class="rounded-lg bg-recipe-600 px-3 py-2 font-bold text-white" type="button" onclick={() => openPicker(day)}>Choose a recipe</button>
				</rp-meal-slot>
			{/each}
		</div>
	{/if}
</section>
