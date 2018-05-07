import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember'

const DeviceBindingUser = BaseValidator.extend({
  validate(value, options, model, attribute) {
    if (model.get('bindingBehavior') == 'speeddial' || model.get('bindingBehavior') == 'park' ||
      model.get('bindingBehavior') == 'empty' || model.get('bindingBehavior') === undefined ) {
      return true
    } else if (Ember.isBlank(value)) {
      return 'User should not be blank.'
    } else {
      return true
    }
  }
});

DeviceBindingUser.reopenClass({
  /**
   * Define attribute specific dependent keys for your validator
   *
   * [
   * 	`model.array.@each.${attribute}` --> Dependent is created on the model's context
   * 	`${attribute}.isValid` --> Dependent is created on the `model.validations.attrs` context
   * ]
   *
   * @param {String}  attribute   The attribute being evaluated
   * @param {Unknown} options     Options passed into your validator
   * @return {Array}
   */
  getDependentsFor(/* attribute, options */) {
    return [];
  }
});

export default DeviceBindingUser;
