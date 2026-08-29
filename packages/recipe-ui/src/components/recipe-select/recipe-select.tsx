import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-select',
  styleUrl: 'recipe-select.css',
  shadow: true,
})
export class RecipeSelect {
  @Prop() label = '';
  @Prop() placeholder = 'All options';
  @Prop() options: string[] = [];
  @Prop() value = '';

  @Event({ eventName: 'value-change' }) valueChange: EventEmitter<{ value: string }>;

  handleChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChange.emit({ value });
  };

  render() {
    return (
      <label>
        <span>{this.label}</span>
        <select onChange={this.handleChange}>
          <option value="" selected={this.value === ''}>{this.placeholder}</option>
          {this.options.map((option) => <option value={option} selected={option === this.value}>{option}</option>)}
        </select>
      </label>
    );
  }
}
