import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('parking-lots/row', 'Integration | Component | parking lots/row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{parking-lots/row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#parking-lots/row}}
      template block text
    {{/parking-lots/row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
