import BaseValidator from 'ember-cp-validations/validators/base';

const DayMark = BaseValidator.extend({
  validate(value, options, model, attribute) {
    if (model.get('startAt')) {
      return true
    }  else {
     if (model.get('dayMon') || model.get('daySat') || model.get('daySun') || model.get('dayFri')
        || model.get('dayThu') || model.get('dayTue') || model.get('dayWed')) {
       return true
     } else{
       return 'Please select one of week days.'
     }
    }
  }
});

DayMark.reopenClass({
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

export default DayMark;
