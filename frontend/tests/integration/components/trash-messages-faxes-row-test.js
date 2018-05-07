import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('trash-messages-faxes-row', 'Integration | Component | trash messages faxes row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{trash-messages-faxes-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#trash-messages-faxes-row}}
      template block text
    {{/trash-messages-faxes-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
