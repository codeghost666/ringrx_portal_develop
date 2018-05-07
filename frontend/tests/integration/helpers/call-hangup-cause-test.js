
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('call-hangup-cause', 'helper:call-hangup-cause', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{call-hangup-cause inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

