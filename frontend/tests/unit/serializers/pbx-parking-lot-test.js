import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pbx-parking-lot', 'Unit | Serializer | pbx parking lot', {
  // Specify the other units that are required for this test.
  needs: ['serializer:pbx-parking-lot']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
