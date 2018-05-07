import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pbx-fax-form', 'Integration | Component | pbx fax form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pbx-fax-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pbx-fax-form}}
      template block text
    {{/pbx-fax-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
