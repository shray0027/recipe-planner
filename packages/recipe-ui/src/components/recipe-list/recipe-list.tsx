import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'rp-recipe-list',
  styleUrl: 'recipe-list.css',
  shadow: true,
})
export class RecipeList {
  @Prop() heading = '';
  @Prop() items: string[] = [];
  @Prop() ordered = false;

  render() {
    const List = this.ordered ? 'ol' : 'ul';

    return (
      <section>
        <h2>{this.heading}</h2>
        <List>
          {this.items.map((item) => <li>{item}</li>)}
        </List>
      </section>
    );
  }
}
