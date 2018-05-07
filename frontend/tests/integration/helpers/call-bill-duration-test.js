
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('call-bill-duration', 'helper:call-bill-duration', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{call-bill-duration inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

