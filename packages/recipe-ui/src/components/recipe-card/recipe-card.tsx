import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  @Prop() recipeId = '';
  @Prop() recipeTitle = '';
  @Prop() imageUrl = '';
  @Prop() subtitle = '';
  @Prop() favorite = false;

  @Event({ eventName: 'recipe-select' }) recipeSelect: EventEmitter<{ recipeId: string }>;
  @Event({ eventName: 'recipe-favorite-toggle' }) recipeFavoriteToggle: EventEmitter<{
    recipeId: string;
    favorite: boolean;
  }>;

  selectRecipe = () => {
    this.recipeSelect.emit({ recipeId: this.recipeId });
  };

  toggleFavorite = (event: MouseEvent) => {
    event.stopPropagation();
    this.recipeFavoriteToggle.emit({ recipeId: this.recipeId, favorite: !this.favorite });
  };

  render() {
    return (
      <article>
        <button class="recipe" type="button" onClick={this.selectRecipe} aria-label={`View ${this.recipeTitle}`}>
          {this.imageUrl ? <img src={this.imageUrl} alt="" /> : <div class="image-placeholder">No image</div>}
          <span class="content">
            <span class="title">{this.recipeTitle}</span>
            {this.subtitle && <span class="subtitle">{this.subtitle}</span>}
          </span>
        </button>
        <footer>
          <button class="favorite" type="button" onClick={this.toggleFavorite} aria-pressed={String(this.favorite)}>
            {this.favorite ? '♥ Saved' : '♡ Save'}
          </button>
          <slot name="actions" />
        </footer>
      </article>
    );
  }
}
