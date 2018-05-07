import BaseValidator from 'ember-cp-validations/validators/base'

const RepeatedShift = BaseValidator.extend({
  validate (value, options, model, attribute) {
    if (model.get('startTime')) {
      if (model.get('endTime') &&
        (moment(model.get('startTime')).format('HH:mm') != moment(model.get('endTime')).format('HH:mm'))) {
        return true
      } else {
        return 'Please input start and end time of shift.'
      }
    } else {
      return true
    }
  }
})

RepeatedShift.reopenClass({
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

export default RepeatedShift
