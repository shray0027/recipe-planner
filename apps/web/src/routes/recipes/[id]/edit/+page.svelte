<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import RecipeForm from '$lib/components/RecipeForm.svelte';
	import { recipeStore } from '$lib/recipes/store';
	import type { RecipeDraft } from '$lib/recipes/types';

	let recipeId = $state('');
	let draft = $state<RecipeDraft | null>(null);

	onMount(() => {
		recipeId = page.params.id ?? '';
		const recipe = recipeStore.getUserRecipes().find((item) => item.id === recipeId);
		if (!recipe) return;
		draft = {
			title: recipe.title,
			category: recipe.category,
			area: recipe.area,
			imageUrl: recipe.imageUrl,
			ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
			instructions: [...recipe.instructions]
		};
	});

	function saveRecipe(nextDraft: RecipeDraft) {
		const recipe = recipeStore.saveUserRecipe(nextDraft, recipeId);
		if (recipe) void goto(`${base}/recipes/${recipe.id}`);
	}
</script>

<svelte:head>
	<title>Edit recipe | Recipe planner</title>
</svelte:head>

<section class="max-w-3xl py-8">
	<a class="font-bold text-recipe-700" href={`${base}/`}>← Back to recipes</a>
	{#if draft}
		<h1 class="mt-6 mb-2 text-4xl font-extrabold text-recipe-900">Edit recipe</h1>
		<p class="mb-8 text-stone-600">Update your saved recipe.</p>
		<RecipeForm initialDraft={draft} submitLabel="Save changes" onsaved={saveRecipe} />
	{:else}
		<div class="mt-8 rounded-xl bg-white p-6">
			<h1 class="text-2xl font-extrabold text-recipe-900">Recipe unavailable</h1>
			<p class="mt-2 text-stone-600">Only recipes you created can be edited.</p>
		</div>
	{/if}
</section>
