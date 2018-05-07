import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:password-strength-test', 'Unit | Validator | password-strength-test', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
