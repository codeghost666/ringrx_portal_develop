
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('to-twenty-hour-format', 'helper:to-twenty-hour-format', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{to-twenty-hour-format inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

