import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('my-voicemail-settings', 'Integration | Component | my voicemail settings', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{my-voicemail-settings}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#my-voicemail-settings}}
      template block text
    {{/my-voicemail-settings}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
