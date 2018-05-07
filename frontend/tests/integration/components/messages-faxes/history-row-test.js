import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('messages-faxes/history-row', 'Integration | Component | messages faxes/history row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{messages-faxes/history-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#messages-faxes/history-row}}
      template block text
    {{/messages-faxes/history-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
