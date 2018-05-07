import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:device-binding-user', 'Unit | Validator | device-binding-user', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
