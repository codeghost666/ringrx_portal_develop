
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('shift-form-title-date', 'helper:shift-form-title-date', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{shift-form-title-date inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

