import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:user-schedule-time', 'Unit | Validator | user-schedule-time', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
