import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('on-call/manage-departments', 'Integration | Component | on call/manage departments', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{on-call/manage-departments}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#on-call/manage-departments}}
      template block text
    {{/on-call/manage-departments}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
