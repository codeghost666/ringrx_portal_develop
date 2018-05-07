import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sent-messages-faxes-row', 'Integration | Component | sent messages faxes row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sent-messages-faxes-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sent-messages-faxes-row}}
      template block text
    {{/sent-messages-faxes-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
