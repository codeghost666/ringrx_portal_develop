import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pbx-group-user/row', 'Integration | Component | pbx group user/row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pbx-group-user/row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pbx-group-user/row}}
      template block text
    {{/pbx-group-user/row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
