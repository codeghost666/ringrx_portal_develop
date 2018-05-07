import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pbx-fax', 'Unit | Serializer | pbx fax', {
  // Specify the other units that are required for this test.
  needs: ['serializer:pbx-fax']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
