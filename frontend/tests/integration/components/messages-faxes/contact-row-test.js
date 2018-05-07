import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('messages-faxes/contact-row', 'Integration | Component | messages faxes/contact row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{messages-faxes/contact-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#messages-faxes/contact-row}}
      template block text
    {{/messages-faxes/contact-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
