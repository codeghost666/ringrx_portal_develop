import DS from 'ember-data';
import pbxDeviceBindingValidations from '../validations/pbxDeviceBinding'

export default DS.Model.extend(pbxDeviceBindingValidations, {
  pbxDeviceId: DS.attr('string'),
  bindingIndex: DS.attr('number'),
  bindingType: DS.attr('string'),
  bindingBehavior: DS.attr('string'),
  bindingDisplay: DS.attr('string'),
  bindingArgument: DS.attr('string'),
  pbxUserId: DS.attr('string'),
  pbxParkingLotId: DS.attr('string'),
  pbxDevice: DS.belongsTo('pbxDevice')
});
