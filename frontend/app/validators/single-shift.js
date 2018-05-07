import BaseValidator from 'ember-cp-validations/validators/base'

const SingleShift = BaseValidator.extend({
  validate (value, options, model, attribute) {
    if (model.get('startAt')) {
      if (model.get('endAt') && (model.get('startAt') != model.get('endAt'))) {
        return true
      } else {
        return 'Please input start and end time of shift.'
      }
    } else {
      return true
    }
  }
})

SingleShift.reopenClass({
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

export default SingleShift
