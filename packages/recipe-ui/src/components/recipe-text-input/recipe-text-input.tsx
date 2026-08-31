import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-text-input',
  styleUrl: 'recipe-text-input.css',
  shadow: true,
})
export class RecipeTextInput {
  @Prop() label = '';
  @Prop() placeholder = '';
  @Prop() type: 'text' | 'url' = 'text';
  @Prop() value = '';
  @Prop() optional = false;

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
        <span>
          {this.label}
          {this.optional && <small> (optional)</small>}
        </span>
        <input
          ref={(input) => (this.input = input)}
          type={this.type}
          value={this.value}
          placeholder={this.placeholder}
          onInput={this.handleInput}
        />
      </label>
    );
  }
}
