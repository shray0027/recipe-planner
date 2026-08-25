import { WEEK_DAYS, type MealPlan, type Recipe, type RecipeDraft, type RecipeValidationErrors, type WeekDay } from './types';

export const STORAGE_KEYS = {
	userRecipes: 'recipe-planner:user-recipes:v1',
	favorites: 'recipe-planner:favorites:v1',
	mealPlan: 'recipe-planner:meal-plan:v1'
} as const;

const emptyMealPlan = (): MealPlan =>
	Object.fromEntries(WEEK_DAYS.map((day) => [day, null])) as MealPlan;

function normalizeDraft(draft: RecipeDraft): RecipeDraft {
	return {
		title: draft.title.trim(),
		category: draft.category.trim(),
		area: draft.area.trim(),
		imageUrl: draft.imageUrl.trim(),
		ingredients: draft.ingredients
			.map((ingredient) => ({ name: ingredient.name.trim(), measure: ingredient.measure.trim() }))
			.filter((ingredient) => ingredient.name),
		instructions: draft.instructions.map((instruction) => instruction.trim()).filter(Boolean)
	};
}

export function validateRecipeDraft(draft: RecipeDraft): RecipeValidationErrors {
	const normalized = normalizeDraft(draft);
	const errors: RecipeValidationErrors = {};
	if (!normalized.title) errors.title = 'A recipe title is required.';
	if (!normalized.category) errors.category = 'Choose or enter a category.';
	if (normalized.ingredients.length === 0) errors.ingredients = 'Add at least one ingredient.';
	if (normalized.instructions.length === 0) errors.instructions = 'Add at least one instruction.';
	return errors;
}

export class RecipeStore {
	private read<T>(key: string, fallback: T): T {
		if (typeof localStorage === 'undefined') return fallback;
		try {
			return JSON.parse(localStorage.getItem(key) ?? '') as T;
		} catch {
			return fallback;
		}
	}

	private write(key: string, value: unknown): void {
		if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
	}

	getUserRecipes(): Recipe[] {
		return this.read<Recipe[]>(STORAGE_KEYS.userRecipes, []);
	}

	saveUserRecipe(draft: RecipeDraft, id?: string): Recipe | null {
		if (Object.keys(validateRecipeDraft(draft)).length > 0) return null;

		const recipes = this.getUserRecipes();
		const normalized = normalizeDraft(draft);
		const existing = recipes.find((recipe) => recipe.id === id && recipe.source === 'local');
		const recipe: Recipe = {
			...normalized,
			id: existing?.id ?? `local-${Date.now()}`,
			source: 'local',
			createdAt: existing?.createdAt ?? new Date().toISOString()
		};

		this.write(
			STORAGE_KEYS.userRecipes,
			existing ? recipes.map((item) => (item.id === existing.id ? recipe : item)) : [recipe, ...recipes]
		);
		return recipe;
	}

	deleteUserRecipe(id: string): void {
		this.write(
			STORAGE_KEYS.userRecipes,
			this.getUserRecipes().filter((recipe) => recipe.id !== id || recipe.source !== 'local')
		);
		this.setFavorite(id, false);
		for (const day of WEEK_DAYS) {
			if (this.getMealPlan()[day] === id) this.setMeal(day, null);
		}
	}

	getFavoriteIds(): string[] {
		return this.read<string[]>(STORAGE_KEYS.favorites, []);
	}

	setFavorite(id: string, favorite: boolean): void {
		const favorites = this.getFavoriteIds().filter((favoriteId) => favoriteId !== id);
		this.write(STORAGE_KEYS.favorites, favorite ? [...favorites, id] : favorites);
	}

	toggleFavorite(id: string): boolean {
		const favorite = !this.getFavoriteIds().includes(id);
		this.setFavorite(id, favorite);
		return favorite;
	}

	getMealPlan(): MealPlan {
		return { ...emptyMealPlan(), ...this.read<Partial<MealPlan>>(STORAGE_KEYS.mealPlan, {}) };
	}

	setMeal(day: WeekDay, recipeId: string | null): void {
		this.write(STORAGE_KEYS.mealPlan, { ...this.getMealPlan(), [day]: recipeId });
	}
}

export const recipeStore = new RecipeStore();
