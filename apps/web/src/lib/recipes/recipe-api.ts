import type { Recipe } from './types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const MAX_BROWSE_RESULTS = 24;

interface MealDbMeal {
	idMeal: string;
	strMeal: string;
	strCategory: string | null;
	strArea: string | null;
	strMealThumb: string | null;
	strInstructions: string | null;
	[key: string]: string | null | undefined;
}

interface MealDbResponse {
	meals: MealDbMeal[] | null;
}

interface MealDbOptionResponse {
	meals: Array<Record<string, string>> | null;
}

export interface RecipeFilters {
	query?: string;
	category?: string;
	area?: string;
}

function splitInstructions(instructions: string | null): string[] {
	return (instructions ?? '')
		.split(/\r?\n+/)
		.map((step) => step.trim())
		.filter(Boolean);
}

function mapMealDbRecipe(meal: MealDbMeal): Recipe {
	const ingredients = [];
	for (let index = 1; index <= 20; index += 1) {
		const name = meal[`strIngredient${index}`]?.trim() ?? '';
		if (name) ingredients.push({ name, measure: meal[`strMeasure${index}`]?.trim() ?? '' });
	}

	return {
		id: meal.idMeal,
		source: 'mealdb',
		title: meal.strMeal,
		category: meal.strCategory ?? 'Uncategorized',
		area: meal.strArea ?? '',
		imageUrl: meal.strMealThumb ?? '',
		ingredients,
		instructions: splitInstructions(meal.strInstructions)
	};
}

export class RecipeApi {
	private async request<T>(path: string): Promise<T> {
		const response = await fetch(`${API_BASE_URL}/${path}`);
		if (!response.ok) throw new Error(`TheMealDB request failed (${response.status}).`);
		return response.json() as Promise<T>;
	}

	async getRecipe(id: string): Promise<Recipe | null> {
		const response = await this.request<MealDbResponse>(`lookup.php?i=${encodeURIComponent(id)}`);
		const meal = response.meals?.[0];
		return meal ? mapMealDbRecipe(meal) : null;
	}

	async searchRecipes(filters: RecipeFilters): Promise<Recipe[]> {
		const query = filters.query?.trim();
		if (!query) return this.browseRecipes(filters);

		const response = await this.request<MealDbResponse>(`search.php?s=${encodeURIComponent(query)}`);
		return (response.meals ?? [])
			.map(mapMealDbRecipe)
			.filter((recipe) => !filters.category || recipe.category === filters.category)
			.filter((recipe) => !filters.area || recipe.area === filters.area);
	}

	async browseRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
		const endpoint = filters.category
			? `filter.php?c=${encodeURIComponent(filters.category)}`
			: filters.area
				? `filter.php?a=${encodeURIComponent(filters.area)}`
				: 'search.php?f=a';
		const response = await this.request<MealDbResponse>(endpoint);
		return (response.meals ?? []).slice(0, MAX_BROWSE_RESULTS).map(mapMealDbRecipe);
	}

	private async getOptions(field: 'c' | 'a', responseKey: string): Promise<string[]> {
		const response = await this.request<MealDbOptionResponse>(`list.php?${field}=list`);
		return (response.meals ?? [])
			.map((meal) => meal[responseKey])
			.filter((value): value is string => Boolean(value))
			.sort((left, right) => left.localeCompare(right));
	}

	getCategories(): Promise<string[]> {
		return this.getOptions('c', 'strCategory');
	}

	getAreas(): Promise<string[]> {
		return this.getOptions('a', 'strArea');
	}
}

export const recipeApi = new RecipeApi();
