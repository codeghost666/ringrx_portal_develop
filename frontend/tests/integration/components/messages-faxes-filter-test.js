import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('messages-faxes-filter', 'Integration | Component | messages faxes filter', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{messages-faxes-filter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#messages-faxes-filter}}
      template block text
    {{/messages-faxes-filter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
