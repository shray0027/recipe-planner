import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-favorite-button',
  styleUrl: 'favorite-button.css',
  shadow: true,
})
export class FavoriteButton {
  @Prop() favorite = false;
  @Prop() recipeTitle = '';

  @Event({ eventName: 'favorite-toggle' }) favoriteToggle: EventEmitter<{ favorite: boolean }>;

  toggle = () => {
    this.favoriteToggle.emit({ favorite: !this.favorite });
  };

  render() {
    const label = this.favorite ? 'Remove from favorites' : 'Add to favorites';
    return (
      <button type="button" aria-label={`${label}${this.recipeTitle ? `: ${this.recipeTitle}` : ''}`} aria-pressed={String(this.favorite)} onClick={this.toggle}>
        {this.favorite ? '♥ Saved' : '♡ Save'}
      </button>
    );
  }
}
