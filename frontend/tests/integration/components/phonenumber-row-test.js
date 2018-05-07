import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('phonenumber-row', 'Integration | Component | phonenumber row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{phonenumber-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#phonenumber-row}}
      template block text
    {{/phonenumber-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
