import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('on-call/calendar-day', 'Integration | Component | on call/calendar day', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{on-call/calendar-day}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#on-call/calendar-day}}
      template block text
    {{/on-call/calendar-day}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
