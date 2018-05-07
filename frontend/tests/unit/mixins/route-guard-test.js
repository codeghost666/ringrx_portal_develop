import EmberObject from '@ember/object';
import RouteGuardMixin from 'frontend/mixins/route-guard';
import { module, test } from 'qunit';

module('Unit | Mixin | route guard');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouteGuardObject = EmberObject.extend(RouteGuardMixin);
  let subject = RouteGuardObject.create();
  assert.ok(subject);
});
