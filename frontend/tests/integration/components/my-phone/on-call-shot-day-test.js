import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('my-phone/on-call-shot-day', 'Integration | Component | my phone/on call shot day', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{my-phone/on-call-shot-day}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#my-phone/on-call-shot-day}}
      template block text
    {{/my-phone/on-call-shot-day}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
