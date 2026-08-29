import { Component, Element, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-search-input',
  styleUrl: 'recipe-search-input.css',
  shadow: true,
})
export class RecipeSearchInput {
  @Element() host: HTMLElement;
  @Prop() label = 'Search recipes';
  @Prop() placeholder = 'Search recipes';
  @Prop() value = '';

  @Event({ eventName: 'value-change' }) valueChange: EventEmitter<{ value: string }>;

  private input?: HTMLInputElement;

  componentDidRender() {
    if (this.input && this.input.value !== this.value) this.input.value = this.value;
  }

  handleInput = (event: Event) => {
    this.valueChange.emit({ value: (event.target as HTMLInputElement).value });
  };

  render() {
    return (
      <label>
        <span>{this.label}</span>
        <input
          ref={(input) => (this.input = input)}
          type="search"
          placeholder={this.placeholder}
          onInput={this.handleInput}
        />
      </label>
    );
  }
}
