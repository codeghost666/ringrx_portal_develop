import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:day-mark', 'Unit | Validator | day-mark', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
