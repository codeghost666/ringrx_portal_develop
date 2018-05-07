import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'

export default DS.Model.extend({
  name: DS.attr(), // Display Only
  extension: DS.attr(),  // Display Only
  username: DS.attr(),
  password: DS.attr(),  // This will never come back, but should be in the model
  pin: DS.attr(),
  maxBindings: DS.attr(),
  externalCalleridName: DS.attr(), // Display Only
  externalCalleridNumber: DS.attr(), // Display Only
  email: DS.attr(),
  mobile: DS.attr(),
  callTimeout: DS.attr(),
  forwardBehavior: DS.attr(),
  vmEmailNotification: DS.attr(),
  vmEmailContent: DS.attr(),
  faxExt: DS.attr(), // Display Only
  enableMobileStun: DS.attr('boolean'),
  oncallRemindMinutes: DS.attr(),
  oncallRemindEmail: DS.attr('boolean'),
  oncallRemindSms: DS.attr('boolean'),
  greeting: '',
  pbxUserSchedules: DS.hasMany('pbxUserSchedule'),
  getForwardBehaviors: collectionAction({path: 'forward', type: 'GET'}),
  getOncallBehaviors: collectionAction({path: 'oncall', type: 'GET'}),
})
