import { recipeApi } from './recipe-api';
import { recipeStore } from './store';
import type { Recipe } from './types';

export async function loadRecipesById(ids: string[]): Promise<Recipe[]> {
	const localRecipes = recipeStore.getUserRecipes();
	const localById = new Map(localRecipes.map((recipe) => [recipe.id, recipe]));
	const apiIds = ids.filter((id) => !localById.has(id));
	const apiRecipes = await Promise.all(apiIds.map((id) => recipeApi.getRecipe(id)));
	const recipesById = new Map<string, Recipe>([
		...localById,
		...apiRecipes
			.filter((recipe): recipe is Recipe => recipe !== null)
			.map((recipe): [string, Recipe] => [recipe.id, recipe])
	]);

	return ids.map((id) => recipesById.get(id)).filter((recipe): recipe is Recipe => recipe !== undefined);
}
