import DS from 'ember-data'
import pbxGroupUserValidations from '../validations/pbxGroupUser'

export default DS.Model.extend(pbxGroupUserValidations,{

  pbxGroup: DS.belongsTo('pbxGroup'),
  pbxGroupId: DS.attr(),
  pbxUserId: DS.attr(),
  priority: DS.attr()
})
