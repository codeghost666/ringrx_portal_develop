import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('parking-lots/container', 'Integration | Component | parking lots/container', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{parking-lots/container}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#parking-lots/container}}
      template block text
    {{/parking-lots/container}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
