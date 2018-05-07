import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'
import { on } from '@ember/object/evented'

export default DS.Model.extend({
  pbxAccountId: DS.attr(),
  name: DS.attr(),
  extension: DS.attr(),
  username: DS.attr(),
  password: DS.attr(),
  sipPassword: DS.attr(),
  pin: DS.attr(),
  maxBindings: DS.attr(),
  externalCalleridName: DS.attr(),
  externalCalleridNumber: DS.attr(),
  email: DS.attr(),
  mobile: DS.attr(),
  callTimeout: DS.attr(),
  forwardBehavior: DS.attr(),
  pbxLocationId: DS.attr(),
  mailbox: DS.attr(),
  vmEmailNotification: DS.attr(),
  vmEmailContent: DS.attr(),
  faxExt: DS.attr(), // Display Only
  enableMobileStun: DS.attr('boolean', { defaultValue: false }),
  oncallRemindMinutes: DS.attr(),
  oncallRemindEmail: DS.attr('boolean', { defaultValue: false }),
  oncallRemindSms: DS.attr('boolean', { defaultValue: false }),
  smsEnable: DS.attr('boolean', { defaultValue: false }),
  role: DS.attr(),
  getForward: collectionAction({path: 'forward', type: 'GET'}),
  getFaxExtensions: collectionAction({path: 'fax_extensions', type: 'GET'}),
  getMailboxes: collectionAction({path: 'mailboxes', type: 'GET'}),
  getRoles: collectionAction({path: 'roles', type: 'GET'}),
  getLocations: collectionAction({path: 'locations', type: 'GET'})
})

