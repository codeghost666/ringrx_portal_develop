
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('contact-name-pretty-format', 'helper:contact-name-pretty-format', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{contact-name-pretty-format inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

