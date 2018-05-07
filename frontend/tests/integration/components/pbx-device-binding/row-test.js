import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pbx-device-binding/row', 'Integration | Component | pbx device binding/row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pbx-device-binding/row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pbx-device-binding/row}}
      template block text
    {{/pbx-device-binding/row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
