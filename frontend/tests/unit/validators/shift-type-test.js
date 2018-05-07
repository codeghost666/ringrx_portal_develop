import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:shift-type', 'Unit | Validator | shift-type', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
