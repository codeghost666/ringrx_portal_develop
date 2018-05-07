import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pbx-mailbox/container', 'Integration | Component | pbx mailbox/container', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pbx-mailbox/container}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pbx-mailbox/container}}
      template block text
    {{/pbx-mailbox/container}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
