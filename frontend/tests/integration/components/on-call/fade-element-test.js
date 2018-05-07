import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('on-call/fade-element', 'Integration | Component | on call/fade element', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{on-call/fade-element}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#on-call/fade-element}}
      template block text
    {{/on-call/fade-element}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
