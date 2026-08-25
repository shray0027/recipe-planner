export const WEEK_DAYS = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];
export type RecipeSource = 'mealdb' | 'local';

export interface Ingredient {
	name: string;
	measure: string;
}

export interface RecipeDraft {
	title: string;
	category: string;
	area: string;
	imageUrl: string;
	ingredients: Ingredient[];
	instructions: string[];
}

export interface Recipe extends RecipeDraft {
	id: string;
	source: RecipeSource;
	createdAt?: string;
}

export type MealPlan = Record<WeekDay, string | null>;

export type RecipeValidationErrors = Partial<Record<keyof RecipeDraft, string>>;
