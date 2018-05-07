import { module, test } from 'qunit';
import validateForwardDestinationPresense from 'frontend/validators/forward-destination-presence';

module('Unit | Validator | forward-destination-presense');

test('it exists', function(assert) {
  assert.ok(validateForwardDestinationPresense());
});
