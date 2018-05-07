import BaseValidator from 'ember-cp-validations/validators/base'
import PasswordTest from 'owasp-password-strength-test'

const PasswordStrengthTest = BaseValidator.extend({
  validate (value, options, model, attribute) {
    var result = PasswordTest.test(value);
    if (result.strong) {
      return true
    } else {
      return 'New password must have minimum ten characters, at' +
        'least one uppercase letter, one lowercase letter, one special character and one number'
    }
  }
})

PasswordStrengthTest.reopenClass({
  /**
   * Define attribute specific dependent keys for your validator
   *
   * [
   *  `model.array.@each.${attribute}` --> Dependent is created on the model's context
   *  `${attribute}.isValid` --> Dependent is created on the `model.validations.attrs` context
   * ]
   *
   * @param {String}  attribute   The attribute being evaluated
   * @param {Unknown} options     Options passed into your validator
   * @return {Array}
   */
  getDependentsFor (/* attribute, options */) {
    return []
  }
})

export default PasswordStrengthTest
