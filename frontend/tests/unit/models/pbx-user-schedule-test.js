import { moduleForModel, test } from 'ember-qunit';

moduleForModel('pbx-user-schedule', 'Unit | Model | pbx user schedule', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
