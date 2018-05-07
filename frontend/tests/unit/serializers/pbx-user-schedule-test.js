import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pbx-user-schedule', 'Unit | Serializer | pbx user schedule', {
  // Specify the other units that are required for this test.
  needs: ['serializer:pbx-user-schedule']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
