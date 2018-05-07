import { module, test } from 'qunit';
import validatePasswordConfirmation from 'frontend/validators/password-confirmation';

module('Unit | Validator | password-confirmation');

test('it exists', function(assert) {
  assert.ok(validatePasswordConfirmation());
});
