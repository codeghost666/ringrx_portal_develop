import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('messages-faxes/new-fax', 'Integration | Component | messages faxes/new fax', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{messages-faxes/new-fax}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#messages-faxes/new-fax}}
      template block text
    {{/messages-faxes/new-fax}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
