import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('on-call/one-time-shift-row', 'Integration | Component | on call/one time shift row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{on-call/one-time-shift-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#on-call/one-time-shift-row}}
      template block text
    {{/on-call/one-time-shift-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
