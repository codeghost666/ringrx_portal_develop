import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('my-phone/rule-row', 'Integration | Component | my phone/rule row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{my-phone/rule-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#my-phone/rule-row}}
      template block text
    {{/my-phone/rule-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
