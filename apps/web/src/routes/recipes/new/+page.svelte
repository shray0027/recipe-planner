<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import RecipeForm from '$lib/components/RecipeForm.svelte';
	import { recipeStore } from '$lib/recipes/store';
	import type { RecipeDraft } from '$lib/recipes/types';

	const emptyDraft: RecipeDraft = {
		title: '',
		category: '',
		area: '',
		imageUrl: '',
		ingredients: [{ name: '', measure: '' }],
		instructions: ['']
	};

	function saveRecipe(draft: RecipeDraft) {
		const recipe = recipeStore.saveUserRecipe(draft);
		if (recipe) void goto(`${base}/recipes/${recipe.id}`);
	}
</script>

<svelte:head>
	<title>Add recipe | Recipe planner</title>
</svelte:head>

<section class="max-w-3xl py-8">
	<a class="font-bold text-recipe-700" href={`${base}/`}>← Back to recipes</a>
	<h1 class="mt-6 mb-2 text-4xl font-extrabold text-recipe-900">Add a recipe</h1>
	<p class="mb-8 text-stone-600">Save your own recipe to use in favorites and your meal plan.</p>
	<RecipeForm initialDraft={emptyDraft} submitLabel="Save recipe" onsaved={saveRecipe} />
</section>
