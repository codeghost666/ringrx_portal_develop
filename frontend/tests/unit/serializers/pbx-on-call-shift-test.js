import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pbx-on-call-shift', 'Unit | Serializer | pbx on call shift', {
  // Specify the other units that are required for this test.
  needs: ['serializer:pbx-on-call-shift']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
