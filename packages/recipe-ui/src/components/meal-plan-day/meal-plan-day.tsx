import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-meal-slot',
  styleUrl: 'meal-plan-day.css',
  shadow: true,
})
export class MealPlanDay {
  @Prop() day = '';
  @Prop() recipeId = '';
  @Prop() recipeTitle = '';
  @Prop() imageUrl = '';

  @Event({ eventName: 'meal-slot-select' }) mealSlotSelect: EventEmitter<{ day: string }>;
  @Event({ eventName: 'meal-slot-remove' }) mealSlotRemove: EventEmitter<{ day: string }>;

  selectMeal = () => {
    this.mealSlotSelect.emit({ day: this.day });
  };

  removeMeal = () => {
    this.mealSlotRemove.emit({ day: this.day });
  };

  render() {
    const hasRecipe = Boolean(this.recipeId);
    return (
      <article>
        <h3>{this.day}</h3>
        {hasRecipe ? (
          <div class="meal">
            {this.imageUrl && <img src={this.imageUrl} alt="" />}
            <button type="button" class="meal-name" onClick={this.selectMeal}>
              {this.recipeTitle}
            </button>
            <button type="button" class="remove" onClick={this.removeMeal} aria-label={`Remove ${this.recipeTitle} from ${this.day}`}>
              Remove
            </button>
          </div>
        ) : (
          <div class="empty">
            <slot name="empty">
              <button type="button" onClick={this.selectMeal}>Choose a recipe</button>
            </slot>
          </div>
        )}
      </article>
    );
  }
}
