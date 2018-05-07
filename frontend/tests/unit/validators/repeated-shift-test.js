import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:repeated-shift', 'Unit | Validator | repeated-shift', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
