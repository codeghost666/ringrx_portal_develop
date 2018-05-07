import DS from 'ember-data'
import pbxOncallShiftUserValidations from '../validations/pbxOncallShiftUser'

export default DS.Model.extend(pbxOncallShiftUserValidations, {

  pbxOncallShiftId: DS.attr(), //Display Only
  pbxUserId: DS.attr(),
  priority: DS.attr('number'),
  pbxOncallShift: DS.belongsTo('pbxOncallShift')
})
