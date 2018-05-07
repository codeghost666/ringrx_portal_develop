import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('on-call/repeated-shift-day-marks', 'Integration | Component | on call/repeated shift day marks', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{on-call/repeated-shift-day-marks}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#on-call/repeated-shift-day-marks}}
      template block text
    {{/on-call/repeated-shift-day-marks}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
