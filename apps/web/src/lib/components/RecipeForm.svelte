<script lang="ts">
	import { validateRecipeDraft } from '$lib/recipes/store';
	import type { RecipeDraft, RecipeValidationErrors } from '$lib/recipes/types';
	import { setElementProps } from '$lib/web-components';

	interface Props {
		initialDraft: RecipeDraft;
		submitLabel: string;
		onsaved: (draft: RecipeDraft) => void;
	}

	let { initialDraft, submitLabel, onsaved }: Props = $props();
	let draft = $state<RecipeDraft>(createInitialDraft());
	let errors = $state<RecipeValidationErrors>({});
	const defaultCategories = [
		'Beef',
		'Breakfast',
		'Chicken',
		'Dessert',
		'Goat',
		'Lamb',
		'Miscellaneous',
		'Pasta',
		'Pork',
		'Seafood',
		'Side',
		'Starter',
		'Vegan',
		'Vegetarian'
	];
	let categoryOptions = $derived([...new Set([...defaultCategories, draft.category].filter(Boolean))]);

	function createInitialDraft(): RecipeDraft {
		return {
			...initialDraft,
			ingredients: initialDraft.ingredients.map((ingredient) => ({ ...ingredient })),
			instructions: [...initialDraft.instructions]
		};
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		errors = validateRecipeDraft(draft);
		if (Object.keys(errors).length === 0) onsaved(draft);
	}

	function addIngredient() {
		draft.ingredients = [...draft.ingredients, { name: '', measure: '' }];
	}

	function removeIngredient(index: number) {
		draft.ingredients = draft.ingredients.filter((_, itemIndex) => itemIndex !== index);
	}

	function addInstruction() {
		draft.instructions = [...draft.instructions, ''];
	}

	function removeInstruction(index: number) {
		draft.instructions = draft.instructions.filter((_, itemIndex) => itemIndex !== index);
	}
</script>

<form class="grid gap-7" onsubmit={submit}>
	<section class="grid gap-4 rounded-2xl bg-white p-6 shadow-sm">
		<h2 class="text-xl font-extrabold text-recipe-900">Recipe details</h2>
		<div class="grid gap-1.5">
			<rp-text-input
				use:setElementProps={{ label: 'Recipe title', value: draft.title }}
				onvalue-change={(event: CustomEvent<{ value: string }>) => (draft.title = event.detail.value)}
			></rp-text-input>
			{#if errors.title}<span class="text-sm text-rose-700">{errors.title}</span>{/if}
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="grid gap-1.5 text-sm font-bold text-recipe-900">
				<rp-select
					use:setElementProps={{
						label: 'Category',
						placeholder: 'Choose a category',
						options: categoryOptions,
						value: draft.category
					}}
					onvalue-change={(event: CustomEvent<{ value: string }>) => (draft.category = event.detail.value)}
				></rp-select>
				{#if errors.category}<span class="text-sm text-rose-700">{errors.category}</span>{/if}
			</div>
			<rp-text-input
				use:setElementProps={{ label: 'Cuisine', optional: true, placeholder: 'For example, Italian', value: draft.area }}
				onvalue-change={(event: CustomEvent<{ value: string }>) => (draft.area = event.detail.value)}
			></rp-text-input>
		</div>
		<rp-text-input
			use:setElementProps={{ label: 'Image URL', optional: true, placeholder: 'https://example.com/recipe.jpg', type: 'url', value: draft.imageUrl }}
			onvalue-change={(event: CustomEvent<{ value: string }>) => (draft.imageUrl = event.detail.value)}
		></rp-text-input>
	</section>

	<section class="grid gap-4 rounded-2xl bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-extrabold text-recipe-900">Ingredients</h2>
				{#if errors.ingredients}<p class="mt-1 text-sm text-rose-700">{errors.ingredients}</p>{/if}
			</div>
			<button class="rounded-lg border border-recipe-600 px-3 py-2 font-bold text-recipe-700" type="button" onclick={addIngredient}>Add ingredient</button>
		</div>
		<div class="grid gap-3">
			{#each draft.ingredients as ingredient, index}
				{@render ingredientRow(ingredient, index)}
			{/each}
		</div>
	</section>

	<section class="grid gap-4 rounded-2xl bg-white p-6 shadow-sm">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-extrabold text-recipe-900">Instructions</h2>
				{#if errors.instructions}<p class="mt-1 text-sm text-rose-700">{errors.instructions}</p>{/if}
			</div>
			<button class="rounded-lg border border-recipe-600 px-3 py-2 font-bold text-recipe-700" type="button" onclick={addInstruction}>Add step</button>
		</div>
		<div class="grid gap-3">
			{#each draft.instructions as _, index}
				{@render instructionRow(index)}
			{/each}
		</div>
	</section>

	<button class="justify-self-start rounded-lg bg-recipe-600 px-4 py-3 font-bold text-white" type="submit">{submitLabel}</button>
</form>

{#snippet ingredientRow(ingredient: RecipeDraft['ingredients'][number], index: number)}
	<div class="grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
		<input class="min-h-10 rounded-lg border border-recipe-300 px-3" bind:value={ingredient.name} placeholder="Ingredient" aria-label={`Ingredient ${index + 1}`} />
		<input class="min-h-10 rounded-lg border border-recipe-300 px-3" bind:value={ingredient.measure} placeholder="Amount" aria-label={`Amount for ingredient ${index + 1}`} />
		<button class="rounded-lg px-3 text-sm font-bold text-rose-700" type="button" onclick={() => removeIngredient(index)}>Remove</button>
	</div>
{/snippet}

{#snippet instructionRow(index: number)}
	<div class="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
		<span class="pt-2 font-bold text-recipe-700">{index + 1}.</span>
		<textarea class="min-h-24 rounded-lg border border-recipe-300 p-3" bind:value={draft.instructions[index]} aria-label={`Instruction ${index + 1}`}></textarea>
		<button class="rounded-lg px-3 text-sm font-bold text-rose-700" type="button" onclick={() => removeInstruction(index)}>Remove</button>
	</div>
{/snippet}
